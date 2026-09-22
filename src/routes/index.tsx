import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Droplets,
  Moon,
  Plus,
  Scale,
  Utensils,
} from "lucide-react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, ProgressBar, Ring, SectionTitle } from "@/components/eattrack/ui";
import {
  dayTotals,
  exerciseMinutes,
  formatDateLabel,
  todayKey,
  toggleHabit,
  useAppData,
  useDay,
} from "@/lib/eattrack/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — EatTrack" },
      {
        name: "description",
        content:
          "Your daily food, calorie, water, weight, sleep, exercise and habit dashboard — fully offline.",
      },
      { property: "og:title", content: "Today — EatTrack" },
      {
        property: "og:description",
        content: "Track calories, water, weight, sleep, exercise and habits offline.",
      },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const data = useAppData();
  const date = todayKey();
  const { day } = useDay(date);
  const totals = dayTotals(day);
  const goals = data.goals;

  const lastWeight =
    day.weightKg ??
    Object.keys(data.days)
      .filter((k) => data.days[k]?.weightKg != null && k <= date)
      .sort()
      .map((k) => data.days[k].weightKg)
      .pop();

  const activeHabits = data.habits.filter((h) => !h.archived);
  const doneHabits = activeHabits.filter((h) => day.habits.includes(h.id)).length;

  return (
    <AppShell title="Today" subtitle={formatDateLabel(date)}>
      <div className="space-y-4">
        <Card className="flex items-center gap-4">
          <Ring
            value={totals.kcal}
            max={goals.calories}
            label={String(Math.round(totals.kcal))}
            sub={`/ ${goals.calories} kcal`}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <Macro
              label="Protein"
              value={totals.protein}
              goal={goals.protein}
              tone="protein"
            />
            <Macro label="Carbs" value={totals.carbs} goal={goals.carbs} tone="carbs" />
            <Macro label="Fat" value={totals.fat} goal={goals.fat} tone="fat" />
          </div>
        </Card>

        <div>
          <SectionTitle>Quick add</SectionTitle>
          <div className="grid grid-cols-5 gap-2">
            <QuickAction to="/food" icon={<Utensils className="h-5 w-5" />} label="Food" />
            <QuickAction to="/water" icon={<Droplets className="h-5 w-5" />} label="Water" />
            <QuickAction to="/weight" icon={<Scale className="h-5 w-5" />} label="Weight" />
            <QuickAction to="/exercise" icon={<Activity className="h-5 w-5" />} label="Move" />
            <QuickAction to="/sleep" icon={<Moon className="h-5 w-5" />} label="Sleep" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            to="/water"
            title="Water"
            value={`${day.waterMl} ml`}
            sub={`of ${goals.waterMl} ml`}
            progress={[day.waterMl, goals.waterMl]}
            tone="water"
            icon={<Droplets className="h-4 w-4 text-water" />}
          />
          <StatCard
            to="/weight"
            title="Weight"
            value={lastWeight ? `${lastWeight} kg` : "—"}
            sub={`goal ${goals.goalWeightKg} kg`}
            icon={<Scale className="h-4 w-4 text-primary" />}
          />
          <StatCard
            to="/sleep"
            title="Sleep"
            value={day.sleep ? `${day.sleep.hours} h` : "—"}
            sub={`goal ${goals.sleepHours} h`}
            progress={[day.sleep?.hours ?? 0, goals.sleepHours]}
            tone="sleep"
            icon={<Moon className="h-4 w-4 text-sleep" />}
          />
          <StatCard
            to="/exercise"
            title="Exercise"
            value={`${exerciseMinutes(day)} min`}
            sub={`goal ${goals.exerciseMin} min`}
            progress={[exerciseMinutes(day), goals.exerciseMin]}
            tone="move"
            icon={<Activity className="h-4 w-4 text-move" />}
          />
        </div>

        <Card>
          <SectionTitle
            action={
              <Link to="/habits" className="text-xs font-semibold text-primary">
                Manage
              </Link>
            }
          >
            Habits · {doneHabits}/{activeHabits.length}
          </SectionTitle>
          <ProgressBar
            value={doneHabits}
            max={Math.max(1, activeHabits.length)}
            className="mb-3"
          />
          <ul className="space-y-1">
            {activeHabits.map((h) => {
              const done = day.habits.includes(h.id);
              return (
                <li key={h.id}>
                  <button
                    onClick={() => toggleHabit(date, h.id)}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-1 text-left"
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                        done ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {done ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-primary-foreground">
                          <path d="M6.2 11.3 3.4 8.5l1.1-1.1 1.7 1.7 4.3-4.3 1.1 1.1z" />
                        </svg>
                      ) : null}
                    </span>
                    <span
                      className={`min-w-0 truncate text-sm font-medium ${
                        done ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {h.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Today's meals</SectionTitle>
          {day.foods.length === 0 ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Nothing logged yet.</p>
              <Link to="/food">
                <Button size="sm">
                  <Plus className="h-4 w-4" /> Add food
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-1 text-sm">
              {day.foods.slice(0, 6).map((f) => (
                <li key={f.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    {f.name} {f.qty !== 1 ? `×${f.qty}` : ""}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {Math.round(f.kcal * f.qty)} kcal
                  </span>
                </li>
              ))}
              {day.foods.length > 6 ? (
                <li className="pt-1">
                  <Link to="/food" className="text-xs font-semibold text-primary">
                    View all {day.foods.length} items
                  </Link>
                </li>
              ) : null}
            </ul>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function Macro({
  label,
  value,
  goal,
  tone,
}: {
  label: string;
  value: number;
  goal: number;
  tone: "protein" | "carbs" | "fat";
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {Math.round(value)} / {goal} g
        </span>
      </div>
      <ProgressBar value={value} max={goal} tone={tone} />
    </div>
  );
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to as never}
      className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl bg-primary-soft text-secondary-foreground"
    >
      {icon}
      <span className="text-[11px] font-bold">{label}</span>
    </Link>
  );
}

function StatCard({
  to,
  title,
  value,
  sub,
  progress,
  tone,
  icon,
}: {
  to: string;
  title: string;
  value: string;
  sub: string;
  progress?: [number, number];
  tone?: "water" | "sleep" | "move";
  icon: React.ReactNode;
}) {
  return (
    <Link to={to as never} className="et-card block p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
      {progress ? (
        <ProgressBar value={progress[0]} max={progress[1]} tone={tone} className="mt-2" />
      ) : null}
    </Link>
  );
}
