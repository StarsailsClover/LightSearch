/*
LightSearch - 多引擎搜索工具
Copyright (C) 2025 Sails

本程序是自由软件：你可以根据GNU通用公共许可证第3版（或任何更新版本）的条款
重新分发和/或修改它。

本程序的分发是希望它能有用，但没有任何保证；甚至没有隐含的适销性或特定用途的保证。
详见GNU通用公共许可证。

你应该已经收到了GNU通用公共许可证的副本。如果没有，请参见<https://www.gnu.org/licenses/>。
*/

// 本地存储工具
export const storage = {
    get: (key) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => localStorage.removeItem(key)
};

// 主题工具
export const themeUtils = {
    init: () => {
        const savedTheme = storage.get('theme') || 'system';
        const isDark = savedTheme === 'dark' || 
                      (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.body.classList.toggle('theme-dark', isDark);
        document.getElementById('theme-preset').value = savedTheme;
    },
    applyPreset: (preset) => {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', 
            preset === 'green' ? '#e6f7ee' : 
            preset === 'dark' ? '#121212' : '#ffffff');
        root.style.setProperty('--text-color', 
            preset === 'dark' || preset === 'green' ? '#ffffff' : '#000000');
        storage.set('theme', preset);
    }
};

// 搜索历史工具
export const historyUtils = {
    MAX_LENGTH: 20,
    add: (query) => {
        if (!query) return;
        const history = storage.get('searchHistory') || [];
        const newHistory = [query, ...history.filter(item => item !== query)].slice(0, historyUtils.MAX_LENGTH);
        storage.set('searchHistory', newHistory);
    },
    render: (containerId) => {
        const container = document.getElementById(containerId);
        const history = storage.get('searchHistory') || [];
        container.innerHTML = history.length 
            ? `<p>历史搜索：${history.map(item => 
                `<span class="history-item">${item}</span>`).join(' ')}</p>`
            : '<p>暂无搜索历史</p>';
        
        // 点击历史项回填搜索框
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('search-input').value = item.textContent;
            });
        });
    }
};
