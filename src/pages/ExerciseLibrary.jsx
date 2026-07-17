import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import ExerciseAnimation, { ExerciseThumbnail } from "../components/ExerciseAnimation";
import { useFitness } from "../context/FitnessContext";
import { exercises, muscleGroups } from "../data/fitnessData";
import { getExerciseAlternatives, getTopExerciseForMuscle } from "../utils/exerciseUtils";

export default function ExerciseLibrary() {
  const { favorites, toggleFavorite } = useFitness();
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("All");
  const [equipment, setEquipment] = useState("All");
  const [detail, setDetail] = useState(null);
  const [replacement, setReplacement] = useState(null);
  const [tutorial, setTutorial] = useState(null);

  const filtered = useMemo(() => exercises.filter((exercise) => {
    const query = search.toLowerCase();
    const matchesQuery = [exercise.name, exercise.muscle, exercise.equipment, exercise.type, exercise.bestFor, exercise.benefit]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesMuscle = muscle === "All" || exercise.muscle === muscle;
    const matchesEquipment = equipment === "All" || exercise.equipment === equipment;
    return matchesQuery && matchesMuscle && matchesEquipment;
  }), [search, muscle, equipment]);

  const replacementOptions = replacement ? getExerciseAlternatives(replacement, exercises, 8) : [];
  const bestForSelectedMuscle = muscle === "All" ? null : getTopExerciseForMuscle(muscle, exercises);

  return (
    <div className="page exercise-library-page">
      <section className="page-heading clear-heading">
        <div>
          <span className="eyebrow">Easy exercise guide</span>
          <h1>Exercise Library</h1>
          <p>See how each exercise is performed, which muscles it trains, why it is useful and what you can do instead.</p>
        </div>
        <div className="heading-badge">{exercises.length} exercises</div>
      </section>

      <section className="filter-panel readable-filter-panel">
        <div className="search-input"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exercise, muscle or equipment" /></div>
        <select value={muscle} onChange={(event) => setMuscle(event.target.value)}>{muscleGroups.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={equipment} onChange={(event) => setEquipment(event.target.value)}>{["All", ...new Set(exercises.map((item) => item.equipment))].map((item) => <option key={item}>{item}</option>)}</select>
        <button className="secondary-btn" onClick={() => { setSearch(""); setMuscle("All"); setEquipment("All"); }}>Reset</button>
      </section>

      {bestForSelectedMuscle && (
        <section className="best-exercise-banner">
          <span>★</span>
          <div>
            <strong>Top FitVerse choice for {muscle}: {bestForSelectedMuscle.name}</strong>
            <p>{bestForSelectedMuscle.whyEffective}</p>
          </div>
          <button className="secondary-btn small" onClick={() => setDetail(bestForSelectedMuscle)}>View guide</button>
        </section>
      )}

      <section className="exercise-library-grid readable-exercise-grid">
        {filtered.map((exercise) => (
          <article className="exercise-card detailed-exercise-card" key={exercise.id} style={{ "--exercise-color": exercise.color }}>
            <ExerciseAnimation exercise={exercise} compact />
            <button className={`favorite-btn ${favorites.includes(exercise.id) ? "active" : ""}`} onClick={() => toggleFavorite(exercise.id)} aria-label="Toggle favorite">♡</button>
            <div className="exercise-card-body">
              <div className="chip-row"><span>{exercise.muscle}</span><span>{exercise.type}</span><span>{exercise.difficulty}</span></div>
              <h3>{exercise.name}</h3>
              <p className="exercise-benefit">{exercise.benefit}</p>
              <div className="effectiveness-line">
                <span>FitVerse effectiveness</span>
                <strong>{exercise.effectiveness.toFixed(1)}/10</strong>
              </div>
              <div className="exercise-meta"><span><strong>{exercise.sets}</strong> sets</span><span><strong>{exercise.reps}</strong> reps</span><span><strong>{exercise.rest}s</strong> rest</span></div>
              <footer><button className="secondary-btn small" onClick={() => setDetail(exercise)}>View full guide</button><button className="text-btn" onClick={() => setTutorial(exercise)}>Visual coach</button><button className="text-btn" onClick={() => setReplacement(exercise)}>Replace ↔</button></footer>
            </div>
          </article>
        ))}
      </section>

      {!filtered.length && <div className="panel empty-search-result"><strong>No exercise found</strong><p>Try another muscle, equipment or keyword.</p></div>}

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name || "Exercise guide"} subtitle={detail ? `${detail.muscle} · ${detail.equipment} · ${detail.difficulty}` : ""} size="large">
        {detail && <div className="exercise-guide complete-exercise-guide">
          <ExerciseAnimation exercise={detail} />

          <div className="guide-summary-grid">
            <section><span className="guide-icon">◎</span><div><h3>Muscles trained</h3><p><strong>Primary:</strong> {detail.muscle}</p><p><strong>Secondary:</strong> {detail.secondary.join(", ") || "None"}</p></div></section>
            <section><span className="guide-icon">★</span><div><h3>Best used for</h3><p>{detail.bestFor}</p><p><strong>Rating:</strong> {detail.effectiveness.toFixed(1)}/10</p></div></section>
          </div>

          <section className="plain-guide-section"><span className="guide-icon">✓</span><div><h3>Why this exercise is useful</h3><p>{detail.benefit}</p><p>{detail.whyEffective}</p></div></section>

          <section className="plain-guide-section"><span className="guide-icon">1</span><div><h3>How to do it</h3><ol>{detail.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="form-summary">{detail.form}</p></div></section>

          <section className="warning-section plain-guide-section"><span className="guide-icon">!</span><div><h3>Common mistakes</h3><p>{detail.mistakes}</p></div></section>

          <div className="guide-program"><div><span>Sets</span><strong>{detail.sets}</strong></div><div><span>Reps</span><strong>{detail.reps}</strong></div><div><span>Rest</span><strong>{detail.rest}s</strong></div><div><span>Estimated burn</span><strong>{detail.calories} kcal</strong></div></div>
          <p className="rating-disclaimer">The effectiveness rating is a FitVerse comparison for this prototype, not a universal scientific ranking. Good form, comfort and steady progress matter more than choosing one “perfect” exercise.</p>
          <div className="guide-action-row"><button className="secondary-btn" onClick={() => setTutorial(detail)}>Open visual coach</button><button className="secondary-btn" onClick={() => window.print()}>Print guide</button><button className="primary-btn" onClick={() => { setReplacement(detail); setDetail(null); }}>Find a replacement</button></div>
        </div>}
      </Modal>



      <Modal open={Boolean(tutorial)} onClose={() => setTutorial(null)} title={`${tutorial?.name || "Exercise"} visual coach`} subtitle="Follow the five pictures from left to right. Use slow, controlled reps." size="large">
        {tutorial && <div className="visual-coach-shell" style={{ "--exercise-color": tutorial.color }}>
          <div className="visual-coach-hero">
            <div><span className="eyebrow">Target muscle</span><h2>{tutorial.muscle}</h2><p>{tutorial.benefit}</p></div>
            <div className="muscle-focus-card"><span>Primary</span><strong>{tutorial.muscle}</strong><small>Also works: {tutorial.secondary.join(", ") || "Focused movement"}</small></div>
          </div>

          <ExerciseAnimation exercise={tutorial} />

          <div className="correct-wrong-grid">
            <section className="form-check-card correct">
              <span>✓</span>
              <div><h3>Correct form</h3><p>{tutorial.form}</p><ul>{tutorial.steps.map((step) => <li key={step}>{step}</li>)}</ul></div>
            </section>
            <section className="form-check-card wrong">
              <span>!</span>
              <div><h3>Avoid these mistakes</h3><p>{tutorial.mistakes}</p><ul><li>Do not rush the lowering phase.</li><li>Stop if you feel sharp pain or joint discomfort.</li><li>Use a weight that lets you keep the same form on every rep.</li></ul></div>
            </section>
          </div>

          <div className="visual-coach-program">
            <div><span>Recommended sets</span><strong>{tutorial.sets}</strong></div>
            <div><span>Rep range</span><strong>{tutorial.reps}</strong></div>
            <div><span>Rest time</span><strong>{tutorial.rest}s</strong></div>
            <div><span>Best for</span><strong>{tutorial.bestFor}</strong></div>
          </div>

          <div className="guide-action-row">
            <button className="secondary-btn" onClick={() => window.print()}>Print picture guide</button>
            <button className="primary-btn" onClick={() => { setReplacement(tutorial); setTutorial(null); }}>See replacements</button>
          </div>
        </div>}
      </Modal>

      <Modal open={Boolean(replacement)} onClose={() => setReplacement(null)} title={`Replace ${replacement?.name || "exercise"}`} subtitle="Every suggestion trains a similar muscle or movement pattern." size="large">
        {replacement && <div className="replacement-list smart-replacement-list">
          {replacementOptions.map(({ exercise: item, score, reason }, index) => (
            <button key={item.id} onClick={() => { setDetail(item); setReplacement(null); }}>
              <ExerciseThumbnail exercise={item} label={index === 0 ? "Best match" : "Replacement"} />
              <div>
                <strong>{item.name} {index === 0 && <em className="best-match-label">Best match</em>}</strong>
                <small>{item.muscle} · {item.equipment} · {item.difficulty}</small>
                <p>{reason}. Best for {item.bestFor.toLowerCase()}.</p>
              </div>
              <em>{Math.min(99, score)}%</em>
            </button>
          ))}
        </div>}
      </Modal>
    </div>
  );
}
