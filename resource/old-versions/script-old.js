// ========== 数据存储 ==========
        const storage = {
            get: (key) => {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            },
            set: (key, value) => {
                localStorage.setItem(key, JSON.stringify(value));
            }
        };

        // ========== 搜索引擎管理 ==========
        let engines = storage.get('engines') || [
            { name: 'Google', url: 'https://www.google.com/search?q={query}', enabled: true },
            { name: 'Bing', url: 'https://www.bing.com/search?q={query}', enabled: true },
            { name: 'Baidu', url: 'https://www.baidu.com/s?ie=utf-8&word={query}', enabled: true }
        ];

        let academicEngines = storage.get('academicEngines') || [
            { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q={query}', enabled: true },
            { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={query}', enabled: true },
            { name: 'arXiv', url: 'https://arxiv.org/search/?query={query}', enabled: true }
        ];

        let searchHistory = storage.get('searchHistory') || [];

        // ========== 弹窗管理 ==========
        function openPopup(id) {
            document.getElementById('overlay').classList.add('is-active');
            document.getElementById(id).classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }

        function closePopup(id) {
            document.getElementById('overlay').classList.remove('is-active');
            document.getElementById(id).classList.remove('is-active');
            document.body.style.overflow = '';
        }

        // ========== 搜索功能 ==========
        function performSearch(query, isAcademic = false) {
            if (!query) {
                alert('请输入搜索关键词');
                return;
            }

            // 添加到历史
            if (!searchHistory.includes(query)) {
                searchHistory.unshift(query);
                searchHistory = searchHistory.slice(0, 20);
                storage.set('searchHistory', searchHistory);
                renderHistory();
            }

            // 执行搜索
            const engineList = isAcademic ? academicEngines : engines;
            const enabledEngines = engineList.filter(e => e.enabled);

            enabledEngines.forEach(engine => {
                const url = engine.url.replace('{query}', encodeURIComponent(query));
                window.open(url, '_blank');
            });
        }

        function performAcademicSearch() {
            const query = document.getElementById('academicInput').value.trim();
            performSearch(query, true);
            closePopup('academicPopup');
        }

        // ========== 引擎管理 ==========
        function renderEngines() {
            const list = document.getElementById('engineList');
            list.innerHTML = engines.map((engine, idx) => `
                <div class="ls-engine-item">
                    <input type="checkbox" ${engine.enabled ? 'checked' : ''} 
                           onchange="toggleEngine(${idx})">
                    <span class="ls-engine-item__name">${engine.name}</span>
                    <span class="ls-engine-item__url">${engine.url}</span>
                    <button class="ls-engine-item__delete" onclick="deleteEngine(${idx})">删除</button>
                </div>
            `).join('');

            const academicList = document.getElementById('academicEngineList');
            academicList.innerHTML = academicEngines.map((engine, idx) => `
                <div class="ls-engine-item">
                    <input type="checkbox" ${engine.enabled ? 'checked' : ''} 
                           onchange="toggleAcademicEngine(${idx})">
                    <span class="ls-engine-item__name">${engine.name}</span>
                    <span class="ls-engine-item__url">${engine.url}</span>
                </div>
            `).join('');
        }

        function addEngine() {
            const url = document.getElementById('newEngine').value.trim();
            if (!url || !url.includes('{query}')) {
                alert('请输入包含 {query} 的有效URL');
                return;
            }
            const name = prompt('引擎名称：');
            if (!name) return;

            engines.push({ name, url, enabled: true });
            storage.set('engines', engines);
            renderEngines();
            document.getElementById('newEngine').value = '';
        }

        function deleteEngine(idx) {
            engines.splice(idx, 1);
            storage.set('engines', engines);
            renderEngines();
        }

        function toggleEngine(idx) {
            engines[idx].enabled = !engines[idx].enabled;
            storage.set('engines', engines);
        }

        function toggleAcademicEngine(idx) {
            academicEngines[idx].enabled = !academicEngines[idx].enabled;
            storage.set('academicEngines', academicEngines);
        }

        // ========== 搜索历史 ==========
        function renderHistory() {
            const container = document.getElementById('searchHistory');
            if (searchHistory.length === 0) {
                container.innerHTML = '<p style="color: #666; font-size: 0.9rem;">暂无搜索历史</p>';
                return;
            }

            container.innerHTML = `
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">搜索历史：</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${searchHistory.slice(0, 10).map(item => `
                        <span class="ls-history__item" onclick="document.getElementById('searchInput').value='${item}'">${item}</span>
                    `).join('')}
                </div>
            `;
        }

        // ========== 主题切换 ==========
        function toggleTheme() {
            document.body.classList.toggle('theme-dark');
            const isDark = document.body.classList.contains('theme-dark');
            storage.set('theme', isDark ? 'dark' : 'light');
        }

        // ========== 初始化 ==========
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ LightSearch 单文件版已加载');

            // 加载主题
            const theme = storage.get('theme');
            if (theme === 'dark') {
                document.body.classList.add('theme-dark');
            }

            // 渲染界面
            renderEngines();
            renderHistory();

            // 绑定事件
            document.getElementById('searchBtn').addEventListener('click', () => {
                const query = document.getElementById('searchInput').value.trim();
                performSearch(query);
            });

            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    performSearch(query);
                }
            });

            document.getElementById('settingsBtn').addEventListener('click', () => {
                openPopup('settingsPopup');
            });

            document.getElementById('academicBtn').addEventListener('click', () => {
                openPopup('academicPopup');
            });

            document.getElementById('themeBtn').addEventListener('click', toggleTheme);

            document.getElementById('overlay').addEventListener('click', () => {
                closePopup('settingsPopup');
                closePopup('academicPopup');
            });

            // ESC 关闭弹窗
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closePopup('settingsPopup');
                    closePopup('academicPopup');
                }
            });

            console.log('✅ 所有功能已就绪');
        });
// ========== 多语言支持 ==========
const LANG_DATA = {
    en: {
        searchPlaceholder: 'Enter search keywords...',
        searchButton: 'Search',
        settingsButton: 'Settings',
        academicButton: 'Academic Search',
        themeButton: 'Toggle Theme',
        historyTitle: 'Search History',
        noHistory: 'No search history',
        settingsTitle: 'Settings',
        academicTitle: 'Academic Search'
    },
    zh: {
        searchPlaceholder: '输入搜索关键词...',
        searchButton: '搜索',
        settingsButton: '设置',
        academicButton: '学术搜索',
        themeButton: '切换主题',
        historyTitle: '搜索历史',
        noHistory: '暂无搜索历史',
        settingsTitle: '设置',
        academicTitle: '学术搜索'
    },
    ja: {
        searchPlaceholder: '検索キーワードを入力...',
        searchButton: '検索',
        settingsButton: '設定',
        academicButton: '学術検索',
        themeButton: 'テーマ切替',
        historyTitle: '検索履歴',
        noHistory: '検索履歴がありません',
        settingsTitle: '設定',
        academicTitle: '学術検索'
    },
    ko: {
        searchPlaceholder: '검색 키워드 입력...',
        searchButton: '검색',
        settingsButton: '설정',
        academicButton: '학술 검색',
        themeButton: '테마 전환',
        historyTitle: '검색 기록',
        noHistory: '검색 기록이 없습니다',
        settingsTitle: '설정',
        academicTitle: '학술 검색'
    },
    ru: {
        searchPlaceholder: 'Введите ключевые слова...',
        searchButton: 'Поиск',
        settingsButton: 'Настройки',
        academicButton: 'Академический поиск',
        themeButton: 'Переключить тему',
        historyTitle: 'История поиска',
        noHistory: 'Нет истории поиска',
        settingsTitle: 'Настройки',
        academicTitle: 'Академический поиск'
    }
};

let currentLang = localStorage.getItem('ls-language') || navigator.language.slice(0, 2) || 'en';
if (!LANG_DATA[currentLang]) currentLang = 'en';

function t(key) {
    return LANG_DATA[currentLang]?.[key] || LANG_DATA.en[key] || key;
}

function applyLanguage() {
    document.title = 'LightSearch - ' + (currentLang === 'zh' ? '简洁优雅的聚合搜索引擎' : 'Simple & Elegant Search Aggregator');
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = t('searchButton');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.textContent = t('settingsButton');
    
    const academicBtn = document.getElementById('academicBtn');
    if (academicBtn) academicBtn.textContent = t('academicButton');
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.textContent = t('themeButton');
    
    const settingsTitle = document.querySelector('#settingsPopup h2');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');
    
    const academicTitle = document.querySelector('#academicPopup h2');
    if (academicTitle) academicTitle.textContent = t('academicTitle');
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    renderHistory();
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ls-language', lang);
    applyLanguage();
}

// 页面加载时应用语言
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLanguage);
} else {
    applyLanguage();
}
