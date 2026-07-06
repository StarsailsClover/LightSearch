// useAI：管理消息流 + 流式接收
// 暴露 messages / send / streaming / error

import { useCallback, useRef, useState } from 'react';
import { ApiError, chatStream } from '../api/client';
import type { AIProfile, ChatMessage } from '../api/types';

interface UseAIState {
  messages: ChatMessage[];
  streaming: boolean;
  error: string | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    messages: [],
    streaming: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  // 流式过程中正在累积的助手消息索引
  const streamingIndexRef = useRef<number>(-1);

  // 发送一条消息：先把 user 消息加入，再发起流式请求
  const send = useCallback(
    async (profile: AIProfile, content: string, systemPrompt?: string) => {
      if (!content.trim() || state.streaming) return;

      const userMsg: ChatMessage = { role: 'user', content };
      const assistantMsg: ChatMessage = { role: 'assistant', content: '' };

      // 组装请求消息：可选 system prompt + 历史 + 当前用户消息
      const history = state.messages;
      const requestMessages: ChatMessage[] = [];
      if (systemPrompt) {
        requestMessages.push({ role: 'system', content: systemPrompt });
      }
      requestMessages.push(...history, userMsg);

      setState((s) => ({
        ...s,
        messages: [...s.messages, userMsg, assistantMsg],
        streaming: true,
        error: null,
      }));
      streamingIndexRef.current = history.length + 1;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await chatStream(
          profile,
          requestMessages,
          (delta) => {
            // 逐字追加到助手消息
            setState((s) => {
              const next = [...s.messages];
              const idx = streamingIndexRef.current;
              if (idx >= 0 && idx < next.length) {
                next[idx] = { ...next[idx], content: next[idx].content + delta };
              }
              return { ...s, messages: next };
            });
          },
          controller.signal
        );
        setState((s) => ({ ...s, streaming: false }));
      } catch (err) {
        if (controller.signal.aborted) {
          setState((s) => ({ ...s, streaming: false }));
          return;
        }
        const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : '未知错误';
        setState((s) => ({ ...s, streaming: false, error: message }));
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        streamingIndexRef.current = -1;
      }
    },
    [state.streaming, state.messages]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setState({ messages: [], streaming: false, error: null });
  }, []);

  return { ...state, send, stop, clear };
}
