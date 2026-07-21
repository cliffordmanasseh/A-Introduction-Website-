import { Song, Segment } from '@/types';

export const SONGS: Song[] = [
  {
    id: 'song-1',
    pollId: 'poll-1',
    number: 1,
    title: 'Enne Karuthum',
    artist: 'Isaac William',
    language: 'Tamil',
    displayOrder: 1,
    segments: [
      { id: 'song-1-A', songId: 'song-1', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/1/1A.wav' },
      { id: 'song-1-B', songId: 'song-1', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/1/1B.wav' },
      { id: 'song-1-C', songId: 'song-1', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/1/1C.wav' },
      { id: 'song-1-D', songId: 'song-1', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/1/1D.wav' },
    ],
  },
  {
    id: 'song-2',
    pollId: 'poll-1',
    number: 2,
    title: 'Haath Uthaakar Gaoonga',
    artist: 'Samarth Shukla ft. Bridge Music',
    language: 'Hindi',
    displayOrder: 2,
    segments: [
      { id: 'song-2-A', songId: 'song-2', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/2/2A.wav' },
      { id: 'song-2-B', songId: 'song-2', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/2/2B.wav' },
      { id: 'song-2-C', songId: 'song-2', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/2/2C.wav' },
      { id: 'song-2-D', songId: 'song-2', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/2/2D.wav' },
    ],
  },
  {
    id: 'song-3',
    pollId: 'poll-1',
    number: 3,
    title: 'Hazaaron Zubane',
    artist: 'Amit Kamble & Prakruthi Angelina',
    language: 'Hindi',
    displayOrder: 3,
    segments: [
      { id: 'song-3-A', songId: 'song-3', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/3/3A.wav' },
      { id: 'song-3-B', songId: 'song-3', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/3/3B.wav' },
      { id: 'song-3-C', songId: 'song-3', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/3/3C.wav' },
      { id: 'song-3-D', songId: 'song-3', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/3/3D.wav' },
    ],
  },
  {
    id: 'song-4',
    pollId: 'poll-1',
    number: 4,
    title: 'Naan Odi Vandhen',
    artist: 'Nations of Worship',
    language: 'Tamil',
    displayOrder: 4,
    segments: [
      { id: 'song-4-A', songId: 'song-4', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/4/4A.wav' },
      { id: 'song-4-B', songId: 'song-4', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/4/4B.wav' },
      { id: 'song-4-C', songId: 'song-4', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/4/4C.wav' },
      { id: 'song-4-D', songId: 'song-4', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/4/4D.wav' },
    ],
  },
  {
    id: 'song-5',
    pollId: 'poll-1',
    number: 5,
    title: 'Nanmaigal',
    artist: 'Timothy Sharan & Benny Visuvasam',
    language: 'Tamil',
    displayOrder: 5,
    segments: [
      { id: 'song-5-A', songId: 'song-5', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/5/5A.wav' },
      { id: 'song-5-B', songId: 'song-5', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/5/5B.wav' },
      { id: 'song-5-C', songId: 'song-5', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/5/5C.wav' },
      { id: 'song-5-D', songId: 'song-5', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/5/5D.wav' },
    ],
  },
  {
    id: 'song-6',
    pollId: 'poll-1',
    number: 6,
    title: 'Ovoru Nalum',
    artist: 'Cherie Mitchelle',
    language: 'Tamil',
    displayOrder: 6,
    segments: [
      { id: 'song-6-A', songId: 'song-6', label: 'A', displayLabel: 'Variation 1', audioUrl: '/audio/6/6A.wav' },
      { id: 'song-6-B', songId: 'song-6', label: 'B', displayLabel: 'Variation 2', audioUrl: '/audio/6/6B.wav' },
      { id: 'song-6-C', songId: 'song-6', label: 'C', displayLabel: 'Variation 3', audioUrl: '/audio/6/6C.wav' },
      { id: 'song-6-D', songId: 'song-6', label: 'D', displayLabel: 'Variation 4', audioUrl: '/audio/6/6D.wav' },
    ],
  },
];

export const TOTAL_SONGS = SONGS.length;
export const SEGMENTS_PER_SONG = 4;
export const LISTEN_GATE_SECONDS = 5; // Must listen 5s per segment before voting
export const ADMIN_PASSWORD = 'worship2026';

export interface TrackItem {
  id: string;
  songId: string;
  label: string;
  songNumber: number;
  variationLabel: 'A' | 'B' | 'C' | 'D';
  audioUrl: string;
  title: string;
}

// Sequence: 1A, 2A, 3A, 4A, 5A, 6A, 1B, 2B, 3B, 4B, 5B, 6B, 1C, 2C, 3C, 4C, 5C, 6C, 1D, 2D, 3D, 4D, 5D, 6D
export const TRACK_ITEMS: TrackItem[] = (['A', 'B', 'C', 'D'] as const).flatMap((label) =>
  SONGS.map((song) => {
    const seg = song.segments.find((s) => s.label === label)!;
    return {
      id: seg.id,
      songId: song.id,
      label: `${song.number}${label}`,
      songNumber: song.number,
      variationLabel: label,
      audioUrl: seg.audioUrl,
      title: song.title,
    };
  })
);

export const TOTAL_TRACKS = TRACK_ITEMS.length;

export function getTrackItemByIndex(index: number): TrackItem | undefined {
  return TRACK_ITEMS[index];
}

export function getSongByNumber(num: number): Song | undefined {
  return SONGS.find((s) => s.number === num);
}

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function shuffleSongs(songs: Song[]): string[] {
  const shuffledIds = songs.map((s) => s.id);
  for (let i = shuffledIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
  }
  return shuffledIds;
}

export function shuffleSegments(segments: Segment[]): Segment[] {
  const shuffled = [...segments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Re-assign display labels based on new order so they show as blind Variation 1, 2, 3, 4
  const labels = ['Variation 1', 'Variation 2', 'Variation 3', 'Variation 4'];
  return shuffled.map((seg, idx) => ({
    ...seg,
    displayLabel: labels[idx] || `Variation ${idx + 1}`,
  }));
}
