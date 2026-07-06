// Google HTML 抓取器
// 通过解析 https://www.google.com/search?q=... 的 HTML 提取 organic 结果

import * as cheerio from 'cheerio';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

export class GoogleScraper extends BaseScraper {
  readonly engineId = 'google';
  readonly engineName = 'Google';
  override readonly weight = 1.0;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://www.google.com/search?q={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const lang = opts.lang || 'en';
    const num = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const url =
      `https://www.google.com/search?q=${encodeURIComponent(query)}` +
      `&num=${num}&hl=${encodeURIComponent(lang)}&ie=UTF-8`;
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    // Google organic 结果容器有多种历史样式：div.g、div.tF2Cxc、div.Gx5Zad
    $('div.g, div.tF2Cxc, div.Gx5Zad').each((_, el) => {
      if (results.length >= num) return false;
      const $el = $(el);
      const $h3 = $el.find('h3').first();
      const $a = $el.find('a[href]').first();
      if (!$h3.length || !$a.length) return;

      const title = $h3.text();
      let href = $a.attr('href') || '';
      // 处理 /url?q=... 重定向格式
      href = normalizeGoogleUrl(href);
      if (!href || !/^https?:\/\//i.test(href)) return;
      if (/google\.com\/search|google\.com\/url|webcache\.google/i.test(href)) return;

      // snippet 选择器随版本变化，依次尝试
      const snippet =
        $el.find('div.VwiC3b').first().text() ||
        $el.find('div.IsZzdc').first().text() ||
        $el.find('[data-sncf]').first().text() ||
        $el.find('span.aCOpRe').first().text() ||
        $el.find('div.BNeawe').last().text();

      if (!title) return;
      results.push(this.buildResult(title, href, snippet));
      return;
    });

    return this.cap(results, opts.limit);
  }
}

function normalizeGoogleUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('/url?')) {
    try {
      const u = new URL('https://www.google.com' + href);
      const q = u.searchParams.get('q');
      if (q) return q;
    } catch {
      /* ignore */
    }
  }
  return href;
}
