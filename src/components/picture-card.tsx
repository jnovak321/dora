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
      aria-label={alt}
      className={cn(
        "block overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]",
        "transition-[transform,box-shadow] duration-150 ease-out",
        onClick && "hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]",
        state === "ok" && "ring-4 ring-ok",
        state === "miss" && "ring-4 ring-miss animate-[shake_0.35s_ease-out]",
        selected && state === "idle" && "ring-4 ring-sage",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="aspect-square w-full rounded-[calc(var(--radius-lg)-6px)] object-cover"
      />
    </Comp>
  );
}
