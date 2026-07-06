// arXiv 学术搜索抓取器
// 使用 Atom API（XML），解析论文条目

import * as cheerio from 'cheerio';
import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

export class ArxivScraper extends BaseScraper {
  readonly engineId = 'arxiv';
  readonly engineName = 'arXiv';
  override readonly weight = 0.85;
  override readonly type = 'academic' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'http://export.arxiv.org/api/query?search_query=all:{query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 5;
    const url =
      `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}` +
      `&start=0&max_results=${limit}&sortBy=relevance&sortOrder=descending`;

    const xml = await this.fetchHtml(url);
    const $ = cheerio.load(xml, { xmlMode: true });
    const results: SearchResult[] = [];

    $('entry').each((_, el) => {
      const $el = $(el);
      const title = $el.find('title').first().text().trim();
      const summary = $el.find('summary').first().text().trim();
      const id = $el.find('id').first().text().trim();
      if (!title || !id) return;

      const published = $el.find('published').first().text().trim();
      const authors: string[] = [];
      $el.find('author > name').each((__, a) => {
        const name = $(a).text().trim();
        if (name) authors.push(name);
      });

      let absUrl = id;
      let pdfUrl: string | undefined;
      $el.find('link').each((__, link) => {
        const $link = $(link);
        const rel = $link.attr('rel');
        const href = $link.attr('href') || '';
        const titleAttr = $link.attr('title');
        if (rel === 'alternate' && href) absUrl = href;
        if (titleAttr === 'pdf' || rel === 'related') {
          if (/\/pdf\//i.test(href) || titleAttr === 'pdf') pdfUrl = href;
        }
      });

      results.push(
        this.buildResult(title, absUrl, summary, {
          ...(published ? { publishedAt: published } : {}),
          ...(authors.length ? { authors } : {}),
          ...(pdfUrl ? { pdfUrl } : {}),
        })
      );
    });

    return this.cap(results, opts.limit);
  }
}
