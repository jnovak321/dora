import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  started: boolean;
  stars: Record<string, number>;
  start: () => void;
  setStars: (lessonId: string, next: number) => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      started: false,
      stars: {},
      start: () => set({ started: true }),
      setStars: (lessonId, next) =>
        set((s) => ({
          stars: {
            ...s.stars,
            [lessonId]: Math.max(s.stars[lessonId] ?? 0, next),
          },
        })),
    }),
    { name: "dora-progress" },
  ),
);

export function starsFromMistakes(mistakes: number) {
  if (mistakes <= 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}
