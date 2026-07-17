import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import { ExerciseThumbnail } from "../components/ExerciseAnimation";
import { useFitness } from "../context/FitnessContext";
import { exercises, muscleGroups } from "../data/fitnessData";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Unscheduled"];
const EXERCISE_COUNTS = [4, 5, 6, 7, 8];

const STYLE_OPTIONS = [
  {
    id: "single",
    title: "One body part",
    description: "Train one main muscle group in this session.",
    icon: "1",
  },
  {
    id: "double",
    title: "Two body parts",
    description: "Combine two muscle groups in one workout.",
    icon: "2",
  },
  {
    id: "ppl",
    title: "Push / Pull / Legs",
    description: "Use a structured push, pull or legs session.",
    icon: "P",
  },
  {
    id: "full",
    title: "Full body",
    description: "Train major upper- and lower-body muscles.",
    icon: "F",
  },
  {
    id: "custom",
    title: "Custom",
    description: "Choose any exercises without a focus restriction.",
    icon: "+",
  },
];

const SPLIT_GROUPS = {
  Push: ["Chest", "Shoulders", "Triceps"],
  Pull: ["Back", "Biceps", "Rear Delts"],
  Legs: ["Legs", "Quads", "Hamstrings", "Glutes", "Calves"],
};

const FULL_BODY_GROUPS = ["Chest", "Back", "Shoulders", "Legs", "Quads", "Hamstrings", "Glutes", "Core"];

const createDefaultForm = () => ({
  name: "",
  day: "Monday",
  focus: "Chest",
  duration: 50,
  level: "Beginner",
  color: "#8b5cf6",
  exercises: [],
  trainingStyle: "single",
  primaryMuscle: "Chest",
  secondaryMuscle: "Back",
  splitType: "Push",
  exerciseCount: 5,
});

const createDefaultFilters = () => ({
  query: "",
  muscle: "All",
  equipment: "All",
  difficulty: "All",
  location: "All",
  type: "All",
  selectedOnly: false,
  focusOnly: true,
});

function getTargetMuscles(form) {
  if (form.trainingStyle === "single") return [form.primaryMuscle];
  if (form.trainingStyle === "double") return [...new Set([form.primaryMuscle, form.secondaryMuscle])];
  if (form.trainingStyle === "ppl") return SPLIT_GROUPS[form.splitType] || [];
  if (form.trainingStyle === "full") return FULL_BODY_GROUPS;
  return [];
}

function getFocusLabel(form) {
  if (form.trainingStyle === "single") return form.primaryMuscle;
  if (form.trainingStyle === "double") return `${form.primaryMuscle} + ${form.secondaryMuscle}`;
  if (form.trainingStyle === "ppl") return `${form.splitType} workout`;
  if (form.trainingStyle === "full") return "Full body";
  return "Custom workout";
}

function buildSuggestedExercises(form) {
  const targets = getTargetMuscles(form);
  const targetSet = new Set(targets);
  const levelRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const desiredRank = levelRank[form.level] || 1;

  const sortedPool = [...exercises]
    .filter((exercise) => !targets.length || targetSet.has(exercise.muscle))
    .sort((a, b) => {
      const aLevelDistance = Math.abs((levelRank[a.difficulty] || 1) - desiredRank);
      const bLevelDistance = Math.abs((levelRank[b.difficulty] || 1) - desiredRank);
      return aLevelDistance - bLevelDistance || b.effectiveness - a.effectiveness;
    });

  const selected = [];
  if (targets.length) {
    let round = 0;
    while (selected.length < form.exerciseCount && round < 10) {
      targets.forEach((target) => {
        if (selected.length >= form.exerciseCount) return;
        const options = sortedPool.filter((exercise) => exercise.muscle === target && !selected.includes(exercise.id));
        if (options[round]) selected.push(options[round].id);
      });
      round += 1;
    }
  }

  sortedPool.forEach((exercise) => {
    if (selected.length < form.exerciseCount && !selected.includes(exercise.id)) selected.push(exercise.id);
  });

  if (selected.length < form.exerciseCount) {
    [...exercises]
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .forEach((exercise) => {
        if (selected.length < form.exerciseCount && !selected.includes(exercise.id)) selected.push(exercise.id);
      });
  }

  return selected.slice(0, form.exerciseCount);
}

export default function WorkoutPlanner({ navigate }) {
  const { plans, addPlan, deletePlan, duplicatePlan, startWorkout } = useFitness();
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState(createDefaultForm);
  const [filters, setFilters] = useState(createDefaultFilters);
  const [builderMessage, setBuilderMessage] = useState("");

  const targetMuscles = useMemo(() => getTargetMuscles(form), [form]);
  const targetSet = useMemo(() => new Set(targetMuscles), [targetMuscles]);
  const selectedExercises = useMemo(
    () => form.exercises.map((id) => exercises.find((item) => item.id === id)).filter(Boolean),
    [form.exercises],
  );

  const equipmentOptions = useMemo(() => ["All", ...new Set(exercises.map((item) => item.equipment))], []);
  const difficultyOptions = ["All", "Beginner", "Intermediate", "Advanced"];
  const locationOptions = ["All", "Gym", "Home"];
  const typeOptions = useMemo(() => ["All", ...new Set(exercises.map((item) => item.type))], []);

  const visibleExercises = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const searchText = [
        exercise.name,
        exercise.muscle,
        ...(exercise.secondary || []),
        exercise.equipment,
        exercise.type,
        exercise.location,
        exercise.bestFor,
        exercise.benefit,
      ].join(" ").toLowerCase();

      const matchesQuery = !query || searchText.includes(query);
      const matchesFocus = !filters.focusOnly || !targetMuscles.length || targetSet.has(exercise.muscle);
      const matchesMuscle = filters.muscle === "All" || exercise.muscle === filters.muscle;
      const matchesEquipment = filters.equipment === "All" || exercise.equipment === filters.equipment;
      const matchesDifficulty = filters.difficulty === "All" || exercise.difficulty === filters.difficulty;
      const matchesLocation = filters.location === "All" || String(exercise.location || "").includes(filters.location);
      const matchesType = filters.type === "All" || exercise.type === filters.type;
      const matchesSelected = !filters.selectedOnly || form.exercises.includes(exercise.id);

      return matchesQuery && matchesFocus && matchesMuscle && matchesEquipment && matchesDifficulty && matchesLocation && matchesType && matchesSelected;
    });
  }, [filters, form.exercises, targetMuscles.length, targetSet]);

  const resetBuilder = () => {
    setForm(createDefaultForm());
    setFilters(createDefaultFilters());
    setBuilderMessage("");
  };

  const openBuilder = () => {
    resetBuilder();
    setModalOpen(true);
  };

  const closeBuilder = () => {
    setModalOpen(false);
    setBuilderMessage("");
  };

  const updateForm = (changes) => {
    setForm((current) => {
      const next = { ...current, ...changes };
      next.focus = getFocusLabel(next);
      if (changes.exerciseCount) next.exercises = next.exercises.slice(0, Number(changes.exerciseCount));
      return next;
    });
    setBuilderMessage("");
  };

  const chooseStyle = (trainingStyle) => {
    setForm((current) => {
      const next = { ...current, trainingStyle, exercises: [] };
      next.focus = getFocusLabel(next);
      return next;
    });
    setFilters((current) => ({ ...current, muscle: "All", focusOnly: trainingStyle !== "custom", selectedOnly: false }));
    setBuilderMessage("");
  };

  const toggleExercise = (id) => {
    setForm((current) => {
      if (current.exercises.includes(id)) {
        setBuilderMessage("");
        return { ...current, exercises: current.exercises.filter((item) => item !== id) };
      }
      if (current.exercises.length >= current.exerciseCount) {
        setBuilderMessage(`You selected ${current.exerciseCount} exercises. Remove one before adding another.`);
        return current;
      }
      setBuilderMessage("");
      return { ...current, exercises: [...current.exercises, id] };
    });
  };

  const removeSelected = (id) => {
    setForm((current) => ({ ...current, exercises: current.exercises.filter((item) => item !== id) }));
    setBuilderMessage("");
  };

  const moveSelected = (index, direction) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.exercises.length) return current;
      const reordered = [...current.exercises];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
      return { ...current, exercises: reordered };
    });
  };

  const autoBuild = () => {
    const suggested = buildSuggestedExercises(form);
    setForm((current) => ({ ...current, exercises: suggested }));
    setBuilderMessage(`Added ${suggested.length} recommended exercises for ${getFocusLabel(form)}.`);
  };

  const clearFilters = () => {
    setFilters({
      ...createDefaultFilters(),
      focusOnly: form.trainingStyle !== "custom",
      selectedOnly: false,
      query: "",
      muscle: "All",
    });
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setBuilderMessage("Enter a workout name before saving.");
      return;
    }
    if (form.exercises.length !== form.exerciseCount) {
      setBuilderMessage(`Select exactly ${form.exerciseCount} exercises. You currently selected ${form.exercises.length}.`);
      return;
    }
    addPlan({ ...form, focus: getFocusLabel(form) });
    closeBuilder();
    resetBuilder();
  };

  return (
    <div className="page">
      <section className="page-heading">
        <div><span className="eyebrow">Weekly system</span><h1>Workout Planner</h1><p>Create a workout by body part, split style, exercise count, equipment and difficulty.</p></div>
        <button className="primary-btn" onClick={openBuilder}>＋ Create workout</button>
      </section>

      <section className="week-strip">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
          const plan = plans.find((item) => item.day.startsWith(day));
          return <div key={day} className={plan ? "scheduled" : ""}><span>{day}</span><strong>{17 + index}</strong><small>{plan ? plan.name : "Rest / open"}</small></div>;
        })}
      </section>

      <section className="planner-layout">
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className="plan-card" key={plan.id} style={{ "--plan-color": plan.color }}>
              <header><span>{plan.day}</span><em>{plan.level}</em></header>
              <div className="plan-icon">⚡</div>
              <h3>{plan.name}</h3>
              <p>{plan.focus}</p>
              <div className="plan-meta"><span>{plan.exercises.length} exercises</span><span>{plan.duration} min</span></div>
              {plan.trainingStyle && <span className="plan-style-badge">{STYLE_OPTIONS.find((item) => item.id === plan.trainingStyle)?.title || "Custom"}</span>}
              <div className="plan-exercise-preview">
                {plan.exercises.slice(0, 4).map((id) => <span key={id}>{exercises.find((item) => item.id === id)?.name}</span>)}
              </div>
              <footer>
                <button className="primary-btn small" onClick={() => { startWorkout(plan); navigate("live"); }}>Start</button>
                <button className="icon-btn" onClick={() => setPreview(plan)} title="View">◫</button>
                <button className="icon-btn" onClick={() => duplicatePlan(plan)} title="Duplicate">⧉</button>
                <button className="icon-btn danger" onClick={() => deletePlan(plan.id)} title="Delete">⌫</button>
              </footer>
            </article>
          ))}
        </div>

        <aside className="planner-insight panel">
          <span className="eyebrow">Plan balance</span>
          <h2>Weekly muscle map</h2>
          <p>Your current plans update this overview automatically.</p>
          {muscleGroups.slice(1, 8).map((group, index) => {
            const count = plans.flatMap((plan) => plan.exercises).filter((id) => exercises.find((item) => item.id === id)?.muscle === group).length;
            return <div className="balance-row" key={group}><span>{group}</span><i><b style={{ width: `${Math.min(100, 24 + count * 22 + index * 2)}%` }} /></i><strong>{count || 0}×</strong></div>;
          })}
          <div className="insight-note"><span>✧</span><p><strong>Coach note:</strong> choose a workout style and exact exercise count before adding your session.</p></div>
        </aside>
      </section>

      <Modal open={modalOpen} onClose={closeBuilder} title="Create a workout" subtitle="Choose your training style, exercise count and exercises." size="large">
        <form className="workout-builder" onSubmit={submit}>
          <section className="builder-section">
            <div className="builder-section-heading"><div><span>Step 1</span><h3>Choose a workout style</h3></div><small>This controls which exercises are recommended.</small></div>
            <div className="workout-style-grid">
              {STYLE_OPTIONS.map((style) => (
                <button type="button" key={style.id} className={form.trainingStyle === style.id ? "active" : ""} onClick={() => chooseStyle(style.id)}>
                  <span>{style.icon}</span><strong>{style.title}</strong><small>{style.description}</small>
                </button>
              ))}
            </div>

            <div className="builder-options-grid">
              {form.trainingStyle === "single" && (
                <label><span>Body part</span><select value={form.primaryMuscle} onChange={(event) => updateForm({ primaryMuscle: event.target.value, exercises: [] })}>{muscleGroups.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
              )}
              {form.trainingStyle === "double" && (
                <>
                  <label><span>First body part</span><select value={form.primaryMuscle} onChange={(event) => { const nextPrimary = event.target.value; const nextSecondary = form.secondaryMuscle === nextPrimary ? muscleGroups.slice(1).find((item) => item !== nextPrimary) : form.secondaryMuscle; updateForm({ primaryMuscle: nextPrimary, secondaryMuscle: nextSecondary, exercises: [] }); }}>{muscleGroups.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label><span>Second body part</span><select value={form.secondaryMuscle} onChange={(event) => updateForm({ secondaryMuscle: event.target.value, exercises: [] })}>{muscleGroups.slice(1).filter((item) => item !== form.primaryMuscle).map((item) => <option key={item}>{item}</option>)}</select></label>
                </>
              )}
              {form.trainingStyle === "ppl" && (
                <label><span>Session type</span><select value={form.splitType} onChange={(event) => updateForm({ splitType: event.target.value, exercises: [] })}>{Object.keys(SPLIT_GROUPS).map((item) => <option key={item}>{item}</option>)}</select></label>
              )}
              <label><span>Number of exercises</span><select value={form.exerciseCount} onChange={(event) => updateForm({ exerciseCount: Number(event.target.value) })}>{EXERCISE_COUNTS.map((count) => <option value={count} key={count}>{count} exercises</option>)}</select></label>
              <label><span>Difficulty</span><select value={form.level} onChange={(event) => updateForm({ level: event.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
              <button type="button" className="auto-build-btn" onClick={autoBuild}><span>✦</span><div><strong>Auto-build workout</strong><small>Choose the strongest matching exercises automatically.</small></div></button>
            </div>
          </section>

          <section className="builder-section">
            <div className="builder-section-heading"><div><span>Step 2</span><h3>Search and select exercises</h3></div><small>{visibleExercises.length} results · {form.exercises.length}/{form.exerciseCount} selected</small></div>

            <div className="builder-search-row">
              <div className="builder-search">
                <span>⌕</span>
                <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Search exercise, body part, equipment or goal" />
                {filters.query && <button type="button" onClick={() => setFilters({ ...filters, query: "" })} aria-label="Clear search">×</button>}
              </div>
              <button type="button" className="secondary-btn" onClick={clearFilters}>Clear filters</button>
            </div>

            <div className="category-chip-row">
              {["All", ...(form.trainingStyle === "custom" ? muscleGroups.slice(1) : targetMuscles)].map((category) => (
                <button type="button" key={category} className={filters.muscle === category ? "active" : ""} onClick={() => setFilters({ ...filters, muscle: category })}>{category}</button>
              ))}
            </div>

            <div className="builder-filter-grid">
              <label><span>Category</span><select value={filters.muscle} onChange={(event) => setFilters({ ...filters, muscle: event.target.value })}>{["All", ...muscleGroups.slice(1)].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Equipment</span><select value={filters.equipment} onChange={(event) => setFilters({ ...filters, equipment: event.target.value })}>{equipmentOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Difficulty</span><select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}>{difficultyOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Location</span><select value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })}>{locationOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>Exercise type</span><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>{typeOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="builder-check"><input type="checkbox" checked={filters.selectedOnly} onChange={(event) => setFilters({ ...filters, selectedOnly: event.target.checked })} /><span>Selected only</span></label>
              {form.trainingStyle !== "custom" && <label className="builder-check"><input type="checkbox" checked={filters.focusOnly} onChange={(event) => setFilters({ ...filters, focusOnly: event.target.checked })} /><span>Matching focus only</span></label>}
            </div>

            {builderMessage && <div className={`builder-message ${form.exercises.length === form.exerciseCount ? "success" : ""}`}>{builderMessage}</div>}

            <div className="exercise-picker advanced-exercise-picker">
              {visibleExercises.map((exercise) => {
                const selected = form.exercises.includes(exercise.id);
                const locked = !selected && form.exercises.length >= form.exerciseCount;
                return (
                  <button type="button" disabled={locked} className={`${selected ? "selected" : ""} ${locked ? "locked" : ""}`} key={exercise.id} onClick={() => toggleExercise(exercise.id)}>
                    <ExerciseThumbnail exercise={exercise} label="" />
                    <div><strong>{exercise.name}</strong><small>{exercise.muscle} · {exercise.equipment}</small><p>{exercise.bestFor}</p></div>
                    <em>{selected ? "✓" : locked ? "—" : "+"}</em>
                  </button>
                );
              })}
              {!visibleExercises.length && <div className="builder-empty"><strong>No exercises found</strong><p>Clear the search or change the category and filters.</p></div>}
            </div>
          </section>

          <section className="builder-section selected-builder-section">
            <div className="builder-section-heading"><div><span>Step 3</span><h3>Review exercise order</h3></div><small>Use the arrows to change the workout sequence.</small></div>
            <div className="selected-exercise-list">
              {selectedExercises.map((exercise, index) => (
                <div key={exercise.id}>
                  <span>{index + 1}</span>
                  <ExerciseThumbnail exercise={exercise} label="" />
                  <div><strong>{exercise.name}</strong><small>{exercise.muscle} · {exercise.sets} sets · {exercise.reps} reps</small></div>
                  <div className="selected-order-actions">
                    <button type="button" disabled={index === 0} onClick={() => moveSelected(index, -1)} aria-label="Move exercise up">↑</button>
                    <button type="button" disabled={index === selectedExercises.length - 1} onClick={() => moveSelected(index, 1)} aria-label="Move exercise down">↓</button>
                    <button type="button" className="danger" onClick={() => removeSelected(exercise.id)} aria-label="Remove exercise">×</button>
                  </div>
                </div>
              ))}
              {!selectedExercises.length && <div className="selected-empty">Choose exercises manually or use Auto-build workout.</div>}
            </div>
          </section>

          <section className="builder-section builder-details-section">
            <div className="builder-section-heading"><div><span>Step 4</span><h3>Workout details</h3></div><small>Final information shown in your weekly plan.</small></div>
            <div className="form-grid">
              <label><span>Workout name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={`Example: ${getFocusLabel(form)} session`} required /></label>
              <label><span>Schedule day</span><select value={form.day} onChange={(event) => setForm({ ...form, day: event.target.value })}>{DAYS.map((day) => <option key={day}>{day}</option>)}</select></label>
              <label><span>Focus</span><input value={getFocusLabel(form)} readOnly /></label>
              <label><span>Duration (minutes)</span><input type="number" min="15" max="180" value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} /></label>
              <label><span>Accent colour</span><input type="color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} /></label>
            </div>
          </section>

          <div className="modal-actions builder-footer">
            <div><strong>{form.exercises.length}/{form.exerciseCount} exercises selected</strong><small>{form.exercises.length === form.exerciseCount ? "Ready to save" : `Choose ${form.exerciseCount - form.exercises.length} more`}</small></div>
            <button type="button" className="secondary-btn" onClick={closeBuilder}>Cancel</button>
            <button className="primary-btn" type="submit" disabled={form.exercises.length !== form.exerciseCount}>Save workout</button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title={preview?.name || "Workout details"} subtitle={preview?.focus}>
        {preview && <div className="preview-list">{preview.exercises.map((id, index) => { const exercise = exercises.find((item) => item.id === id); return <div key={id}><span>{index + 1}</span><div><strong>{exercise.name}</strong><small>{exercise.sets} sets · {exercise.reps} reps · {exercise.rest}s rest</small></div><em>{exercise.muscle}</em></div>; })}<button className="primary-btn full" onClick={() => { startWorkout(preview); setPreview(null); navigate("live"); }}>Start this workout</button></div>}
      </Modal>
    </div>
  );
}
