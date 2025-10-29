#!/usr/bin/env python3
# ✅ Smart Task Planner — FINAL STABLE VERSION (bulletproof JSON extraction)

from __future__ import annotations
import os, re, json, requests
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List
from flask import Flask, request, jsonify

# ---------------- CONFIG ----------------
PORT = 8000
BIND = "127.0.0.1"
TIMEZONE_OFFSET_MIN = 330
TZ = timezone(timedelta(minutes=TIMEZONE_OFFSET_MIN))

# ✅ Gemini Configuration
GEMINI_API_KEY = "AIzaSyDR10mZx0ttUHuvBm7g-uguq9n8ZjbEwuM"  # paste valid key here
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={{key}}"

ISO_DATE = "%Y-%m-%d"
WORK_HOURS_PER_DAY_DEFAULT = 6

# ---------------- APP INIT ----------------
app = Flask(__name__)

@app.after_request
def add_cors_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resp


# ---------------- UTILITIES ----------------
def today_str(): 
    return datetime.now(TZ).date().strftime(ISO_DATE)

def parse_start_date(s: str | None) -> datetime:
    if not s: return datetime.now(TZ)
    s = s.strip().lower()
    base = datetime.now(TZ)
    if s == "today": return base
    if s == "tomorrow": return base + timedelta(days=1)
    try: return datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=TZ)
    except: return base

def parse_deadline(s: str | None, start_dt: datetime):
    if not s: return None
    s = s.strip().lower()
    if s.startswith("in "):
        m = re.search(r"in\s+(\d+)\s*(day|days|week|weeks)?", s)
        if m:
            n = int(m.group(1))
            if "week" in (m.group(2) or ""): n *= 7
            return start_dt + timedelta(days=n)
    try: return datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=TZ)
    except: return None


# ---------------- TASK SCHEDULER ----------------
def topo_sort(tasks: List[Dict[str, Any]]) -> List[str]:
    graph, indeg = {}, {}
    for t in tasks:
        tid = t.get("id")
        graph.setdefault(tid, set()); indeg.setdefault(tid, 0)
    for t in tasks:
        for dep in t.get("depends_on", []) or []:
            if dep in graph:
                graph[dep].add(t["id"]); indeg[t["id"]] = indeg.get(t["id"], 0) + 1
    q = [n for n, d in indeg.items() if d == 0]; order = []
    while q:
        n = q.pop(0); order.append(n)
        for v in graph.get(n, []):
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    for t in tasks:
        if t["id"] not in order: order.append(t["id"])
    return order

def schedule_tasks(tasks, start_dt, deadline, work_hours_per_day):
    tmap = {t["id"]: t for t in tasks}
    order = topo_sort(tasks); est, dur = {}, {}
    for tid in order:
        t = tmap[tid]; h = float(t.get("estimated_hours", 2) or 2)
        dur[tid] = timedelta(hours=h)
        deps = t.get("depends_on", []) or []
        est[tid] = max((est[d] + dur[d] for d in deps if d in est), default=start_dt)
    ratio = 1.0
    if deadline:
        naive_end = max((est[t] + dur[t] for t in order), default=start_dt)
        if naive_end > deadline:
            total_h = sum(max(float(tmap[t].get("estimated_hours", 2)),1) for t in order)
            hours_avail = max((deadline - start_dt).days,1)*work_hours_per_day
            ratio = max(hours_avail/total_h, 0.25)
    out = []
    for tid in order:
        t = tmap[tid]; h = max(float(t.get("estimated_hours", 2)),1)*ratio
        s = est[tid]; e = s + timedelta(hours=h)
        out.append({
            "id": tid, "name": t.get("name", tid),
            "start_date": s.date().isoformat(),
            "end_date": e.date().isoformat(),
            "duration_hours": round(h, 1)
        })
    return out


# ---------------- GEMINI ----------------
PLANNER_PROMPT = (
    "You are an expert project planner. Given a GOAL, return *only JSON* like:\n"
    "{\"tasks\":[{\"id\":\"T1\",\"name\":\"Research\",\"estimated_hours\":5}],\"notes\":\"string\"}"
)

def extract_json_safe(text: str) -> dict:
    """Extracts and parses JSON safely even from messy text."""
    text = text.strip()
    text = re.sub(r"^```json|```$", "", text, flags=re.MULTILINE).strip()
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    if json_match:
        text = json_match.group(0)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Last resort — try removing trailing junk
        text = text.split("}") [0] + "}"
        try:
            return json.loads(text)
        except Exception:
            raise RuntimeError(f"Gemini returned invalid JSON or non-JSON text: {text[:400]}")


def call_gemini(goal, start_date, deadline, hours_per_day):
    url = GEMINI_URL.format(key=GEMINI_API_KEY)
    prompt = (
        f"{PLANNER_PROMPT}\n\n"
        f"GOAL: {goal}\nSTART_DATE: {start_date}\nDEADLINE: {deadline or 'None'}\nWORK_HOURS_PER_DAY: {hours_per_day}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 2048}
    }
    headers = {"Content-Type": "application/json"}

    r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=60)
    if r.status_code != 200:
        raise RuntimeError(f"Gemini API error {r.status_code}: {r.text[:200]}")

    data = r.json()
    text = ""

    try:
        cand = data.get("candidates", [{}])[0]
        content = cand.get("content", {})
        parts = content.get("parts", [])
        text = parts[0].get("text", "") if parts else content.get("text", "")
    except Exception as e:
        raise RuntimeError(f"Unexpected response format: {e}; raw={str(data)[:300]}")

    return extract_json_safe(text)


# ---------------- ROUTES ----------------
@app.get("/")
def home():
    return f"""
    <html><body style='font-family:sans-serif;padding:2rem;'>
    <h1>🧠 Smart Task Planner</h1>
    <p><small>Local time: {today_str()}</small></p>
    <textarea id='goal' rows='4' style='width:100%;'>Launch a product in 2 weeks</textarea><br>
    <input id='start' placeholder='today'><br>
    <input id='deadline' placeholder='in 2 weeks'><br>
    <input id='hours' type='number' value='6'><br>
    <button onclick='run()'>Generate Plan</button><div id='out'></div>
    <script>
    async function run(){{
        const b={{goal:goal.value,start_date:start.value,deadline:deadline.value,work_hours_per_day:parseInt(hours.value)||6}};
        const r=await fetch('/plan',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify(b)}});
        const e=document.getElementById('out');
        if(!r.ok){{e.innerHTML='<p style=color:red>'+await r.text()+'</p>';return;}}
        const d=await r.json();
        e.innerHTML='<h3>Tasks</h3><pre>'+JSON.stringify(d.tasks,null,2)+'</pre><h3>Schedule</h3><pre>'+JSON.stringify(d.schedule,null,2)+'</pre>';
    }}
    </script></body></html>
    """

@app.post("/plan")
def plan():
    try:
        p = request.get_json(force=True)
        goal = p.get("goal", "").strip()
        if not goal:
            return jsonify({"error": "Goal required"}), 400
        s = parse_start_date(p.get("start_date"))
        d = parse_deadline(p.get("deadline"), s)
        h = int(p.get("work_hours_per_day") or WORK_HOURS_PER_DAY_DEFAULT)
        gem = call_gemini(goal, s.date().isoformat(), d.date().isoformat() if d else None, h)
        tasks = gem.get("tasks", [])
        for i, t in enumerate(tasks, 1): t.setdefault("id", f"T{i}")
        sched = schedule_tasks(tasks, s, d, h)
        return jsonify({"goal": goal, "tasks": tasks, "schedule": sched, "notes": gem.get("notes")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- MAIN ----------------
if __name__ == "__main__":
    print("✅ Smart Task Planner Loaded Successfully")
    print(f"🚀 Running on http://{BIND}:{PORT}")
    app.run(host=BIND, port=PORT, debug=True)
