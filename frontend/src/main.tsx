// 入口：挂载 React 应用，注入 Settings + I18n Provider

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SettingsProvider, useSettings } from './stores/settings';
import { I18nProvider } from './i18n';
import './styles/tokens.css';
import './styles/global.css';

// 内层：从 settings store 读取持久化的语言，注入 I18nProvider
function Root() {
  const { state } = useSettings();
  return (
    <I18nProvider initialLang={state.language}>
      <App />
    </I18nProvider>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('找不到 #root 挂载点');
}

createRoot(rootEl).render(
  <StrictMode>
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  </StrictMode>
);
