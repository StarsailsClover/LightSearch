// 后端运行配置
// 优先读取环境变量，未设置时使用默认值

function parseInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === '1' || value.toLowerCase() === 'true';
}

export const config = {
  // 服务端口
  port: parseInt(process.env.PORT, 8788),

  // 单引擎抓取超时（毫秒）
  engineTimeoutMs: parseInt(process.env.ENGINE_TIMEOUT_MS, 8000),

  // 缓存配置：TTL 10 分钟，最大 1000 条
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS, 10 * 60 * 1000),
  cacheMaxEntries: parseInt(process.env.CACHE_MAX_ENTRIES, 1000),

  // 默认语言
  defaultLang: process.env.DEFAULT_LANG || 'en',

  // SearXNG 可选实例
  searxngUrl: process.env.SEARXNG_URL || '',
  searxngEnabled: parseBool(process.env.SEARXNG_ENABLED, false),

  // 通用 User-Agent
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',

  // 服务版本（与根 package.json 保持一致）
  version: '3.0.0',

  // 服务启动时间（用于 /api/health 的 uptime 计算）
  startedAt: Date.now(),
} as const;

export type AppConfig = typeof config;
