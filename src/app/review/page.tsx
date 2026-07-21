"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { submitCloudBallot, consumeInviteToken } from "@/lib/supabase";

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
              அனைத்துப் பாடல்களையும் மதிப்பிட்டதற்கு நன்றி. உங்கள் பதிலைப் பதிவு செய்ய கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்.
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
