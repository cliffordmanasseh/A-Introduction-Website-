"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { submitCloudBallot, consumeInviteToken } from "@/lib/supabase";
import { CompletionBar } from "@/components/poll/CompletionBar";
import { TOTAL_TRACKS } from "@/lib/songs";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/common/LanguageToggle";

import { useEffect, useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];

  const { sessionId, voterName, ratings, comments, inviteToken, markCompleted, hasCompleted } =
    usePollStore();
  const { stopAll } = useAudioStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasCompleted) {
      router.push("/thank-you");
      return;
    }
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    stopAll();

    // Consume invite token if present
    if (inviteToken) {
      await consumeInviteToken(inviteToken);
    }

    await submitCloudBallot({
      sessionId: sessionId || "anon-session",
      voterName: voterName || "Anonymous Voter",
      ratings,
      comments,
    });

    markCompleted();
    setIsSubmitting(false);
    router.push("/thank-you");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-6 bg-base text-text relative">
      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-md flex items-center justify-end z-20 pt-2">
        <LanguageToggle />
      </div>

      <main className="max-w-md w-full space-y-8 text-center my-auto">
        {/* Progress Bar 100% */}
        <CompletionBar currentStep={TOTAL_TRACKS} totalSteps={TOTAL_TRACKS} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="skeu-raised p-8 rounded-3xl space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl skeu-inset flex items-center justify-center text-primary mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-text text-embossed">
              {t.reviewTitle}
            </h1>
            <p className="text-sm text-text-secondary font-inter leading-relaxed">
              {t.reviewSub}
            </p>
          </div>

          {/* Warm encouragement card */}
          <div className="skeu-inset p-4 rounded-2xl space-y-2 text-left bg-primary/5">
            <div className="flex items-center gap-2 font-outfit font-bold text-xs text-primary">
              <Heart className="w-4 h-4 fill-primary text-primary" />
              {t.reviewEncouragementHeader}
            </div>
            <p className="text-xs text-text-secondary font-inter leading-relaxed">
              {t.reviewEncouragementBody}
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-8 py-4 skeu-btn-primary text-white font-outfit font-extrabold text-base flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.submitting}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t.submitResponsesBtn}
              </>
            )}
          </button>
        </motion.div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-text-muted font-inter">
        {t.footerReady}
      </footer>
    </div>
  );
}
