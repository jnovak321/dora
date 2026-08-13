type Listener = (playing: boolean) => void;

let current: HTMLAudioElement | null = null;
const listeners = new Set<Listener>();

function emit(playing: boolean) {
  for (const fn of listeners) fn(playing);
}

export function subscribeSpeech(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function stopSpeech() {
  if (!current) return;
  current.pause();
  current.src = "";
  current = null;
  emit(false);
}

export function playClip(src: string): Promise<void> {
  stopSpeech();
  const audio = new Audio(src);
  audio.preload = "auto";
  current = audio;
  emit(true);
  return new Promise((resolve) => {
    const done = () => {
      if (current === audio) {
        current = null;
        emit(false);
      }
      resolve();
    };
    audio.addEventListener("ended", done, { once: true });
    audio.addEventListener("error", done, { once: true });
    void audio.play().catch(done);
  });
}

export async function playQueue(srcs: string[]) {
  for (const src of srcs) {
    await playClip(src);
  }
}

export function isSpeaking() {
  return current !== null && !current.paused;
}
