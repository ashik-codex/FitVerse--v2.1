export function getExerciseAlternatives(exercise, exerciseList, limit = 6) {
  if (!exercise) return [];

  const preferredIds = new Set(exercise.alternativeIds || []);
  const locationTokens = String(exercise.location || "")
    .toLowerCase()
    .split(/[\s/]+/)
    .filter(Boolean);

  return exerciseList
    .filter((candidate) => candidate.id !== exercise.id)
    .map((candidate) => {
      let score = 0;
      const reasons = [];

      if (preferredIds.has(candidate.id)) {
        score += 70;
        reasons.push("curated replacement");
      }

      if (candidate.muscle === exercise.muscle) {
        score += 45;
        reasons.push(`same primary muscle (${exercise.muscle})`);
      }

      if (candidate.movement === exercise.movement) {
        score += 30;
        reasons.push("same movement pattern");
      }

      if (candidate.type === exercise.type) score += 8;
      if (candidate.difficulty === exercise.difficulty) score += 7;
      if (candidate.equipment !== exercise.equipment) {
        score += 5;
        reasons.push("different equipment option");
      }

      const candidateLocation = String(candidate.location || "").toLowerCase();
      if (locationTokens.some((token) => candidateLocation.includes(token))) score += 5;

      return {
        exercise: candidate,
        score,
        reason: reasons.slice(0, 3).join(" · ") || "similar training purpose",
      };
    })
    .filter((item) => item.score >= 35)
    .sort((a, b) => b.score - a.score || b.exercise.effectiveness - a.exercise.effectiveness)
    .slice(0, limit);
}

export function getTopExerciseForMuscle(muscle, exerciseList) {
  return [...exerciseList]
    .filter((exercise) => exercise.muscle === muscle)
    .sort((a, b) => b.effectiveness - a.effectiveness)[0] || null;
}
