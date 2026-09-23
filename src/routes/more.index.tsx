import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  History,
  Info,
  Settings,
  Target,
  User,
  Utensils,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Card } from "@/components/eattrack/ui";
import { useAppData } from "@/lib/eattrack/store";

export const Route = createFileRoute("/more/")({
  head: () => ({
    meta: [
      { title: "More — EatTrack" },
      {
        name: "description",
        content: "Profile, goals, saved meals, food database, history and settings for EatTrack.",
      },
      { property: "og:title", content: "More — EatTrack" },
      { property: "og:description", content: "Manage your EatTrack profile, goals and data." },
    ],
  }),
  component: MorePage,
});

const rows: { to: string; label: string; hint: string; icon: ReactNode }[] = [
  { to: "/more/profile", label: "Profile", hint: "Name, height, age", icon: <User className="h-5 w-5" /> },
  { to: "/more/goals", label: "Goals", hint: "Calories, macros, water, sleep", icon: <Target className="h-5 w-5" /> },
  { to: "/more/meals", label: "Saved Meals", hint: "Reusable meal combos", icon: <Utensils className="h-5 w-5" /> },
  { to: "/more/foods", label: "Food Database", hint: "Custom foods & favorites", icon: <BookOpen className="h-5 w-5" /> },
  { to: "/history", label: "History", hint: "All logged days", icon: <History className="h-5 w-5" /> },
  { to: "/more/settings", label: "Settings & Data", hint: "Export, import, reset", icon: <Settings className="h-5 w-5" /> },
  { to: "/more/about", label: "About", hint: "Version and privacy", icon: <Info className="h-5 w-5" /> },
];

function MorePage() {
  const data = useAppData();
  const name = data.profile.name?.trim();

  return (
    <AppShell title="More" subtitle={name ? `Hi, ${name}` : "Settings and data"}>
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.to}>
              <Link
                to={r.to as never}
                className="flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-muted"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-secondary-foreground">
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{r.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.hint}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        All data stays on this device.
      </p>
    </AppShell>
  );
}
