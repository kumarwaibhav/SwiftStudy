interface TopicListProps {
  topics: string[];
  accent: string;
  glow: string;
  selectedTopic: string | null;
  searchedTopics: Set<string>;
  loadingTopic: string | null;
  onSelect: (topic: string) => void;
}

export function TopicList({
  topics, accent, glow, selectedTopic, searchedTopics, loadingTopic, onSelect,
}: TopicListProps) {
  return (
    <div className="topic-list" role="list" aria-label="Topics">
      <p className="section-label">{topics.length} TOPICS</p>
      {topics.map((topic, i) => {
        const isActive = selectedTopic === topic;
        const isDone = searchedTopics.has(topic);
        const isLoading = loadingTopic === topic;
        return (
          <button
            key={topic}
            role="listitem"
            className={`topic-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(topic)}
            style={isActive ? { borderColor: accent, background: glow } : undefined}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="topic-num" style={{ color: accent }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="topic-label">{topic}</span>
            {isDone && !isLoading && <span className="topic-done" aria-label="searched">✓</span>}
            {isLoading && (
              <span className="topic-loading pulse" style={{ color: accent }} aria-label="searching">⟳</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
