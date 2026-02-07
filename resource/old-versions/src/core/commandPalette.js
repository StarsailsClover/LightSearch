/*
LightSearch - Command Palette（命令面板）
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

import { i18n } from './i18n.js';
import { popupManager } from './popup.js';
import { themeManager } from './theme.js';

export class CommandPalette {
    constructor() {
        this.commands = [];
        this.selectedIndex = 0;
        this.filteredCommands = [];
        this.init();
    }

    init() {
        this.registerDefaultCommands();
        this.createPalette();
        this.bindKeyboard();
    }

    // 注册默认命令
    registerDefaultCommands() {
        this.commands = [
            {
                id: 'search',
                category: 'search',
                name: () => i18n.t('search.button'),
                keywords: ['search', '搜索', '検索'],
                action: () => {
                    document.querySelector('.js-search-input').focus();
                    this.close();
                }
            },
            {
                id: 'academic-search',
                category: 'search',
                name: () => i18n.t('search.academic'),
                keywords: ['academic', '学术', '学術'],
                action: () => {
                    popupManager.open('academic');
                    this.close();
                }
            },
            {
                id: 'settings',
                category: 'settings',
                name: () => i18n.t('settings.title'),
                keywords: ['settings', '设置', '設定'],
                action: () => {
                    popupManager.open('settings');
                    this.close();
                }
            },
            {
                id: 'theme-classic',
                category: 'settings',
                name: () => i18n.t('settings.personalization.themeClassic'),
                keywords: ['theme', 'classic', '主题'],
                action: () => {
                    themeManager.applyTheme('classic');
                    this.close();
                }
            },
            {
                id: 'theme-dark',
                category: 'settings',
                name: () => i18n.t('settings.personalization.themeClassicDark'),
                keywords: ['theme', 'dark', '深色'],
                action: () => {
                    themeManager.applyTheme('classic-dark');
                    this.close();
                }
            },
            {
                id: 'theme-liquid-glass',
                category: 'settings',
                name: () => i18n.t('settings.personalization.themeLiquidGlass'),
                keywords: ['theme', 'liquid', 'glass'],
                action: () => {
                    themeManager.applyTheme('liquid-glass');
                    this.close();
                }
            },
            {
                id: 'theme-green',
                category: 'settings',
                name: () => i18n.t('settings.personalization.themeGreen'),
                keywords: ['theme', 'green', '护眼'],
                action: () => {
                    themeManager.applyTheme('green');
                    this.close();
                }
            }
        ];
    }

    // 创建命令面板UI
    createPalette() {
        const palette = document.createElement('div');
        palette.className = 'ls-popup ls-command-palette';
        palette.dataset.popup = 'command-palette';
        palette.innerHTML = `
            <div class="ls-popup__body">
                <input 
                    type="text" 
                    class="ls-command-palette__input js-command-input" 
                    placeholder="${i18n.t('commandPalette.placeholder')}"
                    autocomplete="off"
                >
                <div class="ls-command-palette__results js-command-results"></div>
            </div>
        `;
        document.body.appendChild(palette);

        // 注册到弹窗管理器
        popupManager.register('command-palette', palette);

        // 绑定输入事件
        const input = palette.querySelector('.js-command-input');
        input.addEventListener('input', (e) => this.handleInput(e.target.value));
        input.addEventListener('keydown', (e) => this.handleKeydown(e));

        // 弹窗打开时聚焦输入框
        palette.addEventListener('popupOpened', () => {
            input.value = '';
            input.focus();
            this.handleInput('');
        });
    }

    // 绑定键盘快捷键
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K / Cmd+K 打开命令面板
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
            }
        });
    }

    // 处理输入
    handleInput(query) {
        const lowerQuery = query.toLowerCase();
        
        if (!query) {
            this.filteredCommands = this.commands;
        } else {
            this.filteredCommands = this.commands.filter(cmd => {
                const name = cmd.name().toLowerCase();
                const keywords = cmd.keywords.join(' ').toLowerCase();
                return name.includes(lowerQuery) || keywords.includes(lowerQuery);
            });
        }

        this.selectedIndex = 0;
        this.renderResults();
    }

    // 渲染结果
    renderResults() {
        const resultsContainer = document.querySelector('.js-command-results');
        
        if (this.filteredCommands.length === 0) {
            resultsContainer.innerHTML = `
                <div class="ls-command-palette__empty">
                    ${i18n.t('commandPalette.noResults')}
                </div>
            `;
            return;
        }

        // 按类别分组
        const grouped = this.filteredCommands.reduce((acc, cmd) => {
            if (!acc[cmd.category]) acc[cmd.category] = [];
            acc[cmd.category].push(cmd);
            return acc;
        }, {});

        resultsContainer.innerHTML = Object.entries(grouped).map(([category, commands]) => `
            <div class="ls-command-palette__category">
                <div class="ls-command-palette__category-title">
                    ${i18n.t(`commandPalette.categories.${category}`)}
                </div>
                ${commands.map((cmd, idx) => {
                    const globalIdx = this.filteredCommands.indexOf(cmd);
                    return `
                        <div class="ls-command-palette__item ${globalIdx === this.selectedIndex ? 'is-selected' : ''}" 
                             data-index="${globalIdx}">
                            ${cmd.name()}
                        </div>
                    `;
                }).join('')}
            </div>
        `).join('');

        // 绑定点击事件
        resultsContainer.querySelectorAll('.ls-command-palette__item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.executeCommand(this.filteredCommands[index]);
            });
        });
    }

    // 处理键盘导航
    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
                this.renderResults();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.renderResults();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.filteredCommands[this.selectedIndex]) {
                    this.executeCommand(this.filteredCommands[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.close();
                break;
        }
    }

    // 执行命令
    executeCommand(command) {
        if (command && command.action) {
            command.action();
        }
    }

    // 打开命令面板
    open() {
        popupManager.open('command-palette');
    }

    // 关闭命令面板
    close() {
        popupManager.close('command-palette');
    }

    // 注册自定义命令
    registerCommand(command) {
        this.commands.push(command);
    }
}

// 单例模式
export const commandPalette = new CommandPalette();
