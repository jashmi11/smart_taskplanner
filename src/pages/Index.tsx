import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, Clock, TrendingUp, Zap, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CircularProgress from "@/components/CircularProgress";
import TaskFlowVisualization from "@/components/TaskFlowVisualization";

interface Task {
  id: string;
  name: string;
  estimated_hours: number;
}

interface ScheduleItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration_hours: number;
}

interface PlanResponse {
  goal: string;
  tasks: Task[];
  schedule: ScheduleItem[];
  notes?: string;
}

const Index = () => {
  const [goal, setGoal] = useState("Launch a product in 2 weeks");
  const [startDate, setStartDate] = useState("today");
  const [deadline, setDeadline] = useState("in 2 weeks");
  const [workHours, setWorkHours] = useState("6");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      toast.error("Please enter a goal");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: goal.trim(),
          start_date: startDate.trim() || "today",
          deadline: deadline.trim() || null,
          work_hours_per_day: parseInt(workHours) || 6,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate plan");
      }

      const data = await response.json();
      setResult(data);
      toast.success("Plan generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (index: number) => {
    const colors = [
      "bg-accent/10 border-accent text-accent",
      "bg-primary/10 border-primary text-primary",
      "bg-success/10 border-success text-success",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Smart Task Planner
              </h1>
              <p className="text-xs text-muted-foreground">AI-powered project scheduling</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">Powered by Gemini AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Transform Goals into Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Break down complex projects into manageable tasks with intelligent scheduling
          </p>
        </div>

        {/* Circular Progress Visualization */}
        <div className="flex justify-center mb-12">
          <Card className="inline-block p-8 shadow-lg border-border/50">
            <CircularProgress
              steps={[
                "Define Goal",
                "AI Analysis",
                "Task Breakdown",
                "Dependencies",
                "Timeline",
                "Schedule",
                "Review",
                "Execute",
              ]}
              autoAnimate={true}
              size={450}
            />
          </Card>
        </div>

        {/* Input Form */}
        <Card className="mb-8 shadow-lg hover:shadow-glow transition-smooth border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Project Details
            </CardTitle>
            <CardDescription>Tell us about your goal and we'll create a perfect plan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What's your goal? *</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Launch a product in 2 weeks, Complete website redesign, Plan a marketing campaign"
                  className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    Start Date
                  </label>
                  <Input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="today, tomorrow, 2025-10-15"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-accent" />
                    Deadline
                  </label>
                  <Input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="in 2 weeks, 2025-10-30"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                    <Clock className="w-4 h-4 text-success" />
                    Work Hours/Day
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    placeholder="6"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Smart Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-slide-up">
            {/* Task Flow Visualization */}
            {result.tasks.length > 0 && (
              <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Task Flow Visualization
                  </CardTitle>
                  <CardDescription>
                    Interactive circular view of your project workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <TaskFlowVisualization tasks={result.tasks} currentStep={0} />
                </CardContent>
              </Card>
            )}

            {/* Tasks Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Tasks Breakdown</h3>
                <span className="ml-auto text-sm text-muted-foreground">
                  {result.tasks.length} tasks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.tasks.map((task, index) => (
                  <Card
                    key={task.id}
                    className={`border-l-4 hover:scale-[1.02] transition-bounce shadow-md hover:shadow-lg ${getPriorityColor(index)}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {task.name}
                        </CardTitle>
                        <span className="text-xs font-mono px-2 py-1 rounded-md bg-muted shrink-0">
                          {task.id}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{task.estimated_hours} hours</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Schedule Timeline</h3>
              </div>

              <div className="space-y-3">
                {result.schedule.map((item, index) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-md transition-smooth border-border/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.name}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.start_date}</span>
                            </div>
                            <span>→</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{item.end_date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary shrink-0">
                          <Clock className="w-3 h-3" />
                          {item.duration_hours}h
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notes */}
            {result.notes && (
              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-12 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow animate-float">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">
              Enter your goal above to generate an intelligent task plan
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-6 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Gemini AI • Smart Task Planning Made Simple</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
