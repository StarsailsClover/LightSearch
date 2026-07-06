// useSearch：管理 query / results / loading / error
// 支持请求取消（AbortController）

import { useCallback, useRef, useState } from 'react';
import { ApiError, search as searchApi } from '../api/client';
import type { SearchResponse, TimeRange } from '../api/types';

interface UseSearchState {
  loading: boolean;
  error: string | null;
  response: SearchResponse | null;
  lastQuery: string;
}

export function useSearch() {
  const [state, setState] = useState<UseSearchState>({
    loading: false,
    error: null,
    response: null,
    lastQuery: '',
  });

  // 当前请求的 AbortController，用于取消进行中的请求
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (query: string, engines: string[], timeRange: TimeRange) => {
      // 取消上一次请求
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!query.trim()) {
        setState({ loading: false, error: null, response: null, lastQuery: '' });
        return;
      }
      if (engines.length === 0) {
        setState({ loading: false, error: 'NO_ENGINES', response: null, lastQuery: query });
        return;
      }

      setState((s) => ({ ...s, loading: true, error: null, lastQuery: query }));

      try {
        const res = await searchApi(
          { query, engines, timeRange, limit: 20 },
          controller.signal
        );
        // 若已被后续请求取消，则丢弃结果
        if (controller.signal.aborted) return;
        setState({ loading: false, error: null, response: res, lastQuery: query });
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : '未知错误';
        setState((s) => ({ ...s, loading: false, error: message, response: null }));
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ loading: false, error: null, response: null, lastQuery: '' });
  }, []);

  return { ...state, run, reset };
}
