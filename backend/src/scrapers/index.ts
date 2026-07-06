// Scraper 注册表
// 维护 engineId -> BaseScraper 实例的映射，并提供 defaultEngines 配置

import type { Engine } from '../types.js';
import { BaseScraper } from './base.js';
import { GoogleScraper } from './google.js';
import { BingScraper } from './bing.js';
import { BaiduScraper } from './baidu.js';
import { DuckDuckGoScraper } from './duckduckgo.js';
import { WikipediaScraper } from './wikipedia.js';
import { ArxivScraper } from './arxiv.js';
import { PubMedScraper } from './pubmed.js';
import { SearXNGScraper } from './searxng.js';

/** 所有已注册的 scraper 实例 */
const scrapers: BaseScraper[] = [
  new GoogleScraper(),
  new BingScraper(),
  new BaiduScraper(),
  new DuckDuckGoScraper(),
  new WikipediaScraper(),
  new ArxivScraper(),
  new PubMedScraper(),
  new SearXNGScraper(),
];

/** engineId -> scraper 映射 */
export const scraperRegistry: Record<string, BaseScraper> = Object.fromEntries(
  scrapers.map((s) => [s.engineId, s])
);

/** 根据 id 获取 scraper */
export function getScraper(engineId: string): BaseScraper | undefined {
  return scraperRegistry[engineId];
}

/** 将 scraper 元信息转换为 Engine 配置（用于 /api/engines） */
function scraperToEngine(s: BaseScraper): Engine {
  return {
    id: s.engineId,
    name: s.engineName,
    url: s.urlTemplate,
    type: s.type,
    enabled: s.defaultEnabled,
    builtin: true,
  };
}

/** 默认 web 类引擎列表 */
export const defaultEngines: Engine[] = scrapers
  .filter((s) => s.type === 'web' && s.defaultEnabled)
  .map(scraperToEngine);

/** 默认学术类引擎列表 */
export const defaultAcademicEngines: Engine[] = scrapers
  .filter((s) => s.type === 'academic' && s.defaultEnabled)
  .map(scraperToEngine);

/** 全部引擎配置（包含禁用项，供前端展示） */
export const allEngines: Engine[] = scrapers.map(scraperToEngine);

export { BaseScraper } from './base.js';
export type { SearchOptions } from './base.js';
