import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

interface CircularProgressProps {
  steps: string[];
  currentStep?: number;
  autoAnimate?: boolean;
  size?: number;
}

const CircularProgress = ({ 
  steps, 
  currentStep = 0, 
  autoAnimate = true,
  size = 400 
}: CircularProgressProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;
  const radius = size / 2 - 60;
  const centerX = size / 2;
  const centerY = size / 2;

  useEffect(() => {
    if (!autoAnimate) {
      setActiveStep(currentStep);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % totalSteps);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoAnimate, currentStep, totalSteps]);

  // Calculate position of each node on the circle
  const getNodePosition = (index: number) => {
    const angle = (index / totalSteps) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, angle };
  };

  // Calculate path for connecting lines
  const getCirclePath = () => {
    let path = "";
    for (let i = 0; i <= totalSteps; i++) {
      const { x, y } = getNodePosition(i % totalSteps);
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    return path;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle path */}
        <motion.path
          d={getCirclePath()}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="8 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated progress path */}
        <motion.path
          d={getCirclePath()}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: (activeStep + 1) / totalSteps }}
          transition={{
            duration: 0.8,
            ease: [0.45, 0.05, 0.55, 0.95], // ease-in-out-sine
          }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Step nodes */}
      {steps.map((step, index) => {
        const { x, y } = getNodePosition(index);
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const delay = index * 0.1;

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay,
              ease: "backOut",
            }}
          >
            {/* Node circle */}
            <motion.div
              className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isActive
                  ? "w-16 h-16 gradient-primary border-transparent shadow-glow"
                  : isCompleted
                  ? "w-14 h-14 bg-primary border-primary"
                  : "w-14 h-14 bg-background border-border"
              }`}
              animate={
                isActive
                  ? {
                      scale: [1, 1.15, 1],
                      boxShadow: [
                        "0 0 20px hsl(var(--primary) / 0.4)",
                        "0 0 40px hsl(var(--primary) / 0.6)",
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
                <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
              ) : isActive ? (
                <motion.div
                  className="w-3 h-3 rounded-full bg-primary-foreground"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}

              {/* Ripple effect for active node */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 1 }}
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
              )}
            </motion.div>

            {/* Step label */}
            <motion.div
              className="absolute top-full mt-3 whitespace-nowrap text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.3 }}
            >
              <div
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-primary font-bold"
                    : isCompleted
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
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
            {activeStep + 1}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-1">
            of {totalSteps} steps
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CircularProgress;
