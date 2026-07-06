// DuckDuckGo HTML 抓取器
// 使用 https://html.duckduckgo.com/html/?q=... 的无 JS 版本

import * as cheerio from 'cheerio';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

export class DuckDuckGoScraper extends BaseScraper {
  readonly engineId = 'duckduckgo';
  readonly engineName = 'DuckDuckGo';
  override readonly weight = 0.9;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://duckduckgo.com/?q={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    // DDG HTML 版需要表单 POST 才稳，但 GET 也可工作
    const html = await this.fetchHtml(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(query)}&b=&kl=`,
    });
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    // DDG HTML 版结果：div.result / div.web-result，标题 a.result__a，snippet a.result__snippet
    $('div.result, div.web-result').each((_, el) => {
      if (results.length >= limit) return false;
      const $el = $(el);
      const $a = $el.find('a.result__a').first();
      const title = $a.text();
      let href = $a.attr('href') || '';
      if (!title || !href) return;
      // DDG 链接形如 //duckduckgo.com/l/?uddg=<encoded>&rut=...
      href = normalizeDdgUrl(href);
      if (!href || !/^https?:\/\//i.test(href)) return;

      const snippet =
        $el.find('a.result__snippet').first().text() ||
        $el.find('.result__snippet').first().text() ||
        '';

      results.push(this.buildResult(title, href, snippet));
      return;
    });

    return this.cap(results, opts.limit);
  }
}

function normalizeDdgUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('//')) href = 'https:' + href;
  // 解析 DDG 跳转链接
  try {
    const u = new URL(href);
    if (u.pathname === '/l/' || u.pathname.includes('duckduckgo.com/l')) {
      const uddg = u.searchParams.get('uddg');
      if (uddg) return decodeURIComponent(uddg);
    }
  } catch {
    /* ignore */
  }
  return href;
}
