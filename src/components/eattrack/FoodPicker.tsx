import { Clock, Heart, Plus, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, EmptyState, Field, Sheet } from "./ui";
import {
  addFoodEntry,
  addSavedMealTo,
  allFoods,
  toggleFavorite,
  uid,
  update,
  useAppData,
} from "@/lib/eattrack/store";
import type { FoodItem, MealSlot } from "@/lib/eattrack/types";

type Tab = "search" | "favorites" | "recent" | "meals" | "custom";

export function FoodPicker({
  date,
  meal,
  open,
  onClose,
}: {
  date: string;
  meal: MealSlot;
  open: boolean;
  onClose: () => void;
}) {
  const data = useAppData();
  const [tab, setTab] = useState<Tab>("search");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState("1");

  const foods = useMemo(() => allFoods(data), [data]);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = foods;
    if (tab === "favorites") list = foods.filter((f) => data.favorites.includes(f.id));
    if (tab === "recent")
      list = data.recents.map((id) => foods.find((f) => f.id === id)).filter(Boolean) as FoodItem[];
    if (tab === "custom") list = data.customFoods;
    if (!term) return list.slice(0, 60);
    return list.filter((f) => f.name.toLowerCase().includes(term)).slice(0, 60);
  }, [foods, q, tab, data.favorites, data.recents, data.customFoods]);

  const confirm = () => {
    if (!picked) return;
    const n = Math.max(0.25, Number(qty) || 1);
    addFoodEntry(date, {
      foodId: picked.id,
      name: picked.name,
      serving: picked.serving,
      kcal: picked.kcal,
      protein: picked.protein,
      carbs: picked.carbs,
      fat: picked.fat,
      qty: n,
      meal,
    });
    setPicked(null);
    setQty("1");
    setQ("");
    onClose();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "search", label: "All" },
    { id: "favorites", label: "Favorites" },
    { id: "recent", label: "Recent" },
    { id: "meals", label: "Meals" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <Sheet open={open} onClose={onClose} title={picked ? picked.name : "Add food"}>
      {picked ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {picked.serving} · {picked.kcal} kcal
          </p>
          <Field label="Quantity (servings)">
            <input
              className="et-field"
              type="number"
              inputMode="decimal"
              step="0.25"
              min="0.25"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              ["kcal", picked.kcal],
              ["P", picked.protein],
              ["C", picked.carbs],
              ["F", picked.fat],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-muted p-2">
                <div className="font-bold tabular-nums">
                  {Math.round((v as number) * (Number(qty) || 1) * 10) / 10}
                </div>
                <div className="text-muted-foreground">{k as string}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPicked(null)}>
              Back
            </Button>
            <Button className="flex-1" onClick={confirm}>
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="et-field pl-9"
              placeholder="Search foods…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "meals" ? (
            data.savedMeals.length === 0 ? (
              <EmptyState title="No saved meals" hint="Create them from More → Saved Meals." />
            ) : (
              <ul className="space-y-2">
                {data.savedMeals.map((m) => {
                  const kcal = m.items.reduce((a, i) => a + i.kcal * i.qty, 0);
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => {
                          addSavedMealTo(date, meal, m);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border p-3 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{m.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {m.items.length} items · {Math.round(kcal)} kcal
                          </span>
                        </span>
                        <Plus className="h-5 w-5 shrink-0 text-primary" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          ) : results.length === 0 ? (
            <EmptyState title="No foods found" hint="Try another search or add a custom food." />
          ) : (
            <ul className="max-h-[46vh] space-y-1 overflow-y-auto">
              {results.map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setPicked(f)}
                    className="min-w-0 flex-1 rounded-xl p-3 text-left hover:bg-muted"
                  >
                    <span className="block truncate font-semibold">{f.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {f.serving} · {f.kcal} kcal · P{f.protein} C{f.carbs} F{f.fat}
                    </span>
                  </button>
                  <button
                    aria-label="Favorite"
                    onClick={() => toggleFavorite(f.id)}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-muted"
                  >
                    {data.favorites.includes(f.id) ? (
                      <Heart className="h-4 w-4 fill-primary text-primary" />
                    ) : (
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <QuickCustomFood
            onCreated={(food) => {
              setPicked(food);
            }}
          />
        </div>
      )}
    </Sheet>
  );
}

function QuickCustomFood({ onCreated }: { onCreated: (f: FoodItem) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    serving: "1 serving",
    kcal: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  if (!open) {
    return (
      <Button variant="soft" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add custom food
      </Button>
    );
  }

  const save = () => {
    if (!form.name.trim()) return;
    const food: FoodItem = {
      id: uid(),
      name: form.name.trim(),
      serving: form.serving || "1 serving",
      kcal: Number(form.kcal) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      custom: true,
    };
    update((d) => ({ ...d, customFoods: [food, ...d.customFoods] }));
    setOpen(false);
    setForm({ name: "", serving: "1 serving", kcal: "", protein: "", carbs: "", fat: "" });
    onCreated(food);
  };

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <input
        className="et-field"
        placeholder="Food name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="et-field"
        placeholder="Serving size (e.g. 100 g)"
        value={form.serving}
        onChange={(e) => setForm({ ...form, serving: e.target.value })}
      />
      <div className="grid grid-cols-4 gap-2">
        {(["kcal", "protein", "carbs", "fat"] as const).map((k) => (
          <input
            key={k}
            className="et-field px-2 text-center"
            inputMode="decimal"
            placeholder={k === "kcal" ? "kcal" : (k[0] ?? "").toUpperCase()}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={save}>
          <Star className="h-4 w-4" /> Save food
        </Button>
      </div>
    </div>
  );
}
