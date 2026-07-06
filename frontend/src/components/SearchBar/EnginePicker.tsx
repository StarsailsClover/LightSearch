// EnginePicker：引擎多选下拉，已选项以 chip 形式展示

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n';
import type { Engine } from '../../api/types';

interface EnginePickerProps {
  engines: Engine[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const TYPE_LABEL: Record<Engine['type'], string> = {
  web: 'Web',
  academic: 'Academic',
  image: 'Image',
  news: 'News',
  video: 'Video',
};

export function EnginePicker({ engines, selectedIds, onToggle }: EnginePickerProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const selected = engines.filter((e) => selectedIds.includes(e.id));

  return (
    <div className="engine-picker" ref={ref}>
      <button
        type="button"
        className="engine-picker-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('search.engines')}
      >
        <span className="engine-picker-label">{t('search.engines')}</span>
        <span className="engine-picker-count">{selected.length}</span>
        <ChevronDownIcon />
      </button>

      {/* 已选 chips */}
      {selected.length > 0 && (
        <div className="engine-chips" aria-label="selected engines">
          {selected.map((e) => (
            <span key={e.id} className="chip chip-engine">
              {e.name}
              <button
                type="button"
                className="chip-remove"
                onClick={() => onToggle(e.id)}
                aria-label={`remove ${e.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="engine-picker-dropdown" role="listbox">
          {engines.length === 0 && (
            <div className="engine-picker-empty">{t('search.empty')}</div>
          )}
          {engines.map((e) => {
            const checked = selectedIds.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                role="option"
                aria-selected={checked}
                className={`engine-option ${checked ? 'engine-option-selected' : ''} ${!e.enabled ? 'engine-option-disabled' : ''}`}
                onClick={() => onToggle(e.id)}
                disabled={!e.enabled}
              >
                <span className="engine-option-check" aria-hidden="true">
                  {checked && '✓'}
                </span>
                <span className="engine-option-name">{e.name}</span>
                <span className="engine-option-type">{TYPE_LABEL[e.type]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
