import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import ExerciseAnimation from "../components/ExerciseAnimation";
import { useFitness } from "../context/FitnessContext";
import { exercises } from "../data/fitnessData";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Dashboard({ navigate }) {
  const { profile, plans, history, nutrition, startWorkout, activeWorkout, analytics } = useFitness();
  const today = dayNames[new Date().getDay()];
  const todayPlan = plans.find((plan) => plan.day === today) || plans[0];
  const firstExercise = exercises.find((item) => item.id === todayPlan?.exercises?.[0]);
  const recent = history.slice(0, 3);

  return (
    <div className="page dashboard-page simple-dashboard">
      <section className="simple-welcome-card">
        <div>
          <span className="eyebrow">Hello, {profile.name}</span>
          <h1>Today’s fitness plan</h1>
          <p>Start your workout, check your food progress and see what needs attention today.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => activeWorkout ? navigate("live") : startWorkout(todayPlan)}>
              {activeWorkout ? "Continue workout" : "Start today’s workout"} <span>→</span>
            </button>
            <button className="secondary-btn" onClick={() => navigate("planner")}>View weekly plan</button>
          </div>
        </div>
        <div className="today-status-card">
          <span>{today}</span>
          <strong>{activeWorkout?.name || todayPlan?.name || "No workout planned"}</strong>
          <small>{activeWorkout ? "Workout is in progress" : `${todayPlan?.exercises?.length || 0} exercises · ${todayPlan?.duration || 0} min`}</small>
        </div>
      </section>

      <section className="stats-grid readable-stats">
        <StatCard icon="✓" label="Workouts this week" value={`${analytics.sessionsThisWeek}`} helper={`Goal: ${profile.weeklyDays} sessions`} tone="green" />
        <StatCard icon="◷" label="Training time" value={`${analytics.totalMinutes} min`} helper={`${analytics.totalSessions} sessions saved`} tone="cyan" />
        <StatCard icon="🥚" label="Protein today" value={`${analytics.consumed.protein}g`} helper={`Target: ${nutrition.proteinTarget}g`} tone="violet" />
        <StatCard icon="💧" label="Water today" value={`${nutrition.water}/${nutrition.waterTarget}`} helper={`${analytics.hydrationPercent}% of target`} tone="orange" />
      </section>

      <section className="simple-dashboard-grid">
        <article className="panel today-workout-panel">
          <header className="panel-header">
            <div><span className="eyebrow">Today’s workout</span><h2>{todayPlan?.name}</h2></div>
            <button className="text-btn" onClick={() => navigate("planner")}>Change plan →</button>
          </header>
          <div className="today-workout-content">
            {firstExercise && <ExerciseAnimation exercise={firstExercise} compact />}
            <div>
              <p><strong>Focus:</strong> {todayPlan?.focus}</p>
              <p><strong>Time:</strong> About {todayPlan?.duration} minutes</p>
              <p><strong>Level:</strong> {todayPlan?.level}</p>
              <div className="workout-exercise-list">
                {todayPlan?.exercises?.slice(0, 5).map((id, index) => {
                  const exercise = exercises.find((item) => item.id === id);
                  return <span key={id}><b>{index + 1}</b>{exercise?.name}</span>;
                })}
              </div>
            </div>
          </div>
        </article>

        <article className="panel daily-check-panel">
          <header className="panel-header"><div><span className="eyebrow">Daily check</span><h2>Today’s targets</h2></div></header>
          <div className="daily-ring-grid">
            <ProgressRing value={analytics.proteinPercent} size={104} label={`${analytics.proteinPercent}%`} sublabel="Protein" />
            <ProgressRing value={analytics.hydrationPercent} size={104} label={`${analytics.hydrationPercent}%`} sublabel="Water" />
            <ProgressRing value={analytics.recoveryScore} size={104} label={`${analytics.recoveryScore}%`} sublabel="Recovery" />
          </div>
          <button className="secondary-btn full" onClick={() => navigate("nutrition")}>Update food and water</button>
        </article>

        <article className="panel quick-actions-panel">
          <header className="panel-header"><div><span className="eyebrow">Quick actions</span><h2>What do you want to do?</h2></div></header>
          <div className="quick-grid simple-quick-grid">
            <button onClick={() => navigate("exercises")}><span>◎</span><strong>Learn an exercise</strong><small>Form, muscles and alternatives</small></button>
            <button onClick={() => navigate("nutrition")}><span>◒</span><strong>Log a meal</strong><small>Update calories and protein</small></button>
            <button onClick={() => navigate("progress")}><span>↗</span><strong>Log progress</strong><small>Weight or measurements</small></button>
            <button onClick={() => navigate("analytics")}><span>▥</span><strong>View analytics</strong><small>Charts update automatically</small></button>
          </div>
        </article>

        <article className="panel recent-activity-panel">
          <header className="panel-header"><div><span className="eyebrow">Recent activity</span><h2>Latest workouts</h2></div><button className="text-btn" onClick={() => navigate("history")}>Full history →</button></header>
          <div className="recent-session-list">
            {recent.length ? recent.map((item) => (
              <div key={item.id}>
                <span>✓</span>
                <div><strong>{item.name}</strong><small>{item.date} · {item.duration} min</small></div>
                <em>{item.rating}/10</em>
              </div>
            )) : <div className="empty-inline">No completed workout yet.</div>}
          </div>
        </article>
      </section>
    </div>
  );
}
