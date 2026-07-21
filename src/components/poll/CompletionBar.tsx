"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, Award } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

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
  const { language } = useLanguageStore();
  const t = translations[language];

  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentStep / totalSteps) * 100))
  );
  const remaining = Math.max(0, totalSteps - currentStep);

  const getEncouragementSubtext = () => {
    if (percentage >= 100) return t.allDone;
    if (percentage >= 75) return t.almostDone.replace("{n}", String(remaining));
    if (percentage >= 50) return t.halfWay.replace("{n}", String(remaining));
    return t.songsRemaining.replace("{n}", String(remaining));
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
            <span className="text-text-secondary font-semibold">{t.completed}</span>
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
