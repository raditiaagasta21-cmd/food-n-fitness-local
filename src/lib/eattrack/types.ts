export type MealSlot =
  | "breakfast"
  | "morning-snack"
  | "lunch"
  | "afternoon-snack"
  | "dinner"
  | "evening-snack";

export const MEAL_SLOTS: { id: MealSlot; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "morning-snack", label: "Morning Snack" },
  { id: "lunch", label: "Lunch" },
  { id: "afternoon-snack", label: "Afternoon Snack" },
  { id: "dinner", label: "Dinner" },
  { id: "evening-snack", label: "Evening Snack" },
];

export type FoodItem = {
  id: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  custom?: boolean;
};

export type FoodEntry = {
  id: string;
  foodId?: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  qty: number;
  meal: MealSlot;
};

export type ExerciseEntry = {
  id: string;
  activity: string;
  minutes: number;
  kcal?: number;
  notes?: string;
};

export type SleepEntry = {
  bedtime: string;
  wake: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
};

export type DayEntry = {
  foods: FoodEntry[];
  waterMl: number;
  weightKg?: number;
  sleep?: SleepEntry;
  exercise: ExerciseEntry[];
  habits: string[];
  notes: string;
};

export type Habit = {
  id: string;
  name: string;
  icon?: string;
  archived?: boolean;
};

export type SavedMeal = {
  id: string;
  name: string;
  items: Omit<FoodEntry, "id" | "meal">[];
};

export type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  sleepHours: number;
  exerciseMin: number;
  goalWeightKg: number;
  startWeightKg: number;
};

export type Profile = {
  name: string;
  sex: "male" | "female" | "other";
  heightCm: number;
  birthYear: number;
};

export type Settings = {
  waterStepMl: number;
  firstDayOfWeek: 0 | 1;
};

export type AppData = {
  version: 1;
  profile: Profile;
  goals: Goals;
  customFoods: FoodItem[];
  favorites: string[];
  recents: string[];
  savedMeals: SavedMeal[];
  habits: Habit[];
  days: Record<string, DayEntry>;
  settings: Settings;
};
