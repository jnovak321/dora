import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home } from "lucide-react";
import { HomeLink } from "@/components/icon-nav";
import { LessonStamp } from "@/components/lesson-stamp";
import { PictureCard } from "@/components/picture-card";
import { SpeakButton } from "@/components/speak-button";
import { Stars } from "@/components/stars";
import { Button } from "@/components/ui/button";
import {
  getLesson,
  PICTURES,
  type Lesson,
  type QuizStep,
} from "@/lib/lessons";
import { awardLesson, starsFromMistakes } from "@/lib/progress";
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

function Word({ text }: { text: string }) {
  const long = text.length > 14;
  return (
    <span
      className={
        long
          ? "font-medium tracking-[0.04em] text-ink text-2xl sm:text-4xl"
          : "font-medium tracking-[0.08em] text-ink text-4xl sm:text-5xl"
      }
    >
      {text}
    </span>
  );
}

function Player({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>({ kind: "teach", index: 0 });
  const [choice, setChoice] = useState<string | null>(null);
  const [choiceState, setChoiceState] = useState<"idle" | "ok" | "miss">(
    "idle",
  );
  const mistakes = useRef(0);
  const locked = useRef(false);
  const missTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (missTimer.current !== null) window.clearTimeout(missTimer.current);
    };
  }, []);

  useEffect(() => {
    locked.current = false;
    setChoice(null);
    setChoiceState("idle");
    if (missTimer.current !== null) {
      window.clearTimeout(missTimer.current);
      missTimer.current = null;
    }

    if (phase.kind === "teach") {
      const step = lesson.teach[phase.index];
      void playQueue(["/audio/sl-poslusaj.mp3", step.pairAudio, step.enAudio]);
      return;
    }
    if (phase.kind === "quiz") {
      const step = lesson.quiz[phase.index];
      const intro =
        phase.index === 0
          ? ["/audio/sl-pritisni.mp3", step.promptAudio]
          : [step.promptAudio];
      void playQueue(intro);
      return;
    }
    void playQueue([
      "/audio/chime-stamp.mp3",
      "/audio/sl-bravo.mp3",
      "/audio/sl-konec.mp3",
    ]);
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
    void playQueue(["/audio/chime-stamp.mp3", "/audio/sl-bravo.mp3"]);
  };

  const goNextTeach = () => {
    if (phase.kind !== "teach") return;
    if (phase.index + 1 < lesson.teach.length) {
      setPhase({ kind: "teach", index: phase.index + 1 });
      return;
    }
    setPhase({ kind: "quiz", index: 0 });
  };

  const pick = (optionId: string, step: QuizStep) => {
    if (phase.kind !== "quiz" || locked.current) return;
    setChoice(optionId);
    const ok = optionId === step.correctId;
    if (ok) {
      locked.current = true;
      setChoiceState("ok");
      void playQueue(["/audio/chime-ok.mp3", "/audio/sl-tako-je.mp3"]);
      return;
    }
    locked.current = true;
    setChoiceState("miss");
    mistakes.current += 1;
    void playQueue(["/audio/chime-no.mp3", "/audio/sl-poskusi.mp3"]);
    missTimer.current = window.setTimeout(() => {
      setChoice(null);
      setChoiceState("idle");
      locked.current = false;
      missTimer.current = null;
    }, 700);
  };

  const goNextQuiz = () => {
    if (phase.kind !== "quiz" || choiceState !== "ok") return;
    if (phase.index + 1 < lesson.quiz.length) {
      setPhase({ kind: "quiz", index: phase.index + 1 });
      return;
    }
    const earned = starsFromMistakes(mistakes.current);
    awardLesson(lesson.id, earned);
    setPhase({ kind: "done", stars: earned });
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
          index={phase.index}
          choice={choice}
          choiceState={choiceState}
          onPick={pick}
          onNext={goNextQuiz}
          onReplay={() => void playClip(lesson.quiz[phase.index].promptAudio)}
        />
      ) : null}

      {phase.kind === "done" ? (
        <DoneView
          lesson={lesson}
          stars={phase.stars}
          onHome={() => {
            stopSpeech();
            void navigate({ to: "/" });
          }}
          onStamp={() =>
            void playQueue(["/audio/chime-stamp.mp3", "/audio/sl-bravo.mp3"])
          }
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
        className="w-full max-w-md animate-enter"
      />
      <h1 className="max-w-full text-balance text-center">
        <Word text={step.word} />
      </h1>
      <Button
        type="button"
        variant="solid"
        size="tile"
        aria-label="Naprej"
        onClick={onNext}
        className="animate-pop"
      >
        <ArrowRight className="size-9" strokeWidth={2.2} />
      </Button>
      <Dots total={lesson.teach.length} index={index} />
    </section>
  );
}

function QuizView({
  lesson,
  step,
  index,
  choice,
  choiceState,
  onPick,
  onNext,
  onReplay,
}: {
  lesson: Lesson;
  step: QuizStep;
  index: number;
  choice: string | null;
  choiceState: "idle" | "ok" | "miss";
  onPick: (id: string, step: QuizStep) => void;
  onNext: () => void;
  onReplay: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pt-6">
      <h1 className="max-w-full text-balance text-center">
        <button type="button" onClick={onReplay}>
          <Word text={step.promptWord} />
        </button>
      </h1>
      <div className="sr-only" aria-live="polite">
        {choiceState === "ok"
          ? "Tako je"
          : choiceState === "miss"
            ? "Poskusi znova"
            : ""}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-5">
        {step.optionIds.map((id) => {
          const pic = PICTURES[id];
          if (!pic) return null;
          const state = choice === id ? choiceState : ("idle" as const);
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
      <div className="grid size-20 place-items-center">
        {choiceState === "ok" ? (
          <Button
            type="button"
            variant="solid"
            size="tile"
            aria-label="Naprej"
            onClick={onNext}
            className="animate-pop"
          >
            <ArrowRight className="size-9" strokeWidth={2.2} />
          </Button>
        ) : null}
      </div>
      <Dots total={lesson.quiz.length} index={index} />
    </section>
  );
}

function DoneView({
  lesson,
  stars,
  onHome,
  onStamp,
}: {
  lesson: Lesson;
  stars: number;
  onHome: () => void;
  onStamp: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pt-4">
      <h1 className="sr-only">Bravo</h1>
      <PictureCard
        src="/images/dora-i-smile.jpg"
        alt="Dora"
        className="w-full max-w-xs animate-enter"
      />
      <LessonStamp
        lesson={lesson}
        size="lg"
        onPress={onStamp}
        className="animate-stamp"
      />
      <Stars value={stars} size="lg" />
      <Button
        type="button"
        variant="solid"
        size="tile"
        aria-label="Domov"
        onClick={onHome}
        className="animate-pop"
      >
        <Home className="size-9" strokeWidth={2.2} />
      </Button>
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
