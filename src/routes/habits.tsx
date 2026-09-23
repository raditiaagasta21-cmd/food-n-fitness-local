import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, EmptyState, ProgressBar, SectionTitle } from "@/components/eattrack/ui";
import {
  getDay,
  shiftDate,
  todayKey,
  toggleHabit,
  uid,
  update,
  useAppData,
  useDay,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — EatTrack" },
      {
        name: "description",
        content: "Build healthy daily habits and keep your streaks going, fully offline.",
      },
      { property: "og:title", content: "Habits — EatTrack" },
      {
        property: "og:description",
        content: "Daily habit checklist with 7-day streaks stored on your device.",
      },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const data = useAppData();
  const date = todayKey();
  const { day } = useDay(date);
  const [name, setName] = useState("");

  const habits = data.habits.filter((h) => !h.archived);
  const done = habits.filter((h) => day.habits.includes(h.id)).length;

  const last7 = Array.from({ length: 7 }, (_, i) => shiftDate(date, i - 6));

  const addHabit = () => {
    const n = name.trim();
    if (!n) return;
    update((d) => ({ ...d, habits: [...d.habits, { id: uid(), name: n }] }));
    setName("");
  };

  const removeHabit = (id: string) => {
    update((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  };

  return (
    <AppShell title="Habits" subtitle={`${done} of ${habits.length} done today`}>
      <div className="space-y-4">
        <Card>
          <SectionTitle>Today</SectionTitle>
          <ProgressBar value={done} max={Math.max(1, habits.length)} className="mb-3" />
          {habits.length === 0 ? (
            <EmptyState title="No habits yet" hint="Add your first habit below." />
          ) : (
            <ul className="space-y-1">
              {habits.map((h) => {
                const isDone = day.habits.includes(h.id);
                return (
                  <li key={h.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHabit(date, h.id)}
                      className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-1 text-left"
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                          isDone ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        ) : null}
                      </span>
                      <span
                        className={`min-w-0 truncate text-sm font-medium ${
                          isDone ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {h.name}
                      </span>
                    </button>
                    <button
                      onClick={() => removeHabit(h.id)}
                      aria-label="Delete habit"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <SectionTitle>Add habit</SectionTitle>
          <div className="flex gap-2">
            <input
              className="et-field"
              placeholder="e.g. Walk 10 minutes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />
            <Button onClick={addHabit} aria-label="Add habit">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Last 7 days</SectionTitle>
          {habits.length === 0 ? (
            <EmptyState title="Nothing to show yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="py-1 text-left font-semibold">Habit</th>
                    {last7.map((k) => (
                      <th key={k} className="py-1 font-semibold">
                        {k.slice(8)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((h) => (
                    <tr key={h.id}>
                      <td className="max-w-28 truncate py-1.5 pr-2 font-medium">{h.name}</td>
                      {last7.map((k) => {
                        const hit = getDay(data, k).habits.includes(h.id);
                        return (
                          <td key={k} className="py-1.5 text-center">
                            <span
                              className={`inline-block h-4 w-4 rounded ${
                                hit ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
