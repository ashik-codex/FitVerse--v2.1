# FitVerse v2.0 — Exercise Image Sync Rebuild

## Main fix
- Replacement exercises now use a unique exercise/media identity.
- Hammer Curl and EZ-Bar Curl no longer share the same local photo files.
- The image guide remounts immediately when Next, Previous, queue selection, or Replace changes the current exercise.
- Old `fitverse_active_workout` data is not reused; v2.0 uses a clean `fitverse_active_workout_v2` key.

## Cache fix
- Development mode unregisters old service workers and clears legacy FitVerse caches.
- Production uses a new v2.0 cache and network-first exercise image strategy.
- Local photo URLs contain a v2.0 revision query to prevent stale image reuse.

## Source ID corrections
- Chest Press → Machine_Bench_Press
- Machine Shoulder Press → Machine_Shoulder_Military_Press
- Reverse Lunge → Dumbbell_Rear_Lunge
- Bird Dog fallback → Superman source photo set
