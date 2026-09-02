import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function PictureCard({
  src,
  alt,
  selected = false,
  state = "idle",
  onClick,
  className,
}: {
  src: string;
  alt: string;
  selected?: boolean;
  state?: "idle" | "ok" | "miss";
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? alt : undefined}
      className={cn(
        "relative block overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]",
        "transition-[transform,box-shadow] duration-150 ease-out",
        onClick && "hover:shadow-[var(--shadow-card-hover)] active:scale-[0.96]",
        state === "ok" && "ring-4 ring-ok animate-pop",
        state === "miss" && "ring-4 ring-miss animate-[shake_0.35s_ease-out]",
        selected && state === "idle" && "ring-4 ring-sage",
        className,
      )}
    >
      <img
        src={src}
        alt={onClick ? "" : alt}
        draggable={false}
        className="aspect-square w-full rounded-[calc(var(--radius-lg)-6px)] object-cover"
      />
      {state === "ok" ? (
        <span
          className="absolute right-3 top-3 grid size-12 place-items-center rounded-full bg-ok text-sage-fg shadow-[var(--shadow-card)] animate-pop"
          aria-hidden
        >
          <Check className="size-7" strokeWidth={3} />
        </span>
      ) : null}
      {state === "miss" ? (
        <span
          className="absolute right-3 top-3 grid size-12 place-items-center rounded-full bg-miss text-clay-fg shadow-[var(--shadow-card)]"
          aria-hidden
        >
          <X className="size-7" strokeWidth={3} />
        </span>
      ) : null}
    </Comp>
  );
}
