import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Minus, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { FoodPicker } from "@/components/eattrack/FoodPicker";
import { Button, Card, EmptyState } from "@/components/eattrack/ui";
import {
  dayTotals,
  formatDateLabel,
  removeFoodEntry,
  setFoodQty,
  shiftDate,
  todayKey,
  uid,
  update,
  useDay,
} from "@/lib/eattrack/store";
import { MEAL_SLOTS, type MealSlot } from "@/lib/eattrack/types";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food Diary — EatTrack" },
      {
        name: "description",
        content:
          "Log breakfast, snacks, lunch and dinner with automatic calorie and macro calculation.",
      },
      { property: "og:title", content: "Food Diary — EatTrack" },
      {
        property: "og:description",
        content: "Offline food diary with a starter food database and saved meals.",
      },
    ],
  }),
  component: FoodPage,
});

function FoodPage() {
  const [date, setDate] = useState(todayKey());
  const { day } = useDay(date);
  const [picker, setPicker] = useState<MealSlot | null>(null);
  const totals = dayTotals(day);

  const saveMealAs = (slot: MealSlot, label: string) => {
    const items = day.foods.filter((f) => f.meal === slot);
    if (!items.length) return;
    const name = window.prompt("Name this saved meal", `${label} — ${formatDateLabel(date)}`);
    if (!name) return;
    update((d) => ({
      ...d,
      savedMeals: [
        {
          id: uid(),
          name,
          items: items.map(({ id: _id, meal: _meal, ...rest }) => rest),
        },
        ...d.savedMeals,
      ],
    }));
  };

  return (
    <AppShell title="Food" subtitle={`${Math.round(totals.kcal)} kcal logged`}>
      <div className="space-y-4">
        <Card className="flex items-center justify-between gap-2 py-2">
          <button
            onClick={() => setDate(shiftDate(date, -1))}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold">{formatDateLabel(date)}</span>
          <button
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= todayKey()}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted disabled:opacity-30"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </Card>

        <Card className="grid grid-cols-4 gap-2 text-center">
          {[
            ["kcal", Math.round(totals.kcal)],
            ["Protein", `${Math.round(totals.protein)} g`],
            ["Carbs", `${Math.round(totals.carbs)} g`],
            ["Fat", `${Math.round(totals.fat)} g`],
          ].map(([k, v]) => (
            <div key={k as string}>
              <div className="text-base font-extrabold tabular-nums">{v as string}</div>
              <div className="text-[11px] text-muted-foreground">{k as string}</div>
            </div>
          ))}
        </Card>

        {MEAL_SLOTS.map((slot) => {
          const items = day.foods.filter((f) => f.meal === slot.id);
          const kcal = items.reduce((a, f) => a + f.kcal * f.qty, 0);
          return (
            <Card key={slot.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate font-bold">{slot.label}</h2>
                  <p className="text-xs text-muted-foreground">{Math.round(kcal)} kcal</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {items.length > 0 ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveMealAs(slot.id, slot.label)}
                      aria-label="Save as meal"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : null}
                  <Button size="sm" variant="soft" onClick={() => setPicker(slot.id)}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </div>

              {items.length === 0 ? (
                <EmptyState title="No items yet" />
              ) : (
                <ul className="space-y-2">
                  {items.map((f) => (
                    <li key={f.id} className="rounded-xl bg-muted/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{f.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.serving} · {Math.round(f.kcal * f.qty)} kcal · P
                            {Math.round(f.protein * f.qty)} C{Math.round(f.carbs * f.qty)} F
                            {Math.round(f.fat * f.qty)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFoodEntry(date, f.id)}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setFoodQty(date, f.id, f.qty - 0.5)}
                          className="grid h-9 w-9 place-items-center rounded-full border border-border"
                          aria-label="Less"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-14 text-center text-sm font-bold tabular-nums">
                          ×{f.qty}
                        </span>
                        <button
                          onClick={() => setFoodQty(date, f.id, f.qty + 0.5)}
                          className="grid h-9 w-9 place-items-center rounded-full border border-border"
                          aria-label="More"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      {picker ? (
        <FoodPicker date={date} meal={picker} open onClose={() => setPicker(null)} />
      ) : null}
    </AppShell>
  );
}
