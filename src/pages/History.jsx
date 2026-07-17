import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import { useFitness } from "../context/FitnessContext";

export default function History() {
  const { history, setHistory } = useFitness();
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => history.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [history, search]);
  const totals = history.reduce((sum, item) => ({ duration: sum.duration + item.duration, volume: sum.volume + item.volume, calories: sum.calories + item.calories }), { duration: 0, volume: 0, calories: 0 });

  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow">Training archive</span><h1>Workout History</h1><p>Review completed sessions, volume, duration and consistency.</p></div><div className="heading-badge">{history.length} sessions</div></section>
      <section className="history-summary">{[['Total time', `${totals.duration} min`, '◷'], ['Total volume', `${Math.round(totals.volume / 1000)}k kg`, '↗'], ['Calories', `${totals.calories} kcal`, '🔥'], ['Average rating', `${history.length ? (history.reduce((sum, item) => sum + item.rating, 0) / history.length).toFixed(1) : 0}/10`, '✦']].map(([label, value, icon]) => <article key={label}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>)}</section>
      <section className="panel history-panel"><header className="panel-header"><div><span className="eyebrow">Completed sessions</span><h2>All workouts</h2></div><div className="search-input compact"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search history" /></div></header><div className="history-table"><div className="history-row history-head"><span>Date</span><span>Workout</span><span>Duration</span><span>Volume</span><span>Rating</span><span /></div>{filtered.map((item) => <div className="history-row" key={item.id}><span>{new Date(item.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span><strong>{item.name}</strong><span>{item.duration} min</span><span>{item.volume.toLocaleString()} kg</span><span>{'★'.repeat(Math.round(item.rating / 2))}{'☆'.repeat(5 - Math.round(item.rating / 2))}</span><div><button className="icon-btn" onClick={() => setDetail(item)}>◫</button><button className="icon-btn danger" onClick={() => setHistory((items) => items.filter((historyItem) => historyItem.id !== item.id))}>⌫</button></div></div>)}</div></section>
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name || "Session details"} subtitle={detail ? new Date(detail.date).toLocaleDateString() : ""}>{detail && <div className="session-detail"><div><span>Duration</span><strong>{detail.duration} min</strong></div><div><span>Exercises</span><strong>{detail.exercises}</strong></div><div><span>Volume</span><strong>{detail.volume.toLocaleString()} kg</strong></div><div><span>Calories</span><strong>{detail.calories} kcal</strong></div><div className="full-field"><span>Session rating</span><strong>{detail.rating}/10</strong></div></div>}</Modal>
    </div>
  );
}
