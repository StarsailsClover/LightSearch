// AppShell：整体布局
// 顶部 TopBar + 主区（SearchBar / ResultList）+ 右侧 AI 抽屉 + 设置 Modal
// 顶部加载进度条（loading 时显示）

import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import type { ThemeMode } from '../../styles/theme';

interface AppShellProps {
  theme: ThemeMode;
  loading: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onToggleAI: () => void;
  aiOpen: boolean;
  searchBar: ReactNode;
  resultList: ReactNode;
  aiAssistant: ReactNode;
  settingsModal: ReactNode;
}

export function AppShell({
  theme,
  loading,
  onToggleTheme,
  onOpenSettings,
  onToggleAI,
  aiOpen,
  searchBar,
  resultList,
  aiAssistant,
  settingsModal,
}: AppShellProps) {
  return (
    <div className={`appshell ${aiOpen ? 'appshell-ai-open' : ''}`}>
      {/* 顶部加载进度条 */}
      {loading && (
        <div className="loading-bar" role="progressbar" aria-label="loading">
          <div className="loading-bar-indicator" />
        </div>
      )}

      <TopBar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSettings={onOpenSettings}
        onToggleAI={onToggleAI}
        aiOpen={aiOpen}
      />

      <main className="app-main" role="main">
        <div className="app-main-inner">
          <section className="search-section">{searchBar}</section>
          <section className="results-section" aria-label="search results">
            {resultList}
          </section>
        </div>
      </main>

      {/* 右侧 AI 抽屉 */}
      <aside className={`ai-drawer ${aiOpen ? 'ai-drawer-open' : ''}`} aria-hidden={!aiOpen}>
        {aiAssistant}
      </aside>

      {/* 遮罩（AI 抽屉打开时，窄屏可点击关闭） */}
      {aiOpen && <div className="ai-scrim" onClick={onToggleAI} aria-hidden="true" />}

      {settingsModal}
    </div>
  );
}
