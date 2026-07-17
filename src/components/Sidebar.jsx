import { useEffect } from "react";

const items = [
  ["dashboard", "⌂", "Dashboard"],
  ["planner", "◫", "Workout Planner"],
  ["live", "▶", "Live Workout"],
  ["exercises", "◎", "Exercise Library"],
  ["nutrition", "◒", "Nutrition"],
  ["progress", "↗", "Progress"],
  ["analytics", "▥", "Analytics"],
  ["history", "◷", "History"],
  ["challenges", "✦", "Challenges"],
  ["coach", "✧", "Smart Coach"],
  ["settings", "⚙", "Settings"],
];

export default function Sidebar({ page, setPage, open, onClose, activeWorkout }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const navigate = (nextPage) => {
    setPage(nextPage);
    onClose();
  };

  return (
    <>
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-top-row">
          <div className="brand-block">
            <div className="brand-mark">FV</div>
            <div>
              <strong>FitVerse</strong>
              <span>Move. Track. Evolve.</span>
            </div>
          </div>

          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        {activeWorkout && (
          <button className="live-pill" onClick={() => navigate("live")}>
            <span className="live-dot" /> Workout in progress
          </button>
        )}

        <nav className="sidebar-nav">
          <span className="nav-label">Your space</span>
          {items.map(([id, icon, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => navigate(id)}
              aria-current={page === id ? "page" : undefined}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
              {id === "live" && activeWorkout && <em>LIVE</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-upgrade">
          <span>PORTFOLIO BUILD</span>
          <strong>Simple fitness companion</strong>
          <p>Plan workouts, learn form, track food and review progress in one place.</p>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="mobile-overlay"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
