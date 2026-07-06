// 聚合搜索服务
// 并行抓取所有选中引擎 -> 计时 -> 去重 -> 评分排序 -> 写入缓存

import { config } from '../config.js';
import { getScraper } from '../scrapers/index.js';
import type { BaseScraper } from '../scrapers/base.js';
import {
  buildCacheKey,
  get as cacheGet,
  set as cacheSet,
} from './cache.js';
import type {
  SearchRequest,
  SearchResponse,
  SearchResult,
  EngineTiming,
  TimeRange,
} from '../types.js';

const TIME_RANGE_MS: Record<Exclude<TimeRange, 'any'>, number> = {
  '1w': 7 * 24 * 60 * 60 * 1000,
  '1m': 30 * 24 * 60 * 60 * 1000,
  '1y': 365 * 24 * 60 * 60 * 1000,
  '5y': 5 * 365 * 24 * 60 * 60 * 1000,
  '10y': 10 * 365 * 24 * 60 * 60 * 1000,
};

/** 标准化 URL：去除协议、www、query、hash，仅保留 host+path，用于去重 */
export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    let host = u.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    let path = u.pathname.replace(/\/+$/, '') || '/';
    // 百度短链特殊：忽略 path 内容，只按 host 去重会误删，故保留原 path
    return `${host}${path}`;
  } catch {
    // 非标准 URL 退回原始字符串的小写形式
    return raw.toLowerCase();
  }
}

/** 按 publishedAt 过滤时间范围（仅作用于有 publishedAt 的结果） */
function filterByTimeRange(results: SearchResult[], timeRange?: TimeRange): SearchResult[] {
  if (!timeRange || timeRange === 'any') return results;
  const threshold = Date.now() - TIME_RANGE_MS[timeRange];
  return results.filter((r) => {
    if (!r.meta?.publishedAt) return true; // 无时间信息的保留
    const t = Date.parse(r.meta.publishedAt);
    if (!Number.isFinite(t)) return true;
    return t >= threshold;
  });
}

/** 计算单条结果得分 */
function scoreResult(result: SearchResult, scraper: BaseScraper, index: number): number {
  const weight = scraper.weight;
  // 位置奖励：靠前的结果加分，最多 +0.5
  const positionBonus = Math.max(0, 1 - index / 20);
  // 长度奖励：标题和 snippet 内容长度在合理范围内加分（0~0.2）
  const titleLen = result.title.length;
  const snippetLen = result.snippet.length;
  const lengthBonus =
    Math.min(titleLen, 80) / 80 * 0.1 + Math.min(snippetLen, 300) / 300 * 0.1;
  // 学术结果额外加权
  const academicBonus = scraper.type === 'academic' ? 0.05 : 0;
  const score = weight * 0.5 + positionBonus * 0.3 + lengthBonus + academicBonus;
  return Math.round(score * 1000) / 1000;
}

/** 执行一次聚合搜索 */
export async function aggregateSearch(req: SearchRequest): Promise<SearchResponse> {
  const query = req.query.trim();
  const timeRange = req.timeRange || 'any';
  const cacheKey = buildCacheKey(query, req.engines, timeRange);

  // 命中缓存
  const cached = cacheGet(cacheKey);
  if (cached) {
    return cached;
  }

  const startedAt = Date.now();
  const timings: EngineTiming[] = [];
  const dedup = new Map<string, SearchResult>();

  // 解析引擎：跳过未注册的 id，但记录错误
  const tasks: Array<{ scraper: BaseScraper }> = [];
  for (const id of req.engines) {
    const scraper = getScraper(id);
    if (!scraper) {
      timings.push({
        engine: id,
        ms: 0,
        ok: false,
        error: `Unknown engine: ${id}`,
      });
      continue;
    }
    tasks.push({ scraper });
  }

  // 并行抓取，单引擎失败不影响其他
  // 每个 task 内部捕获异常，确保即使失败也返回真实耗时
  const settled = await Promise.allSettled(
    tasks.map(async ({ scraper }): Promise<
      | { scraper: BaseScraper; results: SearchResult[]; ms: number; ok: true }
      | { scraper: BaseScraper; ms: number; ok: false; error: string }
    > => {
      const t0 = Date.now();
      try {
        const results = await scraper.search(query, {
          timeRange,
          limit: req.limit,
          offset: req.offset,
          lang: config.defaultLang,
        });
        return { scraper, results, ms: Date.now() - t0, ok: true };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        return { scraper, ms: Date.now() - t0, ok: false, error: errMsg };
      }
    })
  );

  let idx = 0;
  for (const result of settled) {
    if (result.status !== 'fulfilled') continue;
    const value = result.value;
    if (value.ok) {
      const filtered = filterByTimeRange(value.results, timeRange);
      for (const item of filtered) {
        const key = normalizeUrl(item.url);
        if (!key || dedup.has(key)) continue;
        const scored: SearchResult = {
          ...item,
          score: scoreResult(item, value.scraper, idx),
        };
        dedup.set(key, scored);
        idx++;
      }
      timings.push({
        engine: value.scraper.engineName,
        ms: value.ms,
        ok: true,
      });
    } else {
      // 失败引擎：记录真实耗时与错误信息，不静默吞掉
      timings.push({
        engine: value.scraper.engineName,
        ms: value.ms,
        ok: false,
        error: value.error,
      });
    }
  }

  // 按得分降序排序
  const merged = Array.from(dedup.values()).sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );

  const tookMs = Date.now() - startedAt;
  const response: SearchResponse = {
    query,
    results: merged,
    timings,
    total: merged.length,
    tookMs,
  };

  cacheSet(cacheKey, response);
  return response;
}
