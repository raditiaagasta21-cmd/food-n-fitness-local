import { createFileRoute } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, Field, ProgressBar, SectionTitle } from "@/components/eattrack/ui";
import {
  formatDateLabel,
  setSleep,
  shiftDate,
  sleepHoursBetween,
  todayKey,
  useAppData,
  useDay,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/sleep")({
  head: () => ({
    meta: [
      { title: "Sleep — EatTrack" },
      { name: "description", content: "Record bedtime, wake time, sleep duration and quality." },
      { property: "og:title", content: "Sleep — EatTrack" },
      { property: "og:description", content: "Simple offline sleep logging with a nightly goal." },
    ],
  }),
  component: SleepPage,
});

const QUALITY = ["Poor", "Fair", "Okay", "Good", "Great"];

function SleepPage() {
  const data = useAppData();
  const date = todayKey();
  const { day } = useDay(date);
  const [bedtime, setBedtime] = useState(day.sleep?.bedtime ?? "23:00");
  const [wake, setWake] = useState(day.sleep?.wake ?? "07:00");
  const [quality, setQuality] = useState<number>(day.sleep?.quality ?? 4);
  const hours = sleepHoursBetween(bedtime, wake);
  const yesterday = data.days[shiftDate(date, -1)]?.sleep;

  return (
    <AppShell title="Sleep" subtitle={formatDateLabel(date)} back="/">
      <div className="space-y-4">
        <Card className="text-center">
          <Moon className="mx-auto h-8 w-8 text-sleep" />
          <div className="mt-2 text-4xl font-extrabold tabular-nums">
            {day.sleep ? day.sleep.hours : 0} h
          </div>
          <p className="text-sm text-muted-foreground">goal {data.goals.sleepHours} h</p>
          <ProgressBar
            value={day.sleep?.hours ?? 0}
            max={data.goals.sleepHours}
            tone="sleep"
            className="mt-3"
          />
        </Card>

        <Card className="space-y-3">
          <SectionTitle>Log last night</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bedtime">
              <input
                className="et-field"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </Field>
            <Field label="Wake time">
              <input
                className="et-field"
                type="time"
                value={wake}
                onChange={(e) => setWake(e.target.value)}
              />
            </Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Duration: <span className="font-bold text-foreground">{hours} hours</span>
          </p>
          <div>
            <span className="mb-1.5 block text-sm font-semibold">Quality</span>
            <div className="grid grid-cols-5 gap-1.5">
              {QUALITY.map((q, i) => (
                <button
                  key={q}
                  onClick={() => setQuality(i + 1)}
                  className={`min-h-11 rounded-xl text-xs font-bold ${
                    quality === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() =>
              setSleep(date, {
                bedtime,
                wake,
                hours,
                quality: quality as 1 | 2 | 3 | 4 | 5,
              })
            }
          >
            Save sleep
          </Button>
          {day.sleep ? (
            <Button variant="ghost" className="w-full" onClick={() => setSleep(date, undefined)}>
              Clear today's entry
            </Button>
          ) : null}
        </Card>

        {yesterday ? (
          <Card>
            <SectionTitle>Yesterday</SectionTitle>
            <p className="text-sm">
              {yesterday.bedtime} → {yesterday.wake} · {yesterday.hours} h ·{" "}
              {QUALITY[yesterday.quality - 1]}
            </p>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
