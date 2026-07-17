import { useFitness } from "../context/FitnessContext";

export default function Challenges() {
  const { challenges, updateChallenge, notify } = useFitness();
  const joined = challenges.filter((item) => item.joined);
  const completed = challenges.filter((item) => item.progress >= item.goal);
  const earnedXp = completed.reduce((total, item) => total + item.xp, 0);

  return (
    <div className="page">
      <section className="page-heading clear-heading">
        <div><span className="eyebrow">Automatic progress</span><h1>Challenges</h1><p>Challenge progress updates from your workouts, water and protein logs. You do not need to add progress manually.</p></div>
        <div className="xp-chip"><span>✦</span><div><strong>{earnedXp} XP</strong><small>{completed.length} completed</small></div></div>
      </section>

      <section className="challenge-summary-simple">
        <div><strong>{joined.length}</strong><span>Active challenges</span></div>
        <div><strong>{completed.length}</strong><span>Completed</span></div>
        <div><strong>{earnedXp}</strong><span>XP earned</span></div>
      </section>

      <section className="challenge-grid">
        {challenges.map((challenge) => {
          const percentage = Math.min(100, (challenge.progress / Math.max(1, challenge.goal)) * 100);
          return (
            <article key={challenge.id} className={challenge.joined ? "joined" : ""}>
              <header><span>{challenge.icon}</span><em>{challenge.xp} XP</em></header>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <div className="challenge-progress"><i><b style={{ width: `${percentage}%` }} /></i><span>{Math.round(challenge.progress)}/{challenge.goal} {challenge.unit}</span></div>
              {challenge.joined ? (
                <div className="challenge-actions automatic-challenge-actions">
                  <span><i /> Updates automatically</span>
                  <button onClick={() => updateChallenge(challenge.id, { joined: false })}>Leave</button>
                </div>
              ) : (
                <button className="primary-btn full" onClick={() => { updateChallenge(challenge.id, { joined: true }); notify(`Joined ${challenge.title}.`); }}>Join challenge</button>
              )}
            </article>
          );
        })}
      </section>

      <section className="panel badge-panel"><header className="panel-header"><div><span className="eyebrow">Achievements</span><h2>Your badges</h2></div></header><div className="badge-grid">{[["🔥", "First Flame", "Complete 3 workouts"], ["💧", "Hydration Hero", "Reach water target"], ["⚡", "Volume Hunter", "Lift 25,000 kg"], ["🏆", "Consistency", "Complete weekly goal"], ["🥚", "Protein Pro", "Reach protein goal"], ["✦", "Momentum", "Build a 7-day streak"]].map(([icon, title, desc], index) => <article className={index < completed.length + 1 ? "unlocked" : "locked"} key={title}><span>{icon}</span><strong>{title}</strong><small>{desc}</small></article>)}</div></section>
    </div>
  );
}
