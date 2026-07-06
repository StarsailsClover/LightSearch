// EngineManager：搜索引擎增删改 + 启停切换
// 列表式展示，URL 模板含 {query} 占位符说明

import { useState } from 'react';
import { useI18n } from '../../i18n';
import type { Engine, EngineType } from '../../api/types';
import { genId } from '../../utils/format';

interface EngineManagerProps {
  engines: Engine[];
  onAdd: (engine: Engine) => void;
  onUpdate: (engine: Engine) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const ENGINE_TYPES: EngineType[] = ['web', 'academic', 'image', 'news', 'video'];

function emptyDraft(): Engine {
  return { id: '', name: '', url: '', type: 'web', enabled: true, builtin: false };
}

export function EngineManager({ engines, onAdd, onUpdate, onDelete, onToggle }: EngineManagerProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Engine | null>(null);
  const [isNew, setIsNew] = useState(false);

  function startAdd() {
    setDraft(emptyDraft());
    setIsNew(true);
  }

  function startEdit(e: Engine) {
    setDraft({ ...e });
    setIsNew(false);
  }

  function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.url.trim()) return;
    if (isNew) {
      onAdd({ ...draft, id: genId('engine') });
    } else {
      onUpdate(draft);
    }
    setDraft(null);
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <h2 className="settings-panel-title">{t('settings.nav.engines')}</h2>
        <button type="button" className="btn btn-primary" onClick={startAdd}>
          + {t('engines.add')}
        </button>
      </div>

      <ul className="engine-list" role="list">
        {engines.map((e) => (
          <li key={e.id} className="engine-row">
            <div className="engine-row-main">
              <div className="engine-row-name">
                {e.name}
                {e.builtin && <span className="tag tag-builtin">{t('engines.builtin')}</span>}
              </div>
              <div className="engine-row-url ellipsis" title={e.url}>{e.url}</div>
            </div>
            <div className="engine-row-actions">
              <span className="engine-row-type">{e.type}</span>
              <label className="switch" title={t('engines.enabled')}>
                <input
                  type="checkbox"
                  checked={e.enabled}
                  onChange={() => onToggle(e.id)}
                  aria-label={t('engines.enabled')}
                />
                <span className="switch-track" aria-hidden="true" />
              </label>
              <button type="button" className="icon-btn" onClick={() => startEdit(e)} aria-label={t('engines.edit')}>
                <PencilIcon />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onDelete(e.id)}
                aria-label={t('engines.delete')}
                disabled={e.builtin}
                title={e.builtin ? '' : t('engines.delete')}
              >
                <TrashIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 编辑/新增表单 */}
      {draft && (
        <div className="modal-scrim" onClick={() => setDraft(null)}>
          <div className="modal-sheet" onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="modal-sheet-title">
              {isNew ? t('engines.add') : t('engines.edit')}
            </h3>

            <label className="field">
              <span className="field-label">{t('engines.name')}</span>
              <input
                className="field-input"
                value={draft.name}
                onChange={(ev) => setDraft({ ...draft, name: ev.target.value })}
                placeholder={t('engines.name')}
              />
            </label>

            <label className="field">
              <span className="field-label">{t('engines.url')}</span>
              <input
                className="field-input"
                value={draft.url}
                onChange={(ev) => setDraft({ ...draft, url: ev.target.value })}
                placeholder="https://example.com/search?q={query}"
              />
              <span className="field-hint">{t('engines.urlHint')}</span>
            </label>

            <label className="field">
              <span className="field-label">{t('engines.type')}</span>
              <select
                className="field-input"
                value={draft.type}
                onChange={(ev) => setDraft({ ...draft, type: ev.target.value as EngineType })}
              >
                {ENGINE_TYPES.map((tp) => (
                  <option key={tp} value={tp}>{tp}</option>
                ))}
              </select>
            </label>

            <label className="field field-inline">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(ev) => setDraft({ ...draft, enabled: ev.target.checked })}
              />
              <span>{t('engines.enabled')}</span>
            </label>

            <div className="modal-sheet-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setDraft(null)}>
                {t('engines.cancel')}
              </button>
              <button type="button" className="btn btn-primary" onClick={saveDraft}>
                {t('engines.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
