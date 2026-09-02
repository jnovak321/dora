import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ParentSlot } from "@/components/icon-nav";
import { LessonStamp } from "@/components/lesson-stamp";
import { SpeakButton } from "@/components/speak-button";
import { Stars } from "@/components/stars";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/lib/lessons";
import { hasHomeStamp, useProgress } from "@/lib/progress";
import { playClip, stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/")({ component: Home });

const TILE_TINT = {
  clay: "bg-clay/12 ring-clay/35",
  sage: "bg-sage/12 ring-sage/35",
  honey: "bg-honey/16 ring-honey/40",
} as const;

function useHasHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const finish = () => setOk(true);
    const unsub = useProgress.persist.onFinishHydration(finish);
    if (useProgress.persist.hasHydrated()) finish();
    else void useProgress.persist.rehydrate();
    return unsub;
  }, []);
  return ok;
}

function Home() {
  const hydrated = useHasHydrated();
  const started = useProgress((s) => s.started);
  const start = useProgress((s) => s.start);
  const stars = useProgress((s) => s.stars);
  const stickers = useProgress((s) => s.stickers);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  if (!hydrated) {
    return <main className="min-h-dvh bg-paper" />;
  }

  if (!started) {
    return (
      <Welcome
        onStart={() => {
          start();
          void playClip("/audio/sl-pozdravljena.mp3");
        }}
      />
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

      <h1 className="sr-only">Dora</h1>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]">
        <img
          src="/images/welcome.jpg"
          alt="Dora"
          className="aspect-[16/9] w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-[50%_30%]"
        />
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {LESSONS.map((lesson) => {
          const stamped = hasHomeStamp(lesson.id, stars, stickers);
          return (
            <Link
              key={lesson.id}
              to="/lekcija/$id"
              params={{ id: lesson.id }}
              aria-label={lesson.title}
              onClick={() => stopSpeech()}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-[var(--radius-md)] p-1.5 shadow-[var(--shadow-card)] ring-2",
                "transition-[transform,box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]",
                TILE_TINT[lesson.tint],
              )}
            >
              <span className="sr-only">{lesson.title}</span>
              <img
                src={lesson.cover}
                alt=""
                className="aspect-square w-full rounded-[calc(var(--radius-md)-4px)] object-cover"
              />
              <Stars value={stars[lesson.id] ?? 0} size="sm" />
              {stamped ? (
                <LessonStamp
                  lesson={lesson}
                  size="sm"
                  className="absolute -right-1 -top-1 rotate-[-8deg]"
                />
              ) : null}
            </Link>
          );
        })}
      </section>
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex h-dvh max-h-dvh w-full max-w-xl flex-col bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
      <button
        type="button"
        aria-label="Začni"
        onClick={onStart}
        className="flex min-h-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]"
      >
        <img
          src="/images/welcome.jpg"
          alt="Dora"
          className="h-full w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-[50%_28%]"
        />
      </button>
      <div className="flex shrink-0 flex-col items-center gap-4 pt-5">
        <h1 className="text-3xl font-medium tracking-wide text-ink">Dora</h1>
        <Button
          type="button"
          variant="solid"
          size="tile"
          aria-label="Začni"
          onClick={onStart}
          className="animate-pop"
        >
          <ArrowRight className="size-9" strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
