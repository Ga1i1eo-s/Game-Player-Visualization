import { create } from 'zustand';

interface MapState {
  selectedMap: string | null;
  selectedMatch: string | null;
  currentTime: number;
  playbackSpeed: number;
  isPlaying: boolean;
  maxTime: number;
  setMap: (map: string) => void;
  setMatch: (match: string | null) => void;
  setTime: (time: number) => void;
  setMaxTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  togglePlayback: () => void;
}

export const useStore = create<MapState>((set) => ({
  selectedMap: "AmbroseValley", // Default map
  selectedMatch: null,
  currentTime: 0,
  maxTime: 100000,
  playbackSpeed: 1,
  isPlaying: false,
  setMap: (map) => set({ selectedMap: map, selectedMatch: null, currentTime: 0 }),
  setMatch: (match) => set({ selectedMatch: match, currentTime: 0, isPlaying: false }),
  setTime: (time) => set({ currentTime: time }),
  setMaxTime: (time) => set({ maxTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
