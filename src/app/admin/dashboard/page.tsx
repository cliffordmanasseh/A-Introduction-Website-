"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Percent,
  Trophy,
  MessageSquare,
  Download,
  RotateCcw,
  Power,
  ChevronDown,
  ChevronUp,
  LogOut,
  BarChart3,
  Clock,
  Music2,
  Unlock,
  Cloud,
  Loader2,
  Ticket,
  Copy,
  Check,
} from "lucide-react";
import { SONGS, TOTAL_SONGS, TRACK_ITEMS } from "@/lib/songs";
import { fetchCloudVotes, generateBatchInviteTokens, fetchAllInviteTokens, clearCloudVotes, InviteTokenRecord } from "@/lib/supabase";
import { usePollStore } from "@/store/usePollStore";

interface VoteData {
  songId: string;
  segmentId: string;
  sessionId: string;
  comment?: string;
  timestamp: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  delay,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="skeu-raised p-5 space-y-2 rounded-2xl"
    >
      <div className="flex items-center gap-2 text-text-secondary">
        <div className={`p-2 rounded-xl skeu-inset ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-outfit font-bold uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      <p className="text-3xl font-outfit font-extrabold text-text text-embossed">{value}</p>
      {subtext && <p className="text-xs text-text-muted font-inter">{subtext}</p>}
    </motion.div>
  );
}

function RatingResultBar({
  label,
  avgScore,
  delay,
}: {
  label: string;
  avgScore: number;
  delay: number;
}) {
  const percentage = (avgScore / 10) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-outfit font-bold text-text">
            {label}
          </span>
        </div>
        <span className="text-text-secondary font-inter text-xs font-semibold">
          <span className="font-outfit font-extrabold text-primary text-base">{avgScore.toFixed(1)}</span> / 10 score
        </span>
      </div>
      <div className="h-3.5 skeu-progress-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.15, duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-lg bg-gradient-to-r from-primary-dark to-primary-light"
        />
      </div>
    </motion.div>
  );
}

function SongResultCard({
  song,
  allVotes,
  index,
}: {
  song: (typeof SONGS)[0];
  allVotes: VoteData[];
  index: number;
}) {
  const [showComments, setShowComments] = useState(false);

  // Parse scores from comments/records
  const segmentStats = song.segments.map((seg) => {
    const records = allVotes.filter((v) => v.segmentId === seg.id || v.songId === seg.id);
    const scores: number[] = [];

    records.forEach((r) => {
      if (r.comment) {
        const match = r.comment.match(/Rating:\s*(\d+)\/10/i) || r.comment.match(/Score:\s*(\d+)/i);
        if (match) {
          scores.push(parseInt(match[1], 10));
        }
      }
    });

    const totalRatings = scores.length;
    const avgScore = totalRatings > 0 ? scores.reduce((a, b) => a + b, 0) / totalRatings : 0;

    return {
      ...seg,
      avgScore,
      totalRatings,
    };
  });

  const maxAvgScore = Math.max(...segmentStats.map((s) => s.avgScore));
  const cumulativeScore = segmentStats.reduce((sum, s) => sum + s.avgScore, 0);
  const totalSubmissions = Math.max(...segmentStats.map((s) => s.totalRatings), 0);

  const comments = allVotes
    .filter((v) => song.segments.some((s) => s.id === v.segmentId || s.id === v.songId) && v.comment)
    .map((v) => v.comment!);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
      className="skeu-raised p-6 space-y-4 rounded-3xl"
    >
      {/* Header showing un-blinded title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
            <Unlock className="w-3.5 h-3.5" />
            Track #{song.number} Revealed
          </div>
          <h3 className="text-xl font-outfit font-extrabold text-text text-embossed">
            {song.title}
          </h3>
          <p className="text-xs text-text-secondary font-inter">
            {song.artist} &bull; <span className="font-semibold text-primary">{song.language}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right skeu-inset px-4 py-2 rounded-2xl">
            <p className="text-2xl font-outfit font-extrabold text-accent">
              {cumulativeScore.toFixed(1)} <span className="text-xs font-semibold text-text-muted">/ 40</span>
            </p>
            <p className="text-[10px] uppercase font-bold text-text-muted font-inter">Cumulative Score</p>
          </div>
          <div className="text-right skeu-inset px-3.5 py-2 rounded-2xl">
            <p className="text-xl font-outfit font-extrabold text-primary">
              {totalSubmissions}
            </p>
            <p className="text-[10px] uppercase font-bold text-text-muted font-inter">Voters</p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {segmentStats.map((seg, i) => (
          <RatingResultBar
            key={seg.id}
            label={`${seg.displayLabel} (${seg.label})`}
            avgScore={seg.avgScore}
            delay={0.3 + index * 0.08 + i * 0.04}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [allVotes, setAllVotes] = useState<VoteData[]>([]);
  const [pollActive, setPollActive] = useState(true);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [cloudCount, setCloudCount] = useState(0);
  const [tokens, setTokens] = useState<InviteTokenRecord[]>([]);
  const [isGeneratingTokens, setIsGeneratingTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (auth !== "true") {
      router.push("/admin");
      return;
    }
    setIsAuthed(true);
    loadAllVotes();
    loadTokens();
  }, [router]);

  const loadTokens = async () => {
    const list = await fetchAllInviteTokens();
    setTokens(list);
  };

  const handleGenerateTokens = async (count: number = 10) => {
    setIsGeneratingTokens(true);
    await generateBatchInviteTokens(count);
    await loadTokens();
    setIsGeneratingTokens(false);
  };

  const copyInviteLink = (code: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/?invite=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(code);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const loadAllVotes = async () => {
    setIsLoadingCloud(true);
    const votesMap = new Map<string, VoteData>();

    // 1. Load Local Storage Votes
    try {
      const stored = localStorage.getItem("worship-poll-state");
      if (stored) {
        const parsed = JSON.parse(stored);
        const state = parsed.state || parsed;
        if (state.ratings && state.hasCompleted) {
          Object.entries(state.ratings).forEach(([segmentId, score]) => {
            const track = TRACK_ITEMS.find((t) => t.id === segmentId);
            const key = `${state.sessionId || "local"}_${segmentId}`;
            votesMap.set(key, {
              songId: track?.songId || segmentId,
              segmentId: segmentId as string,
              sessionId: state.sessionId || "unknown",
              comment: `Rating: ${score}/10` + (state.comments?.[segmentId] ? ` - ${state.comments[segmentId]}` : ""),
              timestamp: state.startTime || Date.now(),
            });
          });
        } else if (state.votes && state.hasCompleted) {
          Object.entries(state.votes).forEach(([songId, segmentId]) => {
            const key = `${state.sessionId || "local"}_${segmentId}`;
            votesMap.set(key, {
              songId,
              segmentId: segmentId as string,
              sessionId: state.sessionId || "unknown",
              comment: state.comments?.[songId] || undefined,
              timestamp: state.startTime || Date.now(),
            });
          });
        }
      }
    } catch {
      // Ignore parse errors
    }

    // 2. Fetch Supabase Cloud Votes
    const cloudVotes = await fetchCloudVotes();
    setCloudCount(cloudVotes.length);

    cloudVotes.forEach((v) => {
      // Unique key per segment so ALL 24 variations (A, B, C, D for every song) are counted
      const key = `${v.sessionId}_${v.segmentId}`;
      votesMap.set(key, {
        songId: v.songId,
        segmentId: v.segmentId,
        sessionId: v.sessionId,
        comment: v.comment,
        timestamp: v.timestamp,
      });
    });

    setAllVotes(Array.from(votesMap.values()));
    setIsLoadingCloud(false);
  };

  const stats = useMemo(() => {
    const uniqueSessions = new Set(allVotes.map((v) => v.sessionId));
    const totalVoters = uniqueSessions.size;
    const totalVotes = allVotes.length;
    const completedVoters = totalVoters;
    const completionRate =
      totalVoters > 0 ? ((completedVoters / totalVoters) * 100).toFixed(1) : "0";

    return { totalVoters, totalVotes, completedVoters, completionRate };
  }, [allVotes]);

  const handleExportCSV = () => {
    const headers = "Song Number,Real Title,Artist,Language,Selected Variation,Session ID,Comment,Timestamp\n";
    const rows = allVotes
      .map((v) => {
        const s = SONGS.find((song) => song.id === v.songId);
        const seg = s?.segments.find((sg) => sg.id === v.segmentId);
        return `"${s?.number || ""}","${s?.title || v.songId}","${s?.artist || ""}","${s?.language || ""}","${seg?.displayLabel || v.segmentId}","${v.sessionId}","${v.comment || ""}","${new Date(v.timestamp).toISOString()}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blind-worship-poll-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (confirm("⚠️ Are you sure you want to clear ALL test votes (both Cloud and Local)?")) {
      usePollStore.getState().resetPoll();
      localStorage.removeItem("worship-poll-state");
      localStorage.removeItem("local_invite_tokens");
      setAllVotes([]);
      await clearCloudVotes();
      await loadAllVotes();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-auth");
    router.push("/admin");
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="w-10 h-10 rounded-full skeu-inset flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-base/90 backdrop-blur-md border-b border-shadow-dark/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl skeu-inset flex items-center justify-center text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-outfit font-extrabold text-base md:text-lg text-text text-embossed">
                Blind Tally Admin Dashboard
              </h1>
              <p className="text-[11px] text-text-secondary font-inter hidden sm:block">Un-blinded analysis for organizer review only</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPollActive(!pollActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-outfit font-bold flex items-center gap-1.5 transition-all
                ${
                  pollActive
                    ? "skeu-inset text-success"
                    : "skeu-inset text-error"
                }
              `}
            >
              <Power className="w-3.5 h-3.5" />
              {pollActive ? "Audition Open" : "Audition Closed"}
            </button>
            <button
              onClick={handleLogout}
              className="skeu-btn px-3.5 py-1.5 rounded-xl text-text-secondary hover:text-text text-xs font-outfit font-bold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs uppercase tracking-widest text-text-muted font-outfit font-extrabold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Audition Overview
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full skeu-inset text-[11px] font-outfit font-bold text-success border border-success/20">
                <Cloud className="w-3.5 h-3.5 text-primary" />
                Supabase Cloud Connected ({cloudCount} records)
              </div>
            </div>
            <button
              onClick={loadAllVotes}
              disabled={isLoadingCloud}
              className="skeu-btn px-3.5 py-1.5 rounded-xl text-xs text-text-secondary hover:text-text font-outfit font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoadingCloud ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5 text-primary" />
              )}
              {isLoadingCloud ? "Syncing Cloud..." : "Refresh Cloud Tally"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Blind Judges"
              value={stats.totalVoters}
              color="text-primary"
              delay={0.1}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed Ballots"
              value={stats.completedVoters}
              subtext={`out of ${stats.totalVoters} sessions`}
              color="text-success"
              delay={0.15}
            />
            <StatCard
              icon={Percent}
              label="Finish Rate"
              value={`${stats.completionRate}%`}
              color="text-accent"
              delay={0.2}
            />
            <StatCard
              icon={Clock}
              label="Total Selections"
              value={stats.totalVotes}
              subtext={`across ${TOTAL_SONGS} mystery tracks`}
              color="text-emerald-600"
              delay={0.25}
            />
          </div>
        </section>

        {/* Invite Link Generator & Manager */}
        <section className="skeu-raised p-6 space-y-4 rounded-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              <h2 className="font-outfit font-extrabold text-base text-text text-embossed">
                One-Time Invite Links ({tokens.filter((t) => !t.isUsed).length} active, {tokens.filter((t) => t.isUsed).length} used)
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenerateTokens(50)}
                disabled={isGeneratingTokens}
                className="skeu-btn-primary px-4 py-2 text-xs font-outfit font-bold text-white rounded-xl disabled:opacity-50 flex items-center gap-1.5 shadow-md"
              >
                {isGeneratingTokens ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "+ Generate 50 Invites"}
              </button>
              <button
                onClick={() => handleGenerateTokens(10)}
                disabled={isGeneratingTokens}
                className="skeu-btn px-3 py-2 text-xs font-outfit font-bold text-text-secondary hover:text-text rounded-xl disabled:opacity-50 flex items-center gap-1.5"
              >
                + 10
              </button>
              {tokens.filter((t) => !t.isUsed).length > 0 && (
                <button
                  onClick={() => {
                    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
                    const activeLinks = tokens
                      .filter((t) => !t.isUsed)
                      .map((t) => `${baseUrl}/?invite=${t.token}`)
                      .join("\n");
                    navigator.clipboard.writeText(activeLinks);
                    alert(`Copied ${tokens.filter((t) => !t.isUsed).length} active invite links to clipboard!`);
                  }}
                  className="skeu-btn px-3 py-2 text-xs font-outfit font-bold text-primary rounded-xl flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy All Links
                </button>
              )}
            </div>
          </div>

          {tokens.length === 0 ? (
            <p className="text-xs text-text-muted font-inter">No invite tokens generated yet. Click above to generate batch invite links.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {tokens.map((item) => (
                <div key={item.id} className="skeu-inset p-3 rounded-xl flex items-center justify-between text-xs font-inter">
                  <div>
                    <span className="font-outfit font-bold text-text">{item.token}</span>
                    <span className={`block text-[10px] ${item.isUsed ? "text-error font-semibold" : "text-success font-semibold"}`}>
                      {item.isUsed ? "Used" : "Active"}
                    </span>
                  </div>
                  {!item.isUsed && (
                    <button
                      onClick={() => copyInviteLink(item.token)}
                      className="skeu-btn px-2.5 py-1 rounded-lg text-text-secondary hover:text-text flex items-center gap-1 text-[11px] font-outfit font-semibold"
                    >
                      {copiedToken === item.token ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-primary" />}
                      {copiedToken === item.token ? "Copied!" : "Copy Link"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Un-blinded Results */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-text-muted font-outfit font-extrabold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent fill-accent" />
            Un-blinded Results by Track
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SONGS.map((song, idx) => (
              <SongResultCard
                key={song.id}
                song={song}
                allVotes={allVotes}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* No Data State */}
        {allVotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="skeu-inset p-12 text-center space-y-3 rounded-3xl"
          >
            <Music2 className="w-12 h-12 text-text-muted mx-auto" />
            <h3 className="text-lg font-outfit font-bold text-text">
              No blind submissions yet
            </h3>
            <p className="text-xs text-text-secondary font-inter max-w-md mx-auto">
              Share the blind audition link with participants. As they complete their 6 track ballots, un-blinded tallies will appear here immediately.
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-text-muted font-outfit font-extrabold mb-4">
            Audition Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExportCSV}
              disabled={allVotes.length === 0}
              className="skeu-btn px-5 py-3 rounded-2xl text-text font-outfit font-bold text-sm flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 text-primary" />
              Export Un-blinded CSV Report
            </button>
            <button
              onClick={handleReset}
              className="skeu-btn px-5 py-3 rounded-2xl text-error font-outfit font-bold text-sm flex items-center gap-2.5 hover:bg-error/5"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Local Tally Data
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
