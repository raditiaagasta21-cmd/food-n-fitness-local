import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./ui";
import { useCrossTabSync, useHydrated } from "@/lib/eattrack/store";

export function AppShell({
  title,
  subtitle,
  back,
  right,
  nav = true,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
  nav?: boolean;
  children: ReactNode;
}) {
  useCrossTabSync();
  const hydrated = useHydrated();

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title={title} subtitle={subtitle} back={back} right={right} />
      <main className="mx-auto max-w-lg px-4 py-4">
        {hydrated ? (
          children
        ) : (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-2xl bg-muted" />
            <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          </div>
        )}
      </main>
      {nav ? <BottomNav /> : null}
    </div>
  );
}
