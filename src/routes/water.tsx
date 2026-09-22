import { createFileRoute } from "@tanstack/react-router";
import { Droplets, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, Field, ProgressBar, SectionTitle } from "@/components/eattrack/ui";
import {
  addWater,
  formatDateLabel,
  setWater,
  todayKey,
  update,
  useAppData,
  useDay,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/water")({
  head: () => ({
    meta: [
      { title: "Water — EatTrack" },
      { name: "description", content: "Track daily water intake against your own hydration goal." },
      { property: "og:title", content: "Water — EatTrack" },
      { property: "og:description", content: "Quick +250, +500 and +750 ml water logging." },
    ],
  }),
  component: WaterPage,
});

function WaterPage() {
  const data = useAppData();
  const date = todayKey();
  const { day } = useDay(date);
  const goal = data.goals.waterMl;
  const glasses = Math.round(day.waterMl / 250);

  return (
    <AppShell title="Water" subtitle={formatDateLabel(date)} back="/">
      <div className="space-y-4">
        <Card className="text-center">
          <Droplets className="mx-auto h-8 w-8 text-water" />
          <div className="mt-2 text-4xl font-extrabold tabular-nums">{day.waterMl} ml</div>
          <p className="text-sm text-muted-foreground">
            of {goal} ml · about {glasses} glass{glasses === 1 ? "" : "es"}
          </p>
          <ProgressBar value={day.waterMl} max={goal} tone="water" className="mt-3" />
        </Card>

        <div className="grid grid-cols-3 gap-2">
          {[250, 500, 750].map((ml) => (
            <Button key={ml} size="lg" onClick={() => addWater(date, ml)}>
              +{ml} ml
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => addWater(date, -250)}>
            −250 ml
          </Button>
          <Button variant="outline" onClick={() => setWater(date, 0)}>
            <RotateCcw className="h-4 w-4" /> Reset day
          </Button>
        </div>

        <Card>
          <SectionTitle>Daily goal</SectionTitle>
          <Field label="Water target (ml)">
            <input
              className="et-field"
              type="number"
              inputMode="numeric"
              value={goal}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  goals: { ...d.goals, waterMl: Math.max(0, Number(e.target.value) || 0) },
                }))
              }
            />
          </Field>
        </Card>
      </div>
    </AppShell>
  );
}
