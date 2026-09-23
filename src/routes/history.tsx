import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Card, EmptyState, SectionTitle } from "@/components/eattrack/ui";
import {
  dayTotals,
  exerciseMinutes,
  formatDateLabel,
  getDay,
  useAppData,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — EatTrack" },
      {
        name: "description",
        content: "Browse every day you have logged in EatTrack, stored offline on your device.",
      },
      { property: "og:title", content: "History — EatTrack" },
      { property: "og:description", content: "Every logged day, with meals, water and habits." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const data = useAppData();
  const [open, setOpen] = useState<string | null>(null);
  const keys = Object.keys(data.days)
    .filter((k) => {
      const d = data.days[k];
      return (
        d &&
        (d.foods?.length ||
          d.waterMl ||
          d.exercise?.length ||
          d.habits?.length ||
          d.sleep ||
          d.weightKg ||
          d.notes)
      );
    })
    .sort()
    .reverse();

  return (
    <AppShell title="History" subtitle={`${keys.length} logged days`} back="/more">
      {keys.length === 0 ? (
        <EmptyState title="No history yet" hint="Start logging and your days will appear here." />
      ) : (
        <ul className="space-y-3">
          {keys.map((k) => {
            const day = getDay(data, k);
            const t = dayTotals(day);
            const expanded = open === k;
            return (
              <li key={k}>
                <Card>
                  <button
                    className="flex w-full items-center justify-between gap-3 text-left"
                    onClick={() => setOpen(expanded ? null : k)}
                  >
                    <span>
                      <span className="block font-bold">{formatDateLabel(k)}</span>
                      <span className="block text-xs text-muted-foreground">{k}</span>
                    </span>
                    <span className="text-right text-xs text-muted-foreground tabular-nums">
                      {Math.round(t.kcal)} kcal
                      <br />
                      {day.waterMl} ml · {exerciseMinutes(day)} min
                    </span>
                  </button>

                  {expanded ? (
                    <div className="mt-3 space-y-3 border-t border-border pt-3 text-sm">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {[
                          ["kcal", Math.round(t.kcal)],
                          ["P", Math.round(t.protein)],
                          ["C", Math.round(t.carbs)],
                          ["F", Math.round(t.fat)],
                        ].map(([a, b]) => (
                          <div key={a as string} className="rounded-xl bg-muted p-2">
                            <div className="font-bold tabular-nums">{b as number}</div>
                            <div className="text-muted-foreground">{a as string}</div>
                          </div>
                        ))}
                      </div>

                      {day.foods.length ? (
                        <div>
                          <SectionTitle>Meals</SectionTitle>
                          <ul className="space-y-1 text-xs">
                            {day.foods.map((f) => (
                              <li key={f.id} className="flex justify-between gap-3">
                                <span className="min-w-0 truncate">
                                  {f.name} {f.qty !== 1 ? `×${f.qty}` : ""}
                                </span>
                                <span className="shrink-0 tabular-nums text-muted-foreground">
                                  {Math.round(f.kcal * f.qty)} kcal
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {day.exercise.length ? (
                        <div>
                          <SectionTitle>Exercise</SectionTitle>
                          <ul className="space-y-1 text-xs">
                            {day.exercise.map((e) => (
                              <li key={e.id} className="flex justify-between gap-3">
                                <span className="truncate">{e.activity}</span>
                                <span className="text-muted-foreground">{e.minutes} min</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <p className="text-xs text-muted-foreground">
                        {day.sleep ? `Sleep ${day.sleep.hours} h · quality ${day.sleep.quality}/5` : "No sleep logged"}
                        {day.weightKg ? ` · Weight ${day.weightKg} kg` : ""}
                        {` · Habits ${day.habits.length}`}
                      </p>

                      {day.notes ? <p className="text-xs italic">“{day.notes}”</p> : null}
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
