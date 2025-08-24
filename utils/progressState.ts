import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DailySnapshot = {
  date: string; // YYYY-MM-DD
  weight: number | null;
  calories: number | null;
};

export type ProgressState = {
  snapshots: DailySnapshot[];
  addSnapshot: (snapshot: Partial<Omit<DailySnapshot, 'date'>>) => void;
};

export const useProgressStore = create(
  persist<ProgressState>(
    (set, get) => ({
      snapshots: [],
      addSnapshot: (newSnapshotData) => {
        if (!newSnapshotData || typeof newSnapshotData !== 'object') {
          console.error("addSnapshot called with invalid data:", newSnapshotData);
          return;
        }

        const today = new Date().toISOString().split('T')[0];

        set((state) => {
          const currentSnapshots = Array.isArray(state.snapshots) ? state.snapshots.filter(Boolean) : [];
          const existingSnapshotIndex = currentSnapshots.findIndex(s => s.date === today);

          if (existingSnapshotIndex !== -1) {
            const updatedSnapshots = [...currentSnapshots];
            const existingSnapshot = updatedSnapshots[existingSnapshotIndex];

            updatedSnapshots[existingSnapshotIndex] = {
              ...existingSnapshot,
              ...newSnapshotData,
            };
            return { snapshots: updatedSnapshots };
          } else {
            const newSnapshot = {
              date: today,
              weight: null,
              calories: null,
              ...newSnapshotData,
            };
            return { snapshots: [...currentSnapshots, newSnapshot] };
          }
        });
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
