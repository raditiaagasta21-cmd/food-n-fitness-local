import { useCallback, useEffect, useSyncExternalStore } from "react";
import { STARTER_FOODS } from "./foods";
import type {
  AppData,
  DayEntry,
  ExerciseEntry,
  FoodEntry,
  FoodItem,
  Habit,
  MealSlot,
  SavedMeal,
  SleepEntry,
} from "./types";

export const STORAGE_KEY = "eattrack:v1";

export function todayKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftDate(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayKey(dt);
}

export function formatDateLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const today = todayKey();
  if (key === today) return "Today";
  if (key === shiftDate(today, -1)) return "Yesterday";
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const emptyDay = (): DayEntry => ({
  foods: [],
  waterMl: 0,
  exercise: [],
  habits: [],
  notes: "",
});

export const DEFAULT_HABITS: Habit[] = [
  { id: "h-water", name: "Drink enough water" },
  { id: "h-veg", name: "Eat vegetables" },
  { id: "h-fruit", name: "Eat fruit" },
  { id: "h-exercise", name: "Exercise" },
  { id: "h-sleep", name: "Sleep 7+ hours" },
  { id: "h-sugar", name: "Avoid sugary drinks" },
];

export function defaultData(): AppData {
  return {
    version: 1,
    profile: { name: "", sex: "other", heightCm: 170, birthYear: 1995 },
    goals: {
      calories: 2000,
      protein: 120,
      carbs: 230,
      fat: 65,
      waterMl: 2000,
      sleepHours: 8,
      exerciseMin: 30,
      goalWeightKg: 65,
      startWeightKg: 70,
    },
    customFoods: [],
    favorites: [],
    recents: [],
    savedMeals: [],
    habits: DEFAULT_HABITS,
    days: {},
    settings: { waterStepMl: 250, firstDayOfWeek: 1 },
  };
}

function merge(raw: unknown): AppData {
  const base = defaultData();
  if (!raw || typeof raw !== "object") return base;
  const p = raw as Partial<AppData>;
  return {
    ...base,
    ...p,
    profile: { ...base.profile, ...(p.profile ?? {}) },
    goals: { ...base.goals, ...(p.goals ?? {}) },
    settings: { ...base.settings, ...(p.settings ?? {}) },
    customFoods: p.customFoods ?? [],
    favorites: p.favorites ?? [],
    recents: p.recents ?? [],
    savedMeals: p.savedMeals ?? [],
    habits: p.habits?.length ? p.habits : base.habits,
    days: p.days ?? {},
    version: 1,
  };
}

let cache: AppData | null = null;
const listeners = new Set<() => void>();
const SERVER_SNAPSHOT = defaultData();

function read(): AppData {
  if (cache) return cache;
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = merge(raw ? JSON.parse(raw) : null);
  } catch {
    cache = defaultData();
  }
  return cache;
}

function write(next: AppData) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable — keep in-memory state */
  }
  listeners.forEach((l) => l());
}

export function update(fn: (d: AppData) => AppData) {
  write(fn(read()));
}

export function replaceAll(raw: unknown) {
  cache = null;
  write(merge(raw));
}

export function exportJSON() {
  return JSON.stringify(read(), null, 2);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, read, () => SERVER_SNAPSHOT);
}

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------- day helpers ---------- */

export function getDay(data: AppData, date: string): DayEntry {
  return { ...emptyDay(), ...(data.days[date] ?? {}) };
}

export function useDay(date: string) {
  const data = useAppData();
  const day = getDay(data, date);
  const patch = useCallback(
    (fn: (d: DayEntry) => DayEntry) => {
      update((d) => ({
        ...d,
        days: { ...d.days, [date]: fn({ ...emptyDay(), ...(d.days[date] ?? {}) }) },
      }));
    },
    [date],
  );
  return { day, patch };
}

/* ---------- derived ---------- */

export function dayTotals(day: DayEntry) {
  return day.foods.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal * e.qty,
      protein: acc.protein + e.protein * e.qty,
      carbs: acc.carbs + e.carbs * e.qty,
      fat: acc.fat + e.fat * e.qty,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function exerciseMinutes(day: DayEntry) {
  return day.exercise.reduce((a, e) => a + e.minutes, 0);
}

export function allFoods(data: AppData): FoodItem[] {
  return [...data.customFoods, ...STARTER_FOODS];
}

/* ---------- mutations ---------- */

export function addFoodEntry(date: string, entry: Omit<FoodEntry, "id">) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    const recents = entry.foodId
      ? [entry.foodId, ...d.recents.filter((r) => r !== entry.foodId)].slice(0, 20)
      : d.recents;
    return {
      ...d,
      recents,
      days: { ...d.days, [date]: { ...day, foods: [...day.foods, { ...entry, id: uid() }] } },
    };
  });
}

export function addSavedMealTo(date: string, meal: MealSlot, saved: SavedMeal) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    const foods = saved.items.map((i) => ({ ...i, id: uid(), meal }));
    return { ...d, days: { ...d.days, [date]: { ...day, foods: [...day.foods, ...foods] } } };
  });
}

export function removeFoodEntry(date: string, id: string) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return {
      ...d,
      days: { ...d.days, [date]: { ...day, foods: day.foods.filter((f) => f.id !== id) } },
    };
  });
}

export function setFoodQty(date: string, id: string, qty: number) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return {
      ...d,
      days: {
        ...d.days,
        [date]: {
          ...day,
          foods: day.foods.map((f) => (f.id === id ? { ...f, qty: Math.max(0.25, qty) } : f)),
        },
      },
    };
  });
}

export function addWater(date: string, ml: number) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return { ...d, days: { ...d.days, [date]: { ...day, waterMl: Math.max(0, day.waterMl + ml) } } };
  });
}

export function setWater(date: string, ml: number) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return { ...d, days: { ...d.days, [date]: { ...day, waterMl: Math.max(0, ml) } } };
  });
}

export function setWeight(date: string, kg: number) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return { ...d, days: { ...d.days, [date]: { ...day, weightKg: kg } } };
  });
}

export function setSleep(date: string, sleep: SleepEntry | undefined) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return { ...d, days: { ...d.days, [date]: { ...day, sleep } } };
  });
}

export function addExercise(date: string, e: Omit<ExerciseEntry, "id">) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return {
      ...d,
      days: { ...d.days, [date]: { ...day, exercise: [...day.exercise, { ...e, id: uid() }] } },
    };
  });
}

export function removeExercise(date: string, id: string) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return {
      ...d,
      days: { ...d.days, [date]: { ...day, exercise: day.exercise.filter((x) => x.id !== id) } },
    };
  });
}

export function toggleHabit(date: string, habitId: string) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    const done = day.habits.includes(habitId);
    return {
      ...d,
      days: {
        ...d.days,
        [date]: {
          ...day,
          habits: done ? day.habits.filter((h) => h !== habitId) : [...day.habits, habitId],
        },
      },
    };
  });
}

export function setNotes(date: string, notes: string) {
  update((d) => {
    const day = { ...emptyDay(), ...(d.days[date] ?? {}) };
    return { ...d, days: { ...d.days, [date]: { ...day, notes } } };
  });
}

export function toggleFavorite(foodId: string) {
  update((d) => ({
    ...d,
    favorites: d.favorites.includes(foodId)
      ? d.favorites.filter((f) => f !== foodId)
      : [...d.favorites, foodId],
  }));
}

export function sleepHoursBetween(bedtime: string, wake: string) {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

/** Keeps the page in sync when another tab edits the same storage. */
export function useCrossTabSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = null;
        listeners.forEach((l) => l());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
