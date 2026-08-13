import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { subscribeSpeech } from "@/lib/speech";

export function SpeakButton({
  onPress,
  label,
  large = false,
}: {
  onPress: () => void;
  label: string;
  large?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => subscribeSpeech(setPlaying), []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className={cn(
        "grid place-items-center rounded-full bg-sage text-sage-fg shadow-[var(--shadow-card)]",
        "transition-[transform,background-color] duration-150 ease-out",
        "hover:bg-ink active:scale-[0.96]",
        large ? "size-24" : "size-16",
        playing && "animate-pulse",
      )}
    >
      <Volume2
        className={large ? "size-11" : "size-8"}
        strokeWidth={2.2}
        aria-hidden
      />
    </button>
  );
}
