export default function ProgressRing({ value, size = 96, stroke = 9, label, sublabel }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring" aria-hidden="true">
        <circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
        <circle className="progress-ring-value" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="progress-ring-label">
        <strong>{label ?? `${Math.round(safeValue)}%`}</strong>
        {sublabel && <span>{sublabel}</span>}
      </div>
    </div>
  );
}
