---
name: "LightSearch"
description: "Aggregates web, academic, news, image, and knowledge search via LightSearch API. Invoke when users need current, multi-engine search evidence."
---

# LightSearch

Use this skill when a task needs current external information, source discovery, or cross-engine evidence aggregation through a deployed LightSearch API.

## When To Invoke

- The user asks for web search, literature search, current facts, citations, or source-backed answers.
- The task benefits from aggregated results across engines instead of relying on one search provider.
- The user asks an Agent to search using LightSearch or mentions LightSearch as the search backend.
- You need to compare general web sources with academic or knowledge sources.

## API Contract

LightSearch exposes an OpenAPI-like JSON API:

- `GET {LIGHTSEARCH_API_BASE}/api/health` checks service availability.
- `GET {LIGHTSEARCH_API_BASE}/api/engines` returns available built-in engine identifiers.
- `POST {LIGHTSEARCH_API_BASE}/api/search` runs aggregated search.

Search request body:

```json
{
  "query": "search terms",
  "engines": ["google", "bing", "wikipedia"],
  "timeRange": "any",
  "limit": 10
}
```

Supported `timeRange` values are `any`, `1w`, `1m`, `1y`, `5y`, and `10y`.

## Backend Base URL

Resolve the API base URL in this order:

1. User-provided backend URL in the current conversation.
2. Environment variable `LIGHTSEARCH_API_BASE` if available.
3. The deployed Render URL configured for this project.

Do not call the GitHub Pages frontend as the API server. GitHub Pages only hosts the static UI.

## Search Workflow

1. Check `/api/health` before the first search when the backend URL is uncertain.
2. Fetch `/api/engines` when you do not know which engine ids are available.
3. Choose engines based on intent:
   - General web: `google`, `bing`, `duckduckgo`, `wikipedia`.
   - Academic: `arxiv`, `pubmed`, `wikipedia`, plus any configured scholar engines.
   - Broad discovery: combine web and knowledge engines, then deduplicate by URL/domain.
4. Call `/api/search` with a concise query and a practical `limit` such as 10–20.
5. Synthesize findings using titles, snippets, URLs, engine names, and metadata.
6. Clearly distinguish retrieved facts from your own reasoning.

## Output Guidance

- Cite important sources with their URLs.
- Mention failed engines only if failures materially affect confidence.
- Prefer concise summaries with grouped findings over dumping raw results.
- For conflicting information, compare source quality, recency, and corroboration.
- Never expose API keys or user-provided secrets in logs or answers.

## Example

```bash
curl -s "$LIGHTSEARCH_API_BASE/api/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"site reliability error budgets","engines":["google","bing","wikipedia"],"timeRange":"1y","limit":10}'
```
