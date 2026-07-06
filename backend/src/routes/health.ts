// 健康检查路由
// GET /api/health -> { ok, version, uptime }

import Router from '@koa/router';
import { config } from '../config.js';

const router = new Router();

router.get('/api/health', (ctx) => {
  const uptime = Math.floor((Date.now() - config.startedAt) / 1000);
  ctx.body = {
    ok: true,
    version: config.version,
    uptime,
  };
});

export default router;
