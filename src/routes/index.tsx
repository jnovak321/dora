import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ParentSlot } from "@/components/icon-nav";
import { SpeakButton } from "@/components/speak-button";
import { Stars } from "@/components/stars";
import { LESSONS } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { playClip, stopSpeech } from "@/lib/speech";

export const Route = createFileRoute("/")({ component: Home });

function useHasHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const finish = () => setOk(true);
    const unsub = useProgress.persist.onFinishHydration(finish);
    if (useProgress.persist.hasHydrated()) finish();
    return unsub;
  }, []);
  return ok;
}

function Home() {
  const hydrated = useHasHydrated();
  const started = useProgress((s) => s.started);
  const start = useProgress((s) => s.start);
  const stars = useProgress((s) => s.stars);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  if (!hydrated) {
    return <main className="min-h-dvh bg-paper" />;
  }

  if (!started) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-7 bg-paper px-5 py-10">
        <div className="w-full overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]">
          <img
            src="/images/welcome.jpg"
            alt=""
            className="aspect-[4/3] w-full rounded-[calc(var(--radius-lg)-6px)] object-cover"
          />
        </div>
        <p className="text-3xl font-medium tracking-wide text-ink">Dora</p>
        <SpeakButton
          large
          label="Začni"
          onPress={() => {
            start();
            void playClip("/audio/sl-pozdravljena.mp3");
          }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-paper px-4 pb-12 pt-4 sm:px-6">
      <header className="flex items-center justify-between">
        <span className="w-12" />
        <SpeakButton
          label="Poslušaj"
          onPress={() => void playClip("/audio/sl-izberi.mp3")}
        />
        <ParentSlot />
      </header>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]">
        <img
          src="/images/welcome.jpg"
          alt=""
          className="aspect-[16/9] w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-[50%_30%]"
        />
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {LESSONS.map((lesson) => (
          <Link
            key={lesson.id}
            to="/lekcija/$id"
            params={{ id: lesson.id }}
            aria-label={lesson.coverAlt}
            onClick={() => stopSpeech()}
            className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] bg-sheet p-1 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]"
          >
            <img
              src={lesson.cover}
              alt=""
              className="aspect-square w-full rounded-[calc(var(--radius-md)-4px)] object-cover"
            />
            <Stars value={stars[lesson.id] ?? 0} size="sm" />
          </Link>
        ))}
      </section>
    </main>
  );
}
