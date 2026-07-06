// 后端 API 封装：所有调用集中在此
// 开发环境经 Vite 代理 /api -> http://localhost:8788，避免 CORS

import type {
  SearchRequest,
  SearchResponse,
  ChatCompletionRequest,
  ChatMessage,
  AIProfile,
  AppConfig,
} from './types';

// 基础路径：默认走同源 /api（由 Vite 代理），生产环境可由 VITE_API_BASE 覆盖
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

// 统一请求错误
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// fetch 封装：JSON in/out
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error || body?.message || message;
    } catch {
      /* 忽略解析错误 */
    }
    throw new ApiError(message, res.status);
  }
  // 处理无内容响应
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// 聚合搜索
export async function search(req: SearchRequest, signal?: AbortSignal): Promise<SearchResponse> {
  return request<SearchResponse>('/api/search', {
    method: 'POST',
    body: JSON.stringify(req),
    signal,
  });
}

// AI 对话（流式 SSE）
// 调用方传入 onChunk 回调逐字接收
export async function chatStream(
  profile: AIProfile,
  messages: ChatMessage[],
  onChunk: (delta: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const req: ChatCompletionRequest = {
    messages,
    model: profile.model,
    endpoint: profile.baseUrl,
    apiKey: profile.apiKey,
    temperature: profile.temperature,
    stream: true,
  };

  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error || body?.message || message;
    } catch {
      /* 忽略 */
    }
    throw new ApiError(message, res.status);
  }

  if (!res.body) {
    throw new Error('响应体为空');
  }

  // 解析 SSE 流：按行分割，data: 开头的行携带 JSON
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // 按换行切分，保留最后未完成的行
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        // OpenAI 协议：choices[0].delta.content
        const delta = json?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) {
          onChunk(delta);
        }
      } catch {
        // 忽略无法解析的 chunk
      }
    }
  }
}

// 测试 AI 连接（非流式，发送简单 hello）
export async function testAIProfile(profile: AIProfile, signal?: AbortSignal): Promise<void> {
  await request<{ ok: boolean }>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'hello' } as ChatMessage],
      model: profile.model,
      endpoint: profile.baseUrl,
      apiKey: profile.apiKey,
      temperature: 0,
      stream: false,
    } as ChatCompletionRequest),
    signal,
  });
}

// 获取后端应用配置（默认引擎等）
export async function getConfig(signal?: AbortSignal): Promise<AppConfig> {
  return request<AppConfig>('/api/config', { signal });
}
