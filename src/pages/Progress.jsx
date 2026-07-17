import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { useFitness } from "../context/FitnessContext";

export default function Progress() {
  const { profile, progress, logWeight, updateMeasurements, addProgressPhoto, history } = useFitness();
  const [weightOpen, setWeightOpen] = useState(false);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [weight, setWeight] = useState(profile.weight);
  const [measurements, setMeasurements] = useState(progress.measurements);

  const values = progress.weightLogs.map((item) => item.value);
  const min = Math.min(...values, profile.weight) - 1;
  const max = Math.max(...values, profile.weight) + 1;
  const points = useMemo(() => progress.weightLogs.map((item, index) => {
    const x = progress.weightLogs.length === 1 ? 50 : (index / (progress.weightLogs.length - 1)) * 100;
    const y = 90 - ((item.value - min) / (max - min || 1)) * 75;
    return `${x},${y}`;
  }).join(" "), [progress.weightLogs, min, max]);

  const totalVolume = history.reduce((total, item) => total + item.volume, 0);
  const totalMinutes = history.reduce((total, item) => total + item.duration, 0);
  const change = progress.weightLogs.length > 1 ? profile.weight - progress.weightLogs[0].value : 0;

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => addProgressPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="page">
      <section className="page-heading">
        <div><span className="eyebrow">Evidence over emotion</span><h1>Progress</h1><p>Track body weight, measurements, photos, strength and training consistency.</p></div>
        <div className="heading-actions"><button className="secondary-btn" onClick={() => setMeasurementOpen(true)}>Update measurements</button><button className="primary-btn" onClick={() => setWeightOpen(true)}>＋ Log weight</button></div>
      </section>

      <section className="stats-grid">
        <StatCard icon="⚖" label="Current weight" value={`${profile.weight} kg`} helper={`${change >= 0 ? '+' : ''}${change.toFixed(1)} kg overall`} tone="violet" />
        <StatCard icon="◷" label="Training time" value={`${totalMinutes} min`} helper={`${history.length} completed sessions`} tone="cyan" />
        <StatCard icon="↗" label="Total volume" value={`${Math.round(totalVolume / 1000)}k kg`} helper="Across logged workouts" tone="orange" />
        <StatCard icon="✦" label="Goal progress" value={`${Math.round((profile.weight / profile.targetWeight) * 100)}%`} helper={`Target ${profile.targetWeight} kg`} tone="green" />
      </section>

      <section className="progress-layout">
        <article className="panel weight-chart-panel">
          <header className="panel-header"><div><span className="eyebrow">Trend</span><h2>Body weight</h2></div><button className="text-btn" onClick={() => setWeightOpen(true)}>Add entry →</button></header>
          <div className="weight-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Weight trend chart"><defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs><polyline points={`0,100 ${points} 100,100`} fill="url(#weightFill)" stroke="none"/><polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="chart-labels">{progress.weightLogs.map((item) => <span key={`${item.date}-${item.value}`}><strong>{item.value}kg</strong><small>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small></span>)}</div>
          </div>
        </article>

        <article className="panel measurements-panel"><header className="panel-header"><div><span className="eyebrow">Measurements</span><h2>Body stats</h2></div><button className="text-btn" onClick={() => setMeasurementOpen(true)}>Edit →</button></header><div className="measurement-grid">{Object.entries(progress.measurements).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value} cm</strong><small>Last updated today</small></div>)}</div></article>

        <article className="panel photo-panel"><header className="panel-header"><div><span className="eyebrow">Visual journey</span><h2>Progress photos</h2></div><label className="text-btn upload-label">＋ Upload<input type="file" accept="image/*" onChange={handlePhoto} /></label></header>{progress.photos.length ? <div className="photo-grid">{progress.photos.map((photo) => <figure key={photo.id}><img src={photo.src} alt={`Progress on ${photo.date}`} /><figcaption>{photo.date}</figcaption></figure>)}</div> : <label className="photo-empty"><span>＋</span><strong>Add your first progress photo</strong><p>Stored only in this browser for the prototype.</p><input type="file" accept="image/*" onChange={handlePhoto} /></label>}</article>

        <article className="panel personal-records"><header className="panel-header"><div><span className="eyebrow">Strength wins</span><h2>Personal records</h2></div></header>{[['Leg Press', '140 kg', '+10 kg'], ['Incline DB Press', '24 kg', '+2 kg'], ['Lat Pulldown', '65 kg', '+5 kg'], ['Goblet Squat', '32 kg', '+4 kg']].map(([name, value, changeValue]) => <div key={name}><span>🏆</span><div><strong>{name}</strong><small>All-time best</small></div><em>{value}<small>{changeValue}</small></em></div>)}</article>
      </section>

      <Modal open={weightOpen} onClose={() => setWeightOpen(false)} title="Log body weight" subtitle="Add today’s measurement in kilograms."><form className="single-form" onSubmit={(event) => { event.preventDefault(); logWeight(weight); setWeightOpen(false); }}><label><span>Weight (kg)</span><input type="number" step="0.1" min="30" max="250" value={weight} onChange={(event) => setWeight(event.target.value)} /></label><button className="primary-btn full">Save weight</button></form></Modal>
      <Modal open={measurementOpen} onClose={() => setMeasurementOpen(false)} title="Update measurements" subtitle="Use the same measuring method each time."><form className="form-grid" onSubmit={(event) => { event.preventDefault(); updateMeasurements(measurements); setMeasurementOpen(false); }}>{Object.entries(measurements).map(([key, value]) => <label key={key}><span>{key[0].toUpperCase() + key.slice(1)} (cm)</span><input type="number" step="0.1" value={value} onChange={(event) => setMeasurements({ ...measurements, [key]: Number(event.target.value) })} /></label>)}<div className="modal-actions full-field"><button type="button" className="secondary-btn" onClick={() => setMeasurementOpen(false)}>Cancel</button><button className="primary-btn">Save measurements</button></div></form></Modal>
    </div>
  );
}
