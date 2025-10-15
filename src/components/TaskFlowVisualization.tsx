import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  name: string;
  estimated_hours: number;
}

interface TaskFlowVisualizationProps {
  tasks: Task[];
  currentStep?: number;
}

const TaskFlowVisualization = ({ tasks, currentStep = 0 }: TaskFlowVisualizationProps) => {
  const totalSteps = Math.min(tasks.length, 8); // Limit to 8 steps for circular display
  const displayTasks = tasks.slice(0, totalSteps);
  const radius = 180;
  const centerX = 240;
  const centerY = 240;

  // Calculate position of each task node on the circle
  const getNodePosition = (index: number) => {
    const angle = (index / totalSteps) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-[500px] mx-auto" style={{ height: "480px" }}>
      <svg
        width="480"
        height="480"
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
      >
        {/* Connection lines */}
        {displayTasks.map((_, index) => {
          const start = getNodePosition(index);
          const end = getNodePosition((index + 1) % totalSteps);
          const isActive = index <= currentStep;

          return (
            <motion.line
              key={`line-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? "url(#lineGradient)" : "hsl(var(--border))"}
              strokeWidth={isActive ? "3" : "2"}
              strokeDasharray={isActive ? "0" : "8 8"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
            />
          );
        })}

        {/* Gradient for active lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Task nodes */}
      {displayTasks.map((task, index) => {
        const { x, y } = getNodePosition(index);
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <motion.div
            key={task.id}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {/* Node container */}
            <motion.div
              className="relative group cursor-pointer"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Node circle */}
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? "gradient-primary border-transparent shadow-glow"
                    : isCompleted
                    ? "bg-primary/20 border-primary"
                    : "bg-background border-border"
                }`}
                animate={
                  isActive
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 20px hsl(var(--primary) / 0.4)",
                          "0 0 35px hsl(var(--accent) / 0.6)",
                          "0 0 20px hsl(var(--primary) / 0.4)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  ease: [0.45, 0.05, 0.55, 0.95],
                  repeat: isActive ? Infinity : 0,
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                ) : (
                  <span
                    className={`text-lg font-bold ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}

                {/* Ripple effect */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeOut",
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 2],
                        opacity: [0.6, 0],
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeOut",
                        repeat: Infinity,
                        delay: 0.5,
                      }}
                    />
                  </>
                )}
              </motion.div>

              {/* Task label tooltip */}
              <motion.div
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                initial={{ y: -5 }}
                whileHover={{ y: 0 }}
              >
                <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                  <div className="text-xs font-semibold text-foreground max-w-[150px] truncate">
                    {task.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {task.estimated_hours}h
                  </div>
                </div>
              </motion.div>

              {/* Step number badge */}
              <motion.div
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Center content */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
          <motion.div
            className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            {totalSteps}
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground">Tasks</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Step {currentStep + 1}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskFlowVisualization;
