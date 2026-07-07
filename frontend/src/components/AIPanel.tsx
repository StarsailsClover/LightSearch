// AIPanel — AI 抽屉
// 桌面端右侧 420px 抽屉，移动端全屏覆盖
// 头像+文本式对话（参考 Doubao），非气泡布局

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { AIProfile, ChatMessage } from '../api/types';

interface AIPanelProps {
  open: boolean;
  profiles: AIProfile[];
  activeProfile: AIProfile | null;
  onSelectProfile: (id: string) => void;
  messages: ChatMessage[];
  streaming: boolean;
  error: string | null;
  hasSearchContext: boolean;
  onClose: () => void;
  onSend: (content: string) => void;
  onStop: () => void;
  onClear: () => void;
  onSummarize: () => void;
  onRewrite: () => void;
  onFollowup: () => void;
}

export function AIPanel({
  open,
  profiles,
  activeProfile,
  onSelectProfile,
  messages,
  streaming,
  error,
  hasSearchContext,
  onClose,
  onSend,
  onStop,
  onClear,
  onSummarize,
  onRewrite,
  onFollowup,
}: AIPanelProps) {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasProfile = profiles.length > 0 && !!activeProfile;
  const visibleMessages = messages.filter((m) => m.role === 'user' || m.role === 'assistant');

  // 流式时自动滚动到底部
  useLayoutEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, visibleMessages.length]);

  // textarea 自适应高度
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function handleSend() {
    const content = input.trim();
    if (!content || streaming || !hasProfile) return;
    onSend(content);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <div
        className={`drawer-backdrop${open ? ' drawer-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`drawer${open ? ' drawer--open' : ''}`}
        role="dialog"
        aria-label={t('ai.title')}
        aria-hidden={!open}
      >
        <div className="drawer__header">
          <div className="drawer__title">
            <span className="drawer__title-dot" aria-hidden />
            <span>{t('ai.title')}</span>
          </div>
          <div className="drawer__actions">
            {visibleMessages.length > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={onClear}
                aria-label={t('common.delete')}
                title={t('common.delete')}
              >
                <IconTrash />
              </button>
            )}
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label={t('ai.close')}
              title={t('ai.close')}
            >
              <IconClose />
            </button>
          </div>
        </div>

        {hasProfile ? (
          <>
            <div className="drawer__profile-bar">
              <div className="select select--full">
                <select
                  className="drawer__profile-select"
                  value={activeProfile?.id ?? ''}
                  onChange={(e) => onSelectProfile(e.target.value)}
                  aria-label={t('settings.nav.ai')}
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.model}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="select__arrow" />
              </div>
            </div>

            <div className="ai-toolbar">
              <button
                type="button"
                className="ai-action"
                onClick={onSummarize}
                disabled={!hasSearchContext || streaming}
                title={t('ai.summarize')}
              >
                <IconSpark />
                {t('ai.summarize')}
              </button>
              <button
                type="button"
                className="ai-action"
                onClick={onRewrite}
                disabled={!hasSearchContext || streaming}
                title={t('ai.rewrite')}
              >
                <IconEdit />
                {t('ai.rewrite')}
              </button>
              <button
                type="button"
                className="ai-action"
                onClick={onFollowup}
                disabled={!hasSearchContext || streaming}
                title={t('ai.followup')}
              >
                <IconArrow />
                {t('ai.followup')}
              </button>
            </div>

            <div className="ai-messages" ref={messagesRef}>
              {visibleMessages.length === 0 ? (
                <div className="ai-empty">
                  <IconSparkles className="ai-empty__icon" />
                  <div className="ai-empty__hint">{t('ai.placeholder')}</div>
                </div>
              ) : (
                visibleMessages.map((m, i) => (
                  <Message
                    key={i}
                    message={m}
                    streaming={streaming && i === visibleMessages.length - 1 && m.role === 'assistant'}
                  />
                ))
              )}
            </div>

            {error && (
              <div className="ai-error" role="alert">
                {t('ai.error', { message: error })}
              </div>
            )}

            <div className="ai-composer">
              <textarea
                ref={textareaRef}
                className="ai-composer__textarea"
                placeholder={t('ai.placeholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={streaming}
              />
              <div className="ai-composer__row">
                <span className="ai-composer__hint">
                  {streaming ? t('ai.thinking') : '\u00A0'}
                </span>
                {streaming ? (
                  <button
                    type="button"
                    className="ai-send ai-send--stop"
                    onClick={onStop}
                  >
                    <span>{t('ai.close')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ai-send"
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <span>{t('ai.send')}</span>
                    <IconSend />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="ai-no-profile">
            <IconSparkles className="ai-no-profile__icon" />
            <div>{t('ai.noProfile')}</div>
          </div>
        )}
      </aside>
    </>
  );
}

function Message({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === 'user';
  return (
    <div className={`msg msg--${isUser ? 'user' : 'assistant'}`}>
      <div className="msg__avatar" aria-hidden>
        {isUser ? <IconUserAvatar /> : <IconSpark />}
      </div>
      <div className="msg__body">
        <div
          className={`msg__content${streaming ? ' msg__content--streaming' : ''}`}
        >
          {message.content || (streaming ? '' : ' ')}
        </div>
      </div>
    </div>
  );
}

/* ---- Icons ---- */

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15l-1.6-4.2L6 9.2l4.4-1.6z" />
    </svg>
  );
}

function IconUserAvatar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15l-1.6-4.2L6 9.2l4.4-1.6z" />
      <path d="M19 14l.7 2 .3.8 2 .7-2 .7-.3.8-.7 2-.7-2-.3-.8-2-.7 2-.7.3-.8z" />
    </svg>
  );
}
