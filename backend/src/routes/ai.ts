// AI 转发路由
// POST /api/ai/chat -> 透传到 OpenAI 兼容端点

import Router from '@koa/router';
import { proxyChatCompletion } from '../services/openai-proxy.js';
import type { ChatCompletionRequest } from '../types.js';

const router = new Router();

router.post('/api/ai/chat', async (ctx) => {
  const body = (ctx.request.body ?? {}) as Partial<ChatCompletionRequest>;

  // 构造请求对象（字段透传）
  const req: ChatCompletionRequest = {
    messages: Array.isArray(body.messages) ? body.messages : [],
    model: typeof body.model === 'string' ? body.model : '',
    endpoint: typeof body.endpoint === 'string' ? body.endpoint : '',
    apiKey: typeof body.apiKey === 'string' ? body.apiKey : '',
    temperature: typeof body.temperature === 'number' ? body.temperature : undefined,
    top_p: typeof body.top_p === 'number' ? body.top_p : undefined,
    max_tokens: typeof body.max_tokens === 'number' ? body.max_tokens : undefined,
    stream: typeof body.stream === 'boolean' ? body.stream : undefined,
    tools: Array.isArray(body.tools) ? body.tools : undefined,
  };

  await proxyChatCompletion(ctx, req);
});

export default router;
