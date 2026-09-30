import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const PROGRESS_KEY = "dora-progress";

export type ProgressSnapshot = {
  started: boolean;
  stars: Record<string, number>;
  stickers: Record<string, boolean>;
};

type ProgressState = ProgressSnapshot & {
  start: () => void;
  setStars: (lessonId: string, next: number) => void;
  collectSticker: (lessonId: string) => void;
};

export function mergeStars(
  persisted: Record<string, number> | undefined,
  current: Record<string, number>,
): Record<string, number> {
  const next = { ...current };
  for (const [id, value] of Object.entries(persisted ?? {})) {
    next[id] = Math.max(next[id] ?? 0, value ?? 0);
  }
  return next;
}

export function mergeStickers(
  persisted: Record<string, boolean> | undefined,
  current: Record<string, boolean>,
  stars: Record<string, number>,
): Record<string, boolean> {
  const next = { ...current, ...(persisted ?? {}) };
  for (const [id, value] of Object.entries(stars)) {
    if ((value ?? 0) > 0) next[id] = true;
  }
  return next;
}

export function mergeProgress(
  persisted: Partial<ProgressSnapshot> | undefined,
  current: ProgressSnapshot,
): ProgressSnapshot {
  const incoming = persisted ?? {};
  const stars = mergeStars(incoming.stars, current.stars);
  const stickers = mergeStickers(incoming.stickers, current.stickers, stars);
  return {
    started: !!(incoming.started || current.started),
    stars,
    stickers,
  };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      started: false,
      stars: {},
      stickers: {},
      start: () => set({ started: true }),
      setStars: (lessonId, next) =>
        set((s) => ({
          stars: {
            ...s.stars,
            [lessonId]: Math.max(s.stars[lessonId] ?? 0, next),
          },
        })),
      collectSticker: (lessonId) =>
        set((s) => ({
          stickers: { ...s.stickers, [lessonId]: true },
        })),
    }),
    {
      name: PROGRESS_KEY,
      // Skip on the server so localStorage is only touched in the browser.
      // ProgressHydrate calls rehydrate() after mount; awardLesson waits for it.
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        started: s.started,
        stars: s.stars,
        stickers: s.stickers,
      }),
      merge: (persisted, current) => {
        const snap = mergeProgress(
          (persisted as Partial<ProgressSnapshot> | undefined) ?? {},
          current,
        );
        return { ...current, ...snap };
      },
    },
  ),
);

export function awardLesson(lessonId: string, stars: number) {
  const apply = () => {
    useProgress.getState().setStars(lessonId, stars);
    useProgress.getState().collectSticker(lessonId);
  };
  if (useProgress.persist.hasHydrated()) {
    apply();
    return;
  }
  const unsub = useProgress.persist.onFinishHydration(() => {
    apply();
    unsub();
  });
}

export function hasHomeStamp(
  lessonId: string,
  stars: Record<string, number>,
  stickers: Record<string, boolean>,
) {
  return !!(stickers[lessonId] || (stars[lessonId] ?? 0) > 0);
}

export function starsFromMistakes(mistakes: number) {
  if (mistakes <= 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}
