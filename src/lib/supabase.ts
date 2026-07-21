import { createClient } from "@supabase/supabase-js";
import { TRACK_ITEMS } from "./songs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://srvrxnjapbopvpgmuybi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_t9N-kIX7Ot_R6gFggdSoHg_6THybCl-";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CloudVoteData {
  id?: string;
  songId: string;
  segmentId: string;
  sessionId: string;
  voterName?: string;
  comment?: string;
  timestamp: number;
}

/**
 * Submits the completed ballot to Supabase cloud table `blind_votes`.
 */
export async function submitCloudBallot({
  sessionId,
  voterName,
  votes,
  ratings,
  comments,
}: {
  sessionId: string;
  voterName: string;
  votes?: Record<string, string>;
  ratings?: Record<string, number>;
  comments?: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    let rows: any[] = [];

    if (ratings && Object.keys(ratings).length > 0) {
      rows = Object.entries(ratings).map(([segmentId, score]) => {
        const track = TRACK_ITEMS.find((t) => t.id === segmentId);
        const userComment = comments?.[segmentId] || "";
        return {
          session_id: sessionId,
          voter_name: voterName || "Anonymous Voter",
          song_id: track?.songId || segmentId,
          segment_id: segmentId,
          comment: `Rating: ${score}/10` + (userComment ? ` - ${userComment}` : ""),
          created_at: new Date().toISOString(),
        };
      });
    } else if (votes && Object.keys(votes).length > 0) {
      rows = Object.entries(votes).map(([songId, segmentId]) => ({
        session_id: sessionId,
        voter_name: voterName || "Anonymous Voter",
        song_id: songId,
        segment_id: segmentId,
        comment: comments?.[songId] || null,
        created_at: new Date().toISOString(),
      }));
    }

    if (rows.length === 0) {
      return { success: true };
    }

    const { error } = await supabase.from("blind_votes").insert(rows);

    if (error) {
      console.error("Supabase insert error:", error.message || error);
      return { success: false, error: error.message || "Insert failed" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Submit ballot error:", err);
    return { success: false, error: err.message || "Unknown cloud error" };
  }
}

/**
 * Fetches all un-blinded vote records from Supabase for the Admin Dashboard.
 */
export async function fetchCloudVotes(): Promise<CloudVoteData[]> {
  try {
    const { data, error } = await supabase
      .from("blind_votes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Could not fetch from Supabase:", error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      songId: row.song_id,
      segmentId: row.segment_id,
      sessionId: row.session_id,
      voterName: row.voter_name,
      comment: row.comment || undefined,
      timestamp: new Date(row.created_at).getTime(),
    }));
  } catch (err) {
    console.error("Fetch cloud votes error:", err);
    return [];
  }
}

/**
 * Clears all vote records from Supabase cloud table `blind_votes`.
 */
export async function clearCloudVotes(): Promise<boolean> {
  try {
    const { error } = await supabase.from("blind_votes").delete().gte("created_at", "1970-01-01T00:00:00Z");
    if (error) {
      console.error("Clear cloud votes error:", error.message || error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Clear cloud votes error:", err);
    return false;
  }
}

export interface InviteTokenRecord {
  id: string;
  token: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
}

function getLocalTokens(): InviteTokenRecord[] {
  try {
    const raw = localStorage.getItem("local_invite_tokens");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTokens(tokens: InviteTokenRecord[]) {
  try {
    localStorage.setItem("local_invite_tokens", JSON.stringify(tokens));
  } catch {}
}

/**
 * Verifies if an invite token exists and is unused.
 */
export async function verifyInviteToken(token: string): Promise<{ valid: boolean; isUsed: boolean; error?: string }> {
  const cleanToken = token.trim().toUpperCase();

  try {
    const { data, error } = await supabase
      .from("invite_tokens")
      .select("*")
      .eq("token", cleanToken)
      .maybeSingle();

    if (!error && data) {
      return { valid: true, isUsed: !!data.is_used };
    }
  } catch {}

  // Fallback to local storage
  const local = getLocalTokens();
  const found = local.find((t) => t.token === cleanToken);
  if (found) {
    return { valid: true, isUsed: found.isUsed };
  }

  return { valid: false, isUsed: false };
}

/**
 * Marks an invite token as consumed/used.
 */
export async function consumeInviteToken(token: string): Promise<boolean> {
  const cleanToken = token.trim().toUpperCase();

  try {
    await supabase
      .from("invite_tokens")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("token", cleanToken);
  } catch {}

  // Also update local storage
  const local = getLocalTokens();
  const updated = local.map((t) => (t.token === cleanToken ? { ...t, isUsed: true, usedAt: new Date().toISOString() } : t));
  saveLocalTokens(updated);

  return true;
}

/**
 * Generates batch invite tokens for the Admin Portal.
 */
export async function generateBatchInviteTokens(count: number = 50): Promise<string[]> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const tokens: string[] = [];

  for (let i = 0; i < count; i++) {
    let code = "AUDITION-";
    for (let j = 0; j < 4; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    tokens.push(code);
  }

  const now = new Date().toISOString();
  const rows = tokens.map((t) => ({ token: t, is_used: false }));

  // Try inserting into Supabase
  try {
    const { error } = await supabase.from("invite_tokens").insert(rows);
    if (error) {
      console.warn("Supabase invite table insert warning:", error.message);
    }
  } catch (err: any) {
    console.warn("Supabase invite table notice:", err?.message);
  }

  // Always backup/save to local storage so admin has tokens immediately
  const local = getLocalTokens();
  const newRecords: InviteTokenRecord[] = tokens.map((t) => ({
    id: "loc-" + Math.random().toString(36).slice(2, 9),
    token: t,
    isUsed: false,
    createdAt: now,
  }));
  saveLocalTokens([...newRecords, ...local]);

  return tokens;
}

/**
 * Fetches all invite token records for the Admin Dashboard.
 */
export async function fetchAllInviteTokens(): Promise<InviteTokenRecord[]> {
  const local = getLocalTokens();
  const tokenMap = new Map<string, InviteTokenRecord>();

  local.forEach((t) => tokenMap.set(t.token, t));

  try {
    const { data, error } = await supabase
      .from("invite_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      data.forEach((row) => {
        tokenMap.set(row.token, {
          id: row.id,
          token: row.token,
          isUsed: !!row.is_used,
          usedAt: row.used_at || undefined,
          createdAt: row.created_at,
        });
      });
    }
  } catch {}

  return Array.from(tokenMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export interface DraftProgressData {
  sessionId: string;
  inviteToken?: string | null;
  currentStepIndex: number;
  ratings: Record<string, number>;
  updatedAt: string;
}

/**
 * Saves or updates user's draft ratings in Supabase cloud (or local fallback).
 */
export async function saveDraftProgress({
  sessionId,
  inviteToken,
  currentStepIndex,
  ratings,
}: {
  sessionId: string;
  inviteToken?: string | null;
  currentStepIndex: number;
  ratings: Record<string, number>;
}): Promise<boolean> {
  const payload = {
    session_id: sessionId,
    invite_token: inviteToken || null,
    current_step_index: currentStepIndex,
    ratings_json: JSON.stringify(ratings),
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from("poll_drafts")
      .upsert(payload, { onConflict: "session_id" });

    if (error) {
      console.warn("Cloud draft save warning:", error.message);
    }
  } catch (err: any) {
    console.warn("Cloud draft save notice:", err?.message);
  }

  // Backup to localStorage
  try {
    localStorage.setItem(
      `draft_${inviteToken || sessionId}`,
      JSON.stringify({
        sessionId,
        inviteToken,
        currentStepIndex,
        ratings,
        updatedAt: payload.updated_at,
      })
    );
  } catch {}

  return true;
}

/**
 * Fetches saved draft progress by invite token or session ID.
 */
export async function fetchDraftProgress(
  identifier: string
): Promise<DraftProgressData | null> {
  const cleanId = identifier.trim().toUpperCase();

  try {
    // Try fetching by invite_token or session_id
    const { data, error } = await supabase
      .from("poll_drafts")
      .select("*")
      .or(`invite_token.eq.${cleanId},session_id.eq.${identifier}`)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return {
        sessionId: data.session_id,
        inviteToken: data.invite_token,
        currentStepIndex: data.current_step_index,
        ratings: typeof data.ratings_json === "string" ? JSON.parse(data.ratings_json) : data.ratings_json || {},
        updatedAt: data.updated_at,
      };
    }
  } catch {}

  // Local storage fallback
  try {
    const raw = localStorage.getItem(`draft_${cleanId}`) || localStorage.getItem(`draft_${identifier}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  return null;
}
