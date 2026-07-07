// App — 顶层编排
// 组合 useSettings + useSearch + useAI，渲染 Header / SearchHero / ResultList / AIPanel / SettingsModal

import { useCallback, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { ResultList } from './components/ResultList';
import { AIPanel } from './components/AIPanel';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './stores/settings';
import { useSearch } from './hooks/useSearch';
import { useAI } from './hooks/useAI';
import { useI18n } from './i18n';
import type { AIProfile, SearchResult } from './api/types';

export default function App() {
  const { t } = useI18n();
  const { state, dispatch, defaultProfile } = useSettings();
  const search = useSearch();
  const ai = useAI();

  const [aiOpen, setAiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // AI 当前选中的 profile id（null 表示用默认）
  const [activeAIProfileId, setActiveAIProfileId] = useState<string | null>(null);

  // 当前生效的 AI profile
  const activeProfile = useMemo<AIProfile | null>(() => {
    if (activeAIProfileId) {
      return state.aiProfiles.find((p) => p.id === activeAIProfileId) ?? null;
    }
    return defaultProfile;
  }, [activeAIProfileId, state.aiProfiles, defaultProfile]);

  // 是否处于 hero（初始）状态：无响应且未加载
  const isHeroMode = !search.response && !search.loading && !search.error;

  // 搜索上下文（供 AI 使用）
  const searchContext = useMemo(() => {
    if (!search.response || !search.lastQuery) return null;
    return {
      query: search.lastQuery,
      results: search.response.results,
    };
  }, [search.response, search.lastQuery]);

  // 构建 AI 的 system prompt（包含搜索上下文）
  const buildSystemPrompt = useCallback((): string | undefined => {
    if (!searchContext) return undefined;
    const top = searchContext.results.slice(0, 8);
    if (top.length === 0) return undefined;
    const ctx = top
      .map((r: SearchResult, i: number) => `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.snippet}`)
      .join('\n\n');
    return `Query: ${searchContext.query}\n\nTop search results:\n${ctx}`;
  }, [searchContext]);

  // ---- handlers ----

  function handleSearch(query: string) {
    search.run(query, state.selectedEngineIds, state.timeRange);
  }

  function handleToggleTheme() {
    dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' });
  }

  function handleSelectAIProfile(id: string) {
    setActiveAIProfileId(id);
  }

  function handleSendToAI(content: string) {
    if (!activeProfile) return;
    ai.send(activeProfile, content, buildSystemPrompt());
  }

  function handleSummarize() {
    if (!activeProfile) return;
    // 复用 i18n 文案作为用户消息；system prompt 已含搜索上下文
    ai.send(activeProfile, t('ai.summarize'), buildSystemPrompt());
  }

  function handleRewrite() {
    if (!activeProfile) return;
    ai.send(activeProfile, t('ai.rewrite'), buildSystemPrompt());
  }

  function handleFollowup() {
    if (!activeProfile) return;
    ai.send(activeProfile, t('ai.followup'), buildSystemPrompt());
  }

  function handleClearAI() {
    ai.clear();
  }

  function handleStopAI() {
    ai.stop();
  }

  // 抽屉打开时，主区让出空间（仅桌面端，由 CSS 媒体查询控制移动端）
  const appClasses = [
    'app',
    isHeroMode ? 'app--hero' : 'app--results',
    aiOpen ? 'app--drawer-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={appClasses}>
      <div className="app__bg" aria-hidden />

      <div className="app__main">
        <Header
          theme={state.theme}
          aiOpen={aiOpen}
          onToggleTheme={handleToggleTheme}
          onToggleAI={() => setAiOpen((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main className="app__scroll">
          <div className="app__content">
            <SearchHero
              mode={isHeroMode ? 'hero' : 'compact'}
              engines={state.engines}
              selectedEngineIds={state.selectedEngineIds}
              onToggleEngine={(id) => dispatch({ type: 'TOGGLE_SELECTED_ENGINE', id })}
              timeRange={state.timeRange}
              onChangeTimeRange={(r) => dispatch({ type: 'SET_TIME_RANGE', range: r })}
              onSearch={handleSearch}
              initialQuery={search.lastQuery}
            />

            {!isHeroMode && (
              <ResultList
                loading={search.loading}
                error={search.error}
                response={search.response}
                lastQuery={search.lastQuery}
              />
            )}
          </div>
        </main>
      </div>

      <AIPanel
        open={aiOpen}
        profiles={state.aiProfiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectAIProfile}
        messages={ai.messages}
        streaming={ai.streaming}
        error={ai.error}
        hasSearchContext={!!searchContext}
        onClose={() => setAiOpen(false)}
        onSend={handleSendToAI}
        onStop={handleStopAI}
        onClear={handleClearAI}
        onSummarize={handleSummarize}
        onRewrite={handleRewrite}
        onFollowup={handleFollowup}
      />

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
