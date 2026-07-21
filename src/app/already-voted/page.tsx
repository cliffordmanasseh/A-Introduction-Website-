"use client";

import { motion } from "framer-motion";
import { UserCheck, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AlreadyVotedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative bg-base text-text">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-md w-full text-center space-y-6"
      >
        {/* Emblem */}
        <div className="mx-auto w-24 h-24 rounded-3xl skeu-raised p-3 flex items-center justify-center">
          <div className="w-full h-full rounded-2xl skeu-inset flex items-center justify-center bg-primary/10">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            அமர்வு முடிந்தது
          </div>
          <h1 className="text-3xl font-outfit font-extrabold text-text text-embossed">
            மீண்டும் வருக! 👋
          </h1>
          <p className="text-text-secondary font-inter text-sm md:text-base leading-relaxed">
            நீங்கள் ஏற்கனவே உங்கள் மறைமுக இசை ஆடிஷனை முடித்துச் சமர்ப்பித்துவிட்டீர்கள். உங்கள் பங்களிப்பிற்கு மிக்க நன்றி!
          </p>
        </div>

        {/* Info Card */}
        <div className="skeu-raised p-5 text-sm text-text-secondary font-inter space-y-2 rounded-2xl">
          <p className="font-semibold text-text">
            ஏன் மீண்டும் வாக்களிக்க முடியாது?
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            துல்லியமான முடிவுகளை உறுதி செய்ய, ஒரு சாதனத்திற்கு ஒரு முறை மட்டுமே சமர்ப்பிக்க அனுமதிக்கப்படுகிறது.
          </p>
        </div>

        {/* Back & Reset links */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="skeu-btn px-6 py-3 inline-flex items-center gap-2 text-sm font-outfit font-bold text-text-secondary hover:text-text transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            முகப்புப் பக்கத்திற்குத் திரும்பு
          </Link>
          <button
            onClick={() => {
              if (confirm("சோதனைக்காக உங்கள் அமர்வை மீட்டமைக்கவா? (Reset test session?)")) {
                localStorage.removeItem("worship-poll-state");
                window.location.href = "/";
              }
            }}
            className="skeu-btn px-4 py-3 inline-flex items-center gap-1.5 text-xs font-outfit font-semibold text-error/80 hover:text-error transition-colors w-full sm:w-auto justify-center"
          >
            🔄 Reset Test Session
          </button>
        </div>
      </motion.div>
    </div>
  );
}
