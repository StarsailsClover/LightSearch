---
name: "lightsearch"
description: "Aggregates search results across multiple engines (Google/Bing/Baidu/DuckDuckGo/Wikipedia/arXiv/PubMed) via the LightSearch backend. Invoke when the agent needs web search, academic literature lookup, or cross-engine aggregated information retrieval with deduplication and relevance scoring."
---

# LightSearch Skill

LightSearch gives the agent a single-entry search aggregator: one query is fanned out to multiple search engines in parallel, results are deduplicated by URL, scored by engine weight + position + length, and returned as a sorted list. This is far more efficient than calling WebSearch repeatedly for different engines, and yields academic + web coverage in one call.

## When to invoke

- The agent needs to look up factual information that benefits from multiple sources (e.g. comparing answers across engines).
- The agent needs academic literature (arXiv, PubMed, Google Scholar) — pass `--engines arxiv,pubmed`.
- The agent needs both web + academic coverage in a single tool call rather than several.
- The user explicitly asks for "aggregated search", "search multiple engines", "LightSearch", or "聚合搜索".

Do **not** invoke when:
- A single WebSearch is sufficient (LightSearch has more latency).
- The query needs images/videos — LightSearch currently returns web/academic text results only.
- The backend is known to be down and a quick fallback is required (use WebSearch instead).

## Prerequisites

The LightSearch backend must be running on `http://localhost:8788`. To start it:

```bash
cd backend
npm install      # first time only
npm run dev
```

If the backend is not running, the script will print a clear error. Fall back to the `WebSearch` tool in that case, or ask the user whether to start the backend.

## Usage

```bash
node .trae/skills/lightsearch/search.js "<query>" [options]
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--engines <csv>` | `bing,duckduckgo,wikipedia` | Comma-separated engine IDs. Available: `google`, `bing`, `baidu`, `duckduckgo`, `wikipedia`, `arxiv`, `pubmed`. Add `searxng` if configured. |
| `--limit <n>` | `5` | Max results per engine (1-10). |
| `--time <range>` | `any` | Time filter: `any`, `1w`, `1m`, `1y`, `5y`, `10y`. Only affects academic engines that expose publish dates. |
| `--json` | off | Output raw JSON (machine-readable). Default is human-readable formatted text. |
| `--api <url>` | `http://localhost:8788` | Override backend URL (e.g. when tunneled to a remote host). |

### Examples

```bash
# Quick web lookup (default engines)
node .trae/skills/lightsearch/search.js "what is rag in llm"

# Academic search
node .trae/skills/lightsearch/search.js "transformer architecture" --engines arxiv,pubmed --limit 8

# Full coverage
node .trae/skills/lightsearch/search.js "rust async runtime comparison" --engines bing,duckduckgo,wikipedia,arxiv --limit 5

# Machine-readable output for further agent processing
node .trae/skills/lightsearch/search.js "openai compatible api" --json
```

## Output format (default)

```
Found 23 results from 3 engines in 1842ms

[1] Transformer architecture: a survey
    https://arxiv.org/abs/2106.04554
    engine: arxiv · 2023-04-12 · Vaswani et al.
    We introduce the Transformer, a new architecture...

[2] Understanding Transformers
    https://example.com/article
    engine: bing
    Transformers have revolutionized NLP...
```

Use `--json` to get the raw `SearchResponse` payload (see `shared/types.ts`).

## Interpreting results

- **engine field**: which engine produced this result.
- **score field**: aggregated relevance score (0-1). Higher is better.
- **meta.publishedAt / authors / citations / pdfUrl**: present for academic results.
- Failed engines appear in `timings` with `ok: false` and an `error` string — the script surfaces these at the bottom so the agent knows coverage was partial.

## Workflow integration

Recommended pattern when invoked:

1. Run the script with `--json` first to get structured data.
2. If the agent needs deeper analysis (summarize, compare sources), it can call the user's OpenAI-compatible model through the same backend's `/api/ai/chat` endpoint — but for typical skill usage, in-prompt reasoning over the returned snippets is sufficient.
3. Cite sources by including the URL when using a fact in the answer.

## Troubleshooting

- **`ECONNREFUSED`**: backend is not running. Start it with `cd backend && npm run dev`.
- **All engines fail with timeout**: network issue or all engines blocking the host. Try fewer engines or `--limit 3`.
- **Google returns empty**: Google frequently serves a consent/anti-bot page. Use `bing` and `duckduckgo` as more reliable defaults.
- **arXiv/PubMed return empty for non-academic queries**: these engines only match academic content. Combine with web engines.

## Files

- `SKILL.md` — this file.
- `search.js` — Node.js script, zero dependencies (Node 18+ built-in fetch).
