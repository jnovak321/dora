import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { HomeLink } from "@/components/icon-nav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 bg-paper px-6 py-10">
      <HomeLink />
      <div className="w-40 overflow-hidden rounded-[var(--radius-lg)] bg-sheet p-1.5 shadow-[var(--shadow-card)]">
        <img
          src="/images/dora.jpg"
          alt=""
          className="aspect-square w-full rounded-[calc(var(--radius-lg)-6px)] object-cover object-top"
        />
      </div>
      <p className="text-xl font-medium tracking-wide text-ink">Starši</p>
      <div className="flex w-full flex-col gap-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="sheet"
              size="lg"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
            >
              {p.label}
            </Button>
          ))
        ) : (
          <p className="text-center text-ink-soft">—</p>
        )}
      </div>
      <Link
        to="/"
        className="text-base text-ink-soft underline-offset-4 hover:underline"
      >
        ←
      </Link>
    </main>
  );
}
