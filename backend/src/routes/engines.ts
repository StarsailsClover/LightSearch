// 引擎配置路由
// GET /api/engines -> AppConfig

import Router from '@koa/router';
import { config } from '../config.js';
import { defaultEngines, defaultAcademicEngines } from '../scrapers/index.js';
import type { AppConfig } from '../types.js';

const router = new Router();

router.get('/api/engines', (ctx) => {
  const body: AppConfig = {
    version: config.version,
    defaultEngines,
    defaultAcademicEngines,
  };
  ctx.body = body;
});

export default router;
