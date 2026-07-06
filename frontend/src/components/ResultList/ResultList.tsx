// ResultList：列表式展示聚合结果（无卡片，用分隔线）
// 顶部 EngineStatus 行；空状态诚实显示「暂无数据」

import { useI18n } from '../../i18n';
import type { SearchResponse } from '../../api/types';
import { ResultItem } from './ResultItem';
import { EngineStatus } from './EngineStatus';

interface ResultListProps {
  loading: boolean;
  error: string | null;
  response: SearchResponse | null;
  lastQuery: string;
}

export function ResultList({ loading, error, response, lastQuery }: ResultListProps) {
  const { t } = useI18n();

  // 未搜索：提示输入
  if (!lastQuery && !loading && !response && !error) {
    return (
      <div className="results-empty">
        <p className="results-empty-text">{t('search.noQuery')}</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    // 特殊错误：未选中引擎
    if (error === 'NO_ENGINES') {
      return (
        <div className="results-empty">
          <p className="results-empty-text">{t('search.empty')}</p>
        </div>
      );
    }
    return (
      <div className="results-error">
        <p className="results-error-text">{t('search.error', { message: error })}</p>
      </div>
    );
  }

  // 加载中且尚无结果
  if (loading && !response) {
    return (
      <div className="results-empty">
        <p className="results-empty-text">{t('common.loading')}</p>
      </div>
    );
  }

  // 有响应
  if (response) {
    const { results, timings, tookMs, total } = response;

    return (
      <div className="results">
        <div className="results-header">
          <span className="results-count">
            {total} {t('search.results')}
          </span>
          <EngineStatus timings={timings} tookMs={tookMs} />
        </div>

        {results.length === 0 ? (
          <div className="results-empty">
            <p className="results-empty-text">{t('search.empty')}</p>
          </div>
        ) : (
          <ul className="results-list" role="list">
            {results.map((r, i) => (
              <ResultItem key={`${r.engineId}-${r.url}-${i}`} result={r} index={i} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
}
