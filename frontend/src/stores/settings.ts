// SettingsContext：engines, aiProfiles, theme, accentColor, language
// 使用 Context + useReducer，无外部依赖
// 持久化到 localStorage，key 前缀 ls:

import { createContext, createElement, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Engine, AIProfile } from '../api/types';
import { applyAccent, applyTheme, detectSystemTheme, type AccentColor, type ThemeMode } from '../styles/theme';
import { detectLanguage, type Language } from '../i18n';

const STORAGE_PREFIX = 'ls:';

interface SettingsState {
  engines: Engine[];
  aiProfiles: AIProfile[];
  defaultProfileId: string | null;
  theme: ThemeMode;
  accent: AccentColor;
  language: Language;
  selectedEngineIds: string[]; // 当前搜索选中的引擎
  timeRange: import('../api/types').TimeRange;
  version: string;
}

// 默认内置引擎（启动时若 localStorage 无数据则用此）
const DEFAULT_ENGINES: Engine[] = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q={query}', type: 'web', enabled: true, builtin: true },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q={query}', type: 'web', enabled: true, builtin: true },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={query}', type: 'web', enabled: false, builtin: true },
  { id: 'googlescholar', name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q={query}', type: 'academic', enabled: true, builtin: true },
  { id: 'semantic', name: 'Semantic Scholar', url: 'https://www.semanticscholar.org/search?q={query}', type: 'academic', enabled: false, builtin: true },
];

function createInitialState(): SettingsState {
  const theme = detectSystemTheme();
  const language = detectLanguage();
  return {
    engines: DEFAULT_ENGINES,
    aiProfiles: [],
    defaultProfileId: null,
    theme,
    accent: 'blue',
    language,
    selectedEngineIds: DEFAULT_ENGINES.filter((e) => e.enabled).map((e) => e.id),
    timeRange: 'any',
    version: '3.0.0',
  };
}

// Action 类型
type Action =
  | { type: 'SET_ENGINES'; engines: Engine[] }
  | { type: 'ADD_ENGINE'; engine: Engine }
  | { type: 'UPDATE_ENGINE'; engine: Engine }
  | { type: 'DELETE_ENGINE'; id: string }
  | { type: 'TOGGLE_ENGINE'; id: string }
  | { type: 'SET_AI_PROFILES'; profiles: AIProfile[] }
  | { type: 'ADD_AI_PROFILE'; profile: AIProfile }
  | { type: 'UPDATE_AI_PROFILE'; profile: AIProfile }
  | { type: 'DELETE_AI_PROFILE'; id: string }
  | { type: 'SET_DEFAULT_PROFILE'; id: string | null }
  | { type: 'SET_THEME'; theme: ThemeMode }
  | { type: 'SET_ACCENT'; accent: AccentColor }
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_SELECTED_ENGINES'; ids: string[] }
  | { type: 'TOGGLE_SELECTED_ENGINE'; id: string }
  | { type: 'SET_TIME_RANGE'; range: import('../api/types').TimeRange }
  | { type: 'HYDRATE'; state: Partial<SettingsState> };

function reducer(state: SettingsState, action: Action): SettingsState {
  switch (action.type) {
    case 'SET_ENGINES':
      return { ...state, engines: action.engines };
    case 'ADD_ENGINE':
      return { ...state, engines: [...state.engines, action.engine] };
    case 'UPDATE_ENGINE':
      return {
        ...state,
        engines: state.engines.map((e) => (e.id === action.engine.id ? action.engine : e)),
      };
    case 'DELETE_ENGINE':
      return {
        ...state,
        engines: state.engines.filter((e) => e.id !== action.id),
        selectedEngineIds: state.selectedEngineIds.filter((id) => id !== action.id),
      };
    case 'TOGGLE_ENGINE':
      return {
        ...state,
        engines: state.engines.map((e) =>
          e.id === action.id ? { ...e, enabled: !e.enabled } : e
        ),
      };
    case 'SET_AI_PROFILES':
      return { ...state, aiProfiles: action.profiles };
    case 'ADD_AI_PROFILE':
      return { ...state, aiProfiles: [...state.aiProfiles, action.profile] };
    case 'UPDATE_AI_PROFILE':
      return {
        ...state,
        aiProfiles: state.aiProfiles.map((p) => (p.id === action.profile.id ? action.profile : p)),
      };
    case 'DELETE_AI_PROFILE':
      return {
        ...state,
        aiProfiles: state.aiProfiles.filter((p) => p.id !== action.id),
        defaultProfileId: state.defaultProfileId === action.id ? null : state.defaultProfileId,
      };
    case 'SET_DEFAULT_PROFILE':
      return { ...state, defaultProfileId: action.id };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_ACCENT':
      return { ...state, accent: action.accent };
    case 'SET_LANGUAGE':
      return { ...state, language: action.language };
    case 'SET_SELECTED_ENGINES':
      return { ...state, selectedEngineIds: action.ids };
    case 'TOGGLE_SELECTED_ENGINE':
      return {
        ...state,
        selectedEngineIds: state.selectedEngineIds.includes(action.id)
          ? state.selectedEngineIds.filter((id) => id !== action.id)
          : [...state.selectedEngineIds, action.id],
      };
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.range };
    case 'HYDRATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// 持久化：只存核心字段
const PERSIST_KEYS: (keyof SettingsState)[] = [
  'engines',
  'aiProfiles',
  'defaultProfileId',
  'theme',
  'accent',
  'language',
  'selectedEngineIds',
  'timeRange',
];

function loadPersisted(): Partial<SettingsState> {
  if (typeof localStorage === 'undefined') return {};
  const out: Partial<SettingsState> = {};
  for (const key of PERSIST_KEYS) {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw !== null) {
      try {
        (out as Record<string, unknown>)[key] = JSON.parse(raw);
      } catch {
        /* 忽略损坏的条目 */
      }
    }
  }
  return out;
}

function persist(state: SettingsState): void {
  if (typeof localStorage === 'undefined') return;
  for (const key of PERSIST_KEYS) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state[key]));
    } catch {
      /* 忽略写入错误（如配额） */
    }
  }
}

interface SettingsContextValue {
  state: SettingsState;
  dispatch: React.Dispatch<Action>;
  // 便捷派生
  enabledEngines: Engine[];
  defaultProfile: AIProfile | null;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const initial = createInitialState();
    const persisted = loadPersisted();
    return { ...initial, ...persisted };
  });

  // 持久化 + 应用主题/强调色副作用
  useEffect(() => {
    persist(state);
  }, [state]);

  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  useEffect(() => {
    applyAccent(state.accent);
  }, [state.accent]);

  const value = useMemo<SettingsContextValue>(() => {
    const enabledEngines = state.engines.filter((e) => e.enabled);
    const defaultProfile =
      state.aiProfiles.find((p) => p.id === state.defaultProfileId) ?? state.aiProfiles[0] ?? null;
    return { state, dispatch, enabledEngines, defaultProfile };
  }, [state]);

  return createElement(SettingsContext.Provider, { value }, children);
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
