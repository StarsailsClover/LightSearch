/*
 * LightSearch 全面UI改进 v2.4
 * 参考 jQuery-switchButton 和 webintosh 的优秀设计
 * 修复所有已知UI问题
 */

console.log('🎨 Loading UI Improvements v2.4...');

// ========== 1. 修复可疑方框问题 ==========
const fixSuspiciousBox = () => {
    // 检查并移除所有可能导致方框的元素
    const suspiciousSelectors = [
        'input[type="color"]',
        '#colorPicker',
        '.color-picker',
        '.ls-search-container > div:empty',
        '.ls-search-box > div:empty',
        '.ls-search-container > span:empty',
        '.ls-search-box > span:empty'
    ];
    
    suspiciousSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
            el.style.width = '0';
            el.style.height = '0';
        });
    });
    
    // 特别处理 LiquidGlass 模式
    if (document.body.classList.contains('theme-liquid-glass')) {
        // 移除所有可能的空白节点
        const searchContainer = document.querySelector('.ls-search-container');
        if (searchContainer) {
            const children = Array.from(searchContainer.childNodes);
            children.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                    node.remove();
                }
                if (node.nodeType === Node.ELEMENT_NODE && !node.textContent.trim() && !node.querySelector('input, button')) {
                    node.style.display = 'none';
                }
            });
        }
    }
    
    console.log('✅ Suspicious box fixed');
};

// ========== 2. iOS/macOS 风格开关按钮 ==========
const createModernSwitch = () => {
    const style = document.createElement('style');
    style.id = 'modern-switch-styles';
    style.textContent = `
        /* iOS/macOS 风格开关 - 参考 jQuery-switchButton */
        .ls-settings__item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 16px 20px !important;
            min-height: 60px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            gap: 30px !important;
        }
        
        body.theme-dark .ls-settings__item {
            border-bottom-color: rgba(255, 255, 255, 0.05);
        }
        
        .ls-settings__label {
            flex: 1 !important;
            font-size: 1rem !important;
            font-weight: 400 !important;
            color: var(--ls-text);
            white-space: normal !important;
            line-height: 1.5 !important;
        }
        
        /* 现代开关容器 */
        .modern-switch {
            position: relative;
            display: inline-block;
            width: 51px;
            height: 31px;
            flex-shrink: 0;
        }
        
        .modern-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }
        
        /* 开关轨道 */
        .modern-switch-track {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #e5e5ea;
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 31px;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
        }
        
        body.theme-dark .modern-switch-track {
            background-color: #39393d;
        }
        
        /* 开关滑块 */
        .modern-switch-thumb {
            position: absolute;
            content: "";
            height: 27px;
            width: 27px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15),
                        0 3px 1px rgba(0, 0, 0, 0.06);
        }
        
        /* 开启状态 */
        .modern-switch input:checked + .modern-switch-track {
            background-color: #34c759;
        }
        
        body.theme-dark .modern-switch input:checked + .modern-switch-track {
            background-color: #30d158;
        }
        
        .modern-switch input:checked ~ .modern-switch-thumb {
            transform: translateX(20px);
        }
        
        /* 焦点状态 */
        .modern-switch input:focus + .modern-switch-track {
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04),
                        0 0 0 4px rgba(52, 199, 89, 0.1);
        }
        
        /* 禁用状态 */
        .modern-switch input:disabled + .modern-switch-track {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* 悬停效果 */
        .modern-switch:hover input:not(:disabled) + .modern-switch-track {
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04),
                        0 0 0 8px rgba(0, 0, 0, 0.04);
        }
        
        body.theme-dark .modern-switch:hover input:not(:disabled) + .modern-switch-track {
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04),
                        0 0 0 8px rgba(255, 255, 255, 0.04);
        }
    `;
    
    const oldStyle = document.getElementById('modern-switch-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Modern switch styles loaded');
};

// 替换所有旧开关为新开关
const replaceOldSwitches = () => {
    document.querySelectorAll('.ls-switch').forEach(oldSwitch => {
        if (oldSwitch.classList.contains('modern-switch')) return;
        
        const input = oldSwitch.querySelector('input');
        if (!input) return;
        
        // 创建新开关
        const newSwitch = document.createElement('label');
        newSwitch.className = 'modern-switch';
        
        const newInput = input.cloneNode(true);
        const track = document.createElement('span');
        track.className = 'modern-switch-track';
        const thumb = document.createElement('span');
        thumb.className = 'modern-switch-thumb';
        
        newSwitch.appendChild(newInput);
        newSwitch.appendChild(track);
        newSwitch.appendChild(thumb);
        
        oldSwitch.replaceWith(newSwitch);
    });
    
    console.log('✅ Old switches replaced');
};

// ========== 3. 居左布局设置面板 ==========
const createLeftAlignedSettings = () => {
    const style = document.createElement('style');
    style.id = 'left-aligned-settings';
    style.textContent = `
        /* 居左布局设置面板 */
        .ls-popup {
            max-width: 800px !important;
            width: 90% !important;
        }
        
        .ls-popup__body {
            padding: 0 !important;
        }
        
        /* 设置项容器 */
        .ls-settings__section {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .ls-settings__section-title {
            padding: 20px 20px 12px 20px !important;
            margin: 0 !important;
            font-size: 0.85rem !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            color: #666 !important;
            background: rgba(0, 0, 0, 0.02);
        }
        
        body.theme-dark .ls-settings__section-title {
            color: #999 !important;
            background: rgba(255, 255, 255, 0.02);
        }
        
        /* 设置项 */
        .ls-settings__item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 16px 20px !important;
            min-height: 60px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            gap: 30px !important;
            background: white;
            transition: background 0.2s ease;
        }
        
        body.theme-dark .ls-settings__item {
            background: #1c1c1e;
            border-bottom-color: rgba(255, 255, 255, 0.05);
        }
        
        .ls-settings__item:hover {
            background: rgba(0, 0, 0, 0.02);
        }
        
        body.theme-dark .ls-settings__item:hover {
            background: rgba(255, 255, 255, 0.02);
        }
        
        .ls-settings__item:last-child {
            border-bottom: none;
        }
        
        /* 标签 */
        .ls-settings__label {
            flex: 1 !important;
            font-size: 1rem !important;
            font-weight: 400 !important;
            color: var(--ls-text);
            text-align: left !important;
            white-space: normal !important;
            line-height: 1.5 !important;
        }
        
        /* 控件容器 */
        .ls-settings__control {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        /* 输入框和选择器 */
        .ls-settings__item .ls-input,
        .ls-settings__item .ls-select {
            min-width: 200px;
            max-width: 300px;
        }
        
        /* 按钮 */
        .ls-settings__item .ls-btn {
            min-width: auto;
            padding: 8px 16px;
        }
    `;
    
    const oldStyle = document.getElementById('left-aligned-settings');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Left-aligned settings loaded');
};

// ========== 4. 修复明亮/黑暗模式布局 ==========
const fixDisplayModeLayout = () => {
    const manualSettings = document.getElementById('manualModeSettings');
    if (manualSettings) {
        // 重新构建布局
        manualSettings.style.cssText = `
            width: 100%;
            padding: 0;
            background: transparent;
            border-radius: 0;
            margin-top: 0;
            display: none;
        `;
        
        // 查找开关
        const switchLabel = manualSettings.querySelector('label');
        if (switchLabel) {
            switchLabel.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                min-height: 60px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                gap: 30px;
                background: white;
                margin: 0;
            `;
            
            const labelText = switchLabel.querySelector('span');
            if (labelText) {
                labelText.style.cssText = `
                    flex: 1;
                    font-size: 1rem;
                    font-weight: 400;
                    color: var(--ls-text);
                    text-align: left;
                    white-space: normal;
                    line-height: 1.5;
                `;
            }
        }
    }
    
    console.log('✅ Display mode layout fixed');
};

// ========== 5. webintosh 风格窗口逻辑 ==========
const applyWebintoshWindowLogic = () => {
    const style = document.createElement('style');
    style.id = 'webintosh-window-styles';
    style.textContent = `
        /* webintosh 风格窗口 */
        .ls-popup {
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* 窗口标题栏 */
        .ls-popup__header {
            background: linear-gradient(180deg, #f5f5f7 0%, #e8e8ea 100%) !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 12px 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }
        
        body.theme-dark .ls-popup__header {
            background: linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .ls-popup__title {
            font-size: 0.95rem !important;
            font-weight: 600 !important;
            color: var(--ls-text) !important;
            margin: 0 !important;
        }
        
        /* macOS 风格关闭按钮 */
        .ls-popup__close {
            width: 12px !important;
            height: 12px !important;
            border-radius: 50% !important;
            background: #ff5f57 !important;
            border: 0.5px solid rgba(0, 0, 0, 0.1) !important;
            font-size: 0 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            position: relative !important;
            order: -1 !important;
        }
        
        .ls-popup__close:hover {
            background: #ff4136 !important;
        }
        
        .ls-popup__close::before {
            content: '×';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            color: #4d0000;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .ls-popup__close:hover::before {
            opacity: 1;
        }
        
        /* 窗口内容 */
        .ls-popup__body {
            background: white !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
        }
        
        body.theme-dark .ls-popup__body {
            background: #1c1c1e !important;
        }
        
        /* 窗口底部 */
        .ls-popup__footer {
            background: #f5f5f7 !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
            padding: 12px 20px !important;
        }
        
        body.theme-dark .ls-popup__footer {
            background: #2c2c2e !important;
            border-top-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* 滚动条样式 */
        .ls-popup__body::-webkit-scrollbar {
            width: 8px;
        }
        
        .ls-popup__body::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .ls-popup__body::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }
        
        body.theme-dark .ls-popup__body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .ls-popup__body::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
        }
        
        body.theme-dark .ls-popup__body::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    
    const oldStyle = document.getElementById('webintosh-window-styles');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Webintosh window styles loaded');
};

// ========== 6. 初始化所有改进 ==========
const initAllImprovements = () => {
    console.log('🚀 Initializing all UI improvements...');
    
    // 1. 修复可疑方框
    fixSuspiciousBox();
    
    // 2. 创建现代开关样式
    createModernSwitch();
    
    // 3. 应用居左布局
    createLeftAlignedSettings();
    
    // 4. 应用 webintosh 窗口样式
    applyWebintoshWindowLogic();
    
    // 5. 替换旧开关
    setTimeout(() => {
        replaceOldSwitches();
        fixDisplayModeLayout();
    }, 500);
    
    // 6. 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                fixSuspiciousBox();
                replaceOldSwitches();
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 7. 监听主题变化
    const themeObserver = new MutationObserver(() => {
        fixSuspiciousBox();
    });
    
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    console.log('✅ All UI improvements initialized');
};

// ========== 7. 页面加载时执行 ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllImprovements);
} else {
    initAllImprovements();
}

// 导出函数供调试使用
window.uiImprovements = {
    fixSuspiciousBox,
    createModernSwitch,
    replaceOldSwitches,
    createLeftAlignedSettings,
    fixDisplayModeLayout,
    applyWebintoshWindowLogic,
    initAllImprovements
};

console.log('✅ UI Improvements v2.4 loaded');
