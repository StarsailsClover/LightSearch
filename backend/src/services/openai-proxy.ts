// OpenAI 兼容协议转发
// 将前端发起的 ChatCompletionRequest 转发到任意 OpenAI 兼容端点
// 支持 SSE 流式透传与非流式 JSON 响应

import { Readable } from 'node:stream';
import type { Context } from 'koa';
import type { ChatCompletionRequest } from '../types.js';

/** OpenAI 风格的错误结构 */
export interface OpenAIError {
  error: {
    message: string;
    type: string;
    code: string | null;
    param?: string | null;
  };
}

/** 构造 OpenAI 风格错误响应 */
function buildError(message: string, type = 'invalid_request_error', status = 400): {
  status: number;
  body: OpenAIError;
} {
  return {
    status,
    body: {
      error: {
        message,
        type,
        code: null,
      },
    },
  };
}

/** 校验请求并构造转发给上游的 body */
function buildUpstreamPayload(req: ChatCompletionRequest): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    model: req.model,
    messages: req.messages,
  };
  if (typeof req.temperature === 'number') payload.temperature = req.temperature;
  if (typeof req.top_p === 'number') payload.top_p = req.top_p;
  if (typeof req.max_tokens === 'number') payload.max_tokens = req.max_tokens;
  if (typeof req.stream === 'boolean') payload.stream = req.stream;
  if (Array.isArray(req.tools)) payload.tools = req.tools;
  return payload;
}

/** 规范化 endpoint：去除尾部斜杠 */
function normalizeEndpoint(endpoint: string): string {
  return endpoint.replace(/\/+$/, '');
}

/**
 * 处理 OpenAI 兼容转发
 * 流式：直接把上游 SSE 透传给客户端
 * 非流式：解析为 JSON 后回写
 */
export async function proxyChatCompletion(ctx: Context, req: ChatCompletionRequest): Promise<void> {
  // 基本校验
  if (!req.endpoint) {
    const err = buildError('endpoint is required', 'invalid_request_error', 400);
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }
  if (!req.apiKey) {
    const err = buildError('apiKey is required', 'invalid_request_error', 400);
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }
  if (!req.model) {
    const err = buildError('model is required', 'invalid_request_error', 400);
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }
  if (!Array.isArray(req.messages) || req.messages.length === 0) {
    const err = buildError('messages must be a non-empty array', 'invalid_request_error', 400);
    ctx.status = err.status;
    ctx.body = err.body;
    return;
  }

  const upstreamUrl = `${normalizeEndpoint(req.endpoint)}/chat/completions`;
  const payload = buildUpstreamPayload(req);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.apiKey}`,
        Accept: req.stream ? 'text/event-stream' : 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const e = buildError(`Failed to reach upstream: ${msg}`, 'api_connection_error', 502);
    ctx.status = e.status;
    ctx.body = e.body;
    return;
  }

  // 上游返回非 2xx：把错误结构透传给客户端
  if (!upstreamRes.ok) {
    let errBody: unknown = null;
    try {
      errBody = await upstreamRes.json();
    } catch {
      try {
        errBody = await upstreamRes.text();
      } catch {
        /* ignore */
      }
    }
    ctx.status = upstreamRes.status;
    // 如果上游已经返回 OpenAI 风格错误，原样转发；否则包装
    if (errBody && typeof errBody === 'object' && 'error' in (errBody as Record<string, unknown>)) {
      ctx.body = errBody;
    } else {
      const e = buildError(
        typeof errBody === 'string' && errBody
          ? errBody
          : `Upstream returned ${upstreamRes.status} ${upstreamRes.statusText}`,
        'upstream_error',
        upstreamRes.status
      );
      ctx.body = e.body;
    }
    return;
  }

  // 流式：透传 SSE
  if (req.stream && upstreamRes.body) {
    ctx.status = 200;
    ctx.set('Content-Type', 'text/event-stream; charset=utf-8');
    ctx.set('Cache-Control', 'no-cache, no-transform');
    ctx.set('Connection', 'keep-alive');
    // 禁用 nginx 等中间代理的缓冲
    ctx.set('X-Accel-Buffering', 'no');
    // 把 web ReadableStream 转 Node Readable，再 pipe 到响应
    const nodeStream = Readable.fromWeb(upstreamRes.body as unknown as Parameters<typeof Readable.fromWeb>[0]);
    // Koa 在 ctx.body 为 Stream 时会自动 pipe 并处理错误
    ctx.body = nodeStream;
    return;
  }

  // 非流式：把上游 JSON 原样回写
  const text = await upstreamRes.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    // 上游未返回合法 JSON，原样回写文本
    ctx.status = upstreamRes.status;
    ctx.type = 'text/plain';
    ctx.body = text;
    return;
  }
  ctx.status = upstreamRes.status;
  ctx.body = json;
}
