import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { BarChartMini, LineChartMini, round, type Point } from "@/components/eattrack/charts";
import { Button, Card, SectionTitle } from "@/components/eattrack/ui";
import {
  dayTotals,
  exerciseMinutes,
  getDay,
  shiftDate,
  todayKey,
  useAppData,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — EatTrack" },
      {
        name: "description",
        content: "Charts for calories, water, weight, sleep and exercise over the last weeks.",
      },
      { property: "og:title", content: "Progress — EatTrack" },
      {
        property: "og:description",
        content: "See your trends for calories, weight, water, sleep and movement.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const data = useAppData();
  const [range, setRange] = useState(7);
  const today = todayKey();
  const keys = Array.from({ length: range }, (_, i) => shiftDate(today, i - (range - 1)));
  const label = (k: string) => k.slice(5).replace("-", "/");

  const days = keys.map((k) => getDay(data, k));
  const kcal: Point[] = keys.map((k, i) => ({ label: label(k), value: dayTotals(days[i]).kcal }));
  const water: Point[] = keys.map((k, i) => ({ label: label(k), value: days[i].waterMl }));
  const move: Point[] = keys.map((k, i) => ({ label: label(k), value: exerciseMinutes(days[i]) }));
  const sleep: Point[] = keys.map((k, i) => ({ label: label(k), value: days[i].sleep?.hours ?? 0 }));
  const weight: Point[] = keys.map((k, i) => ({
    label: label(k),
    value: days[i].weightKg ?? null,
  }));

  const logged = kcal.filter((p) => (p.value ?? 0) > 0);
  const avgKcal = logged.length
    ? logged.reduce((a, p) => a + (p.value ?? 0), 0) / logged.length
    : 0;

  return (
    <AppShell title="Progress" subtitle={`Last ${range} days`}>
      <div className="space-y-4">
        <div className="flex gap-2">
          {[7, 14, 30].map((r) => (
            <Button
              key={r}
              size="sm"
              variant={r === range ? "primary" : "outline"}
              className="flex-1"
              onClick={() => setRange(r)}
            >
              {r} days
            </Button>
          ))}
        </div>

        <Card className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Avg kcal" value={Math.round(avgKcal)} />
          <Stat
            label="Avg water"
            value={Math.round(water.reduce((a, p) => a + (p.value ?? 0), 0) / range)}
          />
          <Stat
            label="Move min"
            value={Math.round(move.reduce((a, p) => a + (p.value ?? 0), 0))}
          />
        </Card>

        <Card>
          <SectionTitle>Calories</SectionTitle>
          <BarChartMini data={kcal} goal={data.goals.calories} />
        </Card>

        <Card>
          <SectionTitle>Weight (kg)</SectionTitle>
          <LineChartMini data={weight} unit=" kg" />
          <p className="mt-2 text-xs text-muted-foreground">
            Goal {data.goals.goalWeightKg} kg · start {data.goals.startWeightKg} kg
          </p>
        </Card>

        <Card>
          <SectionTitle>Water (ml)</SectionTitle>
          <BarChartMini data={water} goal={data.goals.waterMl} tone="water" />
        </Card>

        <Card>
          <SectionTitle>Sleep (hours)</SectionTitle>
          <BarChartMini data={sleep} goal={data.goals.sleepHours} tone="sleep" />
        </Card>

        <Card>
          <SectionTitle>Exercise (minutes)</SectionTitle>
          <BarChartMini data={move} goal={data.goals.exerciseMin} tone="move" />
        </Card>

        <Card>
          <SectionTitle>Daily log</SectionTitle>
          <ul className="divide-y divide-border text-sm">
            {[...keys].reverse().map((k) => {
              const d = getDay(data, k);
              const t = dayTotals(d);
              return (
                <li key={k} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-medium">{label(k)}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {Math.round(t.kcal)} kcal · {d.waterMl} ml · {exerciseMinutes(d)} min
                    {d.weightKg ? ` · ${round(d.weightKg)} kg` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link to="/history" className="mt-3 block text-xs font-semibold text-primary">
            Open full history
          </Link>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-lg font-extrabold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
