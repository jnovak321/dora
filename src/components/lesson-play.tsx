import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home } from "lucide-react";
import { HomeLink } from "@/components/icon-nav";
import { PictureCard } from "@/components/picture-card";
import { SpeakButton } from "@/components/speak-button";
import { Stars } from "@/components/stars";
import {
  getLesson,
  PICTURES,
  type Lesson,
  type QuizStep,
} from "@/lib/lessons";
import { starsFromMistakes, useProgress } from "@/lib/progress";
import { playClip, playQueue, stopSpeech } from "@/lib/speech";

type Phase =
  | { kind: "teach"; index: number }
  | { kind: "quiz"; index: number }
  | { kind: "done"; stars: number };

export function LessonPlay({ id }: { id: string }) {
  const lesson = getLesson(id);
  if (!lesson) return <Missing />;
  return <Player lesson={lesson} />;
}

function Missing() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper p-6">
      <HomeLink />
    </main>
  );
}

function Player({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate();
  const setStars = useProgress((s) => s.setStars);
  const [phase, setPhase] = useState<Phase>({ kind: "teach", index: 0 });
  const [choice, setChoice] = useState<string | null>(null);
  const [choiceState, setChoiceState] = useState<"idle" | "ok" | "miss">(
    "idle",
  );
  const mistakes = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    locked.current = false;
    setChoice(null);
    setChoiceState("idle");

    if (phase.kind === "teach") {
      const step = lesson.teach[phase.index];
      void playQueue(["/audio/sl-poslusaj.mp3", step.pairAudio, step.enAudio]);
      return;
    }
    if (phase.kind === "quiz") {
      const step = lesson.quiz[phase.index];
      const intro =
        phase.index === 0 ? ["/audio/sl-pritisni.mp3", step.promptAudio] : [step.promptAudio];
      void playQueue(intro);
      return;
    }
    void playQueue(["/audio/chime-ok.mp3", "/audio/sl-konec.mp3"]);
  }, [lesson, phase]);

  const replay = () => {
    if (phase.kind === "teach") {
      const step = lesson.teach[phase.index];
      void playQueue([step.pairAudio, step.enAudio]);
      return;
    }
    if (phase.kind === "quiz") {
      void playClip(lesson.quiz[phase.index].promptAudio);
      return;
    }
    void playClip("/audio/sl-konec.mp3");
  };

  const goNextTeach = () => {
    if (phase.kind !== "teach") return;
    if (phase.index + 1 < lesson.teach.length) {
      setPhase({ kind: "teach", index: phase.index + 1 });
      return;
    }
    setPhase({ kind: "quiz", index: 0 });
  };

  const pick = async (optionId: string, step: QuizStep) => {
    if (phase.kind !== "quiz" || locked.current) return;
    locked.current = true;
    setChoice(optionId);
    const ok = optionId === step.correctId;
    if (ok) {
      setChoiceState("ok");
      await playQueue(["/audio/chime-ok.mp3", "/audio/sl-tako-je.mp3"]);
      if (phase.index + 1 < lesson.quiz.length) {
        setPhase({ kind: "quiz", index: phase.index + 1 });
      } else {
        const earned = starsFromMistakes(mistakes.current);
        setStars(lesson.id, earned);
        setPhase({ kind: "done", stars: earned });
      }
    } else {
      mistakes.current += 1;
      setChoiceState("miss");
      await playQueue(["/audio/chime-no.mp3", "/audio/sl-poskusi.mp3"]);
      setChoice(null);
      setChoiceState("idle");
      locked.current = false;
      void playClip(step.promptAudio);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col bg-paper px-4 pb-10 pt-4 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <HomeLink />
        <SpeakButton onPress={replay} label="Poslušaj" />
        <span className="w-14" />
      </header>

      {phase.kind === "teach" ? (
        <TeachView
          lesson={lesson}
          index={phase.index}
          onNext={goNextTeach}
        />
      ) : null}

      {phase.kind === "quiz" ? (
        <QuizView
          lesson={lesson}
          step={lesson.quiz[phase.index]}
          choice={choice}
          choiceState={choiceState}
          onPick={pick}
        />
      ) : null}

      {phase.kind === "done" ? (
        <DoneView
          stars={phase.stars}
          onHome={() => {
            stopSpeech();
            void navigate({ to: "/" });
          }}
        />
      ) : null}
    </main>
  );
}

function TeachView({
  lesson,
  index,
  onNext,
}: {
  lesson: Lesson;
  index: number;
  onNext: () => void;
}) {
  const step = lesson.teach[index];
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 pt-6">
      <PictureCard
        src={step.picture.src}
        alt={step.picture.alt}
        className="w-full max-w-md"
      />
      <p className="max-w-full text-balance text-center font-medium tracking-[0.08em] text-ink text-4xl sm:text-5xl">
        {step.word}
      </p>
      <button
        type="button"
        aria-label="Naprej"
        onClick={onNext}
        className="grid size-20 place-items-center rounded-full bg-sage text-sage-fg shadow-[var(--shadow-card)] transition-transform duration-150 ease-out active:scale-[0.96]"
      >
        <ArrowRight className="size-9" strokeWidth={2.2} />
      </button>
      <Dots total={lesson.teach.length} index={index} />
    </section>
  );
}

function QuizView({
  lesson,
  step,
  choice,
  choiceState,
  onPick,
}: {
  lesson: Lesson;
  step: QuizStep;
  choice: string | null;
  choiceState: "idle" | "ok" | "miss";
  onPick: (id: string, step: QuizStep) => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pt-6">
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-5">
        {step.optionIds.map((id) => {
          const pic = PICTURES[id];
          if (!pic) return null;
          const state =
            choice === id ? choiceState : ("idle" as const);
          return (
            <PictureCard
              key={id}
              src={pic.src}
              alt={pic.alt}
              state={state}
              onClick={() => onPick(id, step)}
            />
          );
        })}
      </div>
      <Dots
        total={lesson.quiz.length}
        index={lesson.quiz.indexOf(step)}
      />
    </section>
  );
}

function DoneView({ stars, onHome }: { stars: number; onHome: () => void }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 pt-4">
      <PictureCard
        src="/images/dora-happy.jpg"
        alt=""
        className="w-full max-w-sm"
      />
      <Stars value={stars} size="lg" />
      <button
        type="button"
        aria-label="Domov"
        onClick={onHome}
        className="grid size-20 place-items-center rounded-full bg-sage text-sage-fg shadow-[var(--shadow-card)] transition-transform duration-150 ease-out active:scale-[0.96]"
      >
        <Home className="size-9" strokeWidth={2.2} />
      </button>
    </section>
  );
}

function Dots({ total, index }: { total: number; index: number }) {
  return (
    <div className="flex gap-2" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i === index
              ? "size-2.5 rounded-full bg-sage"
              : "size-2.5 rounded-full bg-paper-deep"
          }
        />
      ))}
    </div>
  );
}
