import { createFileRoute } from "@tanstack/react-router";
import { Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, EmptyState, Field, SectionTitle } from "@/components/eattrack/ui";
import { allFoods, toggleFavorite, uid, update, useAppData } from "@/lib/eattrack/store";

export const Route = createFileRoute("/more/foods")({
  head: () => ({
    meta: [
      { title: "Food Database — EatTrack" },
      { name: "description", content: "Browse starter foods, add custom foods and manage favorites." },
      { property: "og:title", content: "Food Database — EatTrack" },
      { property: "og:description", content: "Your offline food list with custom foods and favorites." },
    ],
  }),
  component: FoodsPage,
});

const empty = { name: "", serving: "1 serving", kcal: "", protein: "", carbs: "", fat: "" };

function FoodsPage() {
  const data = useAppData();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "fav" | "custom">("all");
  const [form, setForm] = useState(empty);

  const list = useMemo(() => {
    let foods = allFoods(data);
    if (tab === "fav") foods = foods.filter((f) => data.favorites.includes(f.id));
    if (tab === "custom") foods = data.customFoods;
    const s = q.trim().toLowerCase();
    return s ? foods.filter((f) => f.name.toLowerCase().includes(s)) : foods;
  }, [data, q, tab]);

  const addCustom = () => {
    if (!form.name.trim() || !form.kcal) return;
    const n = (v: string) => Math.max(0, Number(v) || 0);
    update((d) => ({
      ...d,
      customFoods: [
        {
          id: "c-" + uid(),
          name: form.name.trim(),
          serving: form.serving.trim() || "1 serving",
          kcal: n(form.kcal),
          protein: n(form.protein),
          carbs: n(form.carbs),
          fat: n(form.fat),
          custom: true,
        },
        ...d.customFoods,
      ],
    }));
    setForm(empty);
  };

  const removeCustom = (id: string) => {
    if (!window.confirm("Delete this custom food?")) return;
    update((d) => ({
      ...d,
      customFoods: d.customFoods.filter((f) => f.id !== id),
      favorites: d.favorites.filter((f) => f !== id),
    }));
  };

  return (
    <AppShell title="Food Database" subtitle={`${allFoods(data).length} foods`} back="/more">
      <Card className="mb-4 space-y-3">
        <SectionTitle>Add custom food</SectionTitle>
        <Field label="Name">
          <input className="et-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Serving size">
          <input className="et-field" value={form.serving} onChange={(e) => setForm({ ...form, serving: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          {(["kcal", "protein", "carbs", "fat"] as const).map((k) => (
            <Field key={k} label={k === "kcal" ? "Calories" : `${k[0].toUpperCase()}${k.slice(1)} (g)`}>
              <input
                className="et-field"
                inputMode="decimal"
                type="number"
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <Button className="w-full" onClick={addCustom} disabled={!form.name.trim() || !form.kcal}>
          Save food
        </Button>
      </Card>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {(
          [
            ["all", "All"],
            ["fav", "Favorites"],
            ["custom", "Custom"],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} size="sm" variant={tab === id ? "primary" : "outline"} onClick={() => setTab(id)}>
            {label}
          </Button>
        ))}
      </div>
      <input className="et-field mb-3" placeholder="Search foods…" value={q} onChange={(e) => setQ(e.target.value)} />

      {list.length === 0 ? (
        <EmptyState title="No foods found" hint="Try another search or add a custom food." />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-border">
            {list.map((f) => {
              const fav = data.favorites.includes(f.id);
              return (
                <li key={f.id} className="flex items-center gap-2 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.serving} · {f.kcal} kcal · P {f.protein} · C {f.carbs} · F {f.fat}
                    </p>
                  </div>
                  <button
                    aria-label={fav ? "Remove favorite" : "Add favorite"}
                    onClick={() => toggleFavorite(f.id)}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
                  >
                    <Star className={fav ? "h-5 w-5 fill-accent text-accent" : "h-5 w-5 text-muted-foreground"} />
                  </button>
                  {f.custom ? (
                    <button
                      aria-label="Delete food"
                      onClick={() => removeCustom(f.id)}
                      className="grid h-10 w-10 place-items-center rounded-full text-destructive hover:bg-muted"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </AppShell>
  );
}
