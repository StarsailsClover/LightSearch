// Bing HTML 抓取器
// 通过解析 https://www.bing.com/search?q=... 的 HTML 提取 organic 结果

import * as cheerio from 'cheerio';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

export class BingScraper extends BaseScraper {
  readonly engineId = 'bing';
  readonly engineName = 'Bing';
  override readonly weight = 1.0;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://www.bing.com/search?q={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const count = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=${count}`;
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    // Bing organic 结果：li.b_algo > h2 > a，摘要在 div.b_caption p
    $('li.b_algo').each((_, el) => {
      if (results.length >= count) return false;
      const $el = $(el);
      const $a = $el.find('h2 > a').first();
      const title = $a.text();
      const href = $a.attr('href') || '';
      if (!title || !href || !/^https?:\/\//i.test(href)) return;

      const snippet =
        $el.find('div.b_caption p').first().text() ||
        $el.find('p.b_lineclamp4').first().text() ||
        $el.find('.b_caption').text();

      results.push(this.buildResult(title, href, snippet));
      return;
    });

    return this.cap(results, opts.limit);
  }
}
