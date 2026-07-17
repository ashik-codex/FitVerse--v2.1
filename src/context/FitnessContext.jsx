import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultChallenges, defaultHistory, defaultPlans, exercises, mealLibrary } from "../data/fitnessData";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FitnessContext = createContext(null);

const defaultProfile = {
  name: "Ash",
  goal: "Muscle Gain",
  level: "Beginner",
  age: 19,
  height: 173,
  weight: 70,
  targetWeight: 75,
  weeklyDays: 5,
  workoutMinutes: 60,
  diet: "Non-Vegetarian",
  sleepGoal: 8,
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultNutrition = {
  date: todayKey(),
  caloriesTarget: 2600,
  proteinTarget: 140,
  carbsTarget: 320,
  fatTarget: 75,
  waterTarget: 8,
  water: 5,
  meals: [mealLibrary[1], mealLibrary[2]],
};

const defaultProgress = {
  weightLogs: [
    { date: "2026-06-20", value: 68.2 },
    { date: "2026-06-28", value: 68.8 },
    { date: "2026-07-05", value: 69.2 },
    { date: "2026-07-12", value: 70 },
  ],
  measurements: { chest: 96, waist: 78, arms: 34, thighs: 55 },
  photos: [],
};

function calculateStreak(history) {
  const dates = [...new Set(history.map((item) => item.date))]
    .map((date) => new Date(`${date}T00:00:00`))
    .sort((a, b) => b - a);

  if (!dates.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (dates[0].getTime() !== today.getTime() && dates[0].getTime() !== yesterday.getTime()) return 0;

  let streak = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const difference = Math.round((dates[index - 1] - dates[index]) / 86400000);
    if (difference !== 1) break;
    streak += 1;
  }
  return streak;
}

function recentHabitCount(dailyHabits, key, days = 7) {
  const cutoff = Date.now() - days * 86400000;
  return Object.entries(dailyHabits).filter(([date, value]) => {
    return new Date(`${date}T00:00:00`).getTime() >= cutoff && Boolean(value?.[key]);
  }).length;
}

export function FitnessProvider({ children }) {
  const [profile, setProfile] = useLocalStorage("fitverse_profile", defaultProfile);
  const [plans, setPlans] = useLocalStorage("fitverse_plans", defaultPlans);
  const [history, setHistory] = useLocalStorage("fitverse_history", defaultHistory);
  const [nutrition, setNutrition] = useLocalStorage("fitverse_nutrition", defaultNutrition);
  const [progress, setProgress] = useLocalStorage("fitverse_progress", defaultProgress);
  const [challengeDefinitions, setChallengeDefinitions] = useLocalStorage("fitverse_challenges_v2", defaultChallenges);
  const [dailyHabits, setDailyHabits] = useLocalStorage("fitverse_daily_habits", {});
  const [favorites, setFavorites] = useLocalStorage("fitverse_favorites", [1, 3, 6]);
  const [settings, setSettings] = useLocalStorage("fitverse_settings", { theme: "dark", accent: "violet" });
  const [activeWorkout, setActiveWorkout] = useLocalStorage("fitverse_active_workout_v2", null);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  };

  const consumed = useMemo(() => nutrition.meals.reduce((totals, meal) => ({
    calories: totals.calories + Number(meal.calories || 0),
    protein: totals.protein + Number(meal.protein || 0),
    carbs: totals.carbs + Number(meal.carbs || 0),
    fat: totals.fat + Number(meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [nutrition.meals]);

  useEffect(() => {
    const date = todayKey();
    const workoutCompleted = history.some((item) => item.date === date);
    const nextRecord = {
      workout: workoutCompleted,
      water: nutrition.water >= nutrition.waterTarget,
      protein: consumed.protein >= nutrition.proteinTarget,
    };

    setDailyHabits((current) => {
      const existing = current[date] || {};
      if (
        existing.workout === nextRecord.workout
        && existing.water === nextRecord.water
        && existing.protein === nextRecord.protein
      ) return current;
      return { ...current, [date]: nextRecord };
    });
  }, [history, nutrition.water, nutrition.waterTarget, nutrition.proteinTarget, consumed.protein, setDailyHabits]);

  const analytics = useMemo(() => {
    const last7 = history.filter((item) => Date.now() - new Date(`${item.date}T00:00:00`).getTime() <= 7 * 86400000);
    const last30 = history.filter((item) => Date.now() - new Date(`${item.date}T00:00:00`).getTime() <= 30 * 86400000);
    const totalVolume = history.reduce((total, item) => total + Number(item.volume || 0), 0);
    const totalMinutes = history.reduce((total, item) => total + Number(item.duration || 0), 0);
    const averageRating = history.length
      ? history.reduce((total, item) => total + Number(item.rating || 0), 0) / history.length
      : 0;
    const muscleFrequency = {};
    history.forEach((item) => {
      (item.muscles || []).forEach((muscle) => {
        muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
      });
    });

    const weightLogs = progress.weightLogs || [];
    const weightChange = weightLogs.length > 1
      ? Number(weightLogs[weightLogs.length - 1].value) - Number(weightLogs[0].value)
      : 0;
    const consistency = Math.min(100, Math.round((last7.length / Math.max(1, profile.weeklyDays)) * 100));
    const recoveryScore = Math.min(100, Math.max(35,
      62
      + (nutrition.water >= nutrition.waterTarget * 0.75 ? 12 : 0)
      + (consumed.protein >= nutrition.proteinTarget * 0.75 ? 10 : 0)
      + (last7.length <= profile.weeklyDays + 1 ? 8 : -8),
    ));

    return {
      consumed,
      last7,
      last30,
      sessionsThisWeek: last7.length,
      sessionsThisMonth: last30.length,
      totalSessions: history.length,
      totalVolume,
      totalMinutes,
      averageRating,
      streak: calculateStreak(history),
      muscleFrequency,
      weightChange,
      consistency,
      recoveryScore,
      hydrationPercent: Math.min(100, Math.round((nutrition.water / Math.max(1, nutrition.waterTarget)) * 100)),
      proteinPercent: Math.min(100, Math.round((consumed.protein / Math.max(1, nutrition.proteinTarget)) * 100)),
      caloriePercent: Math.min(100, Math.round((consumed.calories / Math.max(1, nutrition.caloriesTarget)) * 100)),
      goalWeightPercent: Math.min(100, Math.max(0, Math.round((profile.weight / Math.max(1, profile.targetWeight)) * 100))),
    };
  }, [history, nutrition, consumed, profile, progress.weightLogs]);

  const challenges = useMemo(() => {
    const metricValues = {
      streak: analytics.streak,
      hydrationDays: recentHabitCount(dailyHabits, "water"),
      proteinDays: recentHabitCount(dailyHabits, "protein"),
      volume: analytics.totalVolume,
      sessions: analytics.totalSessions,
    };

    return challengeDefinitions.map((challenge) => ({
      ...challenge,
      progress: Math.min(challenge.goal, metricValues[challenge.metric] ?? challenge.progress ?? 0),
    }));
  }, [challengeDefinitions, analytics, dailyHabits]);

  const startWorkout = (plan) => {
    const workoutExercises = plan.exercises
      .map((id) => exercises.find((item) => item.id === id))
      .filter(Boolean)
      .map((exercise) => ({
        ...exercise,
        completedSets: Array.from({ length: exercise.sets }, (_, index) => ({ id: index + 1, reps: "", weight: "", done: false })),
      }));

    if (!workoutExercises.length) {
      notify("This plan has no available exercises.", "warning");
      return;
    }

    setActiveWorkout({
      id: Date.now(),
      planId: plan.id,
      name: plan.name,
      startedAt: Date.now(),
      currentIndex: 0,
      exercises: workoutExercises,
    });
    notify(`${plan.name} started. Focus on controlled form.`, "info");
  };

  const updateActiveWorkout = (nextWorkout) => setActiveWorkout(nextWorkout);

  const finishWorkout = (rating = 8) => {
    if (!activeWorkout) return;
    const duration = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
    const volume = activeWorkout.exercises.reduce((total, exercise) => {
      return total + exercise.completedSets.reduce((setTotal, set) => {
        return setTotal + (Number(set.weight) || 0) * (Number(set.reps) || 0);
      }, 0);
    }, 0);
    const muscles = [...new Set(activeWorkout.exercises.flatMap((exercise) => [exercise.muscle, ...(exercise.secondary || [])]))];
    const completed = {
      id: Date.now(),
      date: todayKey(),
      name: activeWorkout.name,
      duration,
      volume,
      calories: Math.round(duration * 7.2),
      rating,
      exercises: activeWorkout.exercises.length,
      muscles,
      exerciseDetails: activeWorkout.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        completedSets: exercise.completedSets.filter((set) => set.done).length,
      })),
    };
    setHistory((items) => [completed, ...items]);
    setActiveWorkout(null);
    notify("Workout completed and analytics updated.");
  };

  const swapActiveExercise = (index, exerciseId) => {
    if (!activeWorkout) return;
    const nextExercise = exercises.find((item) => item.id === exerciseId);
    if (!nextExercise) {
      notify("Replacement exercise was not found.", "error");
      return;
    }
    const next = { ...activeWorkout, exercises: [...activeWorkout.exercises] };
    next.exercises[index] = {
      ...nextExercise,
      replacedAt: Date.now(),
      mediaNonce: `${nextExercise.id}-${Date.now()}`,
      mediaSourceId: undefined,
      completedSets: Array.from({ length: nextExercise.sets }, (_, setIndex) => ({ id: setIndex + 1, reps: "", weight: "", done: false })),
    };
    setActiveWorkout(next);
    notify(`Replaced with ${nextExercise.name}.`, "info");
  };

  const addPlan = (plan) => {
    setPlans((items) => [{ ...plan, id: `${Date.now()}` }, ...items]);
    notify("Workout plan created.");
  };

  const deletePlan = (id) => {
    setPlans((items) => items.filter((plan) => plan.id !== id));
    notify("Workout plan removed.", "warning");
  };

  const duplicatePlan = (plan) => {
    setPlans((items) => [{ ...plan, id: `${Date.now()}`, name: `${plan.name} Copy`, day: "Unscheduled" }, ...items]);
    notify("Workout duplicated.");
  };

  const toggleFavorite = (id) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const addMeal = (meal) => {
    setNutrition((current) => ({ ...current, meals: [...current.meals, { ...meal, logId: Date.now() }] }));
    notify(`${meal.name} added to today.`);
  };

  const removeMeal = (index) => {
    setNutrition((current) => ({ ...current, meals: current.meals.filter((_, itemIndex) => itemIndex !== index) }));
    notify("Meal removed.", "warning");
  };

  const addWater = () => setNutrition((current) => ({ ...current, water: Math.min(current.water + 1, 20) }));
  const removeWater = () => setNutrition((current) => ({ ...current, water: Math.max(current.water - 1, 0) }));

  const logWeight = (value) => {
    const numericValue = Number(value);
    if (!numericValue) return;
    setProgress((current) => ({ ...current, weightLogs: [...current.weightLogs, { date: todayKey(), value: numericValue }] }));
    setProfile((current) => ({ ...current, weight: numericValue }));
    notify("Weight logged and analytics updated.");
  };

  const updateMeasurements = (measurements) => {
    setProgress((current) => ({ ...current, measurements }));
    notify("Measurements updated.");
  };

  const addProgressPhoto = (photo) => {
    setProgress((current) => ({ ...current, photos: [{ id: Date.now(), date: todayKey(), src: photo }, ...current.photos].slice(0, 6) }));
    notify("Progress photo saved.");
  };

  const updateChallenge = (id, updates) => {
    setChallengeDefinitions((items) => items.map((challenge) => challenge.id === id ? { ...challenge, ...updates } : challenge));
  };

  const exportData = () => ({ profile, plans, history, nutrition, progress, challenges: challengeDefinitions, dailyHabits, favorites, settings });

  const importData = (data) => {
    if (data.profile) setProfile(data.profile);
    if (Array.isArray(data.plans)) setPlans(data.plans);
    if (Array.isArray(data.history)) setHistory(data.history);
    if (data.nutrition) setNutrition(data.nutrition);
    if (data.progress) setProgress(data.progress);
    if (Array.isArray(data.challenges)) setChallengeDefinitions(data.challenges);
    if (data.dailyHabits) setDailyHabits(data.dailyHabits);
    if (Array.isArray(data.favorites)) setFavorites(data.favorites);
    if (data.settings) setSettings(data.settings);
    notify("Backup imported successfully.");
  };

  const resetData = () => {
    setProfile(defaultProfile);
    setPlans(defaultPlans);
    setHistory(defaultHistory);
    setNutrition(defaultNutrition);
    setProgress(defaultProgress);
    setChallengeDefinitions(defaultChallenges);
    setDailyHabits({});
    setFavorites([1, 3, 6]);
    setActiveWorkout(null);
    notify("Demo data restored.", "info");
  };

  const value = {
    profile, setProfile,
    plans, setPlans, addPlan, deletePlan, duplicatePlan,
    history, setHistory,
    nutrition, setNutrition, addMeal, removeMeal, addWater, removeWater,
    progress, setProgress, logWeight, updateMeasurements, addProgressPhoto,
    challenges, updateChallenge,
    favorites, toggleFavorite,
    settings, setSettings,
    activeWorkout, startWorkout, updateActiveWorkout, finishWorkout, swapActiveExercise,
    analytics,
    toast, setToast, notify,
    exportData, importData, resetData,
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) throw new Error("useFitness must be used inside FitnessProvider");
  return context;
}
