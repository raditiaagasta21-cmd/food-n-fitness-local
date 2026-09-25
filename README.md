# My Daily Track

Build a complete mobile-first app called EatTrack.

EatTrack is a simple offline-first personal food, calorie, and healthy lifestyle tracker.

Core requirements

Mobile-first Android-friendly UI

Offline-first

Use localStorage for ALL user data

No backend, Supabase, Firebase, authentication, AI, or external APIs

Simple architecture, no over-engineering

Must work fully without internet

Must be compatible with Capacitor and exportable to Android Studio

Use standard Vite build with dist/index.html

npm run build must work successfully

Bottom navigation

Today | Food | Progress | Habits | More

Today

Create a clean daily dashboard showing:

Calories consumed / daily target

Protein, carbs, fat

Water / daily target

Current weight

Sleep duration

Exercise duration

Habit completion

Add quick actions:

+ Food | + Water | + Weight | + Exercise | + Sleep

Food

Create an offline food tracker with:

Breakfast

Morning Snack

Lunch

Afternoon Snack

Dinner

Evening Snack

Each food stores:

Name

Serving size

Calories

Protein

Carbs

Fat

Quantity

Automatically calculate nutrition based on quantity.

Include a small starter food database with common foods such as rice, bread, oatmeal, chicken, beef, fish, egg, tofu, tempeh, vegetables, fruits, milk, coffee, and several common Indonesian foods.

Users can:

Search foods

Add custom foods

Favorite foods

See recent foods

Create reusable saved meals

Water

Track daily water intake with quick buttons:

+250 ml | +500 ml | +750 ml

Allow users to set their daily water goal.

Weight

Track weight by date and show:

Starting weight

Current weight

Goal weight

Weight change

Simple weight history chart

Sleep

Track:

Bedtime

Wake time

Sleep duration

Sleep quality

Exercise

Track:

Activity

Duration

Optional calories

Notes

Examples: walking, running, cycling, gym, swimming, sports.

Habits

Include customizable habits such as:

Drink enough water

Eat vegetables

Eat fruit

Exercise

Sleep 7+ hours

Avoid sugary drinks

Users can add, edit, delete, and complete habits.

Progress

Show simple offline charts and summaries for:

Weight

Calories

Water

Sleep

Exercise

Habit completion

Time filters:

7 days | 30 days | 90 days | All

Goals

Allow users to set:

Daily calorie target

Protein target

Carb target

Fat target

Water target

Sleep target

Exercise target

Goal weight

History

Allow users to view previous dates and their:

food, calories, water, weight, sleep, exercise, habits, and notes.

More

Include:

Profile

Goals

Saved Meals

Food Database

Settings

Export Data

Import Data

Reset Data

About

Export/import all local data as JSON.

Data

Use localStorage with simple structured objects for:

profile, goals, foods, meals, weight, water, sleep, exercise, habits, notes, and settings.

Data must persist after refresh and app restart.

Design

Clean, modern, friendly health/wellness design. Green/teal accent, cards, progress bars, clear typography, large touch targets, simple bottom navigation.

Do NOT add social features, AI, cloud sync, accounts, subscriptions, medical diagnosis, or unnecessary features.

Prioritize working functionality, local persistence, mobile UX, and Capacitor/Android Studio compatibility over visual complexity.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://food-n-fitness-local.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f017890-6fef-458a-bb25-e2b4769783b4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
