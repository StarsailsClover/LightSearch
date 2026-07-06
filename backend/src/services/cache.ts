// 简单的 LRU 内存缓存
// 不依赖外部库，使用 Map 的插入顺序特性实现 LRU 淘汰

import { config } from '../config.js';
import type { SearchResponse } from '../types.js';

interface CacheEntry {
  value: SearchResponse;
  expireAt: number;
}

const store = new Map<string, CacheEntry>();

/** 生成缓存 key */
export function buildCacheKey(
  query: string,
  engines: string[],
  timeRange?: string
): string {
  const sorted = [...engines].sort();
  return `${query}|${sorted.join(',')}|${timeRange || 'any'}`;
}

/** 读取缓存，命中时返回值并把条目移到末尾（最近使用） */
export function get(key: string): SearchResponse | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expireAt) {
    store.delete(key);
    return undefined;
  }
  // 重新插入以更新 Map 迭代顺序（LRU）
  store.delete(key);
  store.set(key, entry);
  // 命中时返回 cachedAt 字段
  return { ...entry.value, cachedAt: entry.value.cachedAt ?? entry.expireAt - config.cacheTtlMs };
}

/** 写入缓存，超过容量时淘汰最久未使用的条目 */
export function set(key: string, value: SearchResponse): void {
  // 若已存在先删除，再以新值插入末尾
  if (store.has(key)) store.delete(key);
  store.set(key, {
    value: { ...value, cachedAt: Date.now() },
    expireAt: Date.now() + config.cacheTtlMs,
  });
  // 容量淘汰：Map 迭代器按插入顺序，前部即最久未用
  while (store.size > config.cacheMaxEntries) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

/** 清空缓存（测试用） */
export function clear(): void {
  store.clear();
}

/** 当前缓存条目数 */
export function size(): number {
  return store.size;
}
