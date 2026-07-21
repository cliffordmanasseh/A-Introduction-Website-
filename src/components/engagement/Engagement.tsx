"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Headphones } from "lucide-react";
import type { Badge } from "@/types";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

// Badge display card
export function VoterBadge({
  badge,
  delay = 0,
}: {
  badge: Badge;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 220,
        damping: 16,
      }}
      className="skeu-raised p-4 flex items-center gap-3.5"
    >
      <div className="w-12 h-12 rounded-2xl skeu-inset flex items-center justify-center text-2xl shrink-0">
        {badge.emoji}
      </div>
      <div>
        <p className="font-outfit font-bold text-text text-sm text-embossed">
          {badge.label}
        </p>
        <p className="text-xs text-text-secondary font-inter mt-0.5">
          {badge.description}
        </p>
      </div>
    </motion.div>
  );
}

// Voter number display
export function VoterNumber({
  number,
  delay = 0,
}: {
  number: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="inline-flex items-center gap-2 skeu-inset px-4 py-2 rounded-full text-text-secondary text-sm font-inter shadow-inner"
    >
      <Star className="w-4 h-4 text-accent fill-accent" />
      <span>
        You are Blind Voter <span className="font-outfit font-bold text-primary">#{number}</span>
      </span>
    </motion.div>
  );
}

// Participation counter for landing page
export function ParticipationCounter({
  count,
  delay = 0,
}: {
  count: number;
  delay?: number;
}) {
  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center justify-center gap-3 text-sm font-inter skeu-raised px-5 py-2.5 rounded-full"
    >
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-primary-light border-2 border-base flex items-center justify-center shadow-sm"
          >
            <span className="text-[10px] font-bold text-white">
              {String.fromCharCode(65 + i)}
            </span>
          </div>
        ))}
      </div>
      <span className="text-text-secondary">
        <span className="font-bold text-text">{count}</span>{" "}
        {count === 1 ? "listener has" : "listeners have"} voted so far
      </span>
    </motion.div>
  );
}

// Vote receipt display
export function VoteReceipt({
  receiptId,
  delay = 0,
}: {
  receiptId: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="inline-flex items-center gap-3 skeu-inset px-5 py-2.5 rounded-2xl"
    >
      <span className="text-xs font-semibold text-text-muted font-inter uppercase tracking-wider">Receipt ID</span>
      <span className="font-outfit font-extrabold text-xl text-primary tracking-tight">
        {receiptId}
      </span>
    </motion.div>
  );
}
export function HeadphoneBanner() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="skeu-inset p-4 rounded-2xl flex items-center justify-center gap-3 border border-shadow-light/50"
    >
      <div className="w-10 h-10 rounded-xl skeu-raised flex items-center justify-center text-primary shrink-0">
        <Headphones className="w-5 h-5" />
      </div>
      <span className="text-text text-sm font-inter font-medium">
        {t.headphonesRequired}
      </span>
    </motion.div>
  );
}
