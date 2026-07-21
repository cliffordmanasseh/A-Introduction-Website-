"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Ticket,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { ParticleField } from "@/components/effects/Effects";
import { HeadphoneBanner } from "@/components/engagement/Engagement";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { verifyInviteToken, fetchDraftProgress } from "@/lib/supabase";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = translations[language];

  const {
    hasCompleted,
    currentStepIndex,
    ratings,
    initOrders,
    resetPoll,
    setInviteToken,
    setRating,
    goToStep,
    inviteToken: storedToken,
  } = usePollStore();

  const [mounted, setMounted] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenStatus, setTokenStatus] = useState<"idle" | "verifying" | "valid" | "used" | "invalid">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const urlInvite = searchParams.get("invite") || searchParams.get("token");

  useEffect(() => {
    setMounted(true);
    initOrders();
  }, [initOrders]);

  // Handle URL invite code or stored invite code
  useEffect(() => {
    if (!mounted) return;

    const tokenToTest = urlInvite || storedToken;
    if (tokenToTest) {
      setTokenInput(tokenToTest);
      checkToken(tokenToTest);
    }
  }, [mounted, urlInvite]);

  const checkToken = async (code: string) => {
    if (!code.trim()) return;
    const cleanCode = code.trim().toUpperCase();

    setTokenStatus("verifying");
    setStatusMessage(t.verifying);

    const res = await verifyInviteToken(cleanCode);

    if (!res.valid) {
      setTokenStatus("invalid");
      setStatusMessage(t.invalidToken);
      setInviteToken(null);
    } else if (res.isUsed) {
      setTokenStatus("used");
      setStatusMessage(t.usedToken);
      setInviteToken(null);
    } else {
      setTokenStatus("valid");

      // If switching token or previously completed a session, reset completion state for new session
      if ((storedToken && storedToken !== cleanCode) || hasCompleted) {
        resetPoll();
        initOrders();
      }

      setInviteToken(cleanCode);

      // Check if user has saved cloud draft progress specifically for THIS invite code
      const draft = await fetchDraftProgress(cleanCode);
      if (draft && draft.ratings && Object.keys(draft.ratings).length > 0) {
        Object.entries(draft.ratings).forEach(([segId, score]) => {
          setRating(segId, score);
        });
        if (typeof draft.currentStepIndex === "number") {
          goToStep(draft.currentStepIndex);
        }
        setStatusMessage(
          language === "ta"
            ? `அழைப்பு குறியீடு சரிபார்க்கப்பட்டது! (${Object.keys(draft.ratings).length} பாடல்கள் மீட்டமைக்கப்பட்டன)`
            : `Invite code verified! (${Object.keys(draft.ratings).length} songs restored)`
        );
      } else {
        setStatusMessage(t.validToken);
      }
    }
  };

  const hasStarted = Object.keys(ratings).length > 0 && !hasCompleted;

  const handleStart = () => {
    resetPoll();
    initOrders();
    router.push("/poll/1");
  };

  const handleResume = () => {
    const nextStep = currentStepIndex + 1;
    router.push(`/poll/${nextStep}`);
  };

  const handleStartOver = () => {
    if (confirm(t.resetConfirm)) {
      resetPoll();
      initOrders();
      router.push("/poll/1");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="w-12 h-12 rounded-full skeu-inset flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isTokenRequired = true;
  const canProceed = !isTokenRequired || tokenStatus === "valid" || hasStarted || hasCompleted;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-6 relative bg-base">
      <ParticleField count={20} />

      {/* Top Bar with Language Toggle */}
      <div className="w-full max-w-2xl flex items-center justify-end z-20 pt-2">
        <LanguageToggle />
      </div>

      {/* Hero Section */}
      <main className="max-w-2xl w-full text-center space-y-8 my-auto py-6 z-10">
        {/* Title & Description */}
        <div className="space-y-4 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl font-outfit font-extrabold text-text text-embossed tracking-tight leading-snug"
          >
            {t.landingTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary font-inter text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t.landingSub}
          </motion.p>
        </div>

        {/* How to do the experiment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23 }}
          className="skeu-raised p-6 space-y-3.5 rounded-3xl text-left max-w-md mx-auto"
        >
          <h2 className="font-outfit font-extrabold text-sm text-text text-embossed flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            {t.howToTitle}
          </h2>
          <ul className="space-y-2.5 text-xs text-text-secondary font-inter leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">1.</span>
              <span>{t.step1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">2.</span>
              <span>{t.step2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">3.</span>
              <span>{t.step3}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">4.</span>
              <span>{t.step4}</span>
            </li>
          </ul>
        </motion.div>

        {/* Headphone Recommendation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="max-w-md mx-auto"
        >
          <HeadphoneBanner />
        </motion.div>

        {/* Save & Return info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
          className="max-w-md mx-auto skeu-inset p-4 rounded-2xl space-y-2.5 border border-primary/10 bg-primary/5"
        >
          <p className="font-outfit font-extrabold text-xs text-primary flex items-center gap-1.5">
            {t.saveInfoTitle}
          </p>
          <p className="text-xs text-text-secondary font-inter leading-relaxed">
            {t.saveInfoBody}
          </p>
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] text-text-muted font-inter leading-relaxed">
              {t.saveInfoSaveTip}
            </p>
            <p className="text-[11px] text-text-muted font-inter leading-relaxed">
              {t.saveInfoSubmitTip}
            </p>
          </div>
        </motion.div>

        {/* Invite Code Verification Panel */}
        {!hasCompleted && !hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="max-w-md mx-auto skeu-raised p-5 space-y-3 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-sm font-outfit font-bold text-text">
              <Ticket className="w-4 h-4 text-primary" />
              {t.invitePrompt}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setTokenStatus("idle");
                  setStatusMessage("");
                }}
                placeholder={t.invitePlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl skeu-inset text-text placeholder:text-text-muted font-inter text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase tracking-wider"
              />
              <button
                onClick={() => checkToken(tokenInput)}
                disabled={!tokenInput.trim() || tokenStatus === "verifying"}
                className="skeu-btn-primary px-4 py-2.5 text-xs font-outfit font-bold text-white rounded-xl disabled:opacity-50"
              >
                {tokenStatus === "verifying" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.verifyBtn
                )}
              </button>
            </div>

            {tokenStatus === "valid" && (
              <p className="text-xs text-success font-inter font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {statusMessage}
              </p>
            )}

            {(tokenStatus === "used" || tokenStatus === "invalid") && (
              <p className="text-xs text-error font-inter font-semibold flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {statusMessage}
              </p>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto"
        >
          {hasStarted ? (
            <>
              <button
                onClick={handleResume}
                className="w-full sm:flex-1 py-4 px-6 skeu-btn-primary font-outfit font-bold text-base flex items-center justify-center gap-2"
              >
                {t.resumePollBtn}{currentStepIndex + 1}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartOver}
                className="w-full sm:w-auto py-4 px-5 skeu-btn text-text-secondary font-outfit font-semibold text-sm flex items-center justify-center gap-2"
                title={t.resetBtn}
              >
                <RotateCcw className="w-4 h-4" />
                {t.resetBtn}
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              disabled={!canProceed}
              className={`w-full sm:w-auto px-10 py-4 font-outfit font-bold text-lg flex items-center justify-center gap-3 group transition-all rounded-2xl
                ${
                  canProceed
                    ? "skeu-btn-primary text-white hover:scale-105 active:scale-95 shadow-xl"
                    : "skeu-inset text-text-muted cursor-not-allowed opacity-50"
                }
              `}
            >
              {t.startPollBtn}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 font-inter text-xs text-text-muted">
        {t.footerInvite}
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-base">
          <div className="w-12 h-12 rounded-full skeu-inset flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
