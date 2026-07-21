"use client";

import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

interface RatingSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const values = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 skeu-raised p-6 rounded-3xl">
      {/* Display Badge */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-baseline gap-1.5 px-6 py-2 rounded-2xl skeu-inset">
          <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-outfit font-extrabold text-4xl text-primary tracking-tight"
          >
            {value}
          </motion.span>
          <span className="font-outfit font-bold text-lg text-text-muted">
            / 10
          </span>
        </div>
      </div>

      {/* Range Input Slider */}
      <div className="relative px-2 pt-2 pb-1">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-shadow-dark/20 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        {/* Min/Max Labels */}
        <div className="flex justify-between text-xs font-inter text-text-secondary mt-2 px-1">
          <span>0 ({t.notAtAll})</span>
          <span>10 ({t.highlyPrefer})</span>
        </div>
      </div>

      {/* Number Tap Buttons */}
      <div className="grid grid-cols-11 gap-1 pt-1">
        {values.map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`h-9 rounded-xl font-outfit font-bold text-xs flex items-center justify-center transition-all duration-150
                ${
                  isSelected
                    ? "skeu-btn-primary text-white shadow-md scale-105"
                    : "skeu-btn text-text-secondary hover:text-text hover:bg-base"
                }
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
