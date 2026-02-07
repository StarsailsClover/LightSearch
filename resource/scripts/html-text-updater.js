/*
 * HTML 动态文本更新脚本
 * 将所有硬编码的英文文本改为通过 JavaScript 动态设置
 */

// 在 DOMContentLoaded 后执行
function updateHTMLTexts() {
    try {
        // 更新设置弹窗中的所有静态文本
        const textsToUpdate = [
            // 设置弹窗
            { selector: '#settingsPopup .ls-settings__section:nth-child(1) .ls-settings__section-title', key: 'enginesTitle' },
            { selector: '#newEngineInput', key: 'addEnginePlaceholder', attr: 'placeholder' },
            { selector: '#settingsPopup .ls-settings__section:nth-child(1) button', key: 'addEngine' },
            
            // 个性化部分
            { selector: '#settingsPopup .ls-settings__section:nth-child(2) .ls-settings__section-title', key: 'personalizationTitle' },
            { selector: '#settingsPopup .ls-settings__item:nth-child(2) .ls-settings__label', key: 'themeTitle' },
            { selector: '#themeSelect option[value="classic"]', key: 'themeClassic' },
            { selector: '#themeSelect option[value="liquid-glass"]', key: 'themeLiquidGlass' },
            { selector: '#settingsPopup .ls-settings__item:nth-child(3) .ls-settings__label', key: 'displayMode' },
            
            // 强调色
            { selector: '#settingsPopup .ls-settings__item:nth-child(4) .ls-settings__label', key: 'accentColor' },
            
            // 背景
            { selector: '#settingsPopup .ls-settings__item:nth-child(5) .ls-settings__label', key: 'backgroundTitle' },
            
            // 语言
            { selector: '#settingsPopup .ls-settings__section:nth-child(3) .ls-settings__section-title', key: 'languageTitle' },
            
            // 学术搜索弹窗
            { selector: '#academicInput', key: 'searchPlaceholder', attr: 'placeholder' },
            { selector: '#academicPopup .ls-settings__section-title', key: 'academicEnginesTitle' }
        ];
        
        textsToUpdate.forEach(({ selector, key, attr }) => {
            const element = document.querySelector(selector);
            if (element) {
                if (attr) {
                    element.setAttribute(attr, t(key));
                } else {
                    element.textContent = t(key);
                }
            }
        });
        
        console.log('✅ HTML texts updated');
    } catch (error) {
        ErrorMonitor.log('E4003', 'HTML文本更新失败', error);
    }
}

// 增强的 applyLanguage 函数
function applyLanguageEnhanced() {
    // 调用原有的 applyLanguage
    if (typeof applyLanguage === 'function') {
        applyLanguage();
    }
    
    // 更新 HTML 中的静态文本
    updateHTMLTexts();
    
    // 更新页面标题
    document.title = t('title') || 'LightSearch - Simple & Elegant Search Aggregator';
    
    // 更新所有按钮文本
    const buttons = {
        '#searchBtn': 'searchButton',
        '#settingsBtn': 'settingsButton',
        '#academicBtn': 'academicButton'
    };
    
    Object.entries(buttons).forEach(([selector, key]) => {
        const btn = document.querySelector(selector);
        if (btn) btn.textContent = t(key);
    });
    
    // 更新弹窗标题
    const popupTitles = {
        '#settingsPopup .ls-popup__title': 'settingsTitle',
        '#academicPopup .ls-popup__title': 'academicTitle'
    };
    
    Object.entries(popupTitles).forEach(([selector, key]) => {
        const title = document.querySelector(selector);
        if (title) title.textContent = t(key);
    });
    
    // 更新弹窗底部按钮
    document.querySelectorAll('.ls-popup__footer .ls-btn--secondary').forEach(btn => {
        if (btn.textContent.includes('Cancel') || btn.textContent.includes('取消')) {
            btn.textContent = t('cancelButton');
        }
    });
    
    document.querySelectorAll('.ls-popup__footer .ls-btn--primary').forEach(btn => {
        if (btn.textContent.includes('Save') || btn.textContent.includes('保存')) {
            btn.textContent = t('saveButton');
        }
    });
    
    // 更新输入框占位符
    const inputs = {
        '#searchInput': 'searchPlaceholder',
        '#academicInput': 'searchPlaceholder',
        '#newEngineInput': 'addEnginePlaceholder'
    };
    
    Object.entries(inputs).forEach(([selector, key]) => {
        const input = document.querySelector(selector);
        if (input) input.placeholder = t(key);
    });
}

// 添加缺失的翻译键
const additionalTranslations = {
    en: {
        displayMode: 'Display Mode',
        displayModeManual: 'Manual',
        displayModeAuto: 'Auto',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        switchTime: 'Switch Time',
        lightSwitchTime: 'Switch to Light',
        darkSwitchTime: 'Switch to Dark',
        clearHistory: 'Clear History',
        clearHistoryConfirm: 'Are you sure you want to clear all search history?',
        deleteHistory: 'Delete',
        cropImage: 'Crop Image',
        confirmButton: 'Confirm',
        errorLog: 'Error Log',
        noErrors: 'No errors recorded',
        clearErrors: 'Clear Errors',
        academicEnginesTitle: 'Academic Engines',
        addEnginePlaceholder: 'Add engine (include {query})',
        accentColorLocked: 'Accent color is locked in Liquid Glass theme'
    },
    zh: {
        displayMode: '显示模式',
        displayModeManual: '手动',
        displayModeAuto: '自动',
        lightMode: '明亮模式',
        darkMode: '黑暗模式',
        switchTime: '切换时间',
        lightSwitchTime: '切换到明亮',
        darkSwitchTime: '切换到黑暗',
        clearHistory: '清除历史',
        clearHistoryConfirm: '确定要清除所有搜索历史吗？',
        deleteHistory: '删除',
        cropImage: '裁剪图片',
        confirmButton: '确认',
        errorLog: '错误日志',
        noErrors: '没有记录的错误',
        clearErrors: '清除错误',
        academicEnginesTitle: '学术引擎',
        addEnginePlaceholder: '添加引擎（包含 {query}）',
        accentColorLocked: 'Liquid Glass 主题下强调色已锁定'
    },
    ja: {
        displayMode: '表示モード',
        displayModeManual: '手動',
        displayModeAuto: '自動',
        lightMode: 'ライトモード',
        darkMode: 'ダークモード',
        switchTime: '切り替え時間',
        lightSwitchTime: 'ライトに切り替え',
        darkSwitchTime: 'ダークに切り替え',
        clearHistory: '履歴をクリア',
        clearHistoryConfirm: 'すべての検索履歴をクリアしてもよろしいですか？',
        deleteHistory: '削除',
        cropImage: '画像をトリミング',
        confirmButton: '確認',
        errorLog: 'エラーログ',
        noErrors: 'エラーは記録されていません',
        clearErrors: 'エラーをクリア',
        academicEnginesTitle: '学術エンジン',
        addEnginePlaceholder: 'エンジンを追加（{query}を含む）',
        accentColorLocked: 'Liquid Glass テーマではアクセントカラーがロックされています'
    },
    ko: {
        displayMode: '표시 모드',
        displayModeManual: '수동',
        displayModeAuto: '자동',
        lightMode: '라이트 모드',
        darkMode: '다크 모드',
        switchTime: '전환 시간',
        lightSwitchTime: '라이트로 전환',
        darkSwitchTime: '다크로 전환',
        clearHistory: '기록 지우기',
        clearHistoryConfirm: '모든 검색 기록을 지우시겠습니까?',
        deleteHistory: '삭제',
        cropImage: '이미지 자르기',
        confirmButton: '확인',
        errorLog: '오류 로그',
        noErrors: '기록된 오류가 없습니다',
        clearErrors: '오류 지우기',
        academicEnginesTitle: '학술 엔진',
        addEnginePlaceholder: '엔진 추가 ({query} 포함)',
        accentColorLocked: 'Liquid Glass 테마에서는 강조 색상이 잠겨 있습니다'
    },
    ru: {
        displayMode: 'Режим отображения',
        displayModeManual: 'Ручной',
        displayModeAuto: 'Авто',
        lightMode: 'Светлый режим',
        darkMode: 'Темный режим',
        switchTime: 'Время переключения',
        lightSwitchTime: 'Переключить на светлый',
        darkSwitchTime: 'Переключить на темный',
        clearHistory: 'Очистить историю',
        clearHistoryConfirm: 'Вы уверены, что хотите очистить всю историю поиска?',
        deleteHistory: 'Удалить',
        cropImage: 'Обрезать изображение',
        confirmButton: 'Подтвердить',
        errorLog: 'Журнал ошибок',
        noErrors: 'Ошибок не зарегистрировано',
        clearErrors: 'Очистить ошибки',
        academicEnginesTitle: 'Академические движки',
        addEnginePlaceholder: 'Добавить движок (включить {query})',
        accentColorLocked: 'Акцентный цвет заблокирован в теме Liquid Glass'
    }
};

// 合并翻译到 LANG_DATA
function mergeTranslations() {
    if (typeof LANG_DATA !== 'undefined') {
        Object.keys(additionalTranslations).forEach(lang => {
            if (LANG_DATA[lang]) {
                Object.assign(LANG_DATA[lang], additionalTranslations[lang]);
            }
        });
        console.log('✅ Additional translations merged');
    }
}

// 在页面加载时执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mergeTranslations();
        setTimeout(() => {
            applyLanguageEnhanced();
        }, 100);
    });
} else {
    mergeTranslations();
    applyLanguageEnhanced();
}

console.log('✅ HTML动态文本更新脚本已加载');
