import { useEffect, useMemo, useRef, useState } from "react";
import NotificationCenter from "./NotificationCenter";

const DISMISSED_KEY = "fitverse_dismissed_notifications";

function loadDismissedNotifications() {
  try {
    const saved = sessionStorage.getItem(DISMISSED_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Topbar({
  title,
  profile,
  onMenu,
  onNavigate,
  settings,
  setSettings,
  notifications,
  accent,
  accentSoft,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dismissed, setDismissed] = useState(loadDismissedNotifications);
  const searchRef = useRef(null);

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !dismissed.includes(item.id)),
    [notifications, dismissed],
  );

  useEffect(() => {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  }, [dismissed]);

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim().toLowerCase();

    if (!query) return;

    if (query.includes("meal") || query.includes("food") || query.includes("diet") || query.includes("protein")) {
      onNavigate("nutrition");
    } else if (query.includes("exercise") || query.includes("chest") || query.includes("leg") || query.includes("back")) {
      onNavigate("exercises");
    } else if (query.includes("progress") || query.includes("weight") || query.includes("photo")) {
      onNavigate("progress");
    } else if (query.includes("analytics") || query.includes("report") || query.includes("chart") || query.includes("stats")) {
      onNavigate("analytics");
    } else if (query.includes("history") || query.includes("session")) {
      onNavigate("history");
    } else if (query.includes("challenge") || query.includes("badge")) {
      onNavigate("challenges");
    } else if (query.includes("coach") || query.includes("advice")) {
      onNavigate("coach");
    } else if (query.includes("workout") || query.includes("plan")) {
      onNavigate("planner");
    } else {
      onNavigate("dashboard");
    }
  };

  const dismissNotification = (id) => {
    setDismissed((current) => (current.includes(id) ? current : [...current, id]));
  };

  const clearNotifications = () => {
    setDismissed(notifications.map((item) => item.id));
  };

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open menu">☰</button>

      <div className="topbar-title">
        <span>FitVerse /</span>
        <strong>{title}</strong>
      </div>

      <form className="global-search" onSubmit={handleSearch}>
        <span>⌕</span>
        <input
          ref={searchRef}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search workouts, meals, progress…"
          aria-label="Search FitVerse"
        />
        {search && (
          <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
            ✕
          </button>
        )}
        <kbd>/</kbd>
      </form>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={() => setSettings((current) => ({ ...current, theme: current.theme === "dark" ? "light" : "dark" }))}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {settings.theme === "dark" ? "☀" : "☾"}
        </button>

        <button
          className="icon-btn notification-trigger"
          onClick={() => setPanelOpen(true)}
          aria-label="Open notifications"
          aria-expanded={panelOpen}
          title="Notifications"
        >
          ♢
          {visibleNotifications.length > 0 && (
            <span className="notification-dot">{visibleNotifications.length}</span>
          )}
        </button>

        <button className="profile-chip" onClick={() => onNavigate("settings")}>
          <span>{profile.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{profile.name}</strong>
            <small>{profile.goal}</small>
          </div>
        </button>
      </div>

      <NotificationCenter
        open={panelOpen}
        items={visibleNotifications}
        onClose={() => setPanelOpen(false)}
        onNavigate={onNavigate}
        onDismiss={dismissNotification}
        onClear={clearNotifications}
        theme={settings.theme}
        accent={accent}
        accentSoft={accentSoft}
      />
    </header>
  );
}
