interface HeaderProps {
  showPrompt: boolean;
  onTogglePrompt: () => void;
  accent: string;
  totalSearched: number;
  totalVideos: number;
}

export function Header({ showPrompt, onTogglePrompt, accent, totalSearched, totalVideos }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <p className="header-label">SRMIST · M.TECH DATA SCIENCE · 21CSC501T · SEM PREP</p>
        <h1 className="header-title">
          Swift<span style={{ color: accent }}>Study</span>
        </h1>
        <p className="header-sub">AI-curated YouTube resources · RISEN + ReAct + L2M + CO-STAR</p>
      </div>
      <div className="header-right">
        <div className="header-stats">
          <span>{totalSearched} searched</span>
          <span className="stat-sep">·</span>
          <span>{totalVideos} videos</span>
        </div>
        <button
          className={`btn-prompt ${showPrompt ? 'active' : ''}`}
          onClick={onTogglePrompt}
          aria-expanded={showPrompt}
          aria-label="Toggle prompt stack"
        >
          {showPrompt ? '▲ Hide Prompt Stack' : '⟨/⟩ Prompt Stack'}
        </button>
      </div>
    </header>
  );
}
