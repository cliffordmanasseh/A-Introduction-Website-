"use client";

import { useState, use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Save,
  BookmarkCheck,
  Home,
  X,
  Loader2,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { getTrackItemByIndex, TOTAL_TRACKS } from "@/lib/songs";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { RatingSlider } from "@/components/poll/RatingSlider";
import { CompletionBar } from "@/components/poll/CompletionBar";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { saveDraftProgress } from "@/lib/supabase";

export default function PollPage({
  params,
}: {
  params: Promise<{ songNumber: string }>;
}) {
  const { songNumber } = use(params);
  const router = useRouter();
  const stepNum = parseInt(songNumber, 10);
  const stepIndex = stepNum - 1;

  const { language } = useLanguageStore();
  const t = translations[language];

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    ratings,
    currentStepIndex,
    sessionId,
    inviteToken,
    initOrders,
    setRating,
    goToStep,
    hasCompleted,
  } = usePollStore();
  const { stopAll, togglePlay, currentSegmentId, isPlaying } = useAudioStore();

  useEffect(() => {
    initOrders();
  }, [initOrders]);

  useEffect(() => {
    if (!isNaN(stepIndex) && stepIndex !== currentStepIndex && stepIndex >= 0 && stepIndex < TOTAL_TRACKS) {
      goToStep(stepIndex);
    }
  }, [stepIndex, currentStepIndex, goToStep]);

  useEffect(() => {
    if (hasCompleted) {
      router.push("/already-voted");
    }
  }, [hasCompleted, router]);

  const trackItem = useMemo(() => getTrackItemByIndex(stepIndex), [stepIndex]);

  if (!trackItem || stepNum < 1 || stepNum > TOTAL_TRACKS) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4">
        <div className="skeu-raised p-8 text-center space-y-4 max-w-sm">
          <p className="text-text font-outfit font-bold text-lg">{t.notReadyTitle}</p>
          <button
            onClick={() => {
              initOrders();
              router.push("/poll/1");
            }}
            className="skeu-btn-primary px-6 py-2.5 font-outfit font-semibold text-sm w-full"
          >
            {t.startFromTrack1}
          </button>
        </div>
      </div>
    );
  }

  const isAudioPlaying = currentSegmentId === trackItem.id && isPlaying;
  const currentScore = ratings[trackItem.id] ?? 5;
  const isLastTrack = stepNum === TOTAL_TRACKS;

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    // Ensure current score is recorded
    if (ratings[trackItem.id] === undefined) {
      setRating(trackItem.id, currentScore);
    }
    await saveDraftProgress({
      sessionId,
      inviteToken,
      currentStepIndex: stepIndex,
      ratings: { ...ratings, [trackItem.id]: currentScore },
    });
    setIsSaving(false);
    setShowSaveModal(true);
  };

  const handleNext = () => {
    stopAll();
    // Ensure current rating is set if not edited
    if (ratings[trackItem.id] === undefined) {
      setRating(trackItem.id, 5);
    }
    if (isLastTrack) {
      router.push("/review");
    } else {
      router.push(`/poll/${stepNum + 1}`);
    }
  };

  const handlePrev = () => {
    stopAll();
    if (stepNum > 1) {
      router.push(`/poll/${stepNum - 1}`);
    }
  };

  const ratedCount = Object.keys(ratings).length;

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-6 bg-base text-text relative">
        {/* Top Header Step Bar */}
        <div className="w-full max-w-xl flex items-center justify-between opacity-90 text-xs font-outfit font-semibold text-text-muted">
          <span>
            {t.song} {stepNum} {t.of} {TOTAL_TRACKS}
          </span>
          <LanguageToggle compact />
        </div>

        {/* Main Interface Content */}
        <main className="max-w-xl w-full my-auto space-y-6 py-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={trackItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Description */}
              <h1 className="text-xl md:text-2xl font-outfit font-bold text-text text-embossed leading-relaxed max-w-lg mx-auto">
                {t.pollQuestion}
              </h1>

              {/* Play Button */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <button
                  type="button"
                  onClick={() => togglePlay(trackItem.id, trackItem.audioUrl)}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-200 shadow-xl ${
                    isAudioPlaying
                      ? "skeu-circle-primary scale-105 ring-4 ring-primary/30"
                      : "skeu-btn-primary hover:scale-105 active:scale-95"
                  }`}
                >
                  {isAudioPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </button>
                <span className="text-xs font-inter font-medium text-text-secondary">
                  {isAudioPlaying ? t.playing : t.tapToPlay}
                </span>
              </div>

              {/* 0 to 10 Rating Slider */}
              <RatingSlider
                value={currentScore}
                onChange={(val) => setRating(trackItem.id, val)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prominent Completion Progress Bar inside Main view */}
          <div className="pt-2">
            <CompletionBar currentStep={stepNum} totalSteps={TOTAL_TRACKS} />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={handlePrev}
              disabled={stepNum <= 1}
              className="skeu-btn px-4 py-3 rounded-2xl font-outfit font-semibold text-xs md:text-sm flex items-center gap-1 text-text-secondary hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.prevBtn}
            </button>

            <button
              onClick={handleSaveAndExit}
              disabled={isSaving}
              className="skeu-btn px-4 py-3 rounded-2xl font-outfit font-semibold text-xs md:text-sm flex items-center gap-1.5 text-primary hover:text-primary-dark transition-all disabled:opacity-50"
              title={t.saveBtn}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Save className="w-4 h-4 text-primary" />
              )}
              {t.saveBtn}
            </button>

            <button
              onClick={handleNext}
              className="skeu-btn-primary px-6 py-3 rounded-2xl font-outfit font-bold text-xs md:text-sm flex items-center gap-1.5 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {isLastTrack ? t.submitBtn : t.nextBtn}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* Footer info */}
        <footer className="w-full text-center py-2 text-[11px] text-text-muted font-inter">
          {t.footerAudit}
        </footer>

        {/* Save Confirmation Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="skeu-raised p-6 rounded-3xl max-w-sm w-full text-center space-y-5 relative bg-base text-text shadow-2xl"
              >
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-text p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 rounded-2xl skeu-inset flex items-center justify-center text-success mx-auto">
                  <BookmarkCheck className="w-8 h-8 text-success" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-outfit font-extrabold text-text text-embossed">
                    {t.saveModalTitle}
                  </h3>
                  <p className="text-xs text-text-secondary font-inter leading-relaxed">
                    {t.saveModalMsg
                      .replace("{count}", String(ratedCount))
                      .replace("{total}", String(TOTAL_TRACKS))}
                  </p>
                </div>

                <div className="skeu-inset p-3.5 rounded-2xl text-left text-[11px] text-text-muted space-y-1 font-inter">
                  <p className="font-semibold text-text">{t.saveModalTipHeader}</p>
                  <p>{t.saveModalTipBody}</p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="w-full py-3 skeu-btn-primary font-outfit font-bold text-sm text-white rounded-xl"
                  >
                    {t.continueRatingBtn}
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full py-2.5 skeu-btn font-outfit font-semibold text-xs text-text-secondary rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Home className="w-3.5 h-3.5" />
                    {t.goHomeBtn}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AudioProvider>
  );
}
