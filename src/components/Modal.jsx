import { useEffect } from "react";

export default function Modal({ open, onClose, title, subtitle, children, size = "medium" }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <section className={`modal-card modal-${size}`} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <span className="eyebrow">FitVerse</span>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
