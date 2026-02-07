/*
LightSearch - 国际化系统
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

export class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = {};
        this.fallbackLang = 'en';
    }

    // 语言检测优先级：用户选择 > localStorage > IP检测 > 浏览器语言 > 默认
    detectLanguage() {
        const saved = localStorage.getItem('ls-language');
        if (saved) return saved;

        const browserLang = navigator.language.slice(0, 2);
        const supported = ['zh', 'en', 'ja', 'ko', 'ru'];
        
        return supported.includes(browserLang) ? browserLang : 'en';
    }

    // 加载语言包
    async loadLanguage(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            this.translations[lang] = await response.json();
            this.currentLang = lang;
            localStorage.setItem('ls-language', lang);
            return true;
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
            return false;
        }
    }

    // 翻译函数
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            value = value?.[k];
        }

        // 回退到英语
        if (!value && this.currentLang !== this.fallbackLang) {
            value = this.translations[this.fallbackLang];
            for (const k of keys) {
                value = value?.[k];
            }
        }

        if (!value) return key;

        // 参数替换
        return value.replace(/\{(\w+)\}/g, (_, param) => params[param] || '');
    }

    // 切换语言
    async switchLanguage(lang) {
        await this.loadLanguage(lang);
        this.updateDOM();
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // 更新DOM中的所有翻译
    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.t(key);
        });
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return [
            { code: 'zh', name: '简体中文', nativeName: '简体中文' },
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'ja', name: 'Japanese', nativeName: '日本語' },
            { code: 'ko', name: 'Korean', nativeName: '한국어' },
            { code: 'ru', name: 'Russian', nativeName: 'Русский' }
        ];
    }
}

// 单例模式
export const i18n = new I18n();
