// App：顶层编排
// 组合 settings store + useSearch，渲染 AppShell 及其子组件

import { useMemo, useState } from 'react';
import { AppShell } from './components/Layout/AppShell';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ResultList } from './components/ResultList/ResultList';
import { AIAssistant } from './components/AIAssistant/AIAssistant';
import { SettingsModal } from './components/Settings/SettingsModal';
import { useSettings } from './stores/settings';
import { useSearch } from './hooks/useSearch';

export default function App() {
  const { state, dispatch, defaultProfile } = useSettings();
  const search = useSearch();

  const [aiOpen, setAiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // AI 当前选中的 profile id（null 表示用默认）
  const [activeAIProfileId, setActiveAIProfileId] = useState<string | null>(null);

  // 当前生效的 AI profile
  const activeProfile = useMemo(() => {
    if (activeAIProfileId) {
      return state.aiProfiles.find((p) => p.id === activeAIProfileId) ?? null;
    }
    return defaultProfile;
  }, [activeAIProfileId, state.aiProfiles, defaultProfile]);

  // 搜索时传给 AI 的上下文
  const searchContext = useMemo(() => {
    if (!search.response || !search.lastQuery) return null;
    return {
      query: search.lastQuery,
      results: search.response.results,
    };
  }, [search.response, search.lastQuery]);

  function handleSearch(query: string) {
    search.run(query, state.selectedEngineIds, state.timeRange);
  }

  function handleToggleTheme() {
    dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' });
  }

  return (
    <AppShell
      theme={state.theme}
      loading={search.loading}
      onToggleTheme={handleToggleTheme}
      onOpenSettings={() => setSettingsOpen(true)}
      onToggleAI={() => setAiOpen((v) => !v)}
      aiOpen={aiOpen}
      searchBar={
        <SearchBar
          engines={state.engines}
          selectedEngineIds={state.selectedEngineIds}
          onToggleEngine={(id) => dispatch({ type: 'TOGGLE_SELECTED_ENGINE', id })}
          timeRange={state.timeRange}
          onChangeTimeRange={(r) => dispatch({ type: 'SET_TIME_RANGE', range: r })}
          onSearch={handleSearch}
        />
      }
      resultList={
        <ResultList
          loading={search.loading}
          error={search.error}
          response={search.response}
          lastQuery={search.lastQuery}
        />
      }
      aiAssistant={
        <AIAssistant
          profiles={state.aiProfiles}
          activeProfile={activeProfile}
          onSelectProfile={(id) => setActiveAIProfileId(id)}
          onClose={() => setAiOpen(false)}
          searchContext={searchContext}
        />
      }
      settingsModal={settingsOpen ? <SettingsModal onClose={() => setSettingsOpen(false)} /> : null}
    />
  );
}
