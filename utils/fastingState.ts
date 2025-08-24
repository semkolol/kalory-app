import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FastingState = {
  fastingStartTime: number | null;
  fastingEndTime: number | null;
  isFasting: boolean;
  fastingHistory: { startTime: number; endTime: number }[];
  startFasting: () => void;
  stopFasting: () => void;
  resetFasting: () => void;
};

export const useFastingStore = create(
  persist<FastingState>(
    (set, get) => ({
      fastingStartTime: null,
      fastingEndTime: null,
      isFasting: false,
      fastingHistory: [],
      startFasting: () => {
        const now = Date.now();
        set({ fastingStartTime: now, isFasting: true });
      },
      stopFasting: () => {
        const now = Date.now();
        const { fastingStartTime } = get();
        if (fastingStartTime) {
          set((state) => ({
            fastingEndTime: now,
            isFasting: false,
            fastingHistory: [...state.fastingHistory, { startTime: fastingStartTime, endTime: now }],
          }));
        }
      },
      resetFasting: () => {
        set({ fastingStartTime: null, fastingEndTime: null, isFasting: false });
      },
    }),
    {
      name: 'fasting-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
