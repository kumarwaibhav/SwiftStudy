import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { PromptStack } from '@/components/PromptStack';
import { UnitNav } from '@/components/UnitNav';
import { TopicList } from '@/components/TopicList';
import { ResultsPanel } from '@/components/ResultsPanel';
import { useVideoSearch } from '@/hooks/useVideoSearch';
import { UNITS } from '@/data/syllabus';

export default function App() {
  const [activeUnit, setActiveUnit] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const { results, status, loadingTopic, errorTopic, logLines, search, invalidate } =
    useVideoSearch();

  const unit = UNITS[activeUnit]!;

  const handleUnitSelect = useCallback((num: number) => {
    setActiveUnit(num);
    setSelectedTopic(null);
  }, []);

  const handleTopicSelect = useCallback(
    (topic: string) => {
      setSelectedTopic(topic);
      void search(topic, unit.title);
    },
    [search, unit.title],
  );

  const handleRetry = useCallback(() => {
    if (selectedTopic) {
      invalidate(selectedTopic);
      void search(selectedTopic, unit.title);
    }
  }, [selectedTopic, invalidate, search, unit.title]);

  const handleRefresh = useCallback(() => {
    if (selectedTopic) {
      invalidate(selectedTopic);
      void search(selectedTopic, unit.title);
    }
  }, [selectedTopic, invalidate, search, unit.title]);

  const totalVideos = Object.values(results).reduce((a, r) => a + r.videos.length, 0);
  const searchedTopics = new Set(Object.keys(results));

  const currentResult = selectedTopic ? (results[selectedTopic] ?? null) : null;
  const isLoading = status === 'loading' && loadingTopic === selectedTopic;
  const isError = status === 'error' && errorTopic === selectedTopic;

  return (
    <div className="app-root">
      <Header
        showPrompt={showPrompt}
        onTogglePrompt={() => setShowPrompt((p) => !p)}
        accent={unit.accent}
totalSearched={searchedTopics.size}
        totalVideos={totalVideos}
      />

      {showPrompt && <PromptStack />}

      <div className="layout">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <UnitNav activeUnit={activeUnit} onSelect={handleUnitSelect} />
          <TopicList
            topics={unit.topics}
            accent={unit.accent}
            glow={unit.glow}
            selectedTopic={selectedTopic}
            searchedTopics={searchedTopics}
            loadingTopic={loadingTopic}
            onSelect={handleTopicSelect}
          />
        </aside>

        {/* ── Results ── */}
        <main className="results-panel" aria-label="Video results">
          <ResultsPanel
            selectedTopic={selectedTopic}
            result={currentResult}
            isLoading={isLoading}
            isError={isError}
            logLines={logLines}
            accent={unit.accent}
            glow={unit.glow}
        activeUnit={activeUnit}
            unitTitle={unit.title}
            onRetry={handleRetry}
            onRefresh={handleRefresh}
          />
        </main>
      </div>

      <footer className="app-footer">
        <span>SwiftStudy · claude-sonnet-4 · RISEN + ReAct + L2M + CO-STAR</span>
        <span>{searchedTopics.size} topics searched · {totalVideos} videos found</span>
      </footer>
    </div>
  );
}
