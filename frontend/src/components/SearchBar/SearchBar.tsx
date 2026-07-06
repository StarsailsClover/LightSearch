// SearchBar：主搜索框
// 单行输入 + 引擎多选 + 时间过滤下拉，Enter 触发搜索

import { useState, type KeyboardEvent } from 'react';
import { useI18n } from '../../i18n';
import type { Engine, TimeRange } from '../../api/types';
import { EnginePicker } from './EnginePicker';

interface SearchBarProps {
  engines: Engine[];
  selectedEngineIds: string[];
  onToggleEngine: (id: string) => void;
  timeRange: TimeRange;
  onChangeTimeRange: (range: TimeRange) => void;
  onSearch: (query: string) => void;
  initialValue?: string;
}

const TIME_RANGES: TimeRange[] = ['any', '1w', '1m', '1y', '5y', '10y'];

export function SearchBar({
  engines,
  selectedEngineIds,
  onToggleEngine,
  timeRange,
  onChangeTimeRange,
  onSearch,
  initialValue = '',
}: SearchBarProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState(initialValue);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSearch(query);
    }
  }

  return (
    <div className="searchbar">
      <div className="searchbar-row">
        <div className="searchbar-input-wrap">
          <SearchIcon />
          <input
            type="text"
            className="searchbar-input"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t('search.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              className="searchbar-clear"
              onClick={() => setQuery('')}
              aria-label="clear"
            >
              ×
            </button>
          )}
        </div>

        <EnginePicker
          engines={engines}
          selectedIds={selectedEngineIds}
          onToggle={onToggleEngine}
        />

        {/* 时间过滤 */}
        <div className="time-filter">
          <select
            className="time-filter-select"
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
        </div>

        <button
          type="button"
          className="btn btn-primary searchbar-submit"
          onClick={() => onSearch(query)}
        >
          {t('search.button')}
        </button>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="searchbar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
