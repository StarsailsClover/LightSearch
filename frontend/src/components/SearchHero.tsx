// SearchHero — 搜索框 + 引擎 chip 选择器 + 时间过滤
// 两种模式：hero（初始居中）与 compact（搜索后顶部）

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useI18n } from '../i18n';
import type { Engine, TimeRange } from '../api/types';

interface SearchHeroProps {
  mode: 'hero' | 'compact';
  engines: Engine[];
  selectedEngineIds: string[];
  onToggleEngine: (id: string) => void;
  timeRange: TimeRange;
  onChangeTimeRange: (r: TimeRange) => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const TIME_RANGES: TimeRange[] = ['any', '1w', '1m', '1y', '5y', '10y'];

export function SearchHero({
  mode,
  engines,
  selectedEngineIds,
  onToggleEngine,
  timeRange,
  onChangeTimeRange,
  onSearch,
  initialQuery = '',
}: SearchHeroProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // 跟随外部 initialQuery 变化（如搜索后保留）
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // compact 模式不自动聚焦，hero 模式自动聚焦
  useEffect(() => {
    if (mode === 'hero' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
  }

  const visibleEngines = engines.filter((e) => e.enabled);

  return (
    <div className={mode === 'hero' ? 'hero' : ''}>
      {mode === 'hero' && (
        <>
          <h1 className="hero__title">{t('app.name')}</h1>
          <p className="hero__tagline">{t('app.tagline')}</p>
        </>
      )}

      <form
        className={`search${mode === 'hero' ? ' search--hero' : ' search--compact'}`}
        onSubmit={handleSubmit}
        role="search"
      >
        <div className="search__input-wrap">
          <IconSearch className="search__icon" />
          <input
            ref={inputRef}
            type="text"
            className="search__input"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('search.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="search__submit"
            disabled={!query.trim()}
            aria-label={t('search.button')}
          >
            <span>{t('search.button')}</span>
          </button>
        </div>

        <div className="search__filters">
          <div className="chips" role="group" aria-label={t('search.engines')}>
            {visibleEngines.map((engine) => {
              const active = selectedEngineIds.includes(engine.id);
              return (
                <button
                  key={engine.id}
                  type="button"
                  className={`chip chip--${engine.type}${active ? ' chip--active' : ''}`}
                  onClick={() => onToggleEngine(engine.id)}
                  aria-pressed={active}
                >
                  <span className="chip__dot" aria-hidden />
                  {engine.name}
                </button>
              );
            })}
          </div>

          <div className="select">
            <select
              className="select__el"
              value={timeRange}
              onChange={(e) => onChangeTimeRange(e.target.value as TimeRange)}
              aria-label={t('search.timeRange')}
            >
              {TIME_RANGES.map((r) => (
                <option key={r} value={r}>
                  {t(`search.timeRange.${r}`)}
                </option>
              ))}
            </select>
            <IconChevronDown className="select__arrow" />
          </div>
        </div>
      </form>
    </div>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
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
