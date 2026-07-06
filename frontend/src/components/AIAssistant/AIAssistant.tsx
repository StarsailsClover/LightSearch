// AIAssistant：右侧抽屉式对话面板
// 顶部模型选择 / 中间消息流 / 底部输入 / 工具栏三个快捷按钮
// 流式 SSE 逐字渲染

import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n';
import type { AIProfile, SearchResult } from '../../api/types';
import { useAI } from '../../hooks/useAI';
import { MessageBubble } from './MessageBubble';
import { AIInput } from './AIInput';

interface AIAssistantProps {
  profiles: AIProfile[];
  activeProfile: AIProfile | null;
  onSelectProfile: (id: string) => void;
  onClose: () => void;
  searchContext: { query: string; results: SearchResult[] } | null;
}

export function AIAssistant({
  profiles,
  activeProfile,
  onSelectProfile,
  onClose,
  searchContext,
}: AIAssistantProps) {
  const { t } = useI18n();
  const { messages, streaming, error, send, stop, clear } = useAI();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新消息时自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // 未配置 profile
  if (!activeProfile) {
    return (
      <div className="ai-panel">
        <AIHeader
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={onSelectProfile}
          onClose={onClose}
          onClear={clear}
        />
        <div className="ai-empty">
          <p className="ai-empty-text">{t('ai.noProfile')}</p>
        </div>
      </div>
    );
  }

  // 构造快捷操作的 prompt
  function buildSummarizePrompt(): string {
    if (!searchContext || searchContext.results.length === 0) {
      return '请总结当前搜索结果。当前没有可用的结果。';
    }
    const list = searchContext.results
      .slice(0, 10)
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}`)
      .join('\n');
    return `搜索关键词：${searchContext.query}\n\n以下是聚合搜索结果，请用简洁的中文总结要点：\n${list}`;
  }

  function buildRewritePrompt(): string {
    const q = searchContext?.query || '';
    return `请改写以下搜索查询，提供 3 个更精准或更全面的变体（每行一个，不要编号）：\n${q}`;
  }

  function buildFollowupPrompt(): string {
    if (!searchContext || searchContext.results.length === 0) {
      return '基于当前搜索，请提出 3 个值得深入追问的问题。';
    }
    const titles = searchContext.results.slice(0, 8).map((r) => r.title).join('\n');
    return `基于以下搜索结果标题，请提出 3 个值得深入追问的问题：\n${titles}`;
  }

  return (
    <div className="ai-panel">
      <AIHeader
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={onSelectProfile}
        onClose={onClose}
        onClear={clear}
      />

      {/* 工具栏 */}
      <div className="ai-toolbar">
        <button
          type="button"
          className="btn btn-ghost ai-tool-btn"
          onClick={() => send(activeProfile, buildSummarizePrompt())}
          disabled={streaming}
        >
          {t('ai.summarize')}
        </button>
        <button
          type="button"
          className="btn btn-ghost ai-tool-btn"
          onClick={() => send(activeProfile, buildRewritePrompt())}
          disabled={streaming}
        >
          {t('ai.rewrite')}
        </button>
        <button
          type="button"
          className="btn btn-ghost ai-tool-btn"
          onClick={() => send(activeProfile, buildFollowupPrompt())}
          disabled={streaming}
        >
          {t('ai.followup')}
        </button>
      </div>

      {/* 消息流 */}
      <div className="ai-messages" ref={scrollRef}>
        {messages.length === 0 && !streaming && (
          <div className="ai-empty">
            <p className="ai-empty-hint">{t('ai.placeholder')}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            streaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
          />
        ))}
        {streaming && messages.length === 0 && (
          <div className="ai-empty">
            <p className="ai-empty-hint">{t('ai.thinking')}</p>
          </div>
        )}
      </div>

      {/* 错误 */}
      {error && <div className="ai-error">{t('ai.error', { message: error })}</div>}

      {/* 输入 */}
      <AIInput onSend={(c) => send(activeProfile, c)} streaming={streaming} onStop={stop} />
    </div>
  );
}

// AI 面板头部：模型选择 + 关闭 + 清空
function AIHeader({
  profiles,
  activeProfile,
  onSelectProfile,
  onClose,
  onClear,
}: {
  profiles: AIProfile[];
  activeProfile: AIProfile | null;
  onSelectProfile: (id: string) => void;
  onClose: () => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="ai-header">
      <div className="ai-header-left">
        <span className="ai-title">{t('ai.title')}</span>
        {profiles.length > 0 && (
          <select
            className="ai-model-select"
            value={activeProfile?.id ?? ''}
            onChange={(e) => onSelectProfile(e.target.value)}
            aria-label={t('ai.profile.model')}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.model}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="ai-header-right">
        <button type="button" className="icon-btn" onClick={onClear} title={t('common.delete')} aria-label="clear">
          <TrashIcon />
        </button>
        <button type="button" className="icon-btn" onClick={onClose} title={t('ai.close')} aria-label={t('ai.close')}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
