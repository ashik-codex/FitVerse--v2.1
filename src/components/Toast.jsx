import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3600);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = { success: "✓", warning: "!", error: "×", info: "i" };
  const titles = { success: "Done", warning: "Heads up", error: "Something went wrong", info: "Update" };
  const type = toast.type || "success";

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span className="toast-icon">{icons[type] || icons.success}</span>
      <div className="toast-copy">
        <strong>{titles[type] || titles.success}</strong>
        <p>{toast.message}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close notification">✕</button>
      <span className="toast-progress" aria-hidden="true" />
    </div>
  );
}
