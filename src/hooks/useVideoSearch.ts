import { useState, useCallback, useRef } from 'react';
import type { SearchResult } from '@/types';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

interface SearchState {
  results: Record<string, SearchResult>;
  status: SearchStatus;
  loadingTopic: string | null;
  errorTopic: string | null;
  logLines: string[];
}

const SEARCH_LOGS = [
  'Initialising RISEN system context...',
  'Decomposing topic via Least-to-Most...',
  'ReAct ACT-1 → Searching tutorial videos...',
  'ReAct ACT-2 → Searching university lectures...',
  'ReAct ACT-3 → Searching implementations...',
  'Curating and ranking results...',
  'Applying CO-STAR output schema...',
];

export function useVideoSearch() {
  const [state, setState] = useState<SearchState>({
    results: {},
    status: 'idle',
    loadingTopic: null,
    errorTopic: null,
    logLines: [],
  });

  const logTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLogAnimation = useCallback(() => {
    let i = 0;
    setState((s) => ({ ...s, logLines: [SEARCH_LOGS[i++]!] }));
    logTimerRef.current = setInterval(() => {
      if (i < SEARCH_LOGS.length) {
        setState((s) => ({ ...s, logLines: [...s.logLines, SEARCH_LOGS[i++]!] }));
      } else {
        if (logTimerRef.current) clearInterval(logTimerRef.current);
      }
    }, 650);
  }, []);

  const stopLogAnimation = useCallback((finalLine?: string) => {
    if (logTimerRef.current) clearInterval(logTimerRef.current);
    if (finalLine) {
      setState((s) => ({ ...s, logLines: [...s.logLines, finalLine] }));
    }
  }, []);

  const search = useCallback(
    async (topic: string, unitTitle: string) => {
      // Return cached result if available
      if (state.results[topic]) {
        setState((s) => ({ ...s, status: 'success', errorTopic: null }));
        return;
      }

      setState((s) => ({
        ...s,
        status: 'loading',
        loadingTopic: topic,
        errorTopic: null,
        logLines: [],
      }));
      startLogAnimation();

      try {
        const resp = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, unitTitle } satisfies { topic: string; unitTitle: string }),
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error((body as { error?: string }).error ?? `HTTP ${resp.status}`);
        }

        const data = (await resp.json()) as SearchResult;

        stopLogAnimation(`✓ Found ${data.videos.length} videos!`);
        setState((s) => ({
          ...s,
          status: 'success',
          loadingTopic: null,
          results: { ...s.results, [topic]: data },
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        stopLogAnimation(`⚠ ${msg}`);
        setState((s) => ({
          ...s,
          status: 'error',
          loadingTopic: null,
          errorTopic: topic,
        }));
      }
    },
    [state.results, startLogAnimation, stopLogAnimation],
  );

  const invalidate = useCallback((topic: string) => {
    setState((s) => {
      const next = { ...s.results };
      delete next[topic];
      return { ...s, results: next, status: 'idle', errorTopic: null };
    });
  }, []);

  return { ...state, search, invalidate };
}
