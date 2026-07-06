// 百度 HTML 抓取器
// 通过解析 https://www.baidu.com/s?wd=... 的 HTML 提取 organic 结果

import * as cheerio from 'cheerio';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

export class BaiduScraper extends BaseScraper {
  readonly engineId = 'baidu';
  readonly engineName = 'Baidu';
  override readonly weight = 0.9;
  override readonly type = 'web' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://www.baidu.com/s?wd={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}&rn=${limit}`;
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    const results: SearchResult[] = [];

    // 百度 organic 结果：div.result / div.c-container，标题在 h3 > a
    $('div.result, div.c-container').each((_, el) => {
      if (results.length >= limit) return false;
      const $el = $(el);
      const $a = $el.find('h3 > a').first();
      const title = $a.text();
      const href = $a.attr('href') || '';
      if (!title || !href) return;

      // 百度链接常为 baidu.com/link?url=... 短链，直接保留原链接
      // snippet 选择器历史变化较多
      const snippet =
        $el.find('span.content-right_8Zs40').first().text() ||
        $el.find('div.c-abstract').first().text() ||
        $el.find('div.c_span').first().text() ||
        $el.find('[class*="abstract"]').first().text();

      results.push(this.buildResult(title, href, snippet));
      return;
    });

    return this.cap(results, opts.limit);
  }
}
