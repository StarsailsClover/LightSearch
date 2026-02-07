/*
LightSearch - 搜索引擎管理
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

import { i18n } from './i18n.js';

export class SearchEngine {
    constructor() {
        this.engines = this.loadEngines();
        this.academicEngines = this.loadAcademicEngines();
        this.searchHistory = this.loadHistory();
        this.comparisonMode = false;
    }

    // 加载搜索引擎
    loadEngines() {
        const saved = localStorage.getItem('ls-engines');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默认引擎
        return [
            { name: 'Google', url: 'https://www.google.com/search?q={query}', enabled: true },
            { name: 'Bing', url: 'https://www.bing.com/search?q={query}', enabled: true },
            { name: 'Baidu', url: 'https://www.baidu.com/s?ie=utf-8&word={query}', enabled: true },
            { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={query}', enabled: false },
            { name: 'Yandex', url: 'https://yandex.com/search/?text={query}', enabled: false }
        ];
    }

    // 加载学术引擎
    loadAcademicEngines() {
        const saved = localStorage.getItem('ls-academic-engines');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return [
            { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q={query}', enabled: true },
            { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={query}', enabled: true },
            { name: 'arXiv', url: 'https://arxiv.org/search/?query={query}', enabled: true },
            { name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText={query}', enabled: false },
            { name: 'JSTOR', url: 'https://www.jstor.org/action/doBasicSearch?Query={query}', enabled: false }
        ];
    }

    // 加载搜索历史
    loadHistory() {
        const saved = localStorage.getItem('ls-search-history');
        return saved ? JSON.parse(saved) : [];
    }

    // 保存引擎
    saveEngines() {
        localStorage.setItem('ls-engines', JSON.stringify(this.engines));
    }

    // 保存学术引擎
    saveAcademicEngines() {
        localStorage.setItem('ls-academic-engines', JSON.stringify(this.academicEngines));
    }

    // 保存历史
    saveHistory() {
        localStorage.setItem('ls-search-history', JSON.stringify(this.searchHistory));
    }

    // 添加引擎
    addEngine(name, url, isAcademic = false) {
        if (!url.includes('{query}')) {
            throw new Error(i18n.t('messages.invalidEngine'));
        }

        const engine = { name, url, enabled: true };
        
        if (isAcademic) {
            this.academicEngines.push(engine);
            this.saveAcademicEngines();
        } else {
            this.engines.push(engine);
            this.saveEngines();
        }

        return engine;
    }

    // 删除引擎
    deleteEngine(index, isAcademic = false) {
        if (isAcademic) {
            this.academicEngines.splice(index, 1);
            this.saveAcademicEngines();
        } else {
            this.engines.splice(index, 1);
            this.saveEngines();
        }
    }

    // 切换引擎启用状态
    toggleEngine(index, isAcademic = false) {
        if (isAcademic) {
            this.academicEngines[index].enabled = !this.academicEngines[index].enabled;
            this.saveAcademicEngines();
        } else {
            this.engines[index].enabled = !this.engines[index].enabled;
            this.saveEngines();
        }
    }

    // 执行搜索
    search(query, options = {}) {
        if (!query || !query.trim()) {
            throw new Error(i18n.t('messages.emptySearch'));
        }

        query = query.trim();
        
        // 添加到历史
        this.addToHistory(query);

        const engines = options.academic ? this.academicEngines : this.engines;
        const enabledEngines = engines.filter(e => e.enabled);

        if (enabledEngines.length === 0) {
            throw new Error('No enabled search engines');
        }

        // 构建搜索URL
        const urls = enabledEngines.map(engine => {
            let url = engine.url.replace('{query}', encodeURIComponent(query));
            
            // 学术搜索过滤
            if (options.academic && options.timeFilter && engine.name === 'Google Scholar') {
                const year = new Date().getFullYear() - parseInt(options.timeFilter);
                url += `&as_ylo=${year}`;
            }

            return { name: engine.name, url };
        });

        // 对比模式
        if (this.comparisonMode && options.comparison) {
            this.openComparison(urls);
        } else {
            // 普通模式：打开所有标签页
            urls.forEach(({ url }) => window.open(url, '_blank'));
        }

        return urls;
    }

    // 打开对比视图
    openComparison(urls) {
        // 创建对比窗口
        const comparisonWindow = window.open('', '_blank', 'width=1400,height=900');
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Search Comparison - LightSearch</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                    .header {
                        background: #4285f4;
                        color: white;
                        padding: 15px;
                        display: flex;
                        gap: 10px;
                    }
                    .tab {
                        padding: 10px 20px;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                    .tab.active {
                        background: white;
                        color: #4285f4;
                    }
                    .content {
                        display: flex;
                        height: calc(100vh - 60px);
                    }
                    iframe {
                        flex: 1;
                        border: none;
                        display: none;
                    }
                    iframe.active {
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    ${urls.map((item, idx) => `
                        <button class="tab ${idx === 0 ? 'active' : ''}" onclick="switchTab(${idx})">
                            ${item.name}
                        </button>
                    `).join('')}
                </div>
                <div class="content">
                    ${urls.map((item, idx) => `
                        <iframe src="${item.url}" class="${idx === 0 ? 'active' : ''}"></iframe>
                    `).join('')}
                </div>
                <script>
                    function switchTab(index) {
                        document.querySelectorAll('.tab').forEach((tab, i) => {
                            tab.classList.toggle('active', i === index);
                        });
                        document.querySelectorAll('iframe').forEach((iframe, i) => {
                            iframe.classList.toggle('active', i === index);
                        });
                    }
                </script>
            </body>
            </html>
        `;
        
        comparisonWindow.document.write(html);
        comparisonWindow.document.close();
    }

    // 添加到历史
    addToHistory(query) {
        // 移除重复项
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // 添加到开头
        this.searchHistory.unshift(query);
        
        // 限制历史数量
        if (this.searchHistory.length > 50) {
            this.searchHistory = this.searchHistory.slice(0, 50);
        }
        
        this.saveHistory();
    }

    // 清除历史
    clearHistory() {
        this.searchHistory = [];
        this.saveHistory();
    }

    // 获取搜索建议（基于历史）
    getSuggestions(query) {
        if (!query) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.searchHistory
            .filter(item => item.toLowerCase().includes(lowerQuery))
            .slice(0, 5);
    }

    // 切换对比模式
    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
        localStorage.setItem('ls-comparison-mode', this.comparisonMode);
        return this.comparisonMode;
    }
}

// 单例模式
export const searchEngine = new SearchEngine();
