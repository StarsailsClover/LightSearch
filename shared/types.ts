// 共享类型定义 - 前后端共用
// LightSearch API contract

export type EngineType = 'web' | 'academic' | 'image' | 'news' | 'video';

export interface Engine {
  id: string;
  name: string;
  url: string; // 模板 URL，包含 {query} 占位符
  type: EngineType;
  enabled: boolean;
  builtin?: boolean;
}

export interface SearchMeta {
  publishedAt?: string;
  authors?: string[];
  pdfUrl?: string;
  doi?: string;
  citations?: number;
}

export interface SearchResult {
  engine: string;
  engineId: string;
  title: string;
  url: string;
  snippet: string;
  meta?: SearchMeta;
  score?: number; // 相关性评分，由聚合器计算
}

export interface EngineTiming {
  engine: string;
  ms: number;
  ok: boolean;
  error?: string;
}

export type TimeRange = 'any' | '1y' | '5y' | '10y' | '1m' | '1w';

export interface SearchRequest {
  query: string;
  engines: string[]; // engine id 列表
  timeRange?: TimeRange;
  limit?: number; // 每个引擎的结果数上限
  offset?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  timings: EngineTiming[];
  total: number;
  tookMs: number;
  cachedAt?: number;
}

// OpenAI 协议转发
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  endpoint: string; // OpenAI 兼容 base URL，例如 https://api.openai.com/v1
  apiKey: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: unknown[];
}

export interface AIProfile {
  id: string;
  name: string;
  baseUrl: string; // 例如 https://api.openai.com/v1
  apiKey: string;
  model: string;
  temperature?: number;
}

export interface AppConfig {
  version: string;
  defaultEngines: Engine[];
  defaultAcademicEngines: Engine[];
}
