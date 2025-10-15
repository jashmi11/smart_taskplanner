#  Smart Task Planner (React + LLM Integration)

> An intelligent AI-powered planner that automatically converts your goals into structured, time-optimized task schedules using **Google Gemini LLM** — built with **React.js (frontend)** and **Flask (backend)**.

---

## 🎬 Project Demo

<video src="project-demo.mp4" width="100%" controls autoplay muted loop></video>

> 🎥 _The above video demonstrates the complete workflow from goal input to AI-generated task planning and scheduling._

---

##  Features

- ✅ Converts any goal (e.g., “Launch my app in 2 weeks”) into a **smart task breakdown**
- 🔁 **LLM integration** with **Google Gemini 2.5 Flash**
- 📅 Automatically calculates **start dates, deadlines, and dependencies**
- ⚙️ Dynamically adjusts schedules based on **available work hours per day**
- 🌐 **Full-stack implementation** using:
  - **Frontend:** React.js  
  - **Backend:** Python (Flask)  
  - **LLM:** Gemini 2.5 Flash Model  
- 🧩 Supports dependency-based task sequencing via **topological sorting**

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Axios |
| Backend | Python, Flask |
| LLM | Google Gemini 2.5 Flash |
| Communication | REST API (JSON) |
| Scheduling Logic | Topological Sort + Time Allocation Algorithm |

---

## ⚙️ Setup & Installation
pip install flask requests
GEMINI_API_KEY = "YOUR_VALID_API_KEY"
python app.py


npm install
npm run dev


### 🔧 Backend Setup (Flask + Gemini API)

1. **Clone the repository**
   ```bash
   git clone https://github.com/jashmi11/smart-task-planner.git
   cd smart-task-planner
How It Works

User Input:
The user enters a goal, start date, and deadline in the React UI.

Backend Processing:
The Flask backend sends the goal and time constraints to the Gemini LLM via API.

Gemini Output:
The model returns structured JSON:

{
  "tasks": [
    { "id": "T1", "name": "Research", "estimated_hours": 5 },
    { "id": "T2", "name": "Prototype", "estimated_hours": 8, "depends_on": ["T1"] }
  ],
  "notes": "Validate early prototypes."
}


Scheduling Logic:
A topological sort algorithm orders tasks based on dependencies and fits them within available work hours.

Frontend Visualization:
The React interface displays the AI-generated plan and task timeline.

🧪 Example Output

Goal: “Launch an AI-based app in 10 days”

Generated Tasks:

{
  "tasks": [
    {"id": "T1", "name": "Market Research", "estimated_hours": 6},
    {"id": "T2", "name": "Design Wireframes", "estimated_hours": 4, "depends_on": ["T1"]},
    {"id": "T3", "name": "Develop MVP", "estimated_hours": 12, "depends_on": ["T2"]}
  ]
}


Auto-Scheduled Plan:

[
  {"id": "T1", "start_date": "2025-10-15", "end_date": "2025-10-16", "duration_hours": 6},
  {"id": "T2", "start_date": "2025-10-17", "end_date": "2025-10-18", "duration_hours": 4},
  {"id": "T3", "start_date": "2025-10-19", "end_date": "2025-10-22", "duration_hours": 12}
]
