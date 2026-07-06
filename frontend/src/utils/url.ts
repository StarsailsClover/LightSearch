// URL 规范化、域名提取

// 提取域名，失败返回原始字符串
export function getDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// 规范化 URL：补协议
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// 用 query 填充引擎 URL 模板（含 {query} 占位符）
export function buildEngineUrl(template: string, query: string): string {
  return template.replace(/\{query\}/g, encodeURIComponent(query));
}

// 是否为合法 URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 引用页面 URL（用于「打开原页面」之类的链接）
export function safeExternalUrl(url: string): string {
  return normalizeUrl(url);
}
