// EngineStatus：显示各引擎抓取耗时/状态
// 绿色 ✓ + 耗时ms / 红色 ✗ + 错误

import { useI18n } from '../../i18n';
import type { EngineTiming } from '../../api/types';
import { formatMs } from '../../utils/format';

interface EngineStatusProps {
  timings: EngineTiming[];
  tookMs: number;
}

export function EngineStatus({ timings, tookMs }: EngineStatusProps) {
  const { t } = useI18n();

  if (timings.length === 0) return null;

  return (
    <div className="engine-status" role="status">
      <div className="engine-status-list">
        {timings.map((tm) => (
          <span
            key={tm.engine}
            className={`engine-status-item ${tm.ok ? 'engine-status-ok' : 'engine-status-fail'}`}
            title={tm.error || ''}
          >
            <span className="engine-status-mark" aria-hidden="true">
              {tm.ok ? '✓' : '✗'}
            </span>
            <span className="engine-status-name">{tm.engine}</span>
            {tm.ok ? (
              <span className="engine-status-ms">{formatMs(tm.ms)}</span>
            ) : (
              <span className="engine-status-err">{t('engine.failed')}</span>
            )}
          </span>
        ))}
      </div>
      <div className="engine-status-total">{t('search.tookMs', { ms: tookMs })}</div>
    </div>
  );
}
