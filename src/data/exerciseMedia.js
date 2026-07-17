export const MEDIA_REVISION = "2.1.0";

const mediaIds = {
  1: "Incline_Dumbbell_Press",
  2: "Wide-Grip_Lat_Pulldown",
  3: "Goblet_Squat",
  4: "Cable_Seated_Lateral_Raise",
  5: "Romanian_Deadlift",
  6: "Bent_Over_Two-Dumbbell_Row",
  7: "Leg_Press",
  8: "Alternate_Hammer_Curl",
  9: "Triceps_Pushdown_-_Rope_Attachment",
  10: "Split_Squat_with_Dumbbells",
  11: "Butterfly",
  12: "Face_Pull",
  13: "Plank",
  14: "Standing_Calf_Raises",
  15: "Pushups",
  16: "Pullups",
  17: "Machine_Bench_Press",
  18: "Smith_Machine_Incline_Bench_Press",
  19: "Incline_Push-Up",
  20: "Seated_Cable_Rows",
  21: "One-Arm_Dumbbell_Row",
  22: "Reverse_Machine_Flyes",
  23: "Side_Lateral_Raise",
  24: "Machine_Shoulder_Military_Press",
  25: "Seated_Leg_Curl",
  26: "Pull_Through",
  27: "Hack_Squat",
  28: "Dumbbell_Rear_Lunge",
  29: "EZ-Bar_Curl",
  30: "Cable_Hammer_Curls_-_Rope_Attachment",
  31: "Cable_Rope_Overhead_Triceps_Extension",
  32: "Dips_-_Triceps_Version",
  33: "Cable_Crossover",
  34: "Dumbbell_Flyes",
  35: "Dead_Bug",
  36: "Superman",
  37: "Seated_Calf_Raise",
  38: "Calf_Raise_On_A_Dumbbell",
  39: "Straight-Arm_Pulldown",
  40: "V-Bar_Pulldown",
  41: "Bodyweight_Squat",
  42: "Dumbbell_Step_Ups",
  43: "Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench",
  44: "Plank",
  45: "Lateral_Raise_-_With_Bands",
  46: "Inverted_Row",
};

const offlineByMovement = {
  press: "Incline_Dumbbell_Press",
  pull: "Wide-Grip_Lat_Pulldown",
  row: "Bent_Over_Two-Dumbbell_Row",
  squat: "Goblet_Squat",
  lunge: "Split_Squat_with_Dumbbells",
  hinge: "Romanian_Deadlift",
  raise: "Side_Lateral_Raise",
  curl: "Alternate_Hammer_Curl",
  pushdown: "Triceps_Pushdown_-_Rope_Attachment",
  extension: "Cable_Rope_Overhead_Triceps_Extension",
  fly: "Dumbbell_Flyes",
  "rear-fly": "Reverse_Machine_Flyes",
  core: "Plank",
  calf: "Standing_Calf_Raises",
  "leg-curl": "Seated_Leg_Curl",
};

function localAsset(folder, file) {
  return `${import.meta.env.BASE_URL}exercise-media/${folder}/${file}.jpg?v=${MEDIA_REVISION}`;
}

function remoteAsset(folder, file) {
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${folder}/${file}.jpg?fitverse=${MEDIA_REVISION}`;
}

export function getExerciseMedia(exercise) {
  const numericId = Number(exercise?.id);
  const sourceId = exercise?.mediaSourceId || mediaIds[numericId] || offlineByMovement[exercise?.animation] || "Incline_Dumbbell_Press";
  const fallbackId = offlineByMovement[exercise?.animation] || "Incline_Dumbbell_Press";
  const identity = `${numericId || "exercise"}-${sourceId}-${exercise?.mediaNonce || exercise?.replacedAt || "original"}-${MEDIA_REVISION}`;

  return {
    identity,
    sourceId,
    start: localAsset(sourceId, 0),
    finish: localAsset(sourceId, 1),
    remoteStart: remoteAsset(sourceId, 0),
    remoteFinish: remoteAsset(sourceId, 1),
    fallbackStart: localAsset(fallbackId, 0),
    fallbackFinish: localAsset(fallbackId, 1),
    sourcePage: `https://github.com/yuhonas/free-exercise-db/tree/main/exercises/${sourceId}`,
    datasetPage: "https://github.com/yuhonas/free-exercise-db",
    license: "Public-domain dataset (Unlicense)",
    offline: true,
  };
}

export function getExerciseMediaId(exercise) {
  return getExerciseMedia(exercise).sourceId;
}
