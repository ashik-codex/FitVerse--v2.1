const movementGuides = {
  press: {
    animation: "press",
    steps: [
      "Set the shoulders down and back, then brace the core.",
      "Lower the weight with control until you reach a comfortable depth.",
      "Press smoothly while keeping the wrists and elbows aligned.",
    ],
  },
  "vertical-pull": {
    animation: "pull",
    steps: [
      "Start tall with the ribs controlled and shoulders away from the ears.",
      "Drive the elbows down instead of pulling only with the hands.",
      "Pause briefly, then return to a full controlled stretch.",
    ],
  },
  "horizontal-pull": {
    animation: "row",
    steps: [
      "Keep the chest stable and begin with the shoulder blades reaching forward.",
      "Pull the elbows toward the hips without shrugging.",
      "Squeeze the upper back, then return slowly.",
    ],
  },
  squat: {
    animation: "squat",
    steps: [
      "Set the feet firmly and keep the whole foot in contact with the floor.",
      "Sit down between the hips while the knees track over the toes.",
      "Drive through the floor and stand tall without snapping the knees.",
    ],
  },
  lunge: {
    animation: "lunge",
    steps: [
      "Use a stable stance and keep the front foot flat.",
      "Lower the hips straight down with the torso controlled.",
      "Push through the front leg and finish balanced.",
    ],
  },
  hinge: {
    animation: "hinge",
    steps: [
      "Soften the knees and brace the abdomen.",
      "Push the hips backward while keeping the spine neutral.",
      "Squeeze the glutes to return without leaning backward.",
    ],
  },
  "lateral-raise": {
    animation: "raise",
    steps: [
      "Keep a soft bend in the elbow and the shoulders relaxed.",
      "Raise the arms slightly forward until about shoulder height.",
      "Lower slowly and avoid swinging the torso.",
    ],
  },
  curl: {
    animation: "curl",
    steps: [
      "Keep the elbows close to the body and wrists neutral.",
      "Curl without moving the upper arm forward.",
      "Squeeze briefly and lower under control.",
    ],
  },
  pushdown: {
    animation: "pushdown",
    steps: [
      "Fix the elbows beside the torso and keep the shoulders relaxed.",
      "Extend the elbows fully without moving the upper arms.",
      "Return slowly until the forearms are just above parallel.",
    ],
  },
  extension: {
    animation: "extension",
    steps: [
      "Brace the core and keep the elbows pointing forward.",
      "Lower the handle behind the head with control.",
      "Extend the elbows while keeping the upper arms steady.",
    ],
  },
  fly: {
    animation: "fly",
    steps: [
      "Keep a small bend in the elbows and the chest lifted.",
      "Open only as far as the shoulders remain comfortable.",
      "Bring the arms together by squeezing the target muscles.",
    ],
  },
  "rear-fly": {
    animation: "rear-fly",
    steps: [
      "Keep the chest supported or torso stable.",
      "Move the arms outward with the elbows slightly bent.",
      "Pause when the rear shoulders and upper back contract.",
    ],
  },
  brace: {
    animation: "core",
    steps: [
      "Set a neutral spine and breathe into the sides of the waist.",
      "Brace as if preparing for a gentle punch.",
      "Hold or move slowly without letting the lower back change position.",
    ],
  },
  calf: {
    animation: "calf",
    steps: [
      "Use a stable support and keep the ankles aligned.",
      "Lower into a comfortable calf stretch.",
      "Rise onto the toes, pause, and lower slowly.",
    ],
  },
  "knee-flexion": {
    animation: "leg-curl",
    steps: [
      "Align the machine pivot with the knee and keep the hips down.",
      "Curl the heels toward the body without lifting the hips.",
      "Pause, then extend the knees slowly.",
    ],
  },
};

function makeExercise(data) {
  const guide = movementGuides[data.movement] || movementGuides.press;
  return {
    secondary: [],
    difficulty: "Beginner",
    location: "Gym",
    type: "Compound",
    sets: 3,
    reps: "10-12",
    rest: 75,
    calories: 40,
    color: "#8b5cf6",
    effectiveness: 8.5,
    alternativeIds: [],
    ...guide,
    ...data,
  };
}

export const exercises = [
  makeExercise({ id: 1, name: "Incline Dumbbell Press", muscle: "Chest", secondary: ["Front Delts", "Triceps"], equipment: "Dumbbells", movement: "press", sets: 4, reps: "8-12", rest: 90, calories: 55, color: "#8b5cf6", effectiveness: 9.2, bestFor: "Upper-chest strength and muscle gain", benefit: "Builds the upper chest while allowing each arm to move naturally.", whyEffective: "It offers a long range of motion, easy load progression and good left-to-right balance.", form: "Keep the shoulder blades pulled back, lower slowly and press without bouncing.", mistakes: "Elbows flaring too wide, shoulders rolling forward, lifting the hips.", alternativeIds: [17, 18, 15, 19] }),
  makeExercise({ id: 2, name: "Lat Pulldown", muscle: "Back", secondary: ["Biceps", "Rear Delts"], equipment: "Cable", movement: "vertical-pull", sets: 4, reps: "10-12", rest: 75, calories: 48, color: "#22d3ee", effectiveness: 9.0, bestFor: "Building back width with controlled resistance", benefit: "Trains the lats and teaches the pulling pattern needed for pull-ups.", whyEffective: "The cable keeps tension through the full movement and is easy to scale for beginners.", form: "Pull toward the upper chest with a stable torso and lifted chest.", mistakes: "Swinging backward, pulling behind the neck, using momentum.", alternativeIds: [16, 39, 40] }),
  makeExercise({ id: 3, name: "Goblet Squat", muscle: "Legs", secondary: ["Glutes", "Core"], equipment: "Dumbbell", location: "Gym/Home", movement: "squat", sets: 4, reps: "10-15", rest: 90, calories: 72, color: "#f97316", effectiveness: 8.8, bestFor: "Learning a safe squat pattern", benefit: "Develops the quads and glutes while the front-held load helps posture.", whyEffective: "It is simple to learn, easy to control and gives clear feedback on balance.", form: "Hold the weight close, sit between the hips and keep knees tracking over toes.", mistakes: "Knees collapsing inward, heels lifting, rounding the back.", alternativeIds: [7, 27, 41] }),
  makeExercise({ id: 4, name: "Cable Lateral Raise", muscle: "Shoulders", secondary: ["Upper Traps"], equipment: "Cable", movement: "lateral-raise", type: "Isolation", sets: 3, reps: "12-15", rest: 60, calories: 28, color: "#ec4899", effectiveness: 9.1, bestFor: "Side-delt development", benefit: "Adds shoulder width by keeping tension on the side delts.", whyEffective: "The cable maintains resistance from the start to the top of the rep.", form: "Raise slightly forward to shoulder height with a soft elbow.", mistakes: "Shrugging, swinging the torso, lifting too high.", alternativeIds: [23, 24, 45] }),
  makeExercise({ id: 5, name: "Romanian Deadlift", muscle: "Hamstrings", secondary: ["Glutes", "Lower Back"], equipment: "Barbell", difficulty: "Intermediate", movement: "hinge", sets: 4, reps: "8-10", rest: 120, calories: 80, color: "#84cc16", effectiveness: 9.4, bestFor: "Hamstring and glute strength", benefit: "Loads the hip-hinge pattern and develops the full posterior chain.", whyEffective: "It creates high tension at long muscle lengths and is easy to progressively overload.", form: "Push the hips backward with a neutral spine and keep the bar close.", mistakes: "Squatting the movement, rounding the back, bar drifting forward.", alternativeIds: [26, 25] }),
  makeExercise({ id: 6, name: "Chest-supported Row", muscle: "Back", secondary: ["Biceps", "Rear Delts"], equipment: "Machine", movement: "horizontal-pull", sets: 4, reps: "8-12", rest: 75, calories: 50, color: "#06b6d4", effectiveness: 9.2, bestFor: "Upper-back thickness without lower-back fatigue", benefit: "Builds the mid-back while the chest support reduces body momentum.", whyEffective: "The stable setup lets you focus on pulling with the back and use consistent technique.", form: "Keep the chest on the pad and pull the elbows toward the hips.", mistakes: "Lifting the chest off the pad, shrugging, shortening the range.", alternativeIds: [20, 21, 46] }),
  makeExercise({ id: 7, name: "Leg Press", muscle: "Quads", secondary: ["Glutes", "Hamstrings"], equipment: "Machine", movement: "squat", sets: 4, reps: "10-15", rest: 90, calories: 68, color: "#eab308", effectiveness: 9.0, bestFor: "Quad strength with strong external support", benefit: "Lets you train the legs hard while the machine supports balance.", whyEffective: "It is highly stable, easy to load and suitable for controlled high-rep work.", form: "Lower with control, keep the lower back on the pad and knees aligned.", mistakes: "Locking the knees, excessive depth, knees collapsing inward.", alternativeIds: [27, 3, 41] }),
  makeExercise({ id: 8, name: "Hammer Curl", muscle: "Biceps", secondary: ["Forearms"], equipment: "Dumbbells", location: "Gym/Home", movement: "curl", type: "Isolation", sets: 3, reps: "10-14", rest: 60, calories: 24, color: "#a855f7", effectiveness: 8.7, bestFor: "Biceps and forearm thickness", benefit: "Trains the elbow flexors with a wrist-friendly neutral grip.", whyEffective: "The neutral grip strongly involves the brachialis, which can add arm thickness.", form: "Keep elbows beside the body and curl without rotating the wrists.", mistakes: "Swinging, elbows moving forward, dropping too fast.", alternativeIds: [29, 30] }),
  makeExercise({ id: 9, name: "Rope Pushdown", muscle: "Triceps", secondary: ["Forearms"], equipment: "Cable", movement: "pushdown", type: "Isolation", sets: 3, reps: "10-15", rest: 60, calories: 25, color: "#ef4444", effectiveness: 8.9, bestFor: "Controlled triceps volume", benefit: "Builds the triceps with continuous cable tension and simple technique.", whyEffective: "It is joint-friendly, easy to progress and allows a strong contraction at the bottom.", form: "Keep the elbows fixed and separate the rope at the bottom.", mistakes: "Using the shoulders, leaning excessively, moving the elbows.", alternativeIds: [31, 32] }),
  makeExercise({ id: 10, name: "Bulgarian Split Squat", muscle: "Legs", secondary: ["Glutes", "Core"], equipment: "Dumbbells", location: "Gym/Home", difficulty: "Intermediate", movement: "lunge", sets: 3, reps: "8-12 / leg", rest: 90, calories: 76, color: "#fb7185", effectiveness: 9.3, bestFor: "Single-leg strength and balance", benefit: "Challenges the quads and glutes one leg at a time.", whyEffective: "It provides a large range of motion and exposes left-to-right strength differences.", form: "Keep the front foot stable, lower straight down and drive through the whole foot.", mistakes: "Front heel lifting, unstable stance, pushing mainly from the rear leg.", alternativeIds: [28, 42, 7] }),
  makeExercise({ id: 11, name: "Pec Deck Fly", muscle: "Chest", secondary: ["Front Delts"], equipment: "Machine", movement: "fly", type: "Isolation", sets: 3, reps: "12-15", rest: 60, calories: 30, color: "#c084fc", effectiveness: 8.8, bestFor: "Chest isolation after pressing", benefit: "Trains the chest through horizontal adduction with strong stability.", whyEffective: "The machine removes balance demands and makes the chest contraction easy to feel.", form: "Keep the shoulders down and squeeze without slamming the handles.", mistakes: "Overstretching, shrugging, moving too fast.", alternativeIds: [33, 34] }),
  makeExercise({ id: 12, name: "Face Pull", muscle: "Rear Delts", secondary: ["Upper Back", "Rotator Cuff"], equipment: "Cable", movement: "rear-fly", type: "Isolation", sets: 3, reps: "12-20", rest: 60, calories: 26, color: "#38bdf8", effectiveness: 8.9, bestFor: "Rear shoulders and upper-back control", benefit: "Strengthens the rear delts and external rotators used for shoulder balance.", whyEffective: "It combines rowing and external rotation with adjustable cable resistance.", form: "Pull toward the forehead and rotate the hands apart.", mistakes: "Pulling too low, shrugging, using excessive weight.", alternativeIds: [22, 43] }),
  makeExercise({ id: 13, name: "Plank", muscle: "Core", secondary: ["Shoulders", "Glutes"], equipment: "Bodyweight", location: "Home/Gym", movement: "brace", type: "Stability", sets: 3, reps: "30-60 sec", rest: 45, calories: 20, color: "#14b8a6", effectiveness: 8.6, bestFor: "Basic trunk stability", benefit: "Teaches the core to resist extension while the whole body stays aligned.", whyEffective: "It is simple, scalable and requires no equipment.", form: "Create a straight line from head to heels and brace firmly.", mistakes: "Hips sagging, holding the breath, looking forward.", alternativeIds: [35, 36, 44] }),
  makeExercise({ id: 14, name: "Standing Calf Raise", muscle: "Calves", equipment: "Machine", location: "Gym/Home", movement: "calf", type: "Isolation", sets: 4, reps: "12-20", rest: 45, calories: 24, color: "#f59e0b", effectiveness: 8.7, bestFor: "Gastrocnemius calf development", benefit: "Builds calf strength using a full ankle range of motion.", whyEffective: "The straight-knee position emphasizes the larger upper calf muscle.", form: "Use a full stretch at the bottom and pause at the top.", mistakes: "Bouncing, using a short range, rolling the ankles outward.", alternativeIds: [37, 38] }),
  makeExercise({ id: 15, name: "Push-up", muscle: "Chest", secondary: ["Triceps", "Shoulders", "Core"], equipment: "Bodyweight", location: "Home/Gym", movement: "press", sets: 4, reps: "AMRAP", rest: 60, calories: 40, color: "#7c3aed", effectiveness: 8.8, bestFor: "Portable upper-body strength", benefit: "Trains pressing strength and core control without equipment.", whyEffective: "It is easy to scale, can be practiced frequently and uses a natural shoulder-blade movement.", form: "Keep the body straight and lower the chest between the hands.", mistakes: "Elbows flaring, hips sagging, partial range.", alternativeIds: [19, 17, 1] }),
  makeExercise({ id: 16, name: "Assisted Pull-up", muscle: "Back", secondary: ["Biceps", "Core"], equipment: "Machine", movement: "vertical-pull", sets: 4, reps: "6-10", rest: 90, calories: 58, color: "#0ea5e9", effectiveness: 9.1, bestFor: "Progressing toward bodyweight pull-ups", benefit: "Builds back strength through the same path as a pull-up with adjustable assistance.", whyEffective: "It closely matches the target skill and allows gradual reduction of assistance.", form: "Start from a controlled stretch and pull the chest toward the bar.", mistakes: "Swinging, half reps, shrugging at the top.", alternativeIds: [2, 39, 40] }),
  makeExercise({ id: 17, name: "Machine Chest Press", muscle: "Chest", secondary: ["Triceps", "Front Delts"], equipment: "Machine", movement: "press", sets: 4, reps: "8-12", rest: 75, calories: 50, color: "#7c3aed", effectiveness: 9.0, bestFor: "Stable chest strength and beginner progression", benefit: "Lets you focus on pressing without balancing free weights.", whyEffective: "The fixed path gives confidence and makes consistent overload easy.", form: "Set the seat so the handles align with mid-chest and press smoothly.", mistakes: "Shoulders rolling forward, locking the elbows, seat set too low.", alternativeIds: [1, 18, 15] }),
  makeExercise({ id: 18, name: "Smith Incline Press", muscle: "Chest", secondary: ["Front Delts", "Triceps"], equipment: "Smith Machine", difficulty: "Intermediate", movement: "press", sets: 4, reps: "6-10", rest: 105, calories: 58, color: "#9333ea", effectiveness: 9.2, bestFor: "Heavy upper-chest loading with extra stability", benefit: "Combines an incline press with a guided bar path.", whyEffective: "The stability allows hard sets close to failure with less balancing demand.", form: "Position the bench so the bar reaches the upper chest with forearms vertical.", mistakes: "Bench too steep, elbows too wide, bouncing the bar.", alternativeIds: [1, 17, 15] }),
  makeExercise({ id: 19, name: "Incline Push-up", muscle: "Chest", secondary: ["Triceps", "Shoulders"], equipment: "Bodyweight", location: "Home/Gym", movement: "press", sets: 3, reps: "10-20", rest: 60, calories: 30, color: "#a78bfa", effectiveness: 8.3, bestFor: "Learning push-ups with reduced load", benefit: "Builds pressing strength with an easier body angle.", whyEffective: "The height can be adjusted to match the user’s current ability.", form: "Keep the body straight and lower the chest to the support.", mistakes: "Hips bending, hands too wide, rushing the reps.", alternativeIds: [15, 17, 1] }),
  makeExercise({ id: 20, name: "Seated Cable Row", muscle: "Back", secondary: ["Biceps", "Rear Delts"], equipment: "Cable", movement: "horizontal-pull", sets: 4, reps: "10-12", rest: 75, calories: 48, color: "#0891b2", effectiveness: 9.0, bestFor: "Mid-back strength through constant tension", benefit: "Builds the lats and mid-back with a smooth cable path.", whyEffective: "The resistance remains consistent and grip options are easy to change.", form: "Sit tall, pull toward the lower ribs and avoid leaning far backward.", mistakes: "Rocking the torso, shrugging, shortening the stretch.", alternativeIds: [6, 21, 46] }),
  makeExercise({ id: 21, name: "One-arm Dumbbell Row", muscle: "Back", secondary: ["Biceps", "Core"], equipment: "Dumbbell", location: "Gym/Home", movement: "horizontal-pull", sets: 3, reps: "8-12 / side", rest: 75, calories: 46, color: "#0e7490", effectiveness: 9.1, bestFor: "Unilateral lat strength", benefit: "Trains each side independently and allows a long pulling range.", whyEffective: "It can correct side differences and is easy to load with basic equipment.", form: "Support the body, keep the spine steady and pull the elbow toward the hip.", mistakes: "Twisting excessively, shrugging, pulling toward the shoulder.", alternativeIds: [6, 20, 46] }),
  makeExercise({ id: 22, name: "Reverse Pec Deck", muscle: "Rear Delts", secondary: ["Upper Back"], equipment: "Machine", movement: "rear-fly", type: "Isolation", sets: 3, reps: "12-18", rest: 60, calories: 28, color: "#0284c7", effectiveness: 9.0, bestFor: "Stable rear-delt isolation", benefit: "Trains the rear shoulders with minimal balance demand.", whyEffective: "The machine provides a repeatable path and controlled resistance.", form: "Keep the chest on the pad and open the arms without shrugging.", mistakes: "Using too much weight, bending the elbows more during the rep, leaning back.", alternativeIds: [12, 43] }),
  makeExercise({ id: 23, name: "Dumbbell Lateral Raise", muscle: "Shoulders", secondary: ["Upper Traps"], equipment: "Dumbbells", location: "Gym/Home", movement: "lateral-raise", type: "Isolation", sets: 3, reps: "12-20", rest: 60, calories: 27, color: "#db2777", effectiveness: 8.8, bestFor: "Simple side-delt training anywhere", benefit: "Adds shoulder width with minimal equipment.", whyEffective: "It is easy to learn, inexpensive and responds well to controlled high reps.", form: "Raise slightly forward with relaxed traps and controlled tempo.", mistakes: "Swinging, leading with the hands, lifting above comfort.", alternativeIds: [4, 24, 45] }),
  makeExercise({ id: 24, name: "Machine Lateral Raise", muscle: "Shoulders", secondary: ["Upper Traps"], equipment: "Machine", movement: "lateral-raise", type: "Isolation", sets: 3, reps: "10-15", rest: 60, calories: 29, color: "#be185d", effectiveness: 9.0, bestFor: "Stable side-delt overload", benefit: "Keeps the body stable while the side delts work through a fixed path.", whyEffective: "It reduces technique variation and supports hard sets close to failure.", form: "Align the machine pivot with the shoulder and raise without shrugging.", mistakes: "Seat too high, bouncing the stack, gripping too hard.", alternativeIds: [4, 23, 45] }),
  makeExercise({ id: 25, name: "Seated Leg Curl", muscle: "Hamstrings", secondary: ["Calves"], equipment: "Machine", movement: "knee-flexion", type: "Isolation", sets: 4, reps: "10-15", rest: 75, calories: 38, color: "#65a30d", effectiveness: 9.1, bestFor: "Direct hamstring isolation", benefit: "Trains knee flexion while the seated position keeps the hamstrings lengthened.", whyEffective: "It provides stable resistance and strong tension through a long muscle length.", form: "Keep hips against the pad and curl the heels under the seat.", mistakes: "Hips lifting, fast return, poor machine alignment.", alternativeIds: [5, 26] }),
  makeExercise({ id: 26, name: "Cable Pull-through", muscle: "Glutes", secondary: ["Hamstrings", "Core"], equipment: "Cable", movement: "hinge", sets: 3, reps: "12-15", rest: 75, calories: 45, color: "#4d7c0f", effectiveness: 8.7, bestFor: "Learning the hip hinge with cable tension", benefit: "Trains the glutes without placing a bar on the back.", whyEffective: "The cable pulls the hips backward and makes the hinge direction easy to understand.", form: "Walk forward, hinge back and squeeze the glutes to stand.", mistakes: "Squatting down, overextending the back, arms pulling the rope.", alternativeIds: [5, 25] }),
  makeExercise({ id: 27, name: "Hack Squat", muscle: "Quads", secondary: ["Glutes"], equipment: "Machine", difficulty: "Intermediate", movement: "squat", sets: 4, reps: "8-12", rest: 105, calories: 72, color: "#ca8a04", effectiveness: 9.4, bestFor: "Heavy quad-focused squatting", benefit: "Loads the quads deeply while the machine supports the torso.", whyEffective: "High stability and a large knee range make it excellent for quad overload.", form: "Keep the back on the pad, descend under control and drive through the whole foot.", mistakes: "Heels lifting, knees collapsing, depth beyond control.", alternativeIds: [7, 3, 41] }),
  makeExercise({ id: 28, name: "Reverse Lunge", muscle: "Legs", secondary: ["Glutes", "Core"], equipment: "Dumbbells", location: "Gym/Home", movement: "lunge", sets: 3, reps: "10-12 / leg", rest: 75, calories: 58, color: "#f43f5e", effectiveness: 8.9, bestFor: "Knee-friendly single-leg training", benefit: "Trains the legs and balance with less forward knee momentum than a forward lunge.", whyEffective: "The backward step is often easier to control and scale.", form: "Step back, lower vertically and push through the front foot.", mistakes: "Narrow stance, front heel lifting, torso collapsing.", alternativeIds: [10, 42, 7] }),
  makeExercise({ id: 29, name: "EZ-bar Curl", muscle: "Biceps", secondary: ["Forearms"], equipment: "EZ Bar", movement: "curl", type: "Isolation", sets: 3, reps: "8-12", rest: 60, calories: 27, color: "#9333ea", effectiveness: 9.0, bestFor: "Progressive biceps loading", benefit: "Allows both arms to curl a stable load with a wrist-friendly angled grip.", whyEffective: "It is easy to track load increases and use moderate-to-heavy repetitions.", form: "Stand tall, keep elbows near the ribs and lower fully.", mistakes: "Leaning back, elbows drifting forward, cutting the bottom range.", alternativeIds: [8, 30] }),
  makeExercise({ id: 30, name: "Cable Rope Curl", muscle: "Biceps", secondary: ["Forearms"], equipment: "Cable", movement: "curl", type: "Isolation", sets: 3, reps: "10-15", rest: 60, calories: 25, color: "#7e22ce", effectiveness: 8.8, bestFor: "Constant-tension biceps work", benefit: "Keeps resistance on the biceps throughout the curl.", whyEffective: "The rope allows a comfortable wrist position and a strong top contraction.", form: "Keep elbows fixed and curl the rope toward the shoulders.", mistakes: "Shoulders moving forward, hips swinging, fast lowering.", alternativeIds: [8, 29] }),
  makeExercise({ id: 31, name: "Overhead Cable Extension", muscle: "Triceps", secondary: ["Core"], equipment: "Cable", movement: "extension", type: "Isolation", sets: 3, reps: "10-15", rest: 60, calories: 28, color: "#dc2626", effectiveness: 9.1, bestFor: "Long-head triceps development", benefit: "Trains the triceps in an overhead position where the long head is lengthened.", whyEffective: "The cable provides tension through a large range and complements pushdowns.", form: "Keep the ribs down, elbows forward and extend without moving the upper arms.", mistakes: "Back arching, elbows spreading, using momentum.", alternativeIds: [9, 32] }),
  makeExercise({ id: 32, name: "Machine Dip", muscle: "Triceps", secondary: ["Chest", "Front Delts"], equipment: "Machine", movement: "press", sets: 3, reps: "8-12", rest: 75, calories: 42, color: "#b91c1c", effectiveness: 9.0, bestFor: "Stable compound triceps loading", benefit: "Lets the triceps handle heavier loads with machine stability.", whyEffective: "It combines a compound press with controlled resistance and easy progression.", form: "Keep shoulders down and press the handles without bouncing.", mistakes: "Shrugging, leaning too far forward, locking out aggressively.", alternativeIds: [9, 31, 17] }),
  makeExercise({ id: 33, name: "Cable Fly", muscle: "Chest", secondary: ["Front Delts"], equipment: "Cable", movement: "fly", type: "Isolation", sets: 3, reps: "12-15", rest: 60, calories: 31, color: "#a855f7", effectiveness: 9.0, bestFor: "Chest tension through a customizable path", benefit: "Allows the arm path and cable height to match the user’s comfort.", whyEffective: "Cables keep tension through the full fly and provide many angle options.", form: "Use a staggered stance, keep elbows soft and bring the hands together smoothly.", mistakes: "Overstretching, pressing instead of flying, torso rocking.", alternativeIds: [11, 34] }),
  makeExercise({ id: 34, name: "Dumbbell Fly", muscle: "Chest", secondary: ["Front Delts"], equipment: "Dumbbells", movement: "fly", type: "Isolation", difficulty: "Intermediate", sets: 3, reps: "10-15", rest: 75, calories: 32, color: "#9333ea", effectiveness: 8.4, bestFor: "Chest stretch with free weights", benefit: "Trains the chest through a wide arc using basic equipment.", whyEffective: "It can provide a strong stretch, but requires careful load and shoulder control.", form: "Keep elbows softly bent and stop before the shoulders feel strained.", mistakes: "Using heavy weights, deep overstretch, turning it into a press.", alternativeIds: [11, 33] }),
  makeExercise({ id: 35, name: "Dead Bug", muscle: "Core", secondary: ["Hip Flexors"], equipment: "Bodyweight", location: "Home/Gym", movement: "brace", type: "Stability", sets: 3, reps: "8-12 / side", rest: 45, calories: 18, color: "#0d9488", effectiveness: 8.9, bestFor: "Learning core control while moving the limbs", benefit: "Teaches the abdomen to keep the lower back stable as the arms and legs move.", whyEffective: "It is low impact and provides immediate feedback if the back loses position.", form: "Press the lower back gently down and extend opposite limbs slowly.", mistakes: "Back arching, moving too fast, holding the breath.", alternativeIds: [13, 36, 44] }),
  makeExercise({ id: 36, name: "Bird Dog", muscle: "Core", secondary: ["Glutes", "Back"], equipment: "Bodyweight", location: "Home/Gym", movement: "brace", type: "Stability", sets: 3, reps: "8-12 / side", rest: 45, calories: 18, color: "#0f766e", effectiveness: 8.6, bestFor: "Core stability and coordination", benefit: "Builds cross-body stability while keeping spinal load low.", whyEffective: "It combines balance, glute activation and trunk control in one accessible drill.", form: "Reach the opposite arm and leg without rotating the hips.", mistakes: "Overarching, shifting the hips, reaching too high.", alternativeIds: [13, 35, 44] }),
  makeExercise({ id: 37, name: "Seated Calf Raise", muscle: "Calves", equipment: "Machine", movement: "calf", type: "Isolation", sets: 4, reps: "12-20", rest: 45, calories: 22, color: "#d97706", effectiveness: 8.8, bestFor: "Soleus calf development", benefit: "Emphasizes the deeper calf muscle through a bent-knee position.", whyEffective: "It complements standing raises by changing the knee angle.", form: "Lower fully, rise onto the toes and pause at the top.", mistakes: "Bouncing, using a short range, placing the pad on the kneecap.", alternativeIds: [14, 38] }),
  makeExercise({ id: 38, name: "Single-leg Calf Raise", muscle: "Calves", equipment: "Bodyweight", location: "Home/Gym", movement: "calf", type: "Isolation", sets: 3, reps: "12-20 / side", rest: 45, calories: 20, color: "#b45309", effectiveness: 8.5, bestFor: "Calf balance and home training", benefit: "Trains one calf at a time without a machine.", whyEffective: "It exposes side differences and can be progressed with a dumbbell.", form: "Use support for balance and move through the full ankle range.", mistakes: "Pushing with the support hand, bouncing, ankle rolling outward.", alternativeIds: [14, 37] }),
  makeExercise({ id: 39, name: "Band Pulldown", muscle: "Back", secondary: ["Biceps"], equipment: "Resistance Band", location: "Home/Gym", movement: "vertical-pull", sets: 3, reps: "12-20", rest: 60, calories: 32, color: "#0284c7", effectiveness: 8.1, bestFor: "Home vertical-pull practice", benefit: "Provides a portable way to train the lats with light resistance.", whyEffective: "It is accessible and useful for technique practice or higher repetitions.", form: "Anchor overhead and pull the elbows down toward the ribs.", mistakes: "Leaning far back, pulling only with the hands, loose anchor.", alternativeIds: [2, 16, 40] }),
  makeExercise({ id: 40, name: "One-arm Cable Pulldown", muscle: "Back", secondary: ["Biceps", "Core"], equipment: "Cable", movement: "vertical-pull", sets: 3, reps: "10-15 / side", rest: 60, calories: 39, color: "#0369a1", effectiveness: 8.9, bestFor: "Unilateral lat control", benefit: "Lets each lat work independently through a natural arm path.", whyEffective: "It can improve side-to-side control and helps users feel the lat shortening.", form: "Keep the torso steady and pull the elbow toward the hip.", mistakes: "Rotating the torso, shrugging, bending the wrist.", alternativeIds: [2, 16, 39] }),
  makeExercise({ id: 41, name: "Bodyweight Squat", muscle: "Legs", secondary: ["Glutes", "Core"], equipment: "Bodyweight", location: "Home/Gym", movement: "squat", sets: 3, reps: "12-20", rest: 60, calories: 42, color: "#ea580c", effectiveness: 8.2, bestFor: "Learning squat mechanics anywhere", benefit: "Builds basic leg endurance and movement confidence without equipment.", whyEffective: "It is easy to practice, scale and use as a warm-up.", form: "Keep the feet planted, sit between the hips and stand smoothly.", mistakes: "Heels lifting, knees collapsing, rushing the bottom.", alternativeIds: [3, 7, 27] }),
  makeExercise({ id: 42, name: "Step-up", muscle: "Legs", secondary: ["Glutes", "Core"], equipment: "Bench/Dumbbells", location: "Gym/Home", movement: "lunge", sets: 3, reps: "10-12 / leg", rest: 75, calories: 54, color: "#e11d48", effectiveness: 8.7, bestFor: "Practical single-leg strength", benefit: "Builds leg strength through a movement similar to climbing stairs.", whyEffective: "It is easy to scale by changing the step height or load.", form: "Place the whole foot on the step and drive through the working leg.", mistakes: "Pushing off the back foot, step too high, knee collapsing inward.", alternativeIds: [10, 28, 7] }),
  makeExercise({ id: 43, name: "Rear Delt Fly", muscle: "Rear Delts", secondary: ["Upper Back"], equipment: "Dumbbells", location: "Gym/Home", movement: "rear-fly", type: "Isolation", sets: 3, reps: "12-20", rest: 60, calories: 25, color: "#0ea5e9", effectiveness: 8.7, bestFor: "Rear-delt training with basic equipment", benefit: "Strengthens the rear shoulders and upper back using dumbbells.", whyEffective: "It is accessible and can be performed seated or chest-supported.", form: "Hinge or support the chest and open the arms without shrugging.", mistakes: "Swinging, using heavy weights, turning it into a row.", alternativeIds: [12, 22] }),
  makeExercise({ id: 44, name: "Knee Plank", muscle: "Core", secondary: ["Shoulders"], equipment: "Bodyweight", location: "Home/Gym", movement: "brace", type: "Stability", sets: 3, reps: "20-45 sec", rest: 45, calories: 15, color: "#115e59", effectiveness: 8.0, bestFor: "Building up to a full plank", benefit: "Teaches body-line control with less load than a full plank.", whyEffective: "It gives beginners a manageable entry point without losing the bracing pattern.", form: "Keep a straight line from knees to head and brace the waist.", mistakes: "Hips sagging, elbows too far forward, breath holding.", alternativeIds: [13, 35, 36] }),
  makeExercise({ id: 45, name: "Band Lateral Raise", muscle: "Shoulders", secondary: ["Upper Traps"], equipment: "Resistance Band", location: "Home/Gym", movement: "lateral-raise", type: "Isolation", sets: 3, reps: "15-25", rest: 45, calories: 22, color: "#f472b6", effectiveness: 8.0, bestFor: "Portable side-delt training", benefit: "Trains the side delts using inexpensive portable resistance.", whyEffective: "It works well for warm-ups and high-repetition shoulder work.", form: "Stand on the band and raise the arms without shrugging.", mistakes: "Band too heavy, torso swinging, wrists bending.", alternativeIds: [4, 23, 24] }),
  makeExercise({ id: 46, name: "Inverted Row", muscle: "Back", secondary: ["Biceps", "Core"], equipment: "Bar/Bodyweight", location: "Gym/Home", movement: "horizontal-pull", sets: 4, reps: "8-15", rest: 75, calories: 42, color: "#155e75", effectiveness: 8.8, bestFor: "Bodyweight rowing strength", benefit: "Builds the upper back while the core keeps the body rigid.", whyEffective: "The difficulty is easily changed by adjusting body angle.", form: "Keep the body straight and pull the chest toward the bar.", mistakes: "Hips sagging, shoulders shrugging, pulling only the chin up.", alternativeIds: [6, 20, 21] }),
];

export const defaultPlans = [
  { id: "push-power", name: "Push Day", day: "Monday", focus: "Chest, shoulders and triceps", duration: 62, level: "Beginner", color: "#8b5cf6", exercises: [1, 11, 4, 9, 13] },
  { id: "pull-build", name: "Pull Day", day: "Tuesday", focus: "Back, biceps and rear shoulders", duration: 58, level: "Beginner", color: "#22d3ee", exercises: [2, 6, 12, 8, 13] },
  { id: "leg-engine", name: "Leg Day", day: "Thursday", focus: "Quads, glutes and hamstrings", duration: 68, level: "Intermediate", color: "#f97316", exercises: [3, 7, 5, 10, 14] },
  { id: "full-body-reset", name: "Full Body", day: "Saturday", focus: "Full-body strength and conditioning", duration: 45, level: "Beginner", color: "#22c55e", exercises: [15, 16, 3, 23, 35] },
];

export const mealLibrary = [
  { id: 1, name: "Chicken Rice Bowl", type: "Lunch", calories: 610, protein: 46, carbs: 75, fat: 12, tags: ["High protein", "Budget"] },
  { id: 2, name: "Egg & Oats Breakfast", type: "Breakfast", calories: 520, protein: 30, carbs: 58, fat: 18, tags: ["Quick", "Balanced"] },
  { id: 3, name: "Banana Milk Shake", type: "Snack", calories: 360, protein: 18, carbs: 55, fat: 8, tags: ["Pre-workout", "Easy"] },
  { id: 4, name: "Fish Curry + Rice", type: "Dinner", calories: 640, protein: 40, carbs: 78, fat: 18, tags: ["Kerala", "Omega-3"] },
  { id: 5, name: "Paneer Chapati Plate", type: "Dinner", calories: 590, protein: 32, carbs: 62, fat: 24, tags: ["Vegetarian", "High protein"] },
  { id: 6, name: "Soya Chunk Bowl", type: "Lunch", calories: 470, protein: 36, carbs: 58, fat: 10, tags: ["Vegetarian", "Budget"] },
  { id: 7, name: "Greek Yogurt Fruit Cup", type: "Snack", calories: 270, protein: 20, carbs: 34, fat: 6, tags: ["Recovery", "Light"] },
];

export const defaultChallenges = [
  { id: 1, title: "7-Day Training Streak", description: "Complete a workout on consecutive days.", goal: 7, progress: 0, unit: "days", xp: 350, icon: "🔥", joined: true, metric: "streak" },
  { id: 2, title: "Hydration Hero", description: "Reach your water target on five days.", goal: 5, progress: 0, unit: "days", xp: 220, icon: "💧", joined: true, metric: "hydrationDays" },
  { id: 3, title: "50K Volume Club", description: "Accumulate 50,000 kg of training volume.", goal: 50000, progress: 0, unit: "kg", xp: 500, icon: "⚡", joined: false, metric: "volume" },
  { id: 4, title: "Protein Precision", description: "Reach your protein target on seven days.", goal: 7, progress: 0, unit: "days", xp: 420, icon: "🥚", joined: false, metric: "proteinDays" },
  { id: 5, title: "Workout Explorer", description: "Complete ten training sessions.", goal: 10, progress: 0, unit: "sessions", xp: 300, icon: "🏁", joined: false, metric: "sessions" },
];

export const defaultHistory = [
  { id: 1, date: "2026-07-14", name: "Push Day", duration: 61, volume: 5480, calories: 410, rating: 8, exercises: 5, muscles: ["Chest", "Shoulders", "Triceps"] },
  { id: 2, date: "2026-07-12", name: "Full Body", duration: 47, volume: 3820, calories: 350, rating: 7, exercises: 5, muscles: ["Chest", "Back", "Legs", "Core"] },
  { id: 3, date: "2026-07-10", name: "Leg Day", duration: 69, volume: 7260, calories: 520, rating: 9, exercises: 5, muscles: ["Legs", "Quads", "Hamstrings", "Calves"] },
];

export const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Legs", "Quads", "Hamstrings", "Glutes", "Biceps", "Triceps", "Core", "Rear Delts", "Calves"];
