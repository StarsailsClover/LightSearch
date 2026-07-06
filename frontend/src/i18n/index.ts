// 极简 i18n：t(key, params) + 当前语言 context
// 默认根据 navigator.language 推断

import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import zh from './zh.json';
import en from './en.json';
import ja from './ja.json';
import ko from './ko.json';
import ru from './ru.json';

export type Language = 'en' | 'zh' | 'ja' | 'ko' | 'ru';

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'zh', label: '简体中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
  { id: 'ru', label: 'Русский' },
];

type Dict = Record<string, string>;

const DICTS: Record<Language, Dict> = {
  zh: zh as Dict,
  en: en as Dict,
  ja: ja as Dict,
  ko: ko as Dict,
  ru: ru as Dict,
};

// 根据 navigator.language 推断默认语言
export function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'zh';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ru')) return 'ru';
  return 'en';
}

// 简单模板替换：t('search.tookMs', { ms: 123 }) => '耗时 123 毫秒'
function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  );
}

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, initialLang }: { children: ReactNode; initialLang: Language }) {
  const [lang, setLang] = useState<Language>(initialLang);

  // 当外部传入的 initialLang 变化时同步（用于与 settings store 联动）
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[lang] || DICTS.en;
    return {
      lang,
      setLang,
      t: (key, params) => {
        const raw = dict[key] ?? DICTS.en[key] ?? key;
        return format(raw, params);
      },
    };
  }, [lang]);

  // 使用 createElement 而非 JSX，以保持 .ts 扩展名
  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
