// Wikipedia 搜索抓取器
// 使用 MediaWiki REST API 返回 JSON

import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

interface WikiSearchResponse {
  query?: {
    search?: Array<{
      title: string;
      pageid: number;
      snippet: string;
      timestamp?: string;
    }>;
  };
}

export class WikipediaScraper extends BaseScraper {
  readonly engineId = 'wikipedia';
  readonly engineName = 'Wikipedia';
  override readonly weight = 0.8;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://en.wikipedia.org/w/index.php?search={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 5;
    const lang = opts.lang || 'en';
    const apiBase = `https://${encodeURIComponent(lang)}.wikipedia.org/w/api.php`;
    const url =
      `${apiBase}?action=query&list=search&srsearch=${encodeURIComponent(query)}` +
      `&format=json&srlimit=${limit}&srprop=snippet|timestamp`;

    const data = await this.fetchJson<WikiSearchResponse>(url);
    const items = data?.query?.search || [];
    const results: SearchResult[] = items.map((item) => {
      const pageUrl = `https://${encodeURIComponent(lang)}.wikipedia.org/wiki/${encodeURIComponent(
        item.title.replace(/ /g, '_')
      )}`;
      // 去掉 HTML 高亮标签
      const snippet = item.snippet
        ? item.snippet.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"')
        : '';
      return this.buildResult(item.title, pageUrl, snippet, {
        ...(item.timestamp ? { publishedAt: item.timestamp } : {}),
      });
    });

    return this.cap(results, opts.limit);
  }
}
