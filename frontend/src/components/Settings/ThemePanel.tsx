// ThemePanel：light/dark 切换 + 强调色选择 + 语言切换

import { useI18n, LANGUAGES, type Language } from '../../i18n';
import { ACCENT_PRESETS, type AccentColor, type ThemeMode } from '../../styles/theme';

interface ThemePanelProps {
  theme: ThemeMode;
  accent: AccentColor;
  language: Language;
  onChangeTheme: (theme: ThemeMode) => void;
  onChangeAccent: (accent: AccentColor) => void;
  onChangeLanguage: (lang: Language) => void;
}

export function ThemePanel({
  theme,
  accent,
  language,
  onChangeTheme,
  onChangeAccent,
  onChangeLanguage,
}: ThemePanelProps) {
  const { t } = useI18n();

  return (
    <div className="settings-panel">
      <h2 className="settings-panel-title">{t('settings.nav.theme')}</h2>

      {/* 外观模式 */}
      <div className="field">
        <span className="field-label">{t('theme.mode')}</span>
        <div className="seg-group">
          <button
            type="button"
            className={`seg-btn ${theme === 'light' ? 'seg-btn-active' : ''}`}
            onClick={() => onChangeTheme('light')}
          >
            {t('theme.light')}
          </button>
          <button
            type="button"
            className={`seg-btn ${theme === 'dark' ? 'seg-btn-active' : ''}`}
            onClick={() => onChangeTheme('dark')}
          >
            {t('theme.dark')}
          </button>
        </div>
      </div>

      {/* 强调色 */}
      <div className="field">
        <span className="field-label">{t('theme.accent')}</span>
        <div className="accent-grid">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`accent-swatch ${accent === p.id ? 'accent-swatch-active' : ''}`}
              style={{ backgroundColor: p.color }}
              onClick={() => onChangeAccent(p.id)}
              aria-label={p.label}
              title={p.label}
            >
              {accent === p.id && <span className="accent-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 语言 */}
      <div className="field">
        <span className="field-label">{t('theme.language')}</span>
        <select
          className="field-input field-input-inline"
          value={language}
          onChange={(e) => onChangeLanguage(e.target.value as Language)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
