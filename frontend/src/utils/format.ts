// 时间格式化等

// 格式化耗时毫秒
export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

// 格式化日期：YYYY-MM-DD
export function formatDate(input?: string | number | Date): string {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 相对时间：刚刚 / N 分钟前 / N 小时前 / N 天前 / YYYY-MM-DD
export function formatRelative(input?: string | number | Date): string {
  if (!input) return '';
  const d = new Date(input).getTime();
  if (Number.isNaN(d)) return '';
  const now = Date.now();
  const diff = now - d;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;
  return formatDate(input);
}

// 数字千分位
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

// 截断文本
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

// 生成简单 id（用于本地新增的 engine/profile）
export function genId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
