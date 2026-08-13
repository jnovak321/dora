import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stars({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "size-9" : size === "sm" ? "size-4" : "size-5";
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          className={cn(
            dim,
            n <= value
              ? "fill-sage text-sage"
              : "fill-transparent text-ink-soft/45",
          )}
          strokeWidth={1.8}
        />
      ))}
    </span>
  );
}
