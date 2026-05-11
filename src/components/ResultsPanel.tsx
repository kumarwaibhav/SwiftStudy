import { VideoCard } from './VideoCard';
import type { SearchResult } from '@/types';

interface ResultsPanelProps {
  selectedTopic: string | null;
  result: SearchResult | null;
  isLoading: boolean;
  isError: boolean;
  logLines: string[];
  accent: string;
  glow: string;
  activeUnit: number;
  unitTitle: string;
  onRetry: () => void;
  onRefresh: () => void;
}

export function ResultsPanel({
  selectedTopic, result, isLoading, isError, logLines,
  accent, glow, activeUnit, unitTitle, onRetry, onRefresh,
}: ResultsPanelProps) {
  // ── Empty state ────────────────────────────────────────────────────────────
  if (!selectedTopic) {
    return (
      <div className="results-empty">
        <span className="empty-icon" style={{ color: accent }}>◈</span>
        <p className="empty-title">Select a topic to find YouTube videos</p>
        <p className="empty-sub">AI will search and curate the best resources using the 4-layer prompt stack</p>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="results-loading">
        <p className="loading-topic" style={{ color: accent }}>⟳ Searching: &quot;{selectedTopic}&quot;</p>
        <ul className="log-list" aria-live="polite" aria-label="Search progress">
          {logLines.map((line, i) => (
            <li key={i} className="log-line">
              <span className="log-arrow" style={{ color: accent }}>▸</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="skeletons">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="results-error">
        <p className="error-msg">{logLines[logLines.length - 1] ?? 'Could not retrieve results.'}</p>
        <button className="btn-retry" style={{ background: accent }} onClick={onRetry}>
          Retry Search
        </button>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (!result) return null;

  return (
    <div className="results-success">
      <div className="results-meta">
        <p className="results-breadcrumb">
          UNIT {activeUnit} · {unitTitle.toUpperCase()}
        </p>
        <h2 className="results-topic">{selectedTopic}</h2>
        {result.study_tip && (
          <div
            className="study-tip"
            style={{ background: glow, borderColor: `${accent}25` }}
            role="note"
            aria-label="Exam tip"
          >
            <span className="tip-label" style={{ color: accent }}>💡 EXAM TIP  </span>
            {result.study_tip}
          </div>
        )}
      </div>

      <p className="section-label">{result.videos.length} CURATED VIDEOS</p>

      <div className="video-list" role="list">
        {result.videos.map((v, i) => (
          <VideoCard key={v.url} video={v} index={i} />
        ))}
      </div>

      <button className="btn-refresh" onClick={onRefresh} aria-label="Refresh search for this topic">
        ↺ Refresh search
      </button>
    </div>
  );
}
