import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import ProgressRing from "../components/ProgressRing";
import ExerciseAnimation, { ExerciseThumbnail } from "../components/ExerciseAnimation";
import { useFitness } from "../context/FitnessContext";
import { exercises } from "../data/fitnessData";
import { getExerciseAlternatives } from "../utils/exerciseUtils";

export default function LiveWorkout() {
  const { activeWorkout, plans, startWorkout, updateActiveWorkout, finishWorkout, swapActiveExercise } = useFitness();
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [rating, setRating] = useState(8);

  const current = useMemo(() => {
    const storedCurrent = activeWorkout?.exercises[activeWorkout.currentIndex];
    if (!storedCurrent) return null;
    const masterCurrent = exercises.find((item) => item.id === storedCurrent.id);
    return { ...masterCurrent, ...storedCurrent };
  }, [activeWorkout?.currentIndex, activeWorkout?.exercises]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    setSeconds(0);
    setTimerRunning(false);
  }, [current?.id]);

  const completedSets = activeWorkout?.exercises.reduce((total, exercise) => total + exercise.completedSets.filter((set) => set.done).length, 0) || 0;
  const totalSets = activeWorkout?.exercises.reduce((total, exercise) => total + exercise.completedSets.length, 0) || 1;
  const workoutProgress = (completedSets / totalSets) * 100;
  const elapsedMinutes = activeWorkout ? Math.max(1, Math.floor((Date.now() - activeWorkout.startedAt) / 60000)) : 0;
  const swapOptions = useMemo(() => current ? getExerciseAlternatives(current, exercises, 8) : [], [current]);

  const updateSet = (setId, field, value) => {
    const next = { ...activeWorkout, exercises: [...activeWorkout.exercises] };
    const exercise = { ...next.exercises[next.currentIndex], completedSets: [...next.exercises[next.currentIndex].completedSets] };
    exercise.completedSets = exercise.completedSets.map((set) => set.id === setId ? { ...set, [field]: value } : set);
    next.exercises[next.currentIndex] = exercise;
    updateActiveWorkout(next);
  };

  const toggleSet = (setId) => {
    const selectedSet = current.completedSets.find((set) => set.id === setId);
    updateSet(setId, "done", !selectedSet.done);
    if (!selectedSet.done) {
      setSeconds(current.rest);
      setTimerRunning(true);
    }
  };

  const move = (direction) => {
    const next = { ...activeWorkout, currentIndex: Math.max(0, Math.min(activeWorkout.exercises.length - 1, activeWorkout.currentIndex + direction)) };
    updateActiveWorkout(next);
  };

  if (!activeWorkout) {
    return (
      <div className="page">
        <section className="empty-workout simple-empty-workout">
          <div className="pulse-orbit"><span>▶</span></div>
          <span className="eyebrow">Live workout</span>
          <h1>No workout is running</h1>
          <p>Choose a plan to get exercise instructions, step-by-step picture cues, set tracking and replacement options.</p>
          <div className="start-plan-grid">{plans.map((plan) => <button key={plan.id} onClick={() => startWorkout(plan)} style={{ "--plan-color": plan.color }}><span>{plan.day}</span><strong>{plan.name}</strong><small>{plan.focus} · {plan.duration} min</small><em>Start →</em></button>)}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="page live-page readable-live-page">
      <section className="live-header">
        <div><span className="live-badge"><i /> WORKOUT RUNNING</span><h1>{activeWorkout.name}</h1><p>Exercise {activeWorkout.currentIndex + 1} of {activeWorkout.exercises.length} · {elapsedMinutes} minutes</p></div>
        <ProgressRing value={workoutProgress} size={92} label={`${Math.round(workoutProgress)}%`} sublabel="complete" />
      </section>

      <section className="live-layout">
        <article className="live-main panel">
          <ExerciseAnimation key={`live-${activeWorkout.currentIndex}-${current.id}-${current.replacedAt || "original"}`} exercise={current} />

          <div className="live-exercise-heading">
            <div>
              <span className="eyebrow">Current exercise</span>
              <h2>{current.name}</h2>
              <p>{current.benefit || current.form}</p>
            </div>
            <button className="secondary-btn" onClick={() => setSwapOpen(true)}>↔ Replace exercise</button>
          </div>

          <div className="live-purpose-grid">
            <div><span>Primary muscle</span><strong>{current.muscle}</strong></div>
            <div><span>Also works</span><strong>{current.secondary?.join(", ") || "Focused movement"}</strong></div>
            <div><span>Best for</span><strong>{current.bestFor || "General strength"}</strong></div>
            <div><span>FitVerse rating</span><strong>{Number(current.effectiveness || 8).toFixed(1)}/10</strong></div>
          </div>

          <section className="live-form-guide">
            <h3>How to do it</h3>
            <ol>{(current.steps || [current.form]).map((step) => <li key={step}>{step}</li>)}</ol>
            <p><strong>Avoid:</strong> {current.mistakes}</p>
          </section>

          <div className="live-prescription"><span><strong>{current.sets}</strong> sets</span><span><strong>{current.reps}</strong> reps</span><span><strong>{current.rest}s</strong> rest</span><span><strong>{current.equipment}</strong> equipment</span></div>

          <div className="set-table">
            <div className="set-row set-head"><span>Set</span><span>Weight (kg)</span><span>Reps</span><span>Done</span></div>
            {current.completedSets.map((set) => <div className={`set-row ${set.done ? "completed" : ""}`} key={set.id}><strong>{set.id}</strong><input type="number" min="0" value={set.weight} onChange={(event) => updateSet(set.id, "weight", event.target.value)} placeholder="0" /><input type="number" min="0" value={set.reps} onChange={(event) => updateSet(set.id, "reps", event.target.value)} placeholder="0" /><button onClick={() => toggleSet(set.id)} aria-label={`Mark set ${set.id} ${set.done ? "not done" : "done"}`}>{set.done ? "✓" : "○"}</button></div>)}
          </div>

          <footer className="live-navigation"><button className="secondary-btn" onClick={() => move(-1)} disabled={activeWorkout.currentIndex === 0}>← Previous</button><button className="primary-btn" onClick={() => activeWorkout.currentIndex === activeWorkout.exercises.length - 1 ? setFinishOpen(true) : move(1)}>{activeWorkout.currentIndex === activeWorkout.exercises.length - 1 ? "Finish workout" : "Next exercise →"}</button></footer>
        </article>

        <aside className="live-sidebar">
          <article className="panel rest-timer"><span className="eyebrow">Rest timer</span><strong>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</strong><p>{seconds ? "Time remaining" : `Recommended rest: ${current.rest} seconds`}</p><div><button onClick={() => { if (!seconds) setSeconds(current.rest); setTimerRunning((value) => !value); }}>{timerRunning ? "Pause" : seconds ? "Resume" : "Start"}</button><button onClick={() => { setSeconds(0); setTimerRunning(false); }}>Reset</button><button onClick={() => setSeconds((value) => value + 15)}>+15s</button></div></article>
          <article className="panel workout-queue"><span className="eyebrow">Workout list</span><h3>Exercises</h3>{activeWorkout.exercises.map((exercise, index) => <button className={`${index === activeWorkout.currentIndex ? "active" : ""} ${exercise.completedSets.every((set) => set.done) ? "done" : ""}`} key={`${exercise.id}-${index}`} onClick={() => updateActiveWorkout({ ...activeWorkout, currentIndex: index })}><span>{index + 1}</span><div><strong>{exercise.name}</strong><small>{exercise.completedSets.filter((set) => set.done).length}/{exercise.completedSets.length} sets</small></div><em>{exercise.completedSets.every((set) => set.done) ? "✓" : ""}</em></button>)}</article>
          <article className="panel form-tip"><span>!</span><div><strong>Important form reminder</strong><p>{current.mistakes}</p></div></article>
        </aside>
      </section>

      <Modal open={swapOpen} onClose={() => setSwapOpen(false)} title={`Replace ${current.name}`} subtitle="These options train a similar muscle or movement pattern." size="large">
        <div className="replacement-list smart-replacement-list">
          {swapOptions.map(({ exercise: item, score, reason }, index) => <button key={item.id} onClick={() => { swapActiveExercise(activeWorkout.currentIndex, item.id); setSwapOpen(false); }}><ExerciseThumbnail exercise={item} label={index === 0 ? "Best match" : "Replacement"} /><div><strong>{item.name} {index === 0 && <em className="best-match-label">Best match</em>}</strong><small>{item.equipment} · {item.difficulty}</small><p>{reason}. {item.benefit}</p></div><em>{Math.min(99, score)}%</em></button>)}
        </div>
      </Modal>

      <Modal open={finishOpen} onClose={() => setFinishOpen(false)} title="Finish workout" subtitle="Rate the session before saving it to history and analytics.">
        <div className="finish-workout"><div className="finish-stats"><span><strong>{elapsedMinutes}</strong> min</span><span><strong>{completedSets}</strong> sets</span><span><strong>{activeWorkout.exercises.length}</strong> exercises</span></div><label><span>Session rating: {rating}/10</span><input type="range" min="1" max="10" value={rating} onChange={(event) => setRating(Number(event.target.value))} /></label><button className="primary-btn full" onClick={() => finishWorkout(rating)}>Save completed workout</button></div>
      </Modal>
    </div>
  );
}
