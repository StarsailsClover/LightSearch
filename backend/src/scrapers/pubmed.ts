// PubMed 学术搜索抓取器
// 使用 NCBI E-utilities：先 esearch 拿 PMID 列表，再 esummary 取详情

import { BaseScraper, type SearchOptions } from './base.js';
import type { SearchResult } from '../types.js';

interface ESearchResponse {
  esearchresult?: {
    idlist?: string[];
  };
}

interface ESummaryResponse {
  result?: {
    uids?: string[];
    [id: string]:
      | unknown
      | {
          title?: string;
          pubdate?: string;
          authors?: Array<{ name?: string }>;
          fulljournalname?: string;
          elocationid?: string;
        };
  };
}

export class PubMedScraper extends BaseScraper {
  readonly engineId = 'pubmed';
  readonly engineName = 'PubMed';
  override readonly weight = 0.85;
  override readonly type = 'academic' as const;
  override readonly defaultEnabled = true;
  readonly urlTemplate = 'https://pubmed.ncbi.nlm.nih.gov/?term={query}';

  async search(query: string, opts: SearchOptions): Promise<SearchResult[]> {
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 5;
    const esearchUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed` +
      `&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json`;

    const esearch = await this.fetchJson<ESearchResponse>(esearchUrl);
    const ids = esearch?.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    const esummaryUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed` +
      `&id=${ids.join(',')}&retmode=json`;
    const summary = await this.fetchJson<ESummaryResponse>(esummaryUrl);
    const result = summary?.result;
    if (!result) return [];

    const uids = result.uids || [];
    const results: SearchResult[] = [];
    for (const id of uids) {
      const item = result[id] as {
        title?: string;
        pubdate?: string;
        authors?: Array<{ name?: string }>;
        fulljournalname?: string;
        elocationid?: string;
      } | undefined;
      if (!item || !item.title) continue;
      const pageUrl = `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(id)}/`;
      const authors = (item.authors || [])
        .map((a) => a.name)
        .filter((n): n is string => !!n);
      const snippetParts: string[] = [];
      if (item.fulljournalname) snippetParts.push(item.fulljournalname);
      if (item.pubdate) snippetParts.push(item.pubdate);
      const snippet = snippetParts.join(' · ');

      let doi: string | undefined;
      if (item.elocationid) {
        const m = item.elocationid.match(/doi:\s*([^\s;]+)/i);
        if (m) doi = m[1];
      }

      results.push(
        this.buildResult(item.title, pageUrl, snippet, {
          ...(item.pubdate ? { publishedAt: item.pubdate } : {}),
          ...(authors.length ? { authors } : {}),
          ...(doi ? { doi } : {}),
        })
      );
    }

    return this.cap(results, opts.limit);
  }
}
