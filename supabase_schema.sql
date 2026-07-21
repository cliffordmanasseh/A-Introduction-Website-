-- =================================================================
-- Worship Music Blind Audition — Supabase SQL Schema
-- Run this in your Supabase project's SQL Editor to create the table
-- =================================================================

CREATE TABLE IF NOT EXISTS blind_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  voter_name TEXT,
  song_id TEXT NOT NULL,
  segment_id TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by session or song
CREATE INDEX IF NOT EXISTS idx_blind_votes_song ON blind_votes(song_id);
CREATE INDEX IF NOT EXISTS idx_blind_votes_session ON blind_votes(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE blind_votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to submit ballots (INSERT)
CREATE POLICY "Allow public insert to blind_votes" ON blind_votes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous/admin users to read votes (SELECT)
CREATE POLICY "Allow public select from blind_votes" ON blind_votes
  FOR SELECT TO anon, authenticated
  USING (true);

-- =================================================================
-- Invite Tokens Schema
-- =================================================================

CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);

ALTER TABLE invite_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select from invite_tokens" ON invite_tokens
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public update/insert to invite_tokens" ON invite_tokens
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

