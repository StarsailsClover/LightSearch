// AIProfileManager：Cherry Studio 风格 API 配置管理
// 左侧 profile 列表（含「+ 新建」），右侧详情编辑
// 字段：名称 / Base URL / API Key（密文，可显示/复制）/ 模型 / 温度
// 支持多 profile、标记默认、测试连接

import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import type { AIProfile } from '../../api/types';
import { genId } from '../../utils/format';
import { ApiError, testAIProfile } from '../../api/client';

interface AIProfileManagerProps {
  profiles: AIProfile[];
  defaultProfileId: string | null;
  onAdd: (profile: AIProfile) => void;
  onUpdate: (profile: AIProfile) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

function emptyProfile(): AIProfile {
  return {
    id: '',
    name: '',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
  };
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

export function AIProfileManager({
  profiles,
  defaultProfileId,
  onAdd,
  onUpdate,
  onDelete,
  onSetDefault,
}: AIProfileManagerProps) {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(profiles[0]?.id ?? null);
  const [draft, setDraft] = useState<AIProfile | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const [testState, setTestState] = useState<TestState>('idle');
  const [testMsg, setTestMsg] = useState('');

  // 选中变化时同步 draft
  useEffect(() => {
    if (isNew) return;
    const found = profiles.find((p) => p.id === selectedId) ?? null;
    setDraft(found ? { ...found } : null);
    setTestState('idle');
    setTestMsg('');
  }, [selectedId, profiles, isNew]);

  function startNew() {
    setDraft(emptyProfile());
    setIsNew(true);
    setSelectedId(null);
    setTestState('idle');
    setTestMsg('');
  }

  function save() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.baseUrl.trim() || !draft.model.trim()) return;
    if (isNew) {
      const created = { ...draft, id: genId('profile') };
      onAdd(created);
      setSelectedId(created.id);
      setIsNew(false);
    } else {
      onUpdate(draft);
    }
  }

  function remove() {
    if (!draft || isNew) {
      setDraft(null);
      setIsNew(false);
      setSelectedId(profiles[0]?.id ?? null);
      return;
    }
    onDelete(draft.id);
    setSelectedId(profiles.find((p) => p.id !== draft.id)?.id ?? null);
  }

  async function testConnection() {
    if (!draft || !draft.baseUrl.trim() || !draft.apiKey.trim() || !draft.model.trim()) return;
    setTestState('testing');
    setTestMsg('');
    try {
      await testAIProfile(draft);
      setTestState('ok');
      setTestMsg(t('ai.profile.testOk'));
    } catch (err) {
      setTestState('fail');
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'error';
      setTestMsg(`${t('ai.profile.testFail')}：${msg}`);
    }
  }

  function copyKey() {
    if (!draft?.apiKey) return;
    navigator.clipboard?.writeText(draft.apiKey).then(
      () => {
        setCopyState(true);
        setTimeout(() => setCopyState(false), 1500);
      },
      () => {}
    );
  }

  return (
    <div className="settings-panel settings-panel-split">
      {/* 左侧 profile 列表 */}
      <div className="profile-list">
        <div className="profile-list-header">
          <button type="button" className="btn btn-primary btn-block" onClick={startNew}>
            + {t('ai.profile.add')}
          </button>
        </div>
        <ul role="list" className="profile-list-items">
          {profiles.length === 0 && (
            <li className="profile-list-empty">{t('ai.profile.empty')}</li>
          )}
          {profiles.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`profile-item ${selectedId === p.id && !isNew ? 'profile-item-active' : ''}`}
                onClick={() => {
                  setIsNew(false);
                  setSelectedId(p.id);
                }}
              >
                <div className="profile-item-name">
                  {p.name}
                  {defaultProfileId === p.id && (
                    <span className="tag tag-default">{t('ai.profile.default')}</span>
                  )}
                </div>
                <div className="profile-item-model ellipsis">{p.model}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 右侧详情编辑 */}
      <div className="profile-detail">
        {!draft ? (
          <div className="profile-detail-empty">{t('ai.profile.empty')}</div>
        ) : (
          <>
            <h3 className="settings-panel-title">
              {isNew ? t('ai.profile.add') : draft.name}
            </h3>

            <label className="field">
              <span className="field-label">{t('ai.profile.name')}</span>
              <input
                className="field-input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder={t('ai.profile.name')}
              />
            </label>

            <label className="field">
              <span className="field-label">{t('ai.profile.baseUrl')}</span>
              <input
                className="field-input"
                value={draft.baseUrl}
                onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </label>

            <div className="field">
              <span className="field-label">{t('ai.profile.apiKey')}</span>
              <div className="field-input-row">
                <input
                  className="field-input"
                  type={showKey ? 'text' : 'password'}
                  value={draft.apiKey}
                  onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                  placeholder="sk-..."
                  autoComplete="off"
                />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowKey((v) => !v)}>
                  {showKey ? t('ai.profile.hideKey') : t('ai.profile.showKey')}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copyKey}>
                  {copyState ? t('common.copied') : t('ai.profile.copyKey')}
                </button>
              </div>
            </div>

            <label className="field">
              <span className="field-label">{t('ai.profile.model')}</span>
              <input
                className="field-input"
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                placeholder="gpt-4o-mini"
              />
            </label>

            <label className="field">
              <span className="field-label">
                {t('ai.profile.temperature')} ({draft.temperature ?? 0.7})
              </span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={draft.temperature ?? 0.7}
                onChange={(e) => setDraft({ ...draft, temperature: parseFloat(e.target.value) })}
              />
            </label>

            {/* 测试连接反馈 */}
            {testState !== 'idle' && (
              <div className={`test-result test-${testState}`}>
                {testState === 'testing' ? t('ai.profile.testing') : testMsg}
              </div>
            )}

            <div className="profile-detail-actions">
              <button type="button" className="btn btn-ghost" onClick={testConnection} disabled={testState === 'testing'}>
                {testState === 'testing' ? t('ai.profile.testing') : t('ai.profile.test')}
              </button>
              {!isNew && (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onSetDefault(draft.id)}
                    disabled={defaultProfileId === draft.id}
                  >
                    {t('ai.profile.set_default')}
                  </button>
                  <button type="button" className="btn btn-ghost btn-danger" onClick={remove}>
                    {t('ai.profile.delete')}
                  </button>
                </>
              )}
              <button type="button" className="btn btn-primary" onClick={save}>
                {t('common.save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
