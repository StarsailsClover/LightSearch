/*
 * LightSearch 紧急修复脚本 v2.3
 * 修复所有已知UI问题和添加新功能
 */

console.log('🚨 Loading Emergency Fix v2.3...');

// ========== 1. 修复标题 ==========
document.addEventListener('DOMContentLoaded', () => {
    document.title = 'LightSearch|轻寻 起始页';
    console.log('✅ Title fixed');
});

// ========== 2. 修复开关按钮样式 ==========
const fixSwitchStyles = () => {
    const style = document.createElement('style');
    style.id = 'switch-fix-styles';
    style.textContent = `
        /* 修复开关按钮布局 */
        .ls-settings__item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 20px !important;
            min-height: 44px !important;
            padding: 12px 0 !important;
        }
        
        .ls-settings__label {
            flex: 1 !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
            font-size: 0.95rem !important;
        }
        
        /* 修复开关按钮样式 */
        .ls-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
            flex-shrink: 0;
        }
        
        .ls-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }
        
        .ls-switch__slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.3s;
            border-radius: 26px;
        }
        
        .ls-switch__slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .ls-switch input:checked + .ls-switch__slider {
            background-color: #4285f4;
        }
        
        .ls-switch input:checked + .ls-switch__slider:before {
            transform: translateX(24px);
        }
        
        .ls-switch input:focus + .ls-switch__slider {
            box-shadow: 0 0 1px #4285f4;
        }
        
        /* 修复手动模式设置布局 */
        #manualModeSettings {
            width: 100% !important;
            padding: 16px !important;
            background: rgba(0, 0, 0, 0.02) !important;
            border-radius: 8px !important;
            margin-top: 12px !important;
        }
        
        #manualModeSettings .ls-switch {
            margin-left: auto !important;
        }
        
        /* 修复滑块样式 */
        .ls-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #ddd;
            outline: none;
            position: relative;
        }
        
        /* 滑块填充效果 */
        .ls-slider-container {
            position: relative;
            width: 100%;
        }
        
        .ls-slider-fill {
            position: absolute;
            height: 6px;
            background: var(--ls-accent, #4285f4);
            border-radius: 3px;
            pointer-events: none;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            transition: width 0.1s ease;
        }
        
        .ls-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--ls-accent, #4285f4);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            position: relative;
            z-index: 2;
        }
        
        .ls-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }
        
        .ls-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--ls-accent, #4285f4);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }
        
        .ls-slider::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* 修复 LiquidGlass 模式下的隐藏元素 */
        body.theme-liquid-glass input[type="color"],
        body.theme-liquid-glass #colorPicker {
            display: none !important;
            position: absolute !important;
            left: -9999px !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        /* 修复搜索历史容器 */
        body.theme-liquid-glass .ls-history {
            background: transparent !important;
        }
        
        body.theme-liquid-glass .ls-history p {
            color: var(--ls-text) !important;
        }
        
        /* 修复可疑方框 */
        body.theme-liquid-glass .ls-search-container > *:empty,
        body.theme-liquid-glass .ls-search-box > *:empty {
            display: none !important;
        }
        
        /* 确保所有空元素隐藏 */
        .ls-search-container > div:empty,
        .ls-search-box > div:empty {
            display: none !important;
        }
    `;
    
    const oldStyle = document.getElementById('switch-fix-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Switch styles fixed');
};

// ========== 3. 增强滑块功能 ==========
const enhanceSliders = () => {
    document.querySelectorAll('.ls-slider').forEach(slider => {
        // 检查是否已经增强
        if (slider.dataset.enhanced) return;
        slider.dataset.enhanced = 'true';
        
        // 创建填充层
        const container = document.createElement('div');
        container.className = 'ls-slider-container';
        
        const fill = document.createElement('div');
        fill.className = 'ls-slider-fill';
        
        slider.parentNode.insertBefore(container, slider);
        container.appendChild(fill);
        container.appendChild(slider);
        
        // 更新填充
        const updateFill = () => {
            const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
            fill.style.width = percent + '%';
        };
        
        slider.addEventListener('input', updateFill);
        updateFill();
    });
    
    console.log('✅ Sliders enhanced');
};

// ========== 4. 修复多语言翻译 ==========
const fixTranslations = () => {
    if (typeof LANG_DATA === 'undefined') return;
    
    const additionalTranslations = {
        displayMode: {
            en: 'Display Mode',
            zh: '显示模式',
            ja: '表示モード',
            ko: '표시 모드',
            ru: 'Режим отображения'
        },
        displayModeManual: {
            en: 'Manual',
            zh: '手动',
            ja: '手動',
            ko: '수동',
            ru: 'Ручной'
        },
        displayModeAuto: {
            en: 'Auto',
            zh: '自动',
            ja: '自動',
            ko: '자동',
            ru: 'Авто'
        },
        displayModeMethod: {
            en: 'Selection Method',
            zh: '选择方式',
            ja: '選択方法',
            ko: '선택 방법',
            ru: 'Метод выбора'
        },
        lightMode: {
            en: 'Light Mode',
            zh: '明亮模式',
            ja: 'ライトモード',
            ko: '라이트 모드',
            ru: 'Светлый режим'
        },
        lightSwitchTime: {
            en: 'Switch to Light',
            zh: '切换到明亮模式',
            ja: 'ライトに切り替え',
            ko: '라이트로 전환',
            ru: 'Переключить на светлый'
        },
        darkSwitchTime: {
            en: 'Switch to Dark',
            zh: '切换到黑暗模式',
            ja: 'ダークに切り替え',
            ko: '다크로 전환',
            ru: 'Переключить на темный'
        },
        debugSettings: {
            en: 'Debug Settings',
            zh: '调试设置',
            ja: 'デバッグ設定',
            ko: '디버그 설정',
            ru: 'Настройки отладки'
        },
        openDebugMode: {
            en: 'Open Debug Mode',
            zh: '打开调试模式',
            ja: 'デバッグモードを開く',
            ko: '디버그 모드 열기',
            ru: 'Открыть режим отладки'
        },
        visualRendering: {
            en: 'Visual Rendering',
            zh: '视觉渲染',
            ja: 'ビジュアルレンダリング',
            ko: '시각적 렌더링',
            ru: 'Визуальный рендеринг'
        },
        toneTransparency: {
            en: 'Tone Transparency',
            zh: '色调透明',
            ja: 'トーン透明度',
            ko: '톤 투명도',
            ru: 'Прозрачность тона'
        },
        colorfulGlass: {
            en: 'Colorful Glass',
            zh: '多彩染色玻璃',
            ja: 'カラフルガラス',
            ko: '다채로운 유리',
            ru: 'Цветное стекло'
        }
    };
    
    Object.keys(additionalTranslations).forEach(key => {
        Object.keys(additionalTranslations[key]).forEach(lang => {
            if (LANG_DATA[lang]) {
                LANG_DATA[lang][key] = additionalTranslations[key][lang];
            }
        });
    });
    
    console.log('✅ Translations updated');
};

// ========== 5. 清理页面中的 `n ==========
const cleanBacktickN = () => {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.includes('`n')) {
            node.nodeValue = node.nodeValue.replace(/`n/g, '');
        }
    }
    
    console.log('✅ Backtick-n cleaned');
};

// ========== 6. 修复 LiquidGlass 对比度 ==========
const fixLiquidGlassContrast = () => {
    if (!document.body.classList.contains('theme-liquid-glass')) return;
    
    const isDark = document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#ffffff' : '#000000';
    
    // 应用到所有文本元素
    const elements = document.querySelectorAll(`
        .ls-search-container,
        .ls-search-container *,
        .ls-popup,
        .ls-popup *,
        .ls-btn,
        .ls-search-input,
        .ls-select,
        .ls-input,
        .ls-history__item,
        .ls-engine-item
    `);
    
    elements.forEach(el => {
        if (el.tagName !== 'INPUT' && el.tagName !== 'BUTTON') {
            el.style.color = textColor;
        }
    });
    
    console.log('✅ LiquidGlass contrast fixed');
};

// ========== 7. 初始化所有修复 ==========
const initAllFixes = () => {
    console.log('🔧 Initializing all fixes...');
    
    // 修复样式
    fixSwitchStyles();
    
    // 修复翻译
    fixTranslations();
    
    // 清理 `n
    cleanBacktickN();
    
    // 修复对比度
    fixLiquidGlassContrast();
    
    // 增强滑块
    setTimeout(() => {
        enhanceSliders();
    }, 500);
    
    // 监听主题变化
    const observer = new MutationObserver(() => {
        fixLiquidGlassContrast();
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    console.log('✅ All fixes initialized');
};

// ========== 8. 页面加载时执行 ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllFixes);
} else {
    initAllFixes();
}

// 导出修复函数供调试使用
window.emergencyFixes = {
    fixSwitchStyles,
    enhanceSliders,
    fixTranslations,
    cleanBacktickN,
    fixLiquidGlassContrast,
    initAllFixes
};

console.log('✅ Emergency Fix v2.3 loaded');
