import { Home, LogOut, UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser, useCurrentUserState } from "@/lib/auth/use-current-user";
import { stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/cn";

export function HomeLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Domov"
      onClick={() => stopSpeech()}
      className={cn(
        "grid size-14 place-items-center rounded-full bg-sheet text-ink shadow-[var(--shadow-card)]",
        "transition-transform duration-150 ease-out active:scale-[0.96]",
        className,
      )}
    >
      <Home className="size-6" strokeWidth={2} />
    </Link>
  );
}

export function ParentSlot() {
  const { isPending } = useCurrentUserState();
  const user = useCurrentUser();
  if (isPending) {
    return (
      <div className="size-12 animate-pulse rounded-full bg-paper-deep" />
    );
  }
  return (
    <>
      <SignedOut>
        <Link
          to="/login"
          aria-label="Starši"
          className="grid size-12 place-items-center rounded-full text-ink-soft hover:bg-paper-deep"
        >
          <UserRound className="size-5" strokeWidth={2} />
        </Link>
      </SignedOut>
      <SignedIn>
        <button
          type="button"
          aria-label="Odjava"
          onClick={() => void signOut()}
          className="grid size-12 place-items-center rounded-full text-ink-soft hover:bg-paper-deep"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <LogOut className="size-5" strokeWidth={2} />
          )}
        </button>
      </SignedIn>
    </>
  );
}
