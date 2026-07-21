"use client";

import { use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { getTrackItemByIndex, TOTAL_TRACKS } from "@/lib/songs";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { RatingSlider } from "@/components/poll/RatingSlider";

export default function PollPage({
  params,
}: {
  params: Promise<{ songNumber: string }>;
}) {
  const { songNumber } = use(params);
  const router = useRouter();
  const stepNum = parseInt(songNumber, 10);
  const stepIndex = stepNum - 1;

  const {
    ratings,
    currentStepIndex,
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
          <p className="text-text font-outfit font-bold text-lg">பாடல் இன்னும் தயாராகவில்லை</p>
          <button
            onClick={() => {
              initOrders();
              router.push("/poll/1");
            }}
            className="skeu-btn-primary px-6 py-2.5 font-outfit font-semibold text-sm w-full"
          >
            பாடல் #1 இல் இருந்து தொடங்கு
          </button>
        </div>
      </div>
    );
  }

  const isAudioPlaying = currentSegmentId === trackItem.id && isPlaying;
  const currentScore = ratings[trackItem.id] ?? 5;
  const isLastTrack = stepNum === TOTAL_TRACKS;

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

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-8 bg-base text-text">
        {/* Top Header Step Bar */}
        <div className="w-full max-w-xl flex items-center justify-between opacity-80 text-xs font-outfit font-semibold text-text-muted">
          <span>பாடல் {stepNum} / {TOTAL_TRACKS}</span>
          <span>அமைப்பு {trackItem.label}</span>
        </div>

        {/* Main Interface Content */}
        <main className="max-w-xl w-full my-auto space-y-10 py-6 text-center">
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
                1 முதல் 10 வரையிலான புள்ளிகளில், இந்தப் பாடலை உங்கள் சொந்தப் பாடலாகப் பாட எவ்வளவு விரும்புகிறீர்கள்?
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
                  {isAudioPlaying ? "பாடல் ஒலிக்கிறது..." : "பாடலைக் கேட்க தட்டவும்"}
                </span>
              </div>

              {/* 0 to 10 Rating Slider */}
              <RatingSlider
                value={currentScore}
                onChange={(val) => setRating(trackItem.id, val)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto pt-4">
            <button
              onClick={handlePrev}
              disabled={stepNum <= 1}
              className="skeu-btn px-5 py-3 rounded-2xl font-outfit font-semibold text-sm flex items-center gap-1.5 text-text-secondary hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              முந்தைய
            </button>

            <button
              onClick={handleNext}
              className="skeu-btn-primary px-8 py-3 rounded-2xl font-outfit font-bold text-sm flex items-center gap-2 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {isLastTrack ? "சமர்ப்பிக்க" : "அடுத்தது"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* Footer info */}
        <footer className="w-full text-center py-2 text-[11px] text-text-muted font-inter">
          மறைமுக ஆடிஷன் &bull; 0 முதல் 10 வரை மதிப்பிடவும்
        </footer>
      </div>
    </AudioProvider>
  );
}
