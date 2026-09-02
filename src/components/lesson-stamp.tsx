import { cn } from "@/lib/cn";
import type { Lesson } from "@/lib/lessons";

const TINT = {
  clay: "bg-clay text-clay-fg",
  sage: "bg-sage text-sage-fg",
  honey: "bg-honey text-honey-fg",
} as const;

export function LessonStamp({
  lesson,
  size = "md",
  onPress,
  className,
}: {
  lesson: Lesson;
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  className?: string;
}) {
  const dim =
    size === "lg" ? "size-44" : size === "sm" ? "size-14" : "size-24";
  const Comp = onPress ? "button" : "div";
  return (
    <Comp
      type={onPress ? "button" : undefined}
      onClick={onPress}
      aria-label={onPress ? lesson.title : undefined}
      className={cn(
        "relative shrink-0 rounded-full p-1.5 shadow-[var(--shadow-card)]",
        TINT[lesson.tint],
        dim,
        onPress && "transition-transform duration-150 ease-out active:scale-[0.96]",
        className,
      )}
    >
      <span className="block size-full overflow-hidden rounded-full bg-paper ring-2 ring-sheet/80">
        <img
          src={lesson.cover}
          alt=""
          className="size-full object-cover"
          draggable={false}
        />
      </span>
    </Comp>
  );
}
