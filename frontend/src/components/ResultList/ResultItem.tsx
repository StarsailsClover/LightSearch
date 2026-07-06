// ResultItem：单条结果，列表式（无卡片）
// 展示 title（链接，新标签）/ URL（域名，小字灰色）/ snippet / 引擎 chip
// 学术结果额外展示 authors / publishedAt / citations

import { useI18n } from '../../i18n';
import type { SearchResult } from '../../api/types';
import { getDomain } from '../../utils/url';
import { formatDate, formatNumber } from '../../utils/format';

interface ResultItemProps {
  result: SearchResult;
  index: number;
}

export function ResultItem({ result, index }: ResultItemProps) {
  const { t } = useI18n();
  const domain = getDomain(result.url);
  const hasAcademicMeta = !!result.meta && (
    !!result.meta.authors?.length ||
    !!result.meta.publishedAt ||
    typeof result.meta.citations === 'number' ||
    !!result.meta.doi ||
    !!result.meta.pdfUrl
  );

  return (
    <li className="result-item" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
      <div className="result-item-main">
        {/* 域名 + 引擎标签 */}
        <div className="result-item-meta">
          <span className="result-item-domain" title={result.url}>{domain}</span>
          <span className="result-item-engine chip">{result.engine}</span>
        </div>

        {/* 标题链接 */}
        <a
          className="result-item-title"
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          title={t('result.openInNewTab')}
        >
          {result.title}
        </a>

        {/* 摘要 */}
        {result.snippet && <p className="result-item-snippet">{result.snippet}</p>}

        {/* 学术元信息 */}
        {hasAcademicMeta && result.meta && (
          <div className="result-item-academic">
            {result.meta.authors && result.meta.authors.length > 0 && (
              <span className="academic-field">{result.meta.authors.join(', ')}</span>
            )}
            {result.meta.publishedAt && (
              <span className="academic-field academic-date">
                {formatDate(result.meta.publishedAt)}
              </span>
            )}
            {typeof result.meta.citations === 'number' && (
              <span className="academic-field academic-cite">
                {t('result.citations', { n: formatNumber(result.meta.citations) })}
              </span>
            )}
            {result.meta.doi && (
              <span className="academic-field academic-doi">DOI: {result.meta.doi}</span>
            )}
            {result.meta.pdfUrl && (
              <a
                className="academic-pdf"
                href={result.meta.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
