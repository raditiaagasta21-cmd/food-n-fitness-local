import { createFileRoute } from "@tanstack/react-router";
import { Activity, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, EmptyState, Field, ProgressBar, SectionTitle } from "@/components/eattrack/ui";
import {
  addExercise,
  exerciseMinutes,
  formatDateLabel,
  removeExercise,
  todayKey,
  useAppData,
  useDay,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/exercise")({
  head: () => ({
    meta: [
      { title: "Exercise — EatTrack" },
      {
        name: "description",
        content: "Log walking, running, cycling, gym, swimming and sports with duration and notes.",
      },
      { property: "og:title", content: "Exercise — EatTrack" },
      { property: "og:description", content: "Offline activity logging with a daily minutes goal." },
    ],
  }),
  component: ExercisePage,
});

const PRESETS = ["Walking", "Running", "Cycling", "Gym", "Swimming", "Sports", "Yoga", "Hiking"];

function ExercisePage() {
  const data = useAppData();
  const date = todayKey();
  const { day } = useDay(date);
  const [activity, setActivity] = useState("Walking");
  const [minutes, setMinutes] = useState("30");
  const [kcal, setKcal] = useState("");
  const [notes, setNotes] = useState("");
  const total = exerciseMinutes(day);

  const save = () => {
    const m = Number(minutes);
    if (!activity.trim() || !m) return;
    addExercise(date, {
      activity: activity.trim(),
      minutes: m,
      kcal: kcal ? Number(kcal) : undefined,
      notes: notes.trim() || undefined,
    });
    setMinutes("30");
    setKcal("");
    setNotes("");
  };

  return (
    <AppShell title="Exercise" subtitle={formatDateLabel(date)} back="/">
      <div className="space-y-4">
        <Card className="text-center">
          <Activity className="mx-auto h-8 w-8 text-move" />
          <div className="mt-2 text-4xl font-extrabold tabular-nums">{total} min</div>
          <p className="text-sm text-muted-foreground">goal {data.goals.exerciseMin} min</p>
          <ProgressBar value={total} max={data.goals.exerciseMin} tone="move" className="mt-3" />
        </Card>

        <Card className="space-y-3">
          <SectionTitle>Add activity</SectionTitle>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setActivity(p)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${
                  activity === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Field label="Activity">
            <input
              className="et-field"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (min)">
              <input
                className="et-field"
                type="number"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </Field>
            <Field label="Calories (optional)">
              <input
                className="et-field"
                type="number"
                inputMode="numeric"
                value={kcal}
                onChange={(e) => setKcal(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <input
              className="et-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
            />
          </Field>
          <Button size="lg" className="w-full" onClick={save}>
            Add activity
          </Button>
        </Card>

        <Card>
          <SectionTitle>Today's activities</SectionTitle>
          {day.exercise.length === 0 ? (
            <EmptyState title="Nothing logged yet" />
          ) : (
            <ul className="space-y-2">
              {day.exercise.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-muted/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{e.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.minutes} min{e.kcal ? ` · ${e.kcal} kcal` : ""}
                      {e.notes ? ` · ${e.notes}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => removeExercise(date, e.id)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
