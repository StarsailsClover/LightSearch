// SettingsModal：全屏 modal，左侧副导航（图标居左对齐）+ 右侧内容
// 四个面板：搜索引擎 / AI 配置 / 主题 / 关于

import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../stores/settings';
import { EngineManager } from './EngineManager';
import { AIProfileManager } from './AIProfileManager';
import { ThemePanel } from './ThemePanel';

type Tab = 'engines' | 'ai' | 'theme' | 'about';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { t } = useI18n();
  const { state, dispatch } = useSettings();
  const [tab, setTab] = useState<Tab>('engines');

  // ESC 关闭
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'engines', label: t('settings.nav.engines'), icon: <EngineNavIcon /> },
    { id: 'ai', label: t('settings.nav.ai'), icon: <SparkleNavIcon /> },
    { id: 'theme', label: t('settings.nav.theme'), icon: <PaletteNavIcon /> },
    { id: 'about', label: t('settings.nav.about'), icon: <InfoNavIcon /> },
  ];

  return (
    <div className="modal-scrim modal-scrim-full" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('settings.title')}
      >
        {/* 左侧副导航：图标居左对齐 */}
        <nav className="settings-nav" aria-label={t('settings.title')}>
          <div className="settings-nav-header">
            <span className="settings-nav-title">{t('settings.title')}</span>
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t('settings.close')}>
              <CloseIcon />
            </button>
          </div>
          <ul className="settings-nav-list" role="tablist">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={`settings-nav-item ${tab === item.id ? 'settings-nav-item-active' : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  <span className="settings-nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="settings-nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 右侧内容区 */}
        <div className="settings-content" role="tabpanel">
          {tab === 'engines' && (
            <EngineManager
              engines={state.engines}
              onAdd={(e) => dispatch({ type: 'ADD_ENGINE', engine: e })}
              onUpdate={(e) => dispatch({ type: 'UPDATE_ENGINE', engine: e })}
              onDelete={(id) => dispatch({ type: 'DELETE_ENGINE', id })}
              onToggle={(id) => dispatch({ type: 'TOGGLE_ENGINE', id })}
            />
          )}

          {tab === 'ai' && (
            <AIProfileManager
              profiles={state.aiProfiles}
              defaultProfileId={state.defaultProfileId}
              onAdd={(p) => dispatch({ type: 'ADD_AI_PROFILE', profile: p })}
              onUpdate={(p) => dispatch({ type: 'UPDATE_AI_PROFILE', profile: p })}
              onDelete={(id) => dispatch({ type: 'DELETE_AI_PROFILE', id })}
              onSetDefault={(id) => dispatch({ type: 'SET_DEFAULT_PROFILE', id })}
            />
          )}

          {tab === 'theme' && (
            <ThemePanel
              theme={state.theme}
              accent={state.accent}
              language={state.language}
              onChangeTheme={(th) => dispatch({ type: 'SET_THEME', theme: th })}
              onChangeAccent={(ac) => dispatch({ type: 'SET_ACCENT', accent: ac })}
              onChangeLanguage={(lng) => dispatch({ type: 'SET_LANGUAGE', language: lng })}
            />
          )}

          {tab === 'about' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">{t('settings.nav.about')}</h2>
              <div className="about-block">
                <div className="about-logo">
                  <span className="about-logo-dot" aria-hidden="true" />
                  <span className="about-logo-text">LightSearch</span>
                </div>
                <p className="about-desc">{t('about.description')}</p>
                <dl className="about-list">
                  <dt>{t('about.version')}</dt>
                  <dd>{state.version}</dd>
                  <dt>{t('about.github')}</dt>
                  <dd>
                    <a
                      className="about-link"
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com
                    </a>
                  </dd>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- 副导航图标（居左对齐） ---- */

function EngineNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SparkleNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15l-1.6-4.2L6 9.2l4.4-1.6L12 3z" />
    </svg>
  );
}

function PaletteNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="7" r="1.2" fill="currentColor" />
      <circle cx="16" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

function InfoNavIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
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
