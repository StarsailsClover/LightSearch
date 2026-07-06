// 搜索路由
// POST /api/search -> SearchResponse

import Router from '@koa/router';
import { aggregateSearch } from '../services/aggregator.js';
import type { SearchRequest } from '../types.js';

const router = new Router();

router.post('/api/search', async (ctx) => {
  const body = (ctx.request.body ?? {}) as Partial<SearchRequest>;

  // 参数校验
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query) {
    ctx.status = 400;
    ctx.body = { error: 'query is required' };
    return;
  }
  if (!Array.isArray(body.engines) || body.engines.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'engines must be a non-empty array' };
    return;
  }

  const req: SearchRequest = {
    query,
    engines: body.engines.filter((e): e is string => typeof e === 'string'),
    timeRange: body.timeRange,
    limit: typeof body.limit === 'number' ? body.limit : undefined,
    offset: typeof body.offset === 'number' ? body.offset : undefined,
  };

  try {
    const response = await aggregateSearch(req);
    ctx.body = response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    ctx.status = 500;
    ctx.body = { error: `Search failed: ${msg}` };
  }
});

export default router;
