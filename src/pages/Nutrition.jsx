import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import ProgressRing from "../components/ProgressRing";
import { useFitness } from "../context/FitnessContext";
import { mealLibrary } from "../data/fitnessData";

export default function Nutrition() {
  const { nutrition, setNutrition, addMeal, removeMeal, addWater, removeWater } = useFitness();
  const [mealOpen, setMealOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: "", type: "Meal", calories: 400, protein: 25, carbs: 40, fat: 12, tags: ["Custom"] });

  const totals = useMemo(() => nutrition.meals.reduce((sum, meal) => ({
    calories: sum.calories + Number(meal.calories || 0),
    protein: sum.protein + Number(meal.protein || 0),
    carbs: sum.carbs + Number(meal.carbs || 0),
    fat: sum.fat + Number(meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [nutrition.meals]);

  const filteredMeals = mealLibrary.filter((meal) => [meal.name, meal.type, ...meal.tags].join(" ").toLowerCase().includes(search.toLowerCase()));

  const submitCustom = (event) => {
    event.preventDefault();
    addMeal(customMeal);
    setCustomOpen(false);
    setCustomMeal({ name: "", type: "Meal", calories: 400, protein: 25, carbs: 40, fat: 12, tags: ["Custom"] });
  };

  return (
    <div className="page">
      <section className="page-heading">
        <div><span className="eyebrow">Daily fuel system</span><h1>Nutrition</h1><p>Track calories, macros, hydration and practical Kerala-friendly meal choices.</p></div>
        <div className="heading-actions"><button className="secondary-btn" onClick={() => setCustomOpen(true)}>＋ Custom meal</button><button className="primary-btn" onClick={() => setMealOpen(true)}>Browse meals</button></div>
      </section>

      <section className="nutrition-hero panel">
        <div className="nutrition-hero-main"><ProgressRing value={(totals.calories / nutrition.caloriesTarget) * 100} size={150} label={totals.calories} sublabel={`${nutrition.caloriesTarget} kcal`} /><div><span className="eyebrow">Calories consumed</span><h2>{Math.max(0, nutrition.caloriesTarget - totals.calories)} kcal remaining</h2><p>Stay within your target while prioritising protein and whole foods.</p></div></div>
        <div className="macro-cards">
          {[['Protein', totals.protein, nutrition.proteinTarget, 'violet'], ['Carbs', totals.carbs, nutrition.carbsTarget, 'cyan'], ['Fat', totals.fat, nutrition.fatTarget, 'orange']].map(([label, value, target, tone]) => <article key={label} className={`macro-card ${tone}`}><span>{label}</span><strong>{value}g</strong><small>of {target}g</small><i><b style={{ width: `${Math.min(100, value / target * 100)}%` }} /></i></article>)}
        </div>
      </section>

      <section className="nutrition-layout">
        <div className="meal-log panel">
          <header className="panel-header"><div><span className="eyebrow">Today</span><h2>Meal log</h2></div><button className="text-btn" onClick={() => setMealOpen(true)}>＋ Add meal</button></header>
          <div className="meal-list">
            {nutrition.meals.length ? nutrition.meals.map((meal, index) => <article key={`${meal.id}-${meal.logId || index}`}><div className="meal-symbol">{meal.type === "Breakfast" ? "☀" : meal.type === "Lunch" ? "◐" : meal.type === "Dinner" ? "☾" : "✦"}</div><div className="meal-copy"><span>{meal.type}</span><strong>{meal.name}</strong><p>{meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat</p></div><em>{meal.calories} kcal</em><button className="icon-btn danger" onClick={() => removeMeal(index)}>✕</button></article>) : <div className="empty-inline">No meals logged today.</div>}
          </div>
        </div>

        <aside className="nutrition-side">
          <article className="panel water-card"><header className="panel-header"><div><span className="eyebrow">Hydration</span><h2>Water tracker</h2></div><strong>{nutrition.water}/{nutrition.waterTarget}</strong></header><div className="bottle-row">{Array.from({ length: nutrition.waterTarget }, (_, index) => <span key={index} className={index < nutrition.water ? "filled" : ""}>💧</span>)}</div><div className="water-actions"><button onClick={removeWater}>−</button><button onClick={addWater}>＋ Add glass</button></div></article>
          <article className="panel nutrition-tip"><span>✧</span><div><strong>Smart food swap</strong><p>Chicken unavailable? Try fish, eggs, paneer or soya chunks to keep protein high.</p></div></article>
          <article className="panel target-editor"><span className="eyebrow">Targets</span><h3>Adjust daily goals</h3>{[['Calories', 'caloriesTarget'], ['Protein (g)', 'proteinTarget'], ['Carbs (g)', 'carbsTarget'], ['Fat (g)', 'fatTarget']].map(([label, key]) => <label key={key}><span>{label}</span><input type="number" value={nutrition[key]} onChange={(event) => setNutrition({ ...nutrition, [key]: Number(event.target.value) })} /></label>)}</article>
        </aside>
      </section>

      <Modal open={mealOpen} onClose={() => setMealOpen(false)} title="Meal library" subtitle="Choose practical meals and add them to today." size="large">
        <div className="modal-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chicken, Kerala, vegetarian…" /></div>
        <div className="meal-library-grid">{filteredMeals.map((meal) => <article key={meal.id}><header><span>{meal.type}</span><em>{meal.calories} kcal</em></header><h3>{meal.name}</h3><p>{meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat</p><div className="chip-row">{meal.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="primary-btn small full" onClick={() => addMeal(meal)}>Add to today</button></article>)}</div>
      </Modal>

      <Modal open={customOpen} onClose={() => setCustomOpen(false)} title="Create a custom meal" subtitle="Add your own food combination and macros.">
        <form className="form-grid" onSubmit={submitCustom}>
          <label className="full-field"><span>Meal name</span><input required value={customMeal.name} onChange={(event) => setCustomMeal({ ...customMeal, name: event.target.value })} placeholder="Example: Rice + egg curry" /></label>
          <label><span>Meal type</span><select value={customMeal.type} onChange={(event) => setCustomMeal({ ...customMeal, type: event.target.value })}><option>Breakfast</option><option>Lunch</option><option>Snack</option><option>Dinner</option><option>Meal</option></select></label>
          {['calories', 'protein', 'carbs', 'fat'].map((key) => <label key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><input type="number" min="0" value={customMeal[key]} onChange={(event) => setCustomMeal({ ...customMeal, [key]: Number(event.target.value) })} /></label>)}
          <div className="modal-actions full-field"><button type="button" className="secondary-btn" onClick={() => setCustomOpen(false)}>Cancel</button><button className="primary-btn">Add custom meal</button></div>
        </form>
      </Modal>
    </div>
  );
}
