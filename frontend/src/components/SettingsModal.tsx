// SettingsModal — 全屏设置模态
// 左侧副导航（图标居左对齐：引擎/AI/主题/关于），右侧面板

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useI18n, LANGUAGES, type Language } from '../i18n';
import { useSettings } from '../hooks/useSettings';
import { testAIProfile, setApiBase, getApiBase } from '../api/client';
import { ACCENT_PRESETS, type AccentColor, type ThemeMode } from '../styles/theme';
import { genId } from '../utils/format';
import type { AIProfile, Engine, EngineType } from '../api/types';

type NavSection = 'engines' | 'ai' | 'theme' | 'about';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { t } = useI18n();
  const [nav, setNav] = useState<NavSection>('engines');

  // ESC 关闭
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const navItems: { id: NavSection; label: string; icon: ReactNode }[] = [
    { id: 'engines', label: t('settings.nav.engines'), icon: <IconGlobe /> },
    { id: 'ai', label: t('settings.nav.ai'), icon: <IconSparkles /> },
    { id: 'theme', label: t('settings.nav.theme'), icon: <IconPalette /> },
    { id: 'about', label: t('settings.nav.about'), icon: <IconInfo /> },
  ];

  return (
    <div className="settings" role="dialog" aria-modal="true" aria-label={t('settings.title')}>
      <nav className="settings__nav" aria-label={t('settings.title')}>
        <div className="settings__nav-title">{t('settings.title')}</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`settings__nav-item${nav === item.id ? ' settings__nav-item--active' : ''}`}
            onClick={() => setNav(item.id)}
            aria-current={nav === item.id}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="settings__body">
        <div className="settings__topbar">
          <div className="settings__title">
            {navItems.find((n) => n.id === nav)?.label}
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={t('settings.close')}
            title={t('settings.close')}
          >
            <IconClose />
          </button>
        </div>

        <div className="settings__panel">
          {nav === 'engines' && <EnginesPanel />}
          {nav === 'ai' && <AIProfilesPanel />}
          {nav === 'theme' && <ThemePanel />}
          {nav === 'about' && <AboutPanel />}
        </div>
      </div>
    </div>
  );
}

/* ============== Engines Panel ============== */

const ENGINE_TYPES: EngineType[] = ['web', 'academic', 'image', 'news', 'video'];

function EnginesPanel() {
  const { t } = useI18n();
  const { state, dispatch } = useSettings();
  const [editing, setEditing] = useState<Engine | null>(null);
  const [adding, setAdding] = useState(false);

  function startAdd() {
    setEditing({
      id: genId('engine'),
      name: '',
      url: '',
      type: 'web',
      enabled: true,
      builtin: false,
    });
    setAdding(true);
  }

  function saveEngine(engine: Engine) {
    if (adding) {
      dispatch({ type: 'ADD_ENGINE', engine });
    } else {
      dispatch({ type: 'UPDATE_ENGINE', engine });
    }
    setEditing(null);
    setAdding(false);
  }

  function cancelEdit() {
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="section">
      <div className="section__head">
        <div className="section__title">{t('settings.nav.engines')}</div>
        <button type="button" className="btn btn--sm" onClick={startAdd}>
          <IconPlus />
          {t('engines.add')}
        </button>
      </div>

      {editing && (
        <EngineForm
          engine={editing}
          onSave={saveEngine}
          onCancel={cancelEdit}
        />
      )}

      <div>
        {state.engines.map((engine) => (
          <div className="list-row" key={engine.id}>
            <div className="list-row__main">
              <div className="list-row__title">
                <span>{engine.name}</span>
                <span className="list-row__badge">{engine.type}</span>
                {engine.builtin && (
                  <span className="list-row__badge">{t('engines.builtin')}</span>
                )}
              </div>
              <div className="list-row__sub">{engine.url}</div>
            </div>
            <div className="list-row__actions">
              <label className="switch">
                <input
                  type="checkbox"
                  className="switch__input"
                  checked={engine.enabled}
                  onChange={() => dispatch({ type: 'TOGGLE_ENGINE', id: engine.id })}
                  aria-label={t('engines.enabled')}
                />
                <span className="switch__track">
                  <span className="switch__thumb" />
                </span>
              </label>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={() => { setEditing(engine); setAdding(false); }}
                aria-label={t('engines.edit')}
              >
                <IconEdit />
              </button>
              {!engine.builtin && (
                <button
                  type="button"
                  className="btn btn--sm btn--ghost btn--danger"
                  onClick={() => dispatch({ type: 'DELETE_ENGINE', id: engine.id })}
                  aria-label={t('engines.delete')}
                >
                  <IconTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngineForm({
  engine,
  onSave,
  onCancel,
}: {
  engine: Engine;
  onSave: (e: Engine) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Engine>(engine);

  function update(patch: Partial<Engine>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.url.trim()) return;
    onSave(draft);
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('engines.name')}</label>
          <input
            className="form-input"
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder={t('engines.name')}
            autoFocus
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('engines.type')}</label>
          <div className="select select--full">
            <select
              className="form-input"
              style={{ height: '38px' }}
              value={draft.type}
              onChange={(e) => update({ type: e.target.value as EngineType })}
            >
              {ENGINE_TYPES.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">{t('engines.url')}</label>
        <input
          className="form-input"
          value={draft.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder={t('engines.urlHint')}
        />
        <div className="form-hint">{t('engines.urlHint')}</div>
      </div>
      <div className="inline-form__row">
        <button type="button" className="btn" onClick={onCancel}>
          {t('engines.cancel')}
        </button>
        <button type="submit" className="btn btn--primary" disabled={!draft.name.trim() || !draft.url.trim()}>
          {t('engines.save')}
        </button>
      </div>
    </form>
  );
}

/* ============== AI Profiles Panel ============== */

function AIProfilesPanel() {
  const { t } = useI18n();
  const { state, dispatch } = useSettings();
  const [editing, setEditing] = useState<AIProfile | null>(null);
  const [adding, setAdding] = useState(false);

  function startAdd() {
    setEditing({
      id: genId('profile'),
      name: '',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
    setAdding(true);
  }

  function saveProfile(profile: AIProfile) {
    if (adding) {
      dispatch({ type: 'ADD_AI_PROFILE', profile });
      // 若是第一个 profile，自动设为默认
      if (state.aiProfiles.length === 0) {
        dispatch({ type: 'SET_DEFAULT_PROFILE', id: profile.id });
      }
    } else {
      dispatch({ type: 'UPDATE_AI_PROFILE', profile });
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="section">
      <div className="section__head">
        <div className="section__title">{t('settings.nav.ai')}</div>
        <button type="button" className="btn btn--sm" onClick={startAdd}>
          <IconPlus />
          {t('ai.profile.add')}
        </button>
      </div>

      {editing && (
        <AIProfileForm
          profile={editing}
          isNew={adding}
          isDefault={state.defaultProfileId === editing.id}
          onSave={saveProfile}
          onCancel={() => { setEditing(null); setAdding(false); }}
          onDelete={adding ? undefined : () => {
            dispatch({ type: 'DELETE_AI_PROFILE', id: editing.id });
            setEditing(null);
          }}
          onSetDefault={adding ? undefined : () => dispatch({ type: 'SET_DEFAULT_PROFILE', id: editing.id })}
        />
      )}

      {state.aiProfiles.length === 0 && !editing && (
        <div className="state" style={{ padding: '32px 16px' }}>
          <div>{t('ai.profile.empty')}</div>
        </div>
      )}

      <div>
        {state.aiProfiles.map((profile) => (
          <div className="list-row" key={profile.id}>
            <div className="list-row__main">
              <div className="list-row__title">
                <span>{profile.name}</span>
                {state.defaultProfileId === profile.id && (
                  <span className="list-row__badge list-row__badge--default">
                    {t('ai.profile.default')}
                  </span>
                )}
              </div>
              <div className="list-row__sub">{profile.model} · {profile.baseUrl}</div>
            </div>
            <div className="list-row__actions">
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={() => { setEditing(profile); setAdding(false); }}
                aria-label={t('engines.edit')}
              >
                <IconEdit />
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost btn--danger"
                onClick={() => dispatch({ type: 'DELETE_AI_PROFILE', id: profile.id })}
                aria-label={t('ai.profile.delete')}
              >
                <IconTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIProfileForm({
  profile,
  isNew,
  isDefault,
  onSave,
  onCancel,
  onDelete,
  onSetDefault,
}: {
  profile: AIProfile;
  isNew: boolean;
  isDefault: boolean;
  onSave: (p: AIProfile) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<AIProfile>(profile);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  function update(patch: Partial<AIProfile>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.baseUrl.trim() || !draft.apiKey.trim() || !draft.model.trim()) return;
    onSave(draft);
  }

  async function handleTest() {
    setTestStatus('testing');
    try {
      await testAIProfile(draft);
      setTestStatus('ok');
    } catch {
      setTestStatus('fail');
    }
  }

  async function handleCopyKey() {
    try {
      await navigator.clipboard.writeText(draft.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 忽略 */
    }
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">{t('ai.profile.name')}</label>
        <input
          className="form-input"
          value={draft.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder={t('ai.profile.name')}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('ai.profile.baseUrl')}</label>
        <input
          className="form-input"
          value={draft.baseUrl}
          onChange={(e) => update({ baseUrl: e.target.value })}
          placeholder="https://api.openai.com/v1"
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t('ai.profile.apiKey')}</label>
        <div style={{ position: 'relative' }}>
          <input
            className="form-input"
            type={showKey ? 'text' : 'password'}
            value={draft.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            placeholder="sk-..."
            style={{ paddingRight: '120px' }}
          />
          <div style={{ position: 'absolute', right: '6px', top: '4px', display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => setShowKey((v) => !v)}
            >
              {showKey ? t('ai.profile.hideKey') : t('ai.profile.showKey')}
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={handleCopyKey}
              disabled={!draft.apiKey}
            >
              {copied ? t('common.copied') : t('ai.profile.copyKey')}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('ai.profile.model')}</label>
          <input
            className="form-input"
            value={draft.model}
            onChange={(e) => update({ model: e.target.value })}
            placeholder="gpt-4o-mini"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('ai.profile.temperature')}</label>
          <input
            className="form-input"
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={draft.temperature ?? 0.7}
            onChange={(e) => update({ temperature: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="inline-form__row" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn--sm"
            onClick={handleTest}
            disabled={testStatus === 'testing' || !draft.baseUrl || !draft.apiKey || !draft.model}
          >
            {testStatus === 'testing' ? t('ai.profile.testing') : t('ai.profile.test')}
          </button>
          {testStatus === 'ok' && (
            <span style={{ fontSize: '12px', color: '#34a853' }}>{t('ai.profile.testOk')}</span>
          )}
          {testStatus === 'fail' && (
            <span style={{ fontSize: '12px', color: '#ea4335' }}>{t('ai.profile.testFail')}</span>
          )}
          {!isNew && !isDefault && onSetDefault && (
            <button type="button" className="btn btn--sm btn--ghost" onClick={onSetDefault}>
              {t('ai.profile.set_default')}
            </button>
          )}
          {!isNew && onDelete && (
            <button type="button" className="btn btn--sm btn--ghost btn--danger" onClick={onDelete}>
              {t('ai.profile.delete')}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn" onClick={onCancel}>
            {t('engines.cancel')}
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!draft.name.trim() || !draft.baseUrl.trim() || !draft.apiKey.trim() || !draft.model.trim()}
          >
            {t('engines.save')}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ============== Theme Panel ============== */

function ThemePanel() {
  const { t, lang, setLang } = useI18n();
  const { state, dispatch } = useSettings();

  return (
    <div>
      <div className="section">
        <div className="section__head">
          <div className="section__title">{t('theme.mode')}</div>
        </div>
        <div className="segmented">
          <button
            type="button"
            className={`segmented__item${state.theme === 'light' ? ' segmented__item--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_THEME', theme: 'light' as ThemeMode })}
          >
            <IconSun />
            {t('theme.light')}
          </button>
          <button
            type="button"
            className={`segmented__item${state.theme === 'dark' ? ' segmented__item--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_THEME', theme: 'dark' as ThemeMode })}
          >
            <IconMoon />
            {t('theme.dark')}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section__head">
          <div className="section__title">{t('theme.accent')}</div>
        </div>
        <div className="swatches">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`swatch${state.accent === preset.id ? ' swatch--active' : ''}`}
              style={{ background: preset.color }}
              onClick={() => dispatch({ type: 'SET_ACCENT', accent: preset.id as AccentColor })}
              aria-label={preset.label}
              title={preset.label}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section__head">
          <div className="section__title">{t('theme.language')}</div>
        </div>
        <div className="select select--full" style={{ maxWidth: '240px' }}>
          <select
            className="form-input"
            style={{ height: '38px', maxWidth: '240px' }}
            value={lang}
            onChange={(e) => {
              const newLang = e.target.value as Language;
              setLang(newLang);
              dispatch({ type: 'SET_LANGUAGE', language: newLang });
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
          <IconChevronDown className="select__arrow" />
        </div>
      </div>
    </div>
  );
}

/* ============== About Panel ============== */

function AboutPanel() {
  const { t } = useI18n();
  const { state } = useSettings();
  const [backendUrl, setBackendUrl] = useState(getApiBase());
  const REPO_URL = 'https://github.com/StarsailsClover/LightSearch';

  return (
    <div className="about">
      <div className="about__name">{t('app.name')}</div>
      <div className="about__desc">{t('about.description')}</div>

      <div className="section" style={{ marginTop: '24px', marginBottom: '0' }}>
        <div className="section__head">
          <div className="section__title">{t('about.backend')}</div>
        </div>
        <div className="form-group">
          <input
            className="form-input"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            placeholder={t('about.backendPlaceholder')}
          />
          <div className="form-hint">{t('about.backendHint')}</div>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => setApiBase(backendUrl.trim())}
        >
          {t('about.backendSave')}
        </button>
      </div>

      <div>
        <div className="about__row">
          <span className="about__row-label">{t('about.version')}</span>
          <span className="about__row-value">{state.version}</span>
        </div>
        <div className="about__row">
          <span className="about__row-label">{t('about.github')}</span>
          <span className="about__row-value">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              {t('about.github')}
              <IconExternal />
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============== Icons ============== */

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15l-1.6-4.2L6 9.2l4.4-1.6z" />
    </svg>
  );
}

function IconPalette() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.929.722-1.687 1.65-1.687h1.937c3.15 0 5.64-2.554 5.64-5.715C22 6.985 17.55 2 12 2z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
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

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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

function IconExternal() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}
