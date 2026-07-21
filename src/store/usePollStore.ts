import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SONGS, TRACK_ITEMS, TOTAL_TRACKS, shuffleSegments, shuffleSongs } from '@/lib/songs';
import type { Segment } from '@/types';

interface PollStore {
  // Session
  sessionId: string;
  voterName: string;
  inviteToken: string | null;
  isReturningVoter: boolean;
  hasCompleted: boolean;
  startTime: number | null;

  // Voting state
  currentStepIndex: number; // 0 to TOTAL_TRACKS - 1
  songOrder: string[]; // Randomized songId order
  votes: Record<string, string>; // songId → segmentId
  ratings: Record<string, number>; // segmentId → score 0..10
  comments: Record<string, string>; // songId → comment text
  listenedSegments: Record<string, string[]>; // songId → listened segment IDs
  listenDurations: Record<string, number>; // segmentId → total ms listened
  segmentOrder: Record<string, Segment[]>; // songId → shuffled segments

  // Actions
  setVoterName: (name: string) => void;
  setSessionId: (id: string) => void;
  setInviteToken: (token: string | null) => void;
  initOrders: () => void;
  markSegmentListened: (songId: string, segmentId: string) => void;
  addListenDuration: (segmentId: string, ms: number) => void;
  castVote: (songId: string, segmentId: string) => void;
  setRating: (segmentId: string, rating: number) => void;
  setComment: (songId: string, comment: string) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (index: number) => void;
  markCompleted: () => void;
  resetPoll: () => void;
}

function generateSessionId(): string {
  return 'voter-' + crypto.randomUUID().slice(0, 8);
}

function generateReceiptId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '#';
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const usePollStore = create<PollStore>()(
  persist(
    (set, get) => ({
      sessionId: '',
      voterName: '',
      inviteToken: null,
      isReturningVoter: false,
      hasCompleted: false,
      startTime: null,
      currentStepIndex: 0,
      songOrder: [],
      votes: {},
      ratings: {},
      comments: {},
      listenedSegments: {},
      listenDurations: {},
      segmentOrder: {},

      setVoterName: (name) => set({ voterName: name }),

      setSessionId: (id) => set({ sessionId: id }),

      setInviteToken: (token) => set({ inviteToken: token }),

      initOrders: () => {
        const state = get();
        if (state.songOrder.length > 0 && Object.keys(state.segmentOrder).length > 0) return; // Already initialized

        const sOrder = shuffleSongs(SONGS);
        const segOrder: Record<string, Segment[]> = {};
        SONGS.forEach((song) => {
          segOrder[song.id] = shuffleSegments(song.segments);
        });

        set({
          songOrder: sOrder,
          segmentOrder: segOrder,
          sessionId: state.sessionId || generateSessionId(),
          startTime: state.startTime || Date.now(),
        });
      },

      markSegmentListened: (songId, segmentId) =>
        set((state) => {
          const current = state.listenedSegments[songId] || [];
          if (current.includes(segmentId)) return state;
          return {
            listenedSegments: {
              ...state.listenedSegments,
              [songId]: [...current, segmentId],
            },
          };
        }),

      addListenDuration: (segmentId, ms) =>
        set((state) => ({
          listenDurations: {
            ...state.listenDurations,
            [segmentId]: (state.listenDurations[segmentId] || 0) + ms,
          },
        })),

      castVote: (songId, segmentId) =>
        set((state) => ({
          votes: { ...state.votes, [songId]: segmentId },
        })),

      setRating: (segmentId, rating) =>
        set((state) => ({
          ratings: { ...state.ratings, [segmentId]: rating },
        })),

      setComment: (songId, comment) =>
        set((state) => ({
          comments: { ...state.comments, [songId]: comment },
        })),

      goToNextStep: () =>
        set((state) => ({
          currentStepIndex: Math.min(state.currentStepIndex + 1, TOTAL_TRACKS - 1),
        })),

      goToPrevStep: () =>
        set((state) => ({
          currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
        })),

      goToStep: (index) => set({ currentStepIndex: index }),

      markCompleted: () => set({ hasCompleted: true }),

      resetPoll: () =>
        set({
          currentStepIndex: 0,
          songOrder: shuffleSongs(SONGS),
          votes: {},
          ratings: {},
          comments: {},
          listenedSegments: {},
          listenDurations: {},
          segmentOrder: (() => {
            const segOrder: Record<string, Segment[]> = {};
            SONGS.forEach((song) => {
              segOrder[song.id] = shuffleSegments(song.segments);
            });
            return segOrder;
          })(),
          hasCompleted: false,
          startTime: null,
          voterName: '',
          inviteToken: null,
          sessionId: generateSessionId(),
          isReturningVoter: false,
        }),
    }),
    {
      name: 'worship-poll-state',
    }
  )
);

export { generateReceiptId, generateSessionId };
