import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function NotificationCenter({
  open,
  items,
  onClose,
  onNavigate,
  onDismiss,
  onClear,
  theme,
  accent,
  accentSoft,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={`notification-layer theme-${theme}`}
      style={{ "--accent": accent, "--accent-soft": accentSoft }}
    >
      <button
        type="button"
        className="notification-backdrop"
        onClick={onClose}
        aria-label="Close notifications"
      />

      <aside
        className="notification-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
      >
        <header className="notification-drawer-header">
          <div>
            <span className="eyebrow">Today</span>
            <h2 id="notification-title">Notifications</h2>
            <p>{items.length ? `${items.length} updates waiting for you` : "You are all caught up"}</p>
          </div>

          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close notifications">
            ✕
          </button>
        </header>

        <div className="notification-drawer-tools">
          <span>{items.length ? "Tap an update to open its section" : "No new alerts"}</span>
          {items.length > 0 && (
            <button type="button" className="text-btn" onClick={onClear}>
              Clear all
            </button>
          )}
        </div>

        <div className="notification-drawer-list">
          {items.length === 0 ? (
            <div className="notification-empty">
              <span>✓</span>
              <strong>Nothing needs your attention</strong>
              <p>Workout, nutrition and progress reminders will appear here.</p>
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="notification-item-card">
                <button
                  type="button"
                  className="notification-item-main"
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                >
                  <span className="notification-item-icon">{item.icon}</span>
                  <span className="notification-item-copy">
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>Open section →</small>
                  </span>
                </button>

                <button
                  type="button"
                  className="notification-dismiss"
                  onClick={() => onDismiss(item.id)}
                  aria-label={`Dismiss ${item.title}`}
                  title="Dismiss"
                >
                  ✕
                </button>
              </article>
            ))
          )}
        </div>

        <footer className="notification-drawer-footer">
          <span>Stored only for this browser session</span>
          <button type="button" className="secondary-btn small" onClick={onClose}>
            Done
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
