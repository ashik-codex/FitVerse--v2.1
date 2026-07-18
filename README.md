# FitVerse v2.1 — Open-Source Exercise Photo Guide

FitVerse is a clear, modern frontend fitness prototype built with React and Vite. It helps users plan workouts, understand exercise form, replace unavailable exercises, track nutrition, review analytics and monitor progress.

## Main features

- Simple daily dashboard with automatically updated data
- Weekly workout planner and custom workout creation
- Live workout mode with set tracking and countdown rest timer
- 46-exercise library with real human start/working-position photos
- Step-by-step form, target muscles, benefits and common mistakes
- Smart replacement suggestions for every exercise
- FitVerse effectiveness comparison and best-use explanation
- Nutrition, calories, macros and water tracking
- Weight, measurements and progress-photo tracking
- Dynamic analytics for volume, workout duration, muscle frequency and nutrition
- Automatically updated fitness challenges
- Workout history and rule-based Smart Coach
- Refresh-safe hash navigation
- Dark/light themes, readable typography and responsive design
- LocalStorage persistence, JSON backup/import and GitHub Pages workflow

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
npm audit
```

## Important note

FitVerse is a frontend educational prototype. It does not provide medical diagnosis and is not a replacement for professional medical, training or nutrition advice. Data is saved only in the current browser through LocalStorage. Exercise photos come from the public-domain Free Exercise DB. The app is educational and is not a replacement for qualified coaching.


## v2.0 replacement-image rebuild

- Uses a unique media identity for every active exercise.
- Replacing Hammer Curl with EZ-Bar Curl immediately changes both the title and photos.
- Next, Previous and workout-queue navigation refresh photos without a page reload.
- Development mode removes old FitVerse service workers and stale caches automatically.
- `npm run verify:media` confirms the curl replacement photos are distinct local files.
