// 重新导出共享类型，方便后端内部模块统一引用
export type {
  EngineType,
  Engine,
  SearchMeta,
  SearchResult,
  EngineTiming,
  TimeRange,
  SearchRequest,
  SearchResponse,
  ChatMessage,
  ChatCompletionRequest,
  AIProfile,
  AppConfig,
} from '../../shared/types.js';
