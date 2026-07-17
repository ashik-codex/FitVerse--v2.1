const CACHE_NAME = "fitverse-v2-1-workout-builder";
const CORE_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './exercise-media/Alternate_Hammer_Curl/0.jpg',
  './exercise-media/Alternate_Hammer_Curl/1.jpg',
  './exercise-media/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench/0.jpg',
  './exercise-media/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench/1.jpg',
  './exercise-media/Bent_Over_Two-Dumbbell_Row/0.jpg',
  './exercise-media/Bent_Over_Two-Dumbbell_Row/1.jpg',
  './exercise-media/Bird_Dog/0.jpg',
  './exercise-media/Bird_Dog/1.jpg',
  './exercise-media/Bodyweight_Squat/0.jpg',
  './exercise-media/Bodyweight_Squat/1.jpg',
  './exercise-media/Butterfly/0.jpg',
  './exercise-media/Butterfly/1.jpg',
  './exercise-media/Cable_Crossover/0.jpg',
  './exercise-media/Cable_Crossover/1.jpg',
  './exercise-media/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg',
  './exercise-media/Cable_Hammer_Curls_-_Rope_Attachment/1.jpg',
  './exercise-media/Cable_Rope_Overhead_Triceps_Extension/0.jpg',
  './exercise-media/Cable_Rope_Overhead_Triceps_Extension/1.jpg',
  './exercise-media/Cable_Seated_Lateral_Raise/0.jpg',
  './exercise-media/Cable_Seated_Lateral_Raise/1.jpg',
  './exercise-media/Calf_Raise_On_A_Dumbbell/0.jpg',
  './exercise-media/Calf_Raise_On_A_Dumbbell/1.jpg',
  './exercise-media/Chest_Press/0.jpg',
  './exercise-media/Chest_Press/1.jpg',
  './exercise-media/Dead_Bug/0.jpg',
  './exercise-media/Dead_Bug/1.jpg',
  './exercise-media/Dips_-_Triceps_Version/0.jpg',
  './exercise-media/Dips_-_Triceps_Version/1.jpg',
  './exercise-media/Dumbbell_Flyes/0.jpg',
  './exercise-media/Dumbbell_Flyes/1.jpg',
  './exercise-media/Dumbbell_Rear_Lunge/0.jpg',
  './exercise-media/Dumbbell_Rear_Lunge/1.jpg',
  './exercise-media/Dumbbell_Step_Ups/0.jpg',
  './exercise-media/Dumbbell_Step_Ups/1.jpg',
  './exercise-media/EZ-Bar_Curl/0.jpg',
  './exercise-media/EZ-Bar_Curl/1.jpg',
  './exercise-media/Face_Pull/0.jpg',
  './exercise-media/Face_Pull/1.jpg',
  './exercise-media/Goblet_Squat/0.jpg',
  './exercise-media/Goblet_Squat/1.jpg',
  './exercise-media/Hack_Squat/0.jpg',
  './exercise-media/Hack_Squat/1.jpg',
  './exercise-media/Incline_Dumbbell_Press/0.jpg',
  './exercise-media/Incline_Dumbbell_Press/1.jpg',
  './exercise-media/Incline_Push-Up/0.jpg',
  './exercise-media/Incline_Push-Up/1.jpg',
  './exercise-media/Inverted_Row/0.jpg',
  './exercise-media/Inverted_Row/1.jpg',
  './exercise-media/Lateral_Raise_-_With_Bands/0.jpg',
  './exercise-media/Lateral_Raise_-_With_Bands/1.jpg',
  './exercise-media/Leg_Press/0.jpg',
  './exercise-media/Leg_Press/1.jpg',
  './exercise-media/Machine_Bench_Press/0.jpg',
  './exercise-media/Machine_Bench_Press/1.jpg',
  './exercise-media/Machine_Shoulder_(Military)_Press/0.jpg',
  './exercise-media/Machine_Shoulder_(Military)_Press/1.jpg',
  './exercise-media/Machine_Shoulder_Military_Press/0.jpg',
  './exercise-media/Machine_Shoulder_Military_Press/1.jpg',
  './exercise-media/One-Arm_Dumbbell_Row/0.jpg',
  './exercise-media/One-Arm_Dumbbell_Row/1.jpg',
  './exercise-media/Plank/0.jpg',
  './exercise-media/Plank/1.jpg',
  './exercise-media/Pull_Through/0.jpg',
  './exercise-media/Pull_Through/1.jpg',
  './exercise-media/Pullups/0.jpg',
  './exercise-media/Pullups/1.jpg',
  './exercise-media/Pushups/0.jpg',
  './exercise-media/Pushups/1.jpg',
  './exercise-media/Reverse_Lunge/0.jpg',
  './exercise-media/Reverse_Lunge/1.jpg',
  './exercise-media/Reverse_Machine_Flyes/0.jpg',
  './exercise-media/Reverse_Machine_Flyes/1.jpg',
  './exercise-media/Romanian_Deadlift/0.jpg',
  './exercise-media/Romanian_Deadlift/1.jpg',
  './exercise-media/Seated_Cable_Rows/0.jpg',
  './exercise-media/Seated_Cable_Rows/1.jpg',
  './exercise-media/Seated_Calf_Raise/0.jpg',
  './exercise-media/Seated_Calf_Raise/1.jpg',
  './exercise-media/Seated_Leg_Curl/0.jpg',
  './exercise-media/Seated_Leg_Curl/1.jpg',
  './exercise-media/Side_Lateral_Raise/0.jpg',
  './exercise-media/Side_Lateral_Raise/1.jpg',
  './exercise-media/Smith_Machine_Incline_Bench_Press/0.jpg',
  './exercise-media/Smith_Machine_Incline_Bench_Press/1.jpg',
  './exercise-media/Split_Squat_with_Dumbbells/0.jpg',
  './exercise-media/Split_Squat_with_Dumbbells/1.jpg',
  './exercise-media/Standing_Calf_Raises/0.jpg',
  './exercise-media/Standing_Calf_Raises/1.jpg',
  './exercise-media/Straight-Arm_Pulldown/0.jpg',
  './exercise-media/Straight-Arm_Pulldown/1.jpg',
  './exercise-media/Superman/0.jpg',
  './exercise-media/Superman/1.jpg',
  './exercise-media/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
  './exercise-media/Triceps_Pushdown_-_Rope_Attachment/1.jpg',
  './exercise-media/V-Bar_Pulldown/0.jpg',
  './exercise-media/V-Bar_Pulldown/1.jpg',
  './exercise-media/Wide-Grip_Lat_Pulldown/0.jpg',
  './exercise-media/Wide-Grip_Lat_Pulldown/1.jpg',
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isExercisePhoto = url.pathname.includes("/exercise-media/") || url.hostname === "raw.githubusercontent.com";
  const isPage = event.request.mode === "navigate";

  if (isExercisePhoto || isPage) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && (response.ok || response.type === "opaque")) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
