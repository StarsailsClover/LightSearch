#!/usr/bin/env node
/*
 * LightSearch Skill - search.js
 * 零依赖 Node.js 脚本，调用 LightSearch 后端 /api/search 端点
 * 要求：Node 18+（内置 fetch）
 *
 * 用法：
 *   node search.js "<query>" [options]
 *
 * 选项：
 *   --engines <csv>   逗号分隔的引擎 ID（默认 bing,duckduckgo,wikipedia）
 *   --limit <n>       每引擎结果上限（默认 5）
 *   --time <range>    时间过滤 any|1w|1m|1y|5y|10y（默认 any）
 *   --json            输出原始 JSON
 *   --api <url>       后端地址（默认 http://localhost:8788）
 *   --help            显示帮助
 */

const DEFAULT_API = process.env.LIGHTSEARCH_API || 'http://localhost:8788';
const DEFAULT_ENGINES = 'bing,duckduckgo,wikipedia';
const DEFAULT_LIMIT = 5;

function parseArgs(argv) {
  const args = { query: '', engines: DEFAULT_ENGINES, limit: DEFAULT_LIMIT, time: 'any', json: false, api: DEFAULT_API };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      args.help = true;
    } else if (a === '--json') {
      args.json = true;
    } else if (a === '--engines') {
      args.engines = argv[++i];
    } else if (a === '--limit') {
      args.limit = parseInt(argv[++i], 10);
    } else if (a === '--time') {
      args.time = argv[++i];
    } else if (a === '--api') {
      args.api = argv[++i];
    } else if (!a.startsWith('--')) {
      positional.push(a);
    } else {
      args.error = `未知参数: ${a}`;
    }
  }
  args.query = positional.join(' ').trim();
  return args;
}

function showHelp() {
  console.log(`LightSearch Skill - 聚合搜索

用法:
  node search.js "<query>" [options]

选项:
  --engines <csv>   逗号分隔的引擎 ID（默认 ${DEFAULT_ENGINES}）
                    可用: google, bing, baidu, duckduckgo, wikipedia, arxiv, pubmed
  --limit <n>       每引擎结果上限（默认 ${DEFAULT_LIMIT}）
  --time <range>    时间过滤 any|1w|1m|1y|5y|10y（默认 any）
  --json            输出原始 JSON
  --api <url>       后端地址（默认 ${DEFAULT_API}）
  --help            显示此帮助

示例:
  node search.js "rag in llm"
  node search.js "transformer" --engines arxiv,pubmed --limit 8
  node search.js "rust async" --json
`);
}

function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function formatResult(r, idx) {
  const lines = [];
  lines.push(`[${idx}] ${r.title || '(no title)'}`);
  lines.push(`    ${r.url}`);
  const meta = [];
  meta.push(`engine: ${r.engine}`);
  if (r.meta?.publishedAt) meta.push(r.meta.publishedAt.slice(0, 10));
  if (r.meta?.authors?.length) meta.push(r.meta.authors.slice(0, 2).join(', '));
  if (r.meta?.citations != null) meta.push(`${r.meta.citations} citations`);
  if (meta.length > 1) lines.push(`    ${meta.join(' · ')}`);
  if (r.snippet) lines.push(`    ${truncate(r.snippet, 280)}`);
  return lines.join('\n');
}

function formatHuman(resp) {
  const out = [];
  out.push(`Found ${resp.results.length} results from ${resp.timings.length} engine(s) in ${resp.tookMs}ms`);
  if (resp.cachedAt) out.push(`(cache hit, cached at ${new Date(resp.cachedAt).toLocaleTimeString()})`);
  out.push('');

  resp.results.forEach((r, i) => {
    out.push(formatResult(r, i + 1));
    out.push('');
  });

  const failed = resp.timings.filter(t => !t.ok);
  if (failed.length > 0) {
    out.push('--- failed engines ---');
    failed.forEach(t => {
      out.push(`${t.engine}: ${t.error || 'unknown error'} (${t.ms}ms)`);
    });
  }

  const okEngines = resp.timings.filter(t => t.ok);
  if (okEngines.length > 0) {
    out.push('--- engine timings ---');
    okEngines.forEach(t => {
      out.push(`${t.engine}: ${t.ms}ms ✓`);
    });
  }

  return out.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (args.error) {
    console.error(`Error: ${args.error}`);
    console.error('Run with --help for usage.');
    process.exit(2);
  }

  if (!args.query) {
    console.error('Error: query is required.');
    console.error('Usage: node search.js "<query>" [options]');
    console.error('Run with --help for full options.');
    process.exit(2);
  }

  const engines = args.engines.split(',').map(s => s.trim()).filter(Boolean);
  if (engines.length === 0) {
    console.error('Error: at least one engine must be specified.');
    process.exit(2);
  }

  const body = {
    query: args.query,
    engines,
    timeRange: args.time,
    limit: args.limit,
  };

  const url = `${args.api.replace(/\/$/, '')}/api/search`;

  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
  } catch (e) {
    console.error(`Error: cannot reach LightSearch backend at ${args.api}.`);
    console.error(`Detail: ${e.message}`);
    console.error('');
    console.error('Start the backend with: cd backend && npm run dev');
    console.error('Or override with --api <url> or LIGHTSEARCH_API env var.');
    process.exit(3);
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    console.error(`Error: backend returned HTTP ${resp.status}.`);
    if (text) console.error(`Body: ${text.slice(0, 500)}`);
    process.exit(4);
  }

  const data = await resp.json();

  if (args.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(formatHuman(data));
  }
}

main().catch(e => {
  console.error(`Fatal: ${e.stack || e.message}`);
  process.exit(1);
});
