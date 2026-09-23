import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, EmptyState, Field } from "@/components/eattrack/ui";
import { addSavedMealTo, allFoods, todayKey, uid, update, useAppData } from "@/lib/eattrack/store";
import { MEAL_SLOTS, type MealSlot, type SavedMeal } from "@/lib/eattrack/types";

export const Route = createFileRoute("/more/meals")({
  head: () => ({
    meta: [
      { title: "Saved Meals — EatTrack" },
      { name: "description", content: "Build reusable meal combos and log them in one tap." },
      { property: "og:title", content: "Saved Meals — EatTrack" },
      { property: "og:description", content: "Reusable meals for faster offline food logging." },
    ],
  }),
  component: MealsPage,
});

function MealsPage() {
  const data = useAppData();
  const foods = allFoods(data);
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [slot, setSlot] = useState<MealSlot>("lunch");

  const results = q.trim()
    ? foods.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 12)
    : [];

  const create = () => {
    if (!name.trim() || picked.length === 0) return;
    const items = picked
      .map((id) => foods.find((f) => f.id === id))
      .filter(Boolean)
      .map((f) => ({
        foodId: f!.id,
        name: f!.name,
        serving: f!.serving,
        kcal: f!.kcal,
        protein: f!.protein,
        carbs: f!.carbs,
        fat: f!.fat,
        qty: 1,
      }));
    update((d) => ({
      ...d,
      savedMeals: [{ id: uid(), name: name.trim(), items }, ...d.savedMeals],
    }));
    setName("");
    setPicked([]);
    setQ("");
  };

  const remove = (id: string) =>
    update((d) => ({ ...d, savedMeals: d.savedMeals.filter((m) => m.id !== id) }));

  const logIt = (m: SavedMeal) => {
    addSavedMealTo(todayKey(), slot, m);
  };

  return (
    <AppShell title="Saved Meals" back="/more" nav={false}>
      <div className="space-y-4">
        <Card className="space-y-3">
          <Field label="New meal name">
            <input
              className="et-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Breakfast combo"
            />
          </Field>
          <Field label="Add foods">
            <input
              className="et-field"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search foods…"
            />
          </Field>
          {results.length > 0 ? (
            <ul className="max-h-56 space-y-1 overflow-y-auto">
              {results.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setPicked([...picked, f.id])}
                    className="flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left hover:bg-muted"
                  >
                    <span className="min-w-0 truncate text-sm">{f.name}</span>
                    <Plus className="h-4 w-4 shrink-0 text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {picked.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {picked.map((id, i) => (
                <button
                  key={`${id}-${i}`}
                  onClick={() => setPicked(picked.filter((_, j) => j !== i))}
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                >
                  {foods.find((f) => f.id === id)?.name} ×
                </button>
              ))}
            </div>
          ) : null}
          <Button className="w-full" onClick={create} disabled={!name.trim() || !picked.length}>
            <Plus className="h-4 w-4" /> Create saved meal
          </Button>
        </Card>

        <Card>
          <Field label="Log to meal slot">
            <select
              className="et-field"
              value={slot}
              onChange={(e) => setSlot(e.target.value as MealSlot)}
            >
              {MEAL_SLOTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        {data.savedMeals.length === 0 ? (
          <EmptyState title="No saved meals yet" hint="Create one above or save a meal from the food diary." />
        ) : (
          <ul className="space-y-3">
            {data.savedMeals.map((m) => {
              const kcal = m.items.reduce((a, i) => a + i.kcal * i.qty, 0);
              return (
                <li key={m.id}>
                  <Card>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-bold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.items.length} items · {Math.round(kcal)} kcal
                        </p>
                      </div>
                      <button
                        onClick={() => remove(m.id)}
                        aria-label="Delete meal"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="mt-2 text-xs text-muted-foreground">
                      {m.items.map((i, idx) => (
                        <li key={idx} className="truncate">
                          {i.name} · {Math.round(i.kcal * i.qty)} kcal
                        </li>
                      ))}
                    </ul>
                    <Button variant="soft" className="mt-3 w-full" onClick={() => logIt(m)}>
                      Log to today
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
