/*
LightSearch - 主题系统（支持 Liquid Glass）
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

export class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.themes = {
            'classic': {
                name: 'LightSearch Classic',
                colors: {
                    '--ls-bg': '#ffffff',
                    '--ls-text': '#000000',
                    '--ls-accent': '#4285f4',
                    '--ls-card-bg': '#ffffff',
                    '--ls-border': '#ddd',
                    '--ls-shadow': '0 2px 8px rgba(0,0,0,0.1)'
                }
            },
            'classic-dark': {
                name: 'Classic Dark',
                colors: {
                    '--ls-bg': '#121212',
                    '--ls-text': '#ffffff',
                    '--ls-accent': '#4285f4',
                    '--ls-card-bg': '#1e1e1e',
                    '--ls-border': '#333',
                    '--ls-shadow': '0 2px 8px rgba(255,255,255,0.1)'
                }
            },
            'liquid-glass': {
                name: 'Liquid Glass',
                colors: {
                    '--ls-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '--ls-text': '#ffffff',
                    '--ls-accent': '#ffffff',
                    '--ls-card-bg': 'rgba(255, 255, 255, 0.1)',
                    '--ls-border': 'rgba(255, 255, 255, 0.2)',
                    '--ls-shadow': '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '--ls-glass-blur': '10px',
                    '--ls-glass-border': '1px solid rgba(255, 255, 255, 0.18)'
                },
                effects: {
                    backdropFilter: 'blur(10px)',
                    glassEffect: true
                }
            },
            'green': {
                name: 'Eye Comfort',
                colors: {
                    '--ls-bg': '#e6f7ee',
                    '--ls-text': '#1a4d2e',
                    '--ls-accent': '#4f9d69',
                    '--ls-card-bg': '#f0fdf4',
                    '--ls-border': '#a7d7c5',
                    '--ls-shadow': '0 2px 8px rgba(79,157,105,0.15)'
                }
            }
        };
    }

    // 加载主题
    loadTheme() {
        const saved = localStorage.getItem('ls-theme');
        if (saved) return saved;

        // 检测系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'classic-dark' : 'classic';
    }

    // 应用主题
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }

        const root = document.documentElement;

        // 移除所有主题类
        Object.keys(this.themes).forEach(name => {
            root.classList.remove(`ls-theme--${name}`);
        });

        // 添加当前主题类
        root.classList.add(`ls-theme--${themeName}`);

        // 应用CSS变量
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // 应用特殊效果（如 Liquid Glass）
        if (theme.effects?.glassEffect) {
            this.applyGlassEffect();
        } else {
            this.removeGlassEffect();
        }

        this.currentTheme = themeName;
        localStorage.setItem('ls-theme', themeName);

        // 触发事件
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName } 
        }));
    }

    // 应用玻璃态效果
    applyGlassEffect() {
        document.querySelectorAll('.ls-card, .ls-popup, .ls-search-box').forEach(el => {
            el.style.backdropFilter = 'blur(10px)';
            el.style.webkitBackdropFilter = 'blur(10px)';
            el.style.background = 'rgba(255, 255, 255, 0.1)';
            el.style.border = '1px solid rgba(255, 255, 255, 0.18)';
        });
    }

    // 移除玻璃态效果
    removeGlassEffect() {
        document.querySelectorAll('.ls-card, .ls-popup, .ls-search-box').forEach(el => {
            el.style.backdropFilter = '';
            el.style.webkitBackdropFilter = '';
            el.style.background = '';
            el.style.border = '';
        });
    }

    // 切换深色模式
    toggleDarkMode() {
        const isDark = this.currentTheme === 'classic-dark';
        this.applyTheme(isDark ? 'classic' : 'classic-dark');
    }

    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }

    // 获取所有主题
    getThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            id: key,
            name: theme.name
        }));
    }

    // 监听系统主题变化
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('ls-theme-auto') === 'true') {
                this.applyTheme(e.matches ? 'classic-dark' : 'classic');
            }
        });
    }
}

// 单例模式
export const themeManager = new ThemeManager();
