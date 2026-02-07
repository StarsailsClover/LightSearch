/*
LightSearch - 主应用程序（修复版）
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

import { i18n } from './core/i18n.js';
import { popupManager } from './core/popup.js';
import { themeManager } from './core/theme.js';
import { commandPalette } from './core/commandPalette.js';
import { searchEngine } from './core/searchEngine.js';

class LightSearchApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing LightSearch...');
            
            // 1. 加载语言包
            await this.initI18n();
            
            // 2. 初始化主题
            this.initTheme();
            
            // 3. 初始化UI
            this.initUI();
            
            // 4. 绑定事件
            this.bindEvents();
            
            // 5. 加载用户设置
            this.loadSettings();

            console.log('✨ LightSearch initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            alert('初始化失败，请刷新页面重试。错误：' + error.message);
        }
    }

    // 初始化国际化
    async initI18n() {
        try {
            const lang = i18n.detectLanguage();
            await i18n.loadLanguage(lang);
            i18n.updateDOM();

            // 监听语言变化
            document.addEventListener('languageChanged', () => {
                i18n.updateDOM();
                this.updateSearchPlaceholder();
            });
        } catch (error) {
            console.warn('i18n initialization failed, using defaults:', error);
        }
    }

    // 初始化主题
    initTheme() {
        themeManager.applyTheme(themeManager.getCurrentTheme());
        themeManager.watchSystemTheme();
    }

    // 初始化UI
    initUI() {
        this.initPopups();
        this.renderSearchHistory();
        this.renderEngineList();
        this.renderSettings();
    }

    // 初始化弹窗
    initPopups() {
        // 注册设置弹窗
        const settingsPopup = document.querySelector('[data-popup="settings"]');
        if (settingsPopup) {
            popupManager.register('settings', settingsPopup);
        }

        // 注册学术搜索弹窗
        const academicPopup = document.querySelector('[data-popup="academic"]');
        if (academicPopup) {
            popupManager.register('academic', academicPopup);
        }
    }

    // 渲染搜索历史
    renderSearchHistory() {
        const container = document.querySelector('.js-search-history');
        if (!container) return;

        const history = searchEngine.searchHistory.slice(0, 10);
        
        if (history.length === 0) {
            container.innerHTML = `<p style="color: #666; font-size: 0.9rem;">${i18n.t('search.noHistory')}</p>`;
            container.style.display = 'block';
            return;
        }

        container.innerHTML = `
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">${i18n.t('search.history')}:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${history.map(item => `
                    <span class="ls-history__item js-history-item" data-query="${item}">
                        ${item}
                    </span>
                `).join('')}
            </div>
        `;
        container.style.display = 'block';

        // 绑定点击事件
        container.querySelectorAll('.js-history-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelector('.js-search-input').value = item.dataset.query;
            });
        });
    }

    // 渲染引擎列表
    renderEngineList(isAcademic = false) {
        const container = document.querySelector(
            isAcademic ? '.js-academic-engine-list' : '.js-engine-list'
        );
        if (!container) return;

        const engines = isAcademic ? searchEngine.academicEngines : searchEngine.engines;

        container.innerHTML = engines.map((engine, idx) => `
            <div class="ls-engine-item">
                <input 
                    type="checkbox" 
                    class="ls-checkbox js-engine-toggle" 
                    data-index="${idx}"
                    data-academic="${isAcademic}"
                    ${engine.enabled ? 'checked' : ''}
                >
                <span class="ls-engine-item__name">${engine.name}</span>
                <span class="ls-engine-item__url">${engine.url}</span>
                <button 
                    class="ls-engine-item__delete js-engine-delete" 
                    data-index="${idx}"
                    data-academic="${isAcademic}">
                    ${i18n.t('settings.engines.delete')}
                </button>
            </div>
        `).join('');

        // 绑定事件
        container.querySelectorAll('.js-engine-toggle').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const academic = e.target.dataset.academic === 'true';
                searchEngine.toggleEngine(index, academic);
            });
        });

        container.querySelectorAll('.js-engine-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const academic = e.target.dataset.academic === 'true';
                searchEngine.deleteEngine(index, academic);
                this.renderEngineList(academic);
            });
        });
    }

    // 渲染设置面板
    renderSettings() {
        // 渲染主题选择
        const themeSelect = document.querySelector('.js-theme-select');
        if (themeSelect) {
            themeSelect.innerHTML = themeManager.getThemes().map(theme => `
                <option value="${theme.id}" ${theme.id === themeManager.getCurrentTheme() ? 'selected' : ''}>
                    ${theme.name}
                </option>
            `).join('');
        }

        // 渲染语言选择
        const langSelect = document.querySelector('.js-language-select');
        if (langSelect) {
            langSelect.innerHTML = i18n.getSupportedLanguages().map(lang => `
                <option value="${lang.code}" ${lang.code === i18n.getCurrentLanguage() ? 'selected' : ''}>
                    ${lang.nativeName}
                </option>
            `).join('');
        }
    }

    // 绑定事件
    bindEvents() {
        // 搜索按钮
        const searchBtn = document.querySelector('.js-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // 搜索输入框回车
        const searchInput = document.querySelector('.js-search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // 设置按钮
        const settingsBtn = document.querySelector('.js-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                popupManager.open('settings');
            });
        }

        // 学术搜索按钮
        const academicBtn = document.querySelector('.js-academic-btn');
        if (academicBtn) {
            academicBtn.addEventListener('click', () => {
                popupManager.open('academic');
            });
        }

        // 学术搜索执行
        const academicSearchBtn = document.querySelector('.js-academic-search-btn');
        if (academicSearchBtn) {
            academicSearchBtn.addEventListener('click', () => {
                this.performSearch(true);
            });
        }

        const academicSearchInput = document.querySelector('.js-academic-search-input');
        if (academicSearchInput) {
            academicSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(true);
                }
            });
        }

        // 主题选择
        const themeSelect = document.querySelector('.js-theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                themeManager.applyTheme(e.target.value);
            });
        }

        // 语言选择
        const langSelect = document.querySelector('.js-language-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                i18n.switchLanguage(e.target.value);
            });
        }

        // 添加引擎
        const addEngineBtn = document.querySelector('.js-add-engine');
        if (addEngineBtn) {
            addEngineBtn.addEventListener('click', () => {
                this.addEngine(false);
            });
        }

        const addAcademicEngineBtn = document.querySelector('.js-add-academic-engine');
        if (addAcademicEngineBtn) {
            addAcademicEngineBtn.addEventListener('click', () => {
                this.addEngine(true);
            });
        }

        // 对比模式切换
        const comparisonToggle = document.querySelector('.js-comparison-toggle');
        if (comparisonToggle) {
            comparisonToggle.addEventListener('change', (e) => {
                searchEngine.toggleComparisonMode();
            });
        }

        // 背景上传
        const backgroundUpload = document.querySelector('.js-background-upload');
        if (backgroundUpload) {
            backgroundUpload.addEventListener('change', (e) => {
                this.handleBackgroundUpload(e);
            });
        }

        // 清除背景
        const backgroundClear = document.querySelector('.js-background-clear');
        if (backgroundClear) {
            backgroundClear.addEventListener('click', () => {
                this.clearBackground();
            });
        }

        // GitHub链接
        const githubLink = document.querySelector('.js-github-link');
        if (githubLink) {
            githubLink.addEventListener('click', () => {
                window.open('https://github.com/StarsailsClover/LightSearch', '_blank');
            });
        }

        const githubIssues = document.querySelector('.js-github-issues');
        if (githubIssues) {
            githubIssues.addEventListener('click', () => {
                window.open('https://github.com/StarsailsClover/LightSearch/issues', '_blank');
            });
        }

        // 快捷键支持
        document.addEventListener('keydown', (e) => {
            // Ctrl+/ 聚焦搜索框
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                document.querySelector('.js-search-input')?.focus();
            }
        });
    }

    // 执行搜索
    performSearch(isAcademic = false) {
        const input = document.querySelector(
            isAcademic ? '.js-academic-search-input' : '.js-search-input'
        );
        const query = input?.value.trim();

        if (!query) {
            alert(i18n.t('messages.emptySearch'));
            return;
        }

        try {
            const options = { academic: isAcademic };

            // 学术搜索过滤
            if (isAcademic) {
                const timeFilter = document.querySelector('.js-time-filter')?.value;
                if (timeFilter && timeFilter !== 'any') {
                    options.timeFilter = timeFilter;
                }

                options.comparison = document.querySelector('.js-comparison-toggle')?.checked;
            }

            searchEngine.search(query, options);
            this.renderSearchHistory();

            // 关闭弹窗
            if (isAcademic) {
                popupManager.close('academic');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // 添加引擎
    addEngine(isAcademic = false) {
        const input = document.querySelector(
            isAcademic ? '.js-new-academic-engine' : '.js-new-engine'
        );
        const url = input?.value.trim();

        if (!url) return;

        try {
            const name = prompt(i18n.t('settings.engines.add'));
            if (!name) return;

            searchEngine.addEngine(name, url, isAcademic);
            this.renderEngineList(isAcademic);
            input.value = '';
            alert(i18n.t('messages.engineAdded'));
        } catch (error) {
            alert(error.message);
        }
    }

    // 处理背景上传
    handleBackgroundUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target.result;
            document.body.style.backgroundImage = `url(${url})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            localStorage.setItem('ls-background', url);
        };
        reader.readAsDataURL(file);
    }

    // 清除背景
    clearBackground() {
        document.body.style.backgroundImage = '';
        localStorage.removeItem('ls-background');
    }

    // 加载用户设置
    loadSettings() {
        // 加载背景
        const bg = localStorage.getItem('ls-background');
        if (bg) {
            document.body.style.backgroundImage = `url(${bg})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }

        // 加载对比模式
        const comparisonMode = localStorage.getItem('ls-comparison-mode') === 'true';
        const comparisonToggle = document.querySelector('.js-comparison-toggle');
        if (comparisonToggle) {
            comparisonToggle.checked = comparisonMode;
        }
    }

    // 更新搜索框占位符
    updateSearchPlaceholder() {
        const input = document.querySelector('.js-search-input');
        if (input) {
            input.placeholder = i18n.t('search.placeholder');
        }

        const academicInput = document.querySelector('.js-academic-search-input');
        if (academicInput) {
            academicInput.placeholder = i18n.t('search.academicPlaceholder');
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LightSearchApp();
});
