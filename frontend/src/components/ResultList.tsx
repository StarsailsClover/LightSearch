// ResultList — 结果列表 + 引擎状态
// 用分隔线组织结果，非卡片式

import { useI18n } from '../i18n';
import type { SearchResponse, SearchResult } from '../api/types';
import { getDomain, normalizeUrl } from '../utils/url';
import { formatMs, formatNumber, formatRelative } from '../utils/format';

interface ResultListProps {
  loading: boolean;
  error: string | null;
  response: SearchResponse | null;
  /** 最近一次查询（用于上下文展示，本组件当前不直接使用） */
  lastQuery: string;
}

export function ResultList({ loading, error, response }: ResultListProps) {
  const { t } = useI18n();

  // 1) 错误状态
  if (error) {
    if (error === 'NO_ENGINES') {
      return (
        <div className="state">
          <IconWarn className="state__icon" />
          <div>{t('search.empty')}</div>
        </div>
      );
    }
    return (
      <div className="state state--error">
        <IconWarn className="state__icon" />
        <div>{t('search.error', { message: error })}</div>
      </div>
    );
  }

  // 2) 加载中且无缓存结果
  if (loading && !response) {
    return (
      <div className="results">
        <SkeletonList />
      </div>
    );
  }

  // 3) 无搜索
  if (!response) {
    return (
      <div className="state">
        <IconCompass className="state__icon" />
        <div>{t('search.noQuery')}</div>
      </div>
    );
  }

  // 4) 空结果
  if (response.results.length === 0) {
    return (
      <div className="results">
        <ResultsMeta response={response} />
        <div className="state">
          <IconCompass className="state__icon" />
          <div>{t('search.empty')}</div>
        </div>
      </div>
    );
  }

  // 5) 正常渲染
  return (
    <div className="results">
      <ResultsMeta response={response} />
      <EngineStatuses response={response} />
      {response.results.map((r, i) => (
        <ResultItem key={`${r.engineId}-${i}`} result={r} />
      ))}
      {loading && <SkeletonList />}
    </div>
  );
}

/* ---- Sub-components ---- */

function ResultsMeta({ response }: { response: SearchResponse }) {
  const { t } = useI18n();
  return (
    <div className="results__meta">
      <span className="results__count">
        <strong>{formatNumber(response.total)}</strong> {t('search.results')}
      </span>
      <span className="results__took">{t('search.tookMs', { ms: response.tookMs })}</span>
    </div>
  );
}

function EngineStatuses({ response }: { response: SearchResponse }) {
  const { t } = useI18n();
  if (response.timings.length === 0) return null;
  return (
    <div className="results__engines" aria-label={t('engine.status')}>
      {response.timings.map((tg, i) => (
        <span
          key={`${tg.engine}-${i}`}
          className={`engine-status engine-status--${tg.ok ? 'ok' : 'fail'}`}
          title={tg.error ?? undefined}
        >
          <span className="engine-status__dot" aria-hidden />
          <span>{tg.engine}</span>
          <span>{tg.ok ? formatMs(tg.ms) : t('engine.failed')}</span>
        </span>
      ))}
    </div>
  );
}

function ResultItem({ result }: { result: SearchResult }) {
  const { t } = useI18n();
  const url = normalizeUrl(result.url);
  const domain = getDomain(url);
  const meta = result.meta;
  const showMeta = meta && (meta.publishedAt || meta.citations != null || meta.pdfUrl || meta.authors?.length);

  return (
    <article className="result">
      <div className="result__top">
        <span className="result__domain">
          <IconGlobe className="result__favicon" />
          <span>{domain}</span>
        </span>
        <span className="result__engine">{result.engine}</span>
        <span className="result__type">{result.engineId}</span>
      </div>

      <a
        className="result__title"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={t('result.openInNewTab')}
      >
        {result.title}
      </a>

      {result.snippet && (
        <p className="result__snippet">{result.snippet}</p>
      )}

      {showMeta && (
        <div className="result__meta">
          {meta?.publishedAt && (
            <span className="result__meta-item">
              <IconCalendar />
              {formatRelative(meta.publishedAt)}
            </span>
          )}
          {meta?.authors && meta.authors.length > 0 && (
            <span className="result__meta-item">
              <IconUser />
              {meta.authors.slice(0, 3).join(', ')}
              {meta.authors.length > 3 ? ' et al.' : ''}
            </span>
          )}
          {meta?.citations != null && (
            <span className="result__meta-item">
              <IconQuote />
              {t('result.citations', { n: formatNumber(meta.citations) })}
            </span>
          )}
          {meta?.pdfUrl && (
            <span className="result__meta-item">
              <a href={normalizeUrl(meta.pdfUrl)} target="_blank" rel="noopener noreferrer">
                <IconDoc />
                PDF
              </a>
            </span>
          )}
          {meta?.doi && (
            <span className="result__meta-item">
              <span>DOI: {meta.doi}</span>
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function SkeletonList() {
  return (
    <div>
      {[0, 1, 2, 3].map((i) => (
        <div className="skeleton" key={i}>
          <div className="skeleton__line skeleton__line--w30" />
          <div className="skeleton__line skeleton__line--title" />
          <div className="skeleton__line skeleton__line--w100" />
          <div className="skeleton__line skeleton__line--w80" />
        </div>
      ))}
    </div>
  );
}

/* ---- Icons ---- */

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2z" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

function IconWarn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function IconCompass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </svg>
  );
}
