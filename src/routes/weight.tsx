import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { LineChartMini } from "@/components/eattrack/charts";
import { Button, Card, EmptyState, Field, SectionTitle } from "@/components/eattrack/ui";
import { setWeight, todayKey, update, useAppData } from "@/lib/eattrack/store";

export const Route = createFileRoute("/weight")({
  head: () => ({
    meta: [
      { title: "Weight — EatTrack" },
      {
        name: "description",
        content: "Log your weight by date and follow the trend towards your goal weight.",
      },
      { property: "og:title", content: "Weight — EatTrack" },
      { property: "og:description", content: "Starting, current and goal weight with a history chart." },
    ],
  }),
  component: WeightPage,
});

function WeightPage() {
  const data = useAppData();
  const [date, setDate] = useState(todayKey());
  const [kg, setKg] = useState("");

  const history = Object.keys(data.days)
    .filter((k) => data.days[k]?.weightKg != null)
    .sort()
    .map((k) => ({ date: k, kg: data.days[k].weightKg as number }));

  const current = history.length ? history[history.length - 1].kg : undefined;
  const start = history.length ? history[0].kg : data.goals.startWeightKg;
  const change = current != null ? Math.round((current - start) * 10) / 10 : 0;

  const save = () => {
    const n = Number(kg);
    if (!n) return;
    setWeight(date, Math.round(n * 10) / 10);
    setKg("");
  };

  return (
    <AppShell title="Weight" back="/">
      <div className="space-y-4">
        <Card className="grid grid-cols-4 gap-2 text-center">
          {[
            ["Start", `${start} kg`],
            ["Current", current != null ? `${current} kg` : "—"],
            ["Goal", `${data.goals.goalWeightKg} kg`],
            ["Change", `${change > 0 ? "+" : ""}${change} kg`],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-base font-extrabold tabular-nums">{v}</div>
              <div className="text-[11px] text-muted-foreground">{k}</div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Log weight</SectionTitle>
          <div className="space-y-3">
            <Field label="Date">
              <input
                className="et-field"
                type="date"
                value={date}
                max={todayKey()}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                className="et-field"
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="e.g. 68.4"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
              />
            </Field>
            <Button className="w-full" size="lg" onClick={save}>
              Save weight
            </Button>
          </div>
        </Card>

        <Card>
          <SectionTitle>History</SectionTitle>
          {history.length < 2 ? (
            <EmptyState title="Log at least two days" hint="Your weight trend appears here." />
          ) : (
            <LineChartMini
              unit=" kg"
              data={history.map((h) => ({ label: h.date.slice(5), value: h.kg }))}
            />
          )}
          <ul className="mt-3 space-y-1 text-sm">
            {[...history].reverse().slice(0, 12).map((h) => (
              <li key={h.date} className="flex justify-between border-b border-border py-1.5">
                <span className="text-muted-foreground">{h.date}</span>
                <span className="font-semibold tabular-nums">{h.kg} kg</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Goal weight</SectionTitle>
          <Field label="Goal weight (kg)">
            <input
              className="et-field"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={data.goals.goalWeightKg}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  goals: { ...d.goals, goalWeightKg: Number(e.target.value) || 0 },
                }))
              }
            />
          </Field>
        </Card>
      </div>
    </AppShell>
  );
}
