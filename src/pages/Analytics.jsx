import { useMemo, useState } from "react";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import { useFitness } from "../context/FitnessContext";

export default function Analytics() {
  const { analytics, history, progress, nutrition, profile } = useFitness();
  const [range, setRange] = useState("30");

  const sessions = useMemo(() => {
    if (range === "all") return history;
    const days = Number(range);
    return history.filter((item) => Date.now() - new Date(`${item.date}T00:00:00`).getTime() <= days * 86400000);
  }, [history, range]);

  const chartSessions = [...sessions].slice(0, 8).reverse();
  const maxVolume = Math.max(...chartSessions.map((item) => Number(item.volume || 0)), 1);
  const maxDuration = Math.max(...chartSessions.map((item) => Number(item.duration || 0)), 1);
  const muscleEntries = Object.entries(analytics.muscleFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  const maxMuscle = Math.max(...muscleEntries.map(([, count]) => count), 1);

  const weightLogs = progress.weightLogs || [];
  const weightValues = weightLogs.map((item) => Number(item.value));
  const minWeight = Math.min(...weightValues, profile.weight) - 1;
  const maxWeight = Math.max(...weightValues, profile.weight) + 1;
  const weightPoints = weightLogs.map((item, index) => {
    const x = weightLogs.length === 1 ? 50 : (index / (weightLogs.length - 1)) * 100;
    const y = 88 - ((Number(item.value) - minWeight) / (maxWeight - minWeight || 1)) * 72;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="page analytics-page">
      <section className="page-heading clear-heading">
        <div>
          <span className="eyebrow">Automatically updated</span>
          <h1>Fitness Analytics</h1>
          <p>Your workout, nutrition and body-progress numbers update whenever you log new data.</p>
        </div>
        <label className="range-control">
          <span>Time range</span>
          <select value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </label>
      </section>

      <section className="stats-grid readable-stats">
        <StatCard icon="✓" label="Completed workouts" value={`${sessions.length}`} helper={`${analytics.totalSessions} total sessions`} tone="green" />
        <StatCard icon="◷" label="Training time" value={`${sessions.reduce((sum, item) => sum + Number(item.duration || 0), 0)} min`} helper={`${analytics.totalMinutes} min all time`} tone="cyan" />
        <StatCard icon="↗" label="Training volume" value={`${Math.round(sessions.reduce((sum, item) => sum + Number(item.volume || 0), 0) / 100) / 10}k kg`} helper="Based on logged sets" tone="orange" />
        <StatCard icon="★" label="Average rating" value={`${analytics.averageRating.toFixed(1)}/10`} helper="How your sessions felt" tone="violet" />
      </section>

      <section className="analytics-grid">
        <article className="panel analytics-wide">
          <header className="panel-header">
            <div><span className="eyebrow">Workout trend</span><h2>Volume and duration</h2></div>
            <span className="live-update-pill"><i /> Live from your logs</span>
          </header>
          {chartSessions.length ? (
            <div className="dual-chart">
              {chartSessions.map((item) => (
                <div className="dual-column" key={item.id}>
                  <div className="dual-bars">
                    <i className="volume-bar" style={{ height: `${Math.max(10, (Number(item.volume || 0) / maxVolume) * 100)}%` }} title={`${item.volume} kg`} />
                    <i className="duration-bar" style={{ height: `${Math.max(10, (Number(item.duration || 0) / maxDuration) * 100)}%` }} title={`${item.duration} minutes`} />
                  </div>
                  <strong>{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
                  <small>{item.name}</small>
                </div>
              ))}
            </div>
          ) : <div className="empty-inline">Complete a workout to see this chart.</div>}
          <div className="chart-legend"><span><i className="legend-volume" /> Volume</span><span><i className="legend-duration" /> Duration</span></div>
        </article>

        <article className="panel analytics-score-card">
          <header className="panel-header"><div><span className="eyebrow">This week</span><h2>Consistency</h2></div></header>
          <ProgressRing value={analytics.consistency} size={146} label={`${analytics.consistency}%`} sublabel="of weekly goal" />
          <p>You completed <strong>{analytics.sessionsThisWeek}</strong> of your planned <strong>{profile.weeklyDays}</strong> sessions.</p>
        </article>

        <article className="panel">
          <header className="panel-header"><div><span className="eyebrow">Muscle balance</span><h2>Training frequency</h2></div></header>
          <div className="muscle-analytics-list">
            {muscleEntries.length ? muscleEntries.map(([muscle, count]) => (
              <div key={muscle}>
                <span>{muscle}</span>
                <i><b style={{ width: `${(count / maxMuscle) * 100}%` }} /></i>
                <strong>{count}×</strong>
              </div>
            )) : <div className="empty-inline">Muscle data appears after completed workouts.</div>}
          </div>
        </article>

        <article className="panel nutrition-analytics-card">
          <header className="panel-header"><div><span className="eyebrow">Today</span><h2>Nutrition progress</h2></div></header>
          <div className="nutrition-rings">
            <ProgressRing value={analytics.caloriePercent} size={104} label={`${analytics.caloriePercent}%`} sublabel="Calories" />
            <ProgressRing value={analytics.proteinPercent} size={104} label={`${analytics.proteinPercent}%`} sublabel="Protein" />
            <ProgressRing value={analytics.hydrationPercent} size={104} label={`${analytics.hydrationPercent}%`} sublabel="Water" />
          </div>
          <div className="analytics-note">Logged today: {analytics.consumed.calories}/{nutrition.caloriesTarget} kcal and {analytics.consumed.protein}/{nutrition.proteinTarget}g protein.</div>
        </article>

        <article className="panel analytics-wide weight-analytics-card">
          <header className="panel-header"><div><span className="eyebrow">Body progress</span><h2>Weight trend</h2></div><strong className={analytics.weightChange >= 0 ? "positive-change" : "negative-change"}>{analytics.weightChange >= 0 ? "+" : ""}{analytics.weightChange.toFixed(1)} kg</strong></header>
          {weightLogs.length ? (
            <div className="analytics-weight-chart">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Weight trend">
                <polyline points={weightPoints} fill="none" stroke="var(--accent)" strokeWidth="2.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>{weightLogs.map((item) => <span key={`${item.date}-${item.value}`}><strong>{item.value} kg</strong><small>{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small></span>)}</div>
            </div>
          ) : <div className="empty-inline">Log your weight to see the trend.</div>}
        </article>
      </section>
    </div>
  );
}
