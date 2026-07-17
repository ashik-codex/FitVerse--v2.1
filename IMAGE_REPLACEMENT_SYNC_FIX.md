# Exercise Replacement Image Sync Fix — v1.7

The Live Workout photo guide now changes immediately when an exercise is replaced.

Example:
- Hammer Curl uses `Alternate_Hammer_Curl` photos.
- Replacing it with EZ-bar Curl immediately switches to `EZ-Bar_Curl` photos.

Fixes included:
- Every exercise resolves photos by its unique exercise ID, not only by movement type.
- The photo guide remounts whenever the exercise ID or replacement timestamp changes.
- Image fallback state resets when an exercise changes.
- Replacement thumbnails use each replacement's own local offline photos.
- The service-worker cache version was changed so older image mappings are removed.
- All exercise photos remain available offline.
