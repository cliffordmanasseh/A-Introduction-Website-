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
import { verifyInviteToken, fetchDraftProgress } from "@/lib/supabase";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    setTokenStatus("verifying");
    setStatusMessage("சரிபார்க்கப்படுகிறது...");

    const res = await verifyInviteToken(code);

    if (!res.valid) {
      setTokenStatus("invalid");
      setStatusMessage("தவறான அழைப்பு குறியீடு. இணைப்பைச் சரிபார்க்கவும்.");
      setInviteToken(null);
    } else if (res.isUsed) {
      setTokenStatus("used");
      setStatusMessage("இந்த அழைப்பு இணைப்பு ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது.");
      setInviteToken(null);
    } else {
      setTokenStatus("valid");
      setInviteToken(code.trim().toUpperCase());

      // Check if user has saved cloud draft progress for this invite code
      const draft = await fetchDraftProgress(code);
      if (draft && draft.ratings && Object.keys(draft.ratings).length > 0) {
        Object.entries(draft.ratings).forEach(([segId, score]) => {
          setRating(segId, score);
        });
        if (typeof draft.currentStepIndex === "number") {
          goToStep(draft.currentStepIndex);
        }
        setStatusMessage(`அழைப்பு குறியீடு சரிபார்க்கப்பட்டது! (முன்னேற்றம் மீட்டமைக்கப்பட்டது: ${Object.keys(draft.ratings).length} பாடல்கள்)`);
      } else {
        setStatusMessage("செல்லுபடியாகும் அழைப்பு குறியீடு!");
      }
    }
  };

  const hasStarted = Object.keys(ratings).length > 0 && !hasCompleted;

  const handleStart = () => {
    initOrders();
    router.push("/poll/1");
  };

  const handleResume = () => {
    const nextStep = currentStepIndex + 1;
    router.push(`/poll/${nextStep}`);
  };

  const handleStartOver = () => {
    if (confirm("உங்கள் தற்போதைய முன்னேற்றத்தை மீட்டமைத்து புதிய அமர்வைத் தொடங்கவா?")) {
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
    <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-10 relative bg-base">
      <ParticleField count={20} />

      {/* Hero Section */}
      <main className="max-w-2xl w-full text-center space-y-8 my-auto py-8 z-10">
        {/* Title & Description */}
        <div className="space-y-4 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl font-outfit font-extrabold text-text text-embossed tracking-tight leading-snug"
          >
            வணக்கம்! <span className="gradient-text">நமது குடும்பப் பாடலை இணைந்து உருவாக்குவோம்! 🎵</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary font-inter text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            இந்தப் பாடலுக்கு எந்த வகையான இசை ட்யூன் சரியாக இருக்கும் என்பதைத் தீர்மானிக்க உங்கள் உதவி தேவை. கீழே உள்ள வாக்கெடுப்பில் உங்கள் விருப்பமான இசை அமைப்பைத் தேர்ந்தெடுங்கள்!
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
            பங்கேற்பது எப்படி?
          </h2>
          <ul className="space-y-2.5 text-xs text-text-secondary font-inter leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">1.</span>
              <span><strong className="text-text font-semibold">ஹெட்ஃபோன் அணியவும்:</strong> சிறந்த இசை அனுபவத்தைப் பெற ஹெட்ஃபோன் பயன்படுத்தவும்.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">2.</span>
              <span><strong className="text-text font-semibold">இசையைக் கேட்கவும்:</strong> பிளே பொத்தானைத் தட்டி இசையைக் கேட்கவும்.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">3.</span>
              <span><strong className="text-text font-semibold">மதிப்பிடவும்:</strong> இந்தப் பாடலை நீங்கள் பாட விரும்பும் அளவை 0 முதல் 10 வரை தேர்வு செய்யவும்.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">4.</span>
              <span><strong className="text-text font-semibold">அடுத்த பாடல்:</strong> மதிப்பிட்ட பின் &apos;அடுத்தது&apos; பொத்தானைக் கிளிக் செய்யவும்.</span>
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
              அழைப்பு குறியீடு / இணைப்பு
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
                placeholder="அழைப்பு குறியீட்டை உள்ளிடவும் (எ.கா: AUDITION-XXXX)"
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
                  "சரிபார்"
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
          {hasCompleted ? (
            <button
              onClick={() => router.push("/already-voted")}
              className="w-full sm:w-auto px-8 py-4 skeu-btn-primary font-outfit font-bold text-base flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5" />
              உங்கள் ரசீதைப் பார்க்கவும்
            </button>
          ) : hasStarted ? (
            <>
              <button
                onClick={handleResume}
                className="w-full sm:flex-1 py-4 px-6 skeu-btn-primary font-outfit font-bold text-base flex items-center justify-center gap-2"
              >
                தொடரவும் - பாடல் #{currentStepIndex + 1}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartOver}
                className="w-full sm:w-auto py-4 px-5 skeu-btn text-text-secondary font-outfit font-semibold text-sm flex items-center justify-center gap-2"
                title="மீட்டமை"
              >
                <RotateCcw className="w-4 h-4" />
                மீட்டமை
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
              வாக்கெடுப்பைத் தொடங்குங்கள்
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 font-inter text-xs text-text-muted">
        ஆராதனை பாடல் ஆடிஷன் &bull; அழைப்பு மூலம் மட்டுமே
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
