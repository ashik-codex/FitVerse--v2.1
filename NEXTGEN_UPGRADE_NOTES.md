# FitVerse 1.2 Upgrade Notes

## Main fixes

- The current page is now stored in the URL hash and LocalStorage.
- Refreshing Smart Coach, Settings, Challenges, Analytics or any other page keeps the same page open.
- Sidebar still closes with the X button, outside click, Escape key and after choosing a page on mobile.
- Scrollbars remain hidden while scrolling continues to work.
- Global text, buttons, cards and form controls use a more readable size.

## Exercise system

- Expanded exercise library with 46 real exercise entries.
- Every exercise includes:
  - animated movement cue
  - primary and secondary muscles
  - use and benefit
  - best-use case
  - step-by-step method
  - common mistakes
  - FitVerse effectiveness rating
  - smart replacement options
- Replacement suggestions are scored using muscle, movement pattern, difficulty, equipment and location.
- Every exercise has replacement results, not only the first few exercises.
- Live Workout now shows animation, purpose, muscles, method and replacement reason.
- Rest timer now counts down after a completed set.

## Dynamic features

- Added a dedicated Analytics page.
- Workout count, training time, volume, rating, muscle frequency, nutrition and weight trend update from user logs.
- Challenge progress updates automatically from workouts, water, protein and total volume.
- Completing a workout updates history, analytics, habits and challenges.
- Logging weight, food or water immediately updates related cards and charts.

## Dashboard

- Rebuilt with simpler language and clearer sections.
- Reduced marketing-style text and unnecessary visual buildup.
- Added clear daily targets, today’s workout, recent sessions and quick actions.

## Quality verification

- `npm run lint` passed with zero warnings.
- `npm run build` passed.
- `npm audit` reported zero vulnerabilities.

FitVerse remains a frontend-only educational prototype. Data is stored in LocalStorage and the exercise animation is a simplified form cue, not a replacement for qualified in-person coaching.
