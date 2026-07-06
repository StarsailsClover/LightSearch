// 主题切换辅助：在 <html> 上设置 data-theme / data-accent 属性

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple';

export const ACCENT_PRESETS: { id: AccentColor; color: string; label: string }[] = [
  { id: 'blue', color: '#4285f4', label: '蓝' },
  { id: 'green', color: '#34a853', label: '绿' },
  { id: 'red', color: '#ea4335', label: '红' },
  { id: 'yellow', color: '#fbbc04', label: '黄' },
  { id: 'purple', color: '#8b5cf6', label: '紫' },
];

// 应用主题到 documentElement
export function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', mode);
}

// 应用强调色
export function applyAccent(accent: AccentColor): void {
  document.documentElement.setAttribute('data-accent', accent);
}

// 跟随系统 prefers-color-scheme 推断初始主题
export function detectSystemTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
