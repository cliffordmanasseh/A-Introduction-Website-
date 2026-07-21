"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { usePollStore, generateReceiptId } from "@/store/usePollStore";
import { TOTAL_TRACKS } from "@/lib/songs";
import { ConfettiExplosion } from "@/components/effects/Effects";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/common/LanguageToggle";

export default function ThankYouPage() {
  const { ratings } = usePollStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [receiptId] = useState(() => generateReceiptId());
  const [showConfetti, setShowConfetti] = useState(true);

  const ratedCount = Object.keys(ratings).length;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-8 relative bg-base text-text">
      {showConfetti && <ConfettiExplosion />}

      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-md flex items-center justify-end z-20 pt-2">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full text-center space-y-8 my-auto"
      >
        {/* Success Tactile Emblem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-3xl skeu-raised p-3 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-2xl skeu-circle-primary flex items-center justify-center bg-gradient-to-tr from-success to-emerald-400">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
        </motion.div>

        {/* Thank You Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3.5 py-1 rounded-full text-xs font-semibold text-success uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            {t.responsesSaved}
          </div>
          <h1 className="text-3xl md:text-4xl font-outfit font-extrabold text-text text-embossed">
            {t.thankYouTitle}
          </h1>
          <p className="text-text-secondary font-inter text-sm md:text-base">
            {t.thankYouSub}
          </p>
        </div>

        {/* Receipt & Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="skeu-raised p-6 space-y-4 rounded-3xl"
        >
          <div className="flex items-center justify-between skeu-inset p-4 rounded-2xl">
            <span className="text-xs font-outfit font-bold text-text-muted uppercase tracking-wider">
              {t.receiptTitle}
            </span>
            <span className="font-outfit font-extrabold text-xl text-primary">
              {receiptId}
            </span>
          </div>

          <div className="skeu-inset p-3.5 rounded-2xl text-center">
            <p className="text-xs text-text-muted font-inter">{t.ratedSongs}</p>
            <p className="font-outfit font-extrabold text-text text-2xl mt-0.5">
              {ratedCount} / {TOTAL_TRACKS}
            </p>
          </div>

          {/* Warm Personalised Connection Message */}
          <div className="skeu-inset p-4 rounded-2xl text-left bg-gradient-to-r from-primary/10 to-indigo-500/10 space-y-1.5 border border-primary/10">
            <p className="text-xs font-outfit font-extrabold text-primary flex items-center gap-1.5">
              {t.thankYouConnectionTitle}
            </p>
            <p className="text-xs text-text-secondary font-inter leading-relaxed">
              {t.thankYouConnectionBody}
            </p>
          </div>
        </motion.div>

        <p className="text-xs text-text-muted font-inter italic">
          &ldquo;{t.thankYouQuote}&rdquo;
        </p>
      </motion.div>

      <footer className="w-full text-center py-4 text-xs text-text-muted font-inter">
        {t.footerAudit}
      </footer>
    </div>
  );
}
