import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, Field, SectionTitle } from "@/components/eattrack/ui";
import { update, useAppData } from "@/lib/eattrack/store";
import type { Profile } from "@/lib/eattrack/types";

export const Route = createFileRoute("/more/profile")({
  head: () => ({
    meta: [
      { title: "Profile — EatTrack" },
      { name: "description", content: "Your name, sex, height and birth year, stored offline." },
      { property: "og:title", content: "Profile — EatTrack" },
      { property: "og:description", content: "Personal details used for BMI and estimates." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const data = useAppData();
  const [form, setForm] = useState<Profile>(data.profile);
  const [saved, setSaved] = useState(false);

  const save = () => {
    update((d) => ({
      ...d,
      profile: {
        name: form.name.trim(),
        sex: form.sex,
        heightCm: Number(form.heightCm) || 0,
        birthYear: Number(form.birthYear) || 0,
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const lastWeight = Object.keys(data.days)
    .sort()
    .map((k) => data.days[k]?.weightKg)
    .filter((w): w is number => typeof w === "number")
    .pop();
  const h = Number(form.heightCm) / 100;
  const bmi = lastWeight && h > 0 ? Math.round((lastWeight / (h * h)) * 10) / 10 : null;
  const age = form.birthYear ? new Date().getFullYear() - Number(form.birthYear) : null;

  return (
    <AppShell title="Profile" back="/more" nav={false}>
      <div className="space-y-4">
        <Card className="space-y-3">
          <Field label="Name">
            <input
              className="et-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </Field>
          <Field label="Sex">
            <div className="grid grid-cols-3 gap-2">
              {(["male", "female", "other"] as const).map((s) => (
                <Button
                  key={s}
                  variant={form.sex === s ? "primary" : "outline"}
                  onClick={() => setForm({ ...form, sex: s })}
                >
                  {(s[0] ?? "").toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </Field>
          <Field label="Height (cm)">
            <input
              className="et-field"
              inputMode="numeric"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
            />
          </Field>
          <Field label="Birth year">
            <input
              className="et-field"
              inputMode="numeric"
              value={form.birthYear}
              onChange={(e) => setForm({ ...form, birthYear: Number(e.target.value) })}
            />
          </Field>
          <Button className="w-full" size="lg" onClick={save}>
            {saved ? "Saved!" : "Save profile"}
          </Button>
        </Card>

        <Card>
          <SectionTitle>Summary</SectionTitle>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Box label="Age" value={age ? `${age}` : "—"} />
            <Box label="Weight" value={lastWeight ? `${lastWeight} kg` : "—"} />
            <Box label="BMI" value={bmi ? `${bmi}` : "—"} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="text-lg font-extrabold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
