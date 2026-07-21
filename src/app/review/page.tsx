"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { CompletionBar } from "@/components/poll/CompletionBar";
import { TOTAL_TRACKS } from "@/lib/songs";
import { Heart } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const { sessionId, voterName, ratings, comments, inviteToken, markCompleted, hasCompleted } =
    usePollStore();
  const { stopAll } = useAudioStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (hasCompleted) {
    router.push("/already-voted");
    return null;
  }

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-10 bg-base text-text">
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
              ஆடிஷன் முடிந்தது!
            </h1>
            <p className="text-sm text-text-secondary font-inter leading-relaxed">
              அனைத்துப் பாடல்களையும் வெற்றிகரமாக மதிப்பிட்டு முடித்துவிட்டீர்கள்.
            </p>
          </div>

          {/* Warm encouragement card */}
          <div className="skeu-inset p-4 rounded-2xl space-y-2 text-left bg-primary/5">
            <div className="flex items-center gap-2 font-outfit font-bold text-xs text-primary">
              <Heart className="w-4 h-4 fill-primary text-primary" />
              உங்கள் பங்களிப்புக்கு நன்றி!
            </div>
            <p className="text-xs text-text-secondary font-inter leading-relaxed">
              உங்கள் கருத்துக்கள் எங்கள் பாடலை மேலும் சிறப்பக்கவும், உங்கள் அனுபவத்திற்கு ஏற்ப தனித்துவமாக (personalised) அமைக்கவும் பெரிதும் உதவும்.
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
                சமர்ப்பிக்கப்படுகிறது...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                பதில்களைச் சமர்ப்பி
              </>
            )}
          </button>
        </motion.div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-text-muted font-inter">
        மறைமுக ஆடிஷன் &bull; பதில் சமர்ப்பிக்கத் தயார்
      </footer>
    </div>
  );
}
