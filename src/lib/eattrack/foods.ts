import type { FoodItem } from "./types";

const f = (
  id: string,
  name: string,
  serving: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
): FoodItem => ({ id, name, serving, kcal, protein, carbs, fat });

export const STARTER_FOODS: FoodItem[] = [
  // Staples
  f("white-rice", "White Rice (cooked)", "100 g", 130, 2.7, 28, 0.3),
  f("brown-rice", "Brown Rice (cooked)", "100 g", 112, 2.6, 24, 0.9),
  f("nasi-uduk", "Nasi Uduk", "1 plate (200 g)", 344, 6, 52, 12),
  f("white-bread", "White Bread", "1 slice (30 g)", 79, 2.7, 15, 1),
  f("whole-wheat-bread", "Whole Wheat Bread", "1 slice (32 g)", 82, 4, 14, 1.1),
  f("oatmeal", "Oatmeal (cooked)", "1 bowl (234 g)", 158, 6, 27, 3.2),
  f("instant-noodles", "Instant Noodles", "1 pack (85 g)", 380, 8, 54, 14),
  f("bihun-goreng", "Bihun Goreng", "1 plate (180 g)", 320, 8, 48, 10),
  f("mie-ayam", "Mie Ayam", "1 bowl", 450, 20, 60, 14),
  f("potato", "Boiled Potato", "100 g", 87, 1.9, 20, 0.1),
  f("sweet-potato", "Sweet Potato (boiled)", "100 g", 86, 1.6, 20, 0.1),

  // Protein
  f("chicken-breast", "Chicken Breast (grilled)", "100 g", 165, 31, 0, 3.6),
  f("chicken-thigh", "Chicken Thigh (skinless)", "100 g", 209, 26, 0, 11),
  f("ayam-goreng", "Ayam Goreng", "1 piece (120 g)", 290, 24, 8, 18),
  f("beef", "Beef (lean, cooked)", "100 g", 250, 26, 0, 15),
  f("rendang", "Rendang Daging", "1 serving (100 g)", 285, 22, 6, 19),
  f("fish", "White Fish (grilled)", "100 g", 105, 22, 0, 1.5),
  f("salmon", "Salmon (grilled)", "100 g", 208, 20, 0, 13),
  f("ikan-bakar", "Ikan Bakar", "1 piece (150 g)", 210, 33, 2, 7),
  f("egg", "Egg (boiled)", "1 large (50 g)", 78, 6.3, 0.6, 5.3),
  f("telur-dadar", "Telur Dadar", "1 omelette (60 g)", 125, 8, 1, 10),
  f("tofu", "Tofu (tahu)", "100 g", 76, 8, 1.9, 4.8),
  f("tempeh", "Tempeh", "100 g", 193, 19, 9, 11),
  f("shrimp", "Shrimp (cooked)", "100 g", 99, 24, 0.2, 0.3),
  f("peanuts", "Peanuts", "30 g", 170, 7, 6, 15),

  // Indonesian dishes
  f("nasi-goreng", "Nasi Goreng", "1 plate (250 g)", 420, 12, 60, 14),
  f("gado-gado", "Gado-Gado", "1 plate", 360, 14, 32, 20),
  f("soto-ayam", "Soto Ayam", "1 bowl", 312, 22, 20, 15),
  f("bakso", "Bakso", "1 bowl", 290, 18, 26, 12),
  f("sate-ayam", "Sate Ayam", "5 skewers", 320, 28, 12, 18),
  f("pecel-lele", "Pecel Lele", "1 serving", 380, 26, 14, 24),
  f("martabak-manis", "Martabak Manis", "1 slice", 300, 6, 40, 13),
  f("pisang-goreng", "Pisang Goreng", "1 piece", 150, 1.5, 22, 6),
  f("kerupuk", "Kerupuk", "3 pieces", 90, 1, 11, 5),

  // Vegetables
  f("broccoli", "Broccoli (steamed)", "100 g", 35, 2.4, 7, 0.4),
  f("spinach", "Spinach (cooked)", "100 g", 23, 2.9, 3.6, 0.4),
  f("kangkung", "Kangkung Tumis", "100 g", 98, 3, 6, 7),
  f("carrot", "Carrot", "100 g", 41, 0.9, 10, 0.2),
  f("cucumber", "Cucumber", "100 g", 15, 0.7, 3.6, 0.1),
  f("tomato", "Tomato", "100 g", 18, 0.9, 3.9, 0.2),
  f("mixed-salad", "Mixed Salad (no dressing)", "1 bowl (150 g)", 33, 2, 6, 0.4),

  // Fruits
  f("banana", "Banana", "1 medium (118 g)", 105, 1.3, 27, 0.4),
  f("apple", "Apple", "1 medium (182 g)", 95, 0.5, 25, 0.3),
  f("orange", "Orange", "1 medium (131 g)", 62, 1.2, 15, 0.2),
  f("papaya", "Papaya", "100 g", 43, 0.5, 11, 0.3),
  f("mango", "Mango", "100 g", 60, 0.8, 15, 0.4),
  f("watermelon", "Watermelon", "100 g", 30, 0.6, 8, 0.2),
  f("avocado", "Avocado", "1/2 fruit (100 g)", 160, 2, 9, 15),

  // Dairy & drinks
  f("milk", "Milk (full cream)", "250 ml", 150, 8, 12, 8),
  f("skim-milk", "Milk (skim)", "250 ml", 83, 8, 12, 0.2),
  f("yogurt", "Plain Yogurt", "170 g", 100, 10, 8, 3),
  f("cheese", "Cheddar Cheese", "30 g", 120, 7, 0.4, 10),
  f("coffee-black", "Coffee (black)", "1 cup (240 ml)", 2, 0.3, 0, 0),
  f("kopi-susu", "Kopi Susu", "1 glass (250 ml)", 145, 4, 20, 5),
  f("teh-manis", "Teh Manis", "1 glass (250 ml)", 90, 0, 23, 0),
  f("orange-juice", "Orange Juice", "250 ml", 112, 1.7, 26, 0.5),
  f("soft-drink", "Soft Drink", "330 ml", 139, 0, 35, 0),

  // Extras
  f("olive-oil", "Olive Oil", "1 tbsp (14 g)", 119, 0, 0, 14),
  f("sugar", "Sugar", "1 tsp (4 g)", 16, 0, 4, 0),
  f("dark-chocolate", "Dark Chocolate", "30 g", 170, 2, 13, 12),
  f("biscuit", "Biscuit", "2 pieces", 140, 2, 20, 6),
];
