// LightSearch 后端入口
// Koa 2 + @koa/router + @koa/cors + koa-bodyparser

import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import enginesRouter from './routes/engines.js';
import searchRouter from './routes/search.js';
import aiRouter from './routes/ai.js';

const app = new Koa();

// 全局错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    ctx.status = ctx.status && ctx.status >= 400 ? ctx.status : 500;
    ctx.body = { error: msg };
  }
});

// CORS：允许任意来源（前端可能从任何端口访问）
app.use(cors({ origin: '*' }));

// body 解析
app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '8mb',
    formLimit: '8mb',
  })
);

// 注册路由
app.use(healthRouter.routes());
app.use(healthRouter.allowedMethods());
app.use(enginesRouter.routes());
app.use(enginesRouter.allowedMethods());
app.use(searchRouter.routes());
app.use(searchRouter.allowedMethods());
app.use(aiRouter.routes());
app.use(aiRouter.allowedMethods());

const server = app.listen(config.port, () => {
  console.log(`LightSearch API listening on http://localhost:${config.port}`);
});

// 优雅退出
function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  // 强制退出兜底（5 秒后）
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { app, server };
