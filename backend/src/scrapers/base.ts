// Scraper 抽象基类
// 提供通用的 HTTP 抓取能力、超时控制、字符集检测与结果构造辅助方法

import { config } from '../config.js';
import type { SearchResult, TimeRange } from '../types.js';

export interface SearchOptions {
  timeRange?: TimeRange;
  limit?: number;
  offset?: number;
  lang?: string;
}

/**
 * 将各种字符集别名归一化为 TextDecoder 支持的标准名
 * Node 18+ 的 TextDecoder 支持 utf-8/gbk/gb2312/big5/shift_jis/euc-kr 等
 */
function normalizeCharset(raw: string | null | undefined): string {
  if (!raw) return 'utf-8';
  const cs = raw.trim().toLowerCase();
  if (cs === 'utf-8' || cs === 'utf8' || cs === 'utf8-sig') return 'utf-8';
  if (cs === 'gb2312' || cs === 'gbk' || cs === 'gb18030') return 'gbk';
  if (cs === 'big5' || cs === 'big5-hkscs') return 'big5';
  if (cs === 'shift_jis' || cs === 'sjis' || cs === 'windows-31j') return 'shift_jis';
  if (cs === 'euc-kr' || cs === 'ksc5601') return 'euc-kr';
  if (cs === 'iso-8859-1' || cs === 'latin1') return 'windows-1252';
  return cs;
}

/**
 * 从 Content-Type 头部提取 charset
 * 形如 text/html; charset=gb2312
 */
function charsetFromContentType(contentType: string | null): string | null {
  if (!contentType) return null;
  const m = contentType.match(/charset\s*=\s*["']?([\w-]+)/i);
  return m ? m[1] : null;
}

/**
 * 从 HTML 头部前 2KB 内嗅探 charset
 * 匹配 <meta charset="gbk"> 或 <meta http-equiv="Content-Type" content="text/html; charset=gbk">
 */
function charsetFromHtmlHead(head: string): string | null {
  const m1 = head.match(/<meta[^>]+charset\s*=\s*["']?([\w-]+)/i);
  if (m1) return m1[1];
  const m2 = head.match(/<meta[^>]+http-equiv\s*=\s*["']?content-type["']?[^>]+content\s*=\s*["'][^"']*charset=([\w-]+)/i);
  if (m2) return m2[1];
  return null;
}

/**
 * GBK 字节被误当作 UTF-8 解码时，常见中文字符会变成乱码。
 * 检测策略：对比 UTF-8 与 GBK 解码结果中常见中文字符的出现次数，
 * 若 GBK 明显更多，则判定为 GBK 谎报 UTF-8。
 */
const COMMON_CHINESE_CHARS = new Set(
  '的是不了一在有 人我他这 个上们来到 时大地为 和你说也 就都而要 知道看到出 后自己 发把好还 这么些能用 过被让从'.split('').filter(c => c.trim())
);

/**
 * 统计文本中常见中文字符的出现次数（仅扫描前 16KB）
 */
function countCommonChinese(text: string): number {
  if (!text) return 0;
  const sample = text.slice(0, 16384);
  let count = 0;
  for (let i = 0; i < sample.length; i++) {
    if (COMMON_CHINESE_CHARS.has(sample[i])) count++;
  }
  return count;
}

/** 统计典型 mojibake 片段，用于识别 UTF-8 被误按 GBK/Latin1 解码的情况 */
function countMojibake(text: string): number {
  const sample = text.slice(0, 16384);
  const matches = sample.match(/[�]|鈥|庐|茅|脙|垄|聽|蜡/g);
  return matches ? matches.length : 0;
}

/**
 * 用指定字符集解码 ArrayBuffer
 * 策略：
 * 1) 若声明为 utf-8：先尝试 fatal:true 严格解码
 *    - 抛错 → 字节非合法 UTF-8，按 GBK 解码（中文环境常见）
 *    - 成功 → 对比 UTF-8 与 GBK 解码中常见中文字符密度，若 GBK 显著更高，采用 GBK
 * 2) 非 UTF-8 字符集 → 直接用 TextDecoder 解码
 */
function decodeBuffer(buf: ArrayBuffer, declaredCharset: string): string {
  const cs = normalizeCharset(declaredCharset);

  if (cs === 'utf-8') {
    // 先严格 UTF-8
    let utf8Text: string | null = null;
    try {
      utf8Text = new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch {
      // 字节不是合法 UTF-8，尝试 GBK 兜底（中文常见情况）
      try {
        const gbk = new TextDecoder('gbk', { fatal: false }).decode(buf);
        console.error(`[decodeBuffer] utf-8 strict threw, using GBK (len=${gbk.length})`);
        return gbk;
      } catch {
        return new TextDecoder('utf-8', { fatal: false }).decode(buf);
      }
    }

    // UTF-8 严格解码成功时，优先信任 UTF-8。
    // 只有当页面确实像中文 GBK 页面时，才尝试用 GBK 兜底，避免英文 UTF-8 页面被误判成 GBK。
    const utf8ChineseCount = countCommonChinese(utf8Text);
    const utf8MojibakeCount = countMojibake(utf8Text);
    if (utf8ChineseCount >= 5 || utf8MojibakeCount === 0) {
      return utf8Text;
    }

    try {
      const gbkText = new TextDecoder('gbk', { fatal: false }).decode(buf);
      const gbkChineseCount = countCommonChinese(gbkText);
      if (gbkChineseCount > utf8ChineseCount * 3 && gbkChineseCount >= 5) {
        return gbkText;
      }
    } catch {
      // GBK 解码失败，保持 UTF-8
    }

    return utf8Text;
  }

  // 非 UTF-8：用声明的字符集解码，失败回退 UTF-8
  try {
    return new TextDecoder(cs, { fatal: false }).decode(buf);
  } catch {
    return new TextDecoder('utf-8', { fatal: false }).decode(buf);
  }
}

export abstract class BaseScraper {
  /** 引擎稳定 ID，例如 'google'、'bing' */
  abstract readonly engineId: string;
  /** 引擎展示名称 */
  abstract readonly engineName: string;
  /** 引擎权重，用于聚合评分（0-1） */
  readonly weight: number = 1.0;
  /** 引擎类型 */
  readonly type: 'web' | 'academic' | 'image' | 'news' | 'video' = 'web';
  /** 是否默认启用 */
  readonly defaultEnabled: boolean = true;
  /** 模板 URL，包含 {query} 占位符（用于前端展示） */
  abstract readonly urlTemplate: string;

  /**
   * 执行搜索
   * @param query 查询字符串
   * @param opts 选项（时间范围、每引擎结果数上限等）
   * @returns 搜索结果数组，失败时应抛出异常由调用方捕获
   */
  abstract search(query: string, opts: SearchOptions): Promise<SearchResult[]>;

  /** 受保护的 HTTP 抓取方法，已内置超时、UA 与字符集自动检测 */
  protected async fetchHtml(url: string, init?: RequestInit): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.engineTimeoutMs);
    try {
      const headers: Record<string, string> = {
        'User-Agent': config.userAgent,
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': `${config.defaultLang};q=0.9`,
        ...(init?.headers as Record<string, string> | undefined),
      };
      const res = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
      }
      // 读取为 ArrayBuffer 以支持非 UTF-8 编码（如 Bing/Baidu 的 GBK）
      const buf = await res.arrayBuffer();
      const contentType = res.headers.get('content-type');
      let charset = charsetFromContentType(contentType);
      if (!charset) {
        // Content-Type 没声明 charset，嗅探 HTML 头部
        const head = new TextDecoder('utf-8', { fatal: false }).decode(buf.slice(0, 2048));
        charset = charsetFromHtmlHead(head) || 'utf-8';
      }
      return decodeBuffer(buf, normalizeCharset(charset));
    } finally {
      clearTimeout(timer);
    }
  }

  /** 受保护的 JSON 抓取方法 */
  protected async fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
    const text = await this.fetchHtml(url, init);
    try {
      return JSON.parse(text) as T;
    } catch (err) {
      throw new Error(`Failed to parse JSON from ${url}: ${(err as Error).message}`);
    }
  }

  /** 构造一条结果 */
  protected buildResult(
    title: string,
    url: string,
    snippet: string,
    meta?: SearchResult['meta']
  ): SearchResult {
    return {
      engine: this.engineName,
      engineId: this.engineId,
      title: title.trim(),
      url: url.trim(),
      snippet: snippet.trim(),
      ...(meta ? { meta } : {}),
    };
  }

  /** 安全地截断结果数组到指定长度 */
  protected cap(results: SearchResult[], limit?: number): SearchResult[] {
    if (!limit || limit <= 0) return results;
    return results.slice(0, limit);
  }
}
