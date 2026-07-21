"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export function LanguageToggle({ className = "", compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div
      className={`inline-flex items-center gap-1 skeu-inset p-1 rounded-2xl ${className}`}
      title="Switch Language / மொழியை மாற்றவும்"
    >
      <div className="pl-1.5 pr-0.5 text-text-muted flex items-center justify-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage("ta")}
        className={`px-2.5 py-1 rounded-xl text-xs font-outfit font-extrabold transition-all ${
          language === "ta"
            ? "skeu-btn-primary text-white shadow-md scale-105"
            : "text-text-secondary hover:text-text"
        }`}
      >
        {compact ? "தமிழ்" : "தமிழ்"}
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-xl text-xs font-outfit font-extrabold transition-all ${
          language === "en"
            ? "skeu-btn-primary text-white shadow-md scale-105"
            : "text-text-secondary hover:text-text"
        }`}
      >
        {compact ? "EN" : "English"}
      </button>
    </div>
  );
}
