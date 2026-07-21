"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, Award } from "lucide-react";

interface CompletionBarProps {
  currentStep: number;
  totalSteps: number;
  showPercentageLabel?: boolean;
  className?: string;
}

export function CompletionBar({
  currentStep,
  totalSteps,
  showPercentageLabel = true,
  className = "",
}: CompletionBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentStep / totalSteps) * 100))
  );
  const remaining = Math.max(0, totalSteps - currentStep);

  const getEncouragementSubtext = () => {
    if (percentage >= 100) return "அனைத்தும் முடிந்தது! சமர்ப்பிக்க தயார் ✨";
    if (percentage >= 75) return `கிட்டத்தட்ட முடிந்துவிட்டது! இன்னும் ${remaining} மட்டுமே 🔥`;
    if (percentage >= 50) return `பாதி வழி தாண்டியாச்சு! இன்னும் ${remaining} மீதம் உள்ளன 👍`;
    return `இன்னும் ${remaining} பாடல்கள் மீதம் உள்ளன`;
  };

  return (
    <div className={`w-full max-w-xl mx-auto space-y-2.5 ${className}`}>
      {showPercentageLabel && (
        <div className="flex items-center justify-between text-xs font-outfit font-bold">
          <div className="flex items-center gap-1.5 text-text">
            {percentage >= 100 ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : percentage >= 75 ? (
              <Flame className="w-4 h-4 text-accent" />
            ) : (
              <Award className="w-4 h-4 text-primary" />
            )}
            <span className="text-primary text-sm font-extrabold">{percentage}%</span>
            <span className="text-text-secondary font-semibold">நிறைவடைந்துள்ளது</span>
          </div>

          <span className="text-[11px] font-inter text-text-muted">
            {getEncouragementSubtext()}
          </span>
        </div>
      )}

      {/* Progress Track */}
      <div className="skeu-progress-track relative w-full h-3.5 rounded-full overflow-hidden p-0.5">
        <motion.div
          className="skeu-progress-fill h-full rounded-full bg-gradient-to-r from-primary to-indigo-500 shadow-sm relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Subtle light shimmer overlay */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
