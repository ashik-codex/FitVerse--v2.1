import { useRef, useState } from "react";
import Modal from "../components/Modal";
import { useFitness } from "../context/FitnessContext";

export default function Settings() {
  const { profile, setProfile, settings, setSettings, exportData, importData, resetData, notify } = useFitness();
  const [form, setForm] = useState(profile);
  const [resetOpen, setResetOpen] = useState(false);
  const fileRef = useRef(null);

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(form);
    notify("Profile settings saved.");
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fitverse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify("Backup downloaded.");
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(JSON.parse(reader.result));
        setForm(JSON.parse(reader.result).profile || form);
      } catch {
        notify("Invalid backup file.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="page">
      <section className="page-heading"><div><span className="eyebrow">Personalise the system</span><h1>Settings & Profile</h1><p>Update goals, training preferences, appearance and local data.</p></div></section>
      <section className="settings-layout">
        <form className="panel settings-profile" onSubmit={saveProfile}>
          <header className="panel-header"><div><span className="eyebrow">Fitness profile</span><h2>Your details</h2></div><div className="profile-avatar-large">{form.name.slice(0, 1).toUpperCase()}</div></header>
          <div className="form-grid">
            <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label><span>Fitness goal</span><select value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}><option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option><option>General Fitness</option></select></label>
            <label><span>Experience</span><select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
            <label><span>Diet preference</span><select value={form.diet} onChange={(event) => setForm({ ...form, diet: event.target.value })}><option>Non-Vegetarian</option><option>Vegetarian</option><option>Vegan</option></select></label>
            <label><span>Age</span><input type="number" min="13" max="90" value={form.age} onChange={(event) => setForm({ ...form, age: Number(event.target.value) })} /></label>
            <label><span>Height (cm)</span><input type="number" value={form.height} onChange={(event) => setForm({ ...form, height: Number(event.target.value) })} /></label>
            <label><span>Current weight (kg)</span><input type="number" step="0.1" value={form.weight} onChange={(event) => setForm({ ...form, weight: Number(event.target.value) })} /></label>
            <label><span>Target weight (kg)</span><input type="number" step="0.1" value={form.targetWeight} onChange={(event) => setForm({ ...form, targetWeight: Number(event.target.value) })} /></label>
            <label><span>Workout days / week</span><input type="number" min="1" max="7" value={form.weeklyDays} onChange={(event) => setForm({ ...form, weeklyDays: Number(event.target.value) })} /></label>
            <label><span>Workout duration</span><input type="number" min="15" max="180" value={form.workoutMinutes} onChange={(event) => setForm({ ...form, workoutMinutes: Number(event.target.value) })} /></label>
            <label><span>Sleep goal (hours)</span><input type="number" min="5" max="12" value={form.sleepGoal} onChange={(event) => setForm({ ...form, sleepGoal: Number(event.target.value) })} /></label>
          </div>
          <div className="form-footer"><button className="primary-btn">Save profile</button></div>
        </form>

        <aside className="settings-side">
          <article className="panel appearance-card"><span className="eyebrow">Appearance</span><h2>Theme & accent</h2><div className="theme-switch"><button className={settings.theme === "dark" ? "active" : ""} onClick={() => setSettings({ ...settings, theme: "dark" })}>☾ Dark</button><button className={settings.theme === "light" ? "active" : ""} onClick={() => setSettings({ ...settings, theme: "light" })}>☀ Light</button></div><span className="form-label">Accent colour</span><div className="accent-row">{[['violet','#8b5cf6'],['cyan','#22d3ee'],['green','#22c55e'],['orange','#f97316'],['pink','#ec4899']].map(([name, color]) => <button key={name} className={settings.accent === name ? "active" : ""} style={{ background: color }} onClick={() => setSettings({ ...settings, accent: name })} aria-label={`${name} accent`} />)}</div></article>
          <article className="panel data-card"><span className="eyebrow">Local data</span><h2>Backup & restore</h2><p>Your prototype stores data in this browser using LocalStorage.</p><button className="secondary-btn full" onClick={downloadBackup}>↓ Export JSON backup</button><button className="secondary-btn full" onClick={() => fileRef.current?.click()}>↑ Import JSON backup</button><input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} /><button className="danger-btn full" onClick={() => setResetOpen(true)}>Reset demo data</button></article>
          <article className="panel about-card"><span className="eyebrow">Portfolio build</span><h2>FitVerse v1.0</h2><p>React + Vite frontend prototype with LocalStorage, responsive UI, workout planning and nutrition tracking.</p><div><span>Frontend only</span><span>No backend</span><span>Demo guidance</span></div></article>
        </aside>
      </section>
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset all demo data?" subtitle="This replaces your current local data with the starter sample data."><div className="confirm-reset"><span>!</span><p>This action cannot be undone unless you export a backup first.</p><div><button className="secondary-btn" onClick={() => setResetOpen(false)}>Cancel</button><button className="danger-btn" onClick={() => { resetData(); setForm({ ...profile }); setResetOpen(false); }}>Reset everything</button></div></div></Modal>
    </div>
  );
}
