import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, Field, SectionTitle } from "@/components/eattrack/ui";
import { update, useAppData } from "@/lib/eattrack/store";
import type { Goals } from "@/lib/eattrack/types";

export const Route = createFileRoute("/more/goals")({
  head: () => ({
    meta: [
      { title: "Goals — EatTrack" },
      {
        name: "description",
        content: "Set daily calorie, macro, water, sleep, exercise and weight targets.",
      },
      { property: "og:title", content: "Goals — EatTrack" },
      { property: "og:description", content: "Your personal daily targets, saved on your device." },
    ],
  }),
  component: GoalsPage,
});

const fields: { key: keyof Goals; label: string; hint?: string }[] = [
  { key: "calories", label: "Daily calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fat", label: "Fat (g)" },
  { key: "waterMl", label: "Water (ml)" },
  { key: "sleepHours", label: "Sleep (hours)" },
  { key: "exerciseMin", label: "Exercise (minutes)" },
  { key: "startWeightKg", label: "Start weight (kg)" },
  { key: "goalWeightKg", label: "Goal weight (kg)" },
];

function GoalsPage() {
  const data = useAppData();
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(data.goals).map(([k, v]) => [k, String(v)])),
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    update((d) => {
      const next = { ...d.goals };
      for (const f of fields) {
        const n = Number(form[f.key]);
        if (Number.isFinite(n) && n >= 0) (next[f.key] as number) = n;
      }
      return { ...d, goals: next };
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const macroKcal =
    (Number(form.protein) || 0) * 4 + (Number(form.carbs) || 0) * 4 + (Number(form.fat) || 0) * 9;

  return (
    <AppShell title="Goals" back="/more" nav={false}>
      <div className="space-y-4">
        <Card className="space-y-3">
          {fields.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <input
                className="et-field"
                inputMode="decimal"
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </Field>
          ))}
          <p className="text-xs text-muted-foreground">
            Your macros add up to {Math.round(macroKcal)} kcal.
          </p>
          <Button className="w-full" size="lg" onClick={save}>
            {saved ? "Saved!" : "Save goals"}
          </Button>
        </Card>

        <Card>
          <SectionTitle>Quick presets</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Lose", kcal: 1700, p: 130, c: 160, f: 55 },
              { label: "Maintain", kcal: 2000, p: 120, c: 230, f: 65 },
              { label: "Gain", kcal: 2500, p: 150, c: 290, f: 80 },
            ].map((p) => (
              <Button
                key={p.label}
                variant="outline"
                onClick={() =>
                  setForm({
                    ...form,
                    calories: String(p.kcal),
                    protein: String(p.p),
                    carbs: String(p.c),
                    fat: String(p.f),
                  })
                }
              >
                {p.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
