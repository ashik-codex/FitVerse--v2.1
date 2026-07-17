import { useEffect, useMemo, useState } from "react";
import { getExerciseMedia } from "../data/exerciseMedia";

function SourcePhoto({ localSrc, remoteSrc, fallback, alt, label, mediaKey }) {
  const preferred = typeof navigator !== "undefined" && navigator.onLine ? remoteSrc : localSrc;
  const candidates = useMemo(
    () => [...new Set([preferred, localSrc, remoteSrc, fallback].filter(Boolean))],
    [preferred, localSrc, remoteSrc, fallback],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [mediaKey, localSrc, remoteSrc, fallback]);

  const visibleSrc = candidates[candidateIndex];
  const failed = candidateIndex >= candidates.length;

  return (
    <figure className="source-photo-card" data-media-key={mediaKey}>
      <div className="source-photo-label">{label}</div>
      {!failed && visibleSrc ? (
        <img
          key={`${mediaKey}-${candidateIndex}-${visibleSrc}`}
          src={visibleSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={() => setCandidateIndex((index) => index + 1)}
        />
      ) : (
        <div className="source-photo-fallback">
          <strong>Photo unavailable</strong>
          <span>Use the written form steps below.</span>
        </div>
      )}
    </figure>
  );
}

export function ExerciseThumbnail({ exercise, label = "Exercise preview" }) {
  const media = getExerciseMedia(exercise);
  const candidates = useMemo(
    () => [...new Set([
      typeof navigator !== "undefined" && navigator.onLine ? media.remoteStart : media.start,
      media.start,
      media.remoteStart,
      media.fallbackStart,
    ].filter(Boolean))],
    [media.remoteStart, media.start, media.fallbackStart],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [media.identity]);

  return (
    <div key={media.identity} className="exercise-thumbnail" style={{ "--exercise-color": exercise?.color || "var(--accent)" }}>
      {candidates[candidateIndex] ? (
        <img
          key={`${media.identity}-${candidateIndex}`}
          src={candidates[candidateIndex]}
          alt={`${exercise?.name || "Exercise"} start position`}
          loading="lazy"
          onError={() => setCandidateIndex((index) => index + 1)}
        />
      ) : <span className="thumbnail-fallback">No photo</span>}
      <span>{label}</span>
    </div>
  );
}

export default function ExerciseAnimation({ exercise, compact = false }) {
  const media = getExerciseMedia(exercise);

  return (
    <section
      key={media.identity}
      className={`exercise-source-guide ${compact ? "compact" : ""}`}
      style={{ "--exercise-color": exercise?.color || "var(--accent)" }}
      aria-label={`${exercise?.name || "Exercise"} source photo guide`}
      data-exercise-id={exercise?.id || ""}
      data-media-source={media.sourceId}
      data-media-identity={media.identity}
    >
      <div className="source-photo-grid" key={`grid-${media.identity}`}>
        <SourcePhoto
          localSrc={media.start}
          remoteSrc={media.remoteStart}
          fallback={media.fallbackStart}
          mediaKey={`${media.identity}-start`}
          label="1 · Start position"
          alt={`${exercise?.name || "Exercise"} start position`}
        />
        <SourcePhoto
          localSrc={media.finish}
          remoteSrc={media.remoteFinish}
          fallback={media.fallbackFinish}
          mediaKey={`${media.identity}-finish`}
          label="2 · Working position"
          alt={`${exercise?.name || "Exercise"} working position`}
        />
      </div>

      {!compact && (
        <div className="source-movement-flow">
          <div><span>1</span><strong>Set up</strong><p>{exercise?.steps?.[0] || "Take a stable starting position."}</p></div>
          <div><span>2</span><strong>Move</strong><p>{exercise?.steps?.[1] || "Move with control through the main range."}</p></div>
          <div><span>3</span><strong>Finish</strong><p>{exercise?.steps?.[2] || "Reach the working position without losing form."}</p></div>
          <div><span>4</span><strong>Return</strong><p>Return slowly to the start and repeat without using momentum.</p></div>
        </div>
      )}

      <footer className="source-photo-credit">
        <span>{exercise?.name} · {media.sourceId.replaceAll("_", " ")} · v2.1 media sync</span>
        <a href={media.sourcePage} target="_blank" rel="noreferrer">View source ↗</a>
      </footer>
    </section>
  );
}
