/*
 * LightSearch 全面重构 v3.0
 * 基于 LiquidGlass 和 Webintosh 开源项目
 * 修复所有已知问题并统一UI风格
 */

console.log('🚀 Loading Complete Refactor v3.0...');

// ========== 1. 紧急修复：恢复搜索栏显示 ==========
const restoreSearchBar = () => {
    const style = document.createElement('style');
    style.id = 'restore-searchbar';
    style.textContent = `
        /* 强制显示搜索相关元素 */
        .ls-search-container,
        .ls-search-box,
        .ls-search-input,
        .ls-search-btn,
        .ls-logo,
        .ls-history {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .ls-search-box {
            display: flex !important;
        }
        
        /* 确保搜索容器可见 */
        .ls-search-container {
            position: relative;
            z-index: 10;
            margin-top: 15vh;
            text-align: center;
            width: 90%;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        
        /* Logo */
        .ls-logo {
            font-size: 3rem;
            font-weight: 300;
            margin-bottom: 2rem;
            color: var(--ls-text, #000);
        }
        
        /* 搜索框 */
        .ls-search-box {
            display: flex;
            gap: 10px;
            margin: 2rem 0;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .ls-search-input {
            flex: 1;
            min-width: 300px;
            max-width: 600px;
            padding: 15px 20px;
            border: 2px solid #ddd;
            border-radius: 24px;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .ls-search-input:focus {
            border-color: #4285f4;
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
        }
        
        .ls-search-btn {
            padding: 15px 30px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 24px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .ls-search-btn:hover {
            background: #3367d6;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        }
        
        /* 搜索历史 */
        .ls-history {
            margin-top: 2rem;
        }
        
        .ls-history__item {
            display: inline-block;
            padding: 8px 16px;
            margin: 4px;
            background: rgba(66, 133, 244, 0.1);
            border: 1px solid rgba(66, 133, 244, 0.3);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .ls-history__item:hover {
            background: rgba(66, 133, 244, 0.2);
            transform: translateY(-2px);
        }
    `;
    
    const oldStyle = document.getElementById('restore-searchbar');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Search bar restored');
};

// ========== 2. LiquidGlass 官方样式（基于开源包） ==========
const applyLiquidGlassStyles = () => {
    const style = document.createElement('style');
    style.id = 'liquidglass-official-styles';
    style.textContent = `
        /* LiquidGlass 官方样式 - 基于 bergice/liquidglass */
        body.theme-liquid-glass {
            background: transparent;
            overflow: hidden;
        }
        
        body.theme-liquid-glass::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('background.jpeg');
            background-size: cover;
            background-position: center;
            z-index: -1;
        }
        
        /* LiquidGlass 组件样式 */
        body.theme-liquid-glass .ls-search-container,
        body.theme-liquid-glass .ls-popup,
        body.theme-liquid-glass .ls-btn,
        body.theme-liquid-glass .ls-controls button {
            background: rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        }
        
        body.theme-liquid-glass .ls-search-input,
        body.theme-liquid-glass .ls-select,
        body.theme-liquid-glass .ls-input {
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #fff !important;
        }
        
        body.theme-liquid-glass .ls-search-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        /* LiquidGlass 文字颜色 */
        body.theme-liquid-glass,
        body.theme-liquid-glass .ls-logo,
        body.theme-liquid-glass .ls-search-container,
        body.theme-liquid-glass .ls-history__item,
        body.theme-liquid-glass .ls-popup {
            color: #ffffff !important;
        }
        
        /* 修复可疑方框 - 隐藏所有不必要的元素 */
        body.theme-liquid-glass input[type="color"],
        body.theme-liquid-glass #colorPicker,
        body.theme-liquid-glass .color-picker,
        body.theme-liquid-glass .ls-search-container > div:empty,
        body.theme-liquid-glass .ls-search-box > div:empty,
        body.theme-liquid-glass .ls-search-container > span:empty,
        body.theme-liquid-glass .ls-search-box > span:empty {
            display: none !important;
            position: absolute !important;
            left: -9999px !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        /* 搜索历史在 LiquidGlass 下的样式 */
        body.theme-liquid-glass .ls-history {
            background: transparent !important;
        }
        
        body.theme-liquid-glass .ls-history p {
            color: rgba(255, 255, 255, 0.8) !important;
        }
        
        body.theme-liquid-glass .ls-history__item {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
        }
        
        body.theme-liquid-glass .ls-history__item:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }
    `;
    
    const oldStyle = document.getElementById('liquidglass-official-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ LiquidGlass official styles applied');
};

// ========== 3. 统一 Classic 主题样式 ==========
const unifyClassicTheme = () => {
    const style = document.createElement('style');
    style.id = 'unified-classic-theme';
    style.textContent = `
        /* 统一的 Classic 主题样式 */
        body:not(.theme-liquid-glass) {
            --ls-bg: #ffffff;
            --ls-text: #000000;
            --ls-accent: #4285f4;
            --ls-card-bg: #ffffff;
            --ls-border: #ddd;
            --ls-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            
            background: var(--ls-bg);
            color: var(--ls-text);
        }
        
        /* 暗黑模式 */
        body.theme-dark:not(.theme-liquid-glass) {
            --ls-bg: #1a1a1a;
            --ls-text: #ffffff;
            --ls-card-bg: #2a2a2a;
            --ls-border: #444;
            --ls-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* 统一按钮样式 */
        body:not(.theme-liquid-glass) .ls-btn,
        body:not(.theme-liquid-glass) .ls-search-btn {
            background: var(--ls-accent);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        body:not(.theme-liquid-glass) .ls-btn:hover,
        body:not(.theme-liquid-glass) .ls-search-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        }
        
        /* 统一输入框样式 */
        body:not(.theme-liquid-glass) .ls-search-input,
        body:not(.theme-liquid-glass) .ls-input,
        body:not(.theme-liquid-glass) .ls-select {
            background: var(--ls-card-bg);
            color: var(--ls-text);
            border: 2px solid var(--ls-border);
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.2s ease;
        }
        
        body:not(.theme-liquid-glass) .ls-search-input:focus,
        body:not(.theme-liquid-glass) .ls-input:focus,
        body:not(.theme-liquid-glass) .ls-select:focus {
            border-color: var(--ls-accent);
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
        }
        
        /* 统一卡片样式 */
        body:not(.theme-liquid-glass) .ls-popup,
        body:not(.theme-liquid-glass) .ls-history__item,
        body:not(.theme-liquid-glass) .ls-engine-item {
            background: var(--ls-card-bg);
            border: 1px solid var(--ls-border);
            box-shadow: var(--ls-shadow);
        }
    `;
    
    const oldStyle = document.getElementById('unified-classic-theme');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Classic theme unified');
};

// ========== 4. 重写显示模式设置 ==========
const rewriteDisplayMode = () => {
    const style = document.createElement('style');
    style.id = 'display-mode-rewrite';
    style.textContent = `
        /* 全新的显示模式设置 */
        .display-mode-container {
            width: 100%;
        }
        
        .display-mode-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        
        .display-mode-title {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--ls-text);
        }
        
        .display-mode-tabs {
            display: flex;
            gap: 8px;
            background: rgba(0, 0, 0, 0.05);
            padding: 4px;
            border-radius: 8px;
        }
        
        .display-mode-tab {
            padding: 6px 16px;
            border: none;
            background: transparent;
            color: var(--ls-text);
            font-size: 0.85rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .display-mode-tab.active {
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .display-mode-content {
            padding: 16px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 8px;
            display: none;
        }
        
        .display-mode-content.active {
            display: block;
        }
        
        /* 手动模式 */
        .manual-mode-switch {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
        }
        
        /* 自动模式 */
        .auto-mode-time-picker {
            margin-bottom: 16px;
        }
        
        .time-picker-label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.85rem;
            color: #666;
        }
        
        .time-picker-input {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .time-picker-input input[type="number"] {
            width: 60px;
            padding: 8px;
            border: 1px solid var(--ls-border);
            border-radius: 6px;
            text-align: center;
            font-size: 0.9rem;
        }
        
        .time-picker-separator {
            font-weight: 600;
            color: var(--ls-text);
        }
    `;
    
    const oldStyle = document.getElementById('display-mode-rewrite');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Display mode rewritten');
};

// ========== 5. Webintosh 风格设置布局 ==========
const applyWebintoshSettingsLayout = () => {
    const style = document.createElement('style');
    style.id = 'webintosh-settings-layout';
    style.textContent = `
        /* Webintosh 风格设置布局 */
        .ls-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--ls-card-bg);
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 700px;
            width: 90%;
            max-height: 85vh;
            display: none;
            z-index: 1001;
            
            /* 保留与窗口边框的距离 */
            margin: 20px;
        }
        
        .ls-popup.active {
            display: flex;
            flex-direction: column;
        }
        
        /* 弹窗头部 */
        .ls-popup__header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--ls-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        
        .ls-popup__title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--ls-text);
            margin: 0;
        }
        
        .ls-popup__close {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: rgba(0, 0, 0, 0.05);
            color: var(--ls-text);
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .ls-popup__close:hover {
            background: rgba(0, 0, 0, 0.1);
        }
        
        /* 弹窗主体 */
        .ls-popup__body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }
        
        /* 设置区块 */
        .ls-settings__section {
            margin-bottom: 32px;
        }
        
        .ls-settings__section:last-child {
            margin-bottom: 0;
        }
        
        .ls-settings__section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--ls-text);
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--ls-border);
        }
        
        /* 设置项 */
        .ls-settings__item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .ls-settings__item:last-child {
            border-bottom: none;
        }
        
        .ls-settings__label {
            font-size: 0.95rem;
            color: var(--ls-text);
            flex: 0 0 auto;
            margin-right: 20px;
        }
        
        .ls-settings__control {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        
        /* 弹窗底部 */
        .ls-popup__footer {
            padding: 16px 24px;
            border-top: 1px solid var(--ls-border);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            flex-shrink: 0;
        }
        
        .ls-popup__footer .ls-btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        
        .ls-btn--secondary {
            background: transparent;
            color: var(--ls-text);
            border: 1px solid var(--ls-border);
        }
        
        .ls-btn--secondary:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            .ls-popup {
                width: 95%;
                max-height: 90vh;
                margin: 10px;
            }
            
            .ls-settings__item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .ls-settings__control {
                width: 100%;
                justify-content: flex-start;
            }
        }
    `;
    
    const oldStyle = document.getElementById('webintosh-settings-layout');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Webintosh settings layout applied');
};

// ========== 6. 初始化所有修复 ==========
const initCompleteRefactor = () => {
    console.log('🔧 Initializing complete refactor...');
    
    // 1. 紧急恢复搜索栏
    restoreSearchBar();
    
    // 2. 应用 LiquidGlass 官方样式
    applyLiquidGlassStyles();
    
    // 3. 统一 Classic 主题
    unifyClassicTheme();
    
    // 4. 重写显示模式
    rewriteDisplayMode();
    
    // 5. 应用 Webintosh 设置布局
    applyWebintoshSettingsLayout();
    
    // 监听主题变化
    const observer = new MutationObserver(() => {
        if (document.body.classList.contains('theme-liquid-glass')) {
            applyLiquidGlassStyles();
        }
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    console.log('✅ Complete refactor initialized');
};

// ========== 7. 页面加载时执行 ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompleteRefactor);
} else {
    initCompleteRefactor();
}

// 导出函数供调试使用
window.completeRefactor = {
    restoreSearchBar,
    applyLiquidGlassStyles,
    unifyClassicTheme,
    rewriteDisplayMode,
    applyWebintoshSettingsLayout,
    initCompleteRefactor
};

console.log('✅ Complete Refactor v3.0 loaded');
