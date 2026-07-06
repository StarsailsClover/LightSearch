// SearXNG 元搜索抓取器（可选）
// 通过公共实例或自建实例的 JSON API 检索
// 默认禁用，需要通过环境变量 SEARXNG_URL / SEARXNG_ENABLED=true 启用

import { config } from '../config.js';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

interface SearXNGResult {
  title?: string;
  url?: string;
  content?: string;
  publishedDate?: string;
  engine?: string;
}

interface SearXNGResponse {
  results?: SearXNGResult[];
}

export class SearXNGScraper extends BaseScraper {
  readonly engineId = 'searxng';
  readonly engineName = 'SearXNG';
  override readonly weight = 0.9;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = false;
  readonly urlTemplate = 'https://searx.be/search?q={query}';

  get instanceUrl(): string {
    return config.searxngUrl || 'https://searx.be';
  }

  isEnabled(): boolean {
    return config.searxngEnabled && !!config.searxngUrl;
  }

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    if (!this.isEnabled()) {
      throw new Error('SearXNG disabled (set SEARXNG_URL and SEARXNG_ENABLED=true)');
    }
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const base = this.instanceUrl.replace(/\/+$/, '');
    const url =
      `${base}/search?q=${encodeURIComponent(query)}` +
      `&format=json&categories=general&safesearch=0`;

    const data = await this.fetchJson<SearXNGResponse>(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    const items = data?.results || [];
    const results: SearchResult[] = items
      .filter((r) => r.title && r.url)
      .slice(0, limit)
      .map((r) =>
        this.buildResult(r.title || '', r.url || '', r.content || '', {
          ...(r.publishedDate ? { publishedAt: r.publishedDate } : {}),
        })
      );

    return this.cap(results, opts.limit);
  }
}
