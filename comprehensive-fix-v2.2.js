/*
 * LightSearch 综合修复脚本 v2.2
 * 修复所有UI问题、增强调试功能
 */

// ========== 1. 自动对比度计算 ==========
const ContrastManager = {
    // 计算颜色亮度
    getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    },
    
    // 从背景色获取RGB
    getRGBFromBackground(element) {
        const bg = window.getComputedStyle(element).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        }
        return [255, 255, 255]; // 默认白色
    },
    
    // 计算对比度
    getContrast(rgb1, rgb2) {
        const lum1 = this.getLuminance(...rgb1);
        const lum2 = this.getLuminance(...rgb2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    },
    
    // 获取最佳文字颜色
    getBestTextColor(bgElement) {
        const bgRGB = this.getRGBFromBackground(bgElement);
        const whiteContrast = this.getContrast(bgRGB, [255, 255, 255]);
        const blackContrast = this.getContrast(bgRGB, [0, 0, 0]);
        
        // WCAG AA 标准要求对比度至少 4.5:1
        if (whiteContrast > blackContrast) {
            return whiteContrast >= 4.5 ? '#ffffff' : '#f0f0f0';
        } else {
            return blackContrast >= 4.5 ? '#000000' : '#1a1a1a';
        }
    },
    
    // 应用自动对比度
    applyAutoContrast() {
        if (!document.body.classList.contains('theme-liquid-glass')) return;
        
        const elements = document.querySelectorAll('.ls-search-container, .ls-popup, .ls-btn, .ls-search-input, .ls-select, .ls-input, .ls-history__item, .ls-engine-item');
        
        elements.forEach(el => {
            const textColor = this.getBestTextColor(el);
            el.style.color = textColor;
            
            // 同时设置子元素
            const children = el.querySelectorAll('*');
            children.forEach(child => {
                if (!child.style.color || child.style.color === 'inherit') {
                    child.style.color = textColor;
                }
            });
        });
        
        console.log('✅ Auto contrast applied');
    }
};

// ========== 2. 增强的调试面板 ==========
const DebugPanelEnhanced = {
    isParameterMode: false,
    
    // 初始化增强功能
    init() {
        this.addGitHubIssueButton();
        this.addExportButton();
        this.addParameterModeToggle();
        this.addFunctionVerification();
        this.enhancePanelUI();
    },
    
    // 添加 GitHub Issue 按钮
    addGitHubIssueButton() {
        const quickActions = document.querySelector('.debug-section');
        if (!quickActions) return;
        
        const githubBtn = document.createElement('button');
        githubBtn.className = 'debug-button';
        githubBtn.innerHTML = '🐛 Report to GitHub';
        githubBtn.onclick = () => this.openGitHubIssue();
        
        quickActions.appendChild(githubBtn);
    },
    
    // 打开 GitHub Issue
    openGitHubIssue() {
        const errors = typeof ErrorMonitor !== 'undefined' ? ErrorMonitor.getErrors() : [];
        const systemInfo = this.getSystemInfo();
        
        const issueBody = encodeURIComponent(`
## 问题描述
<!-- 请在这里描述您遇到的问题 -->

## 错误信息
${errors.length > 0 ? errors.map(e => `- [${e.code}] ${e.message}: ${e.customMessage}`).join('\n') : '无错误记录'}

## 系统信息
- 浏览器: ${systemInfo.browser}
- 屏幕: ${systemInfo.screen}
- WebGL: ${systemInfo.webgl}
- 语言: ${systemInfo.language}
- 主题: ${systemInfo.theme}

## 重现步骤
1. 
2. 
3. 

## 预期行为
<!-- 您期望发生什么 -->

## 实际行为
<!-- 实际发生了什么 -->

## 截图
<!-- 如果可能，请添加截图 -->
        `);
        
        const url = `https://github.com/StarsailsClover/LightSearch/issues/new?title=Bug%20Report&body=${issueBody}`;
        window.open(url, '_blank');
        
        addDebugLog('GitHub Issue opened', 'debug-success');
    },
    
    // 添加导出按钮
    addExportButton() {
        const quickActions = document.querySelector('.debug-section');
        if (!quickActions) return;
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'debug-button';
        exportBtn.innerHTML = '📥 Export Report';
        exportBtn.onclick = () => this.exportErrorReport();
        
        quickActions.appendChild(exportBtn);
    },
    
    // 导出错误报告
    exportErrorReport() {
        const errors = typeof ErrorMonitor !== 'undefined' ? ErrorMonitor.getErrors() : [];
        const systemInfo = this.getSystemInfo();
        const settings = typeof settings !== 'undefined' ? settings : {};
        
        const report = {
            timestamp: new Date().toISOString(),
            version: 'v2.2',
            systemInfo,
            errors,
            settings: {
                theme: settings.theme,
                darkMode: settings.darkMode,
                language: currentLang,
                engines: settings.engines?.length || 0,
                academicEngines: settings.academicEngines?.length || 0
            },
            localStorage: this.getLocalStorageInfo()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lightsearch-error-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        addDebugLog('Error report exported', 'debug-success');
    },
    
    // 添加参数模式切换
    addParameterModeToggle() {
        const quickActions = document.querySelector('.debug-section');
        if (!quickActions) return;
        
        const paramBtn = document.createElement('button');
        paramBtn.className = 'debug-button';
        paramBtn.innerHTML = '🔍 Parameter Mode';
        paramBtn.onclick = () => this.toggleParameterMode();
        
        quickActions.appendChild(paramBtn);
    },
    
    // 切换参数模式
    toggleParameterMode() {
        this.isParameterMode = !this.isParameterMode;
        
        if (this.isParameterMode) {
            this.enableParameterMode();
            addDebugLog('Parameter mode enabled', 'debug-success');
        } else {
            this.disableParameterMode();
            addDebugLog('Parameter mode disabled', 'debug-success');
        }
    },
    
    // 启用参数模式
    enableParameterMode() {
        // 添加参数模式样式
        const style = document.createElement('style');
        style.id = 'parameter-mode-style';
        style.textContent = `
            .param-mode-border {
                outline: 2px dashed #ff0000 !important;
                position: relative !important;
            }
            
            .param-mode-label {
                position: absolute !important;
                top: -20px !important;
                left: 0 !important;
                background: #ff0000 !important;
                color: white !important;
                padding: 2px 6px !important;
                font-size: 10px !important;
                font-family: monospace !important;
                z-index: 99999 !important;
                border-radius: 3px !important;
            }
            
            .param-mode-data {
                position: absolute !important;
                bottom: -20px !important;
                left: 0 !important;
                background: #0066ff !important;
                color: white !important;
                padding: 2px 6px !important;
                font-size: 9px !important;
                font-family: monospace !important;
                z-index: 99999 !important;
                border-radius: 3px !important;
                max-width: 200px !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
            }
        `;
        document.head.appendChild(style);
        
        // 标记所有主要组件
        const components = [
            { selector: '.ls-search-container', name: 'SearchContainer' },
            { selector: '.ls-search-input', name: 'SearchInput' },
            { selector: '.ls-search-btn', name: 'SearchButton' },
            { selector: '.ls-popup', name: 'Popup' },
            { selector: '.ls-btn', name: 'Button' },
            { selector: '.ls-switch', name: 'Switch' },
            { selector: '.ls-select', name: 'Select' },
            { selector: '.ls-input', name: 'Input' },
            { selector: '.ls-slider', name: 'Slider' },
            { selector: '.ls-engine-item', name: 'EngineItem' },
            { selector: '.ls-history__item', name: 'HistoryItem' }
        ];
        
        components.forEach(({ selector, name }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                el.classList.add('param-mode-border');
                
                // 添加组件名标签
                const label = document.createElement('div');
                label.className = 'param-mode-label';
                label.textContent = `${name}[${index}]`;
                el.style.position = 'relative';
                el.appendChild(label);
                
                // 添加数据标签
                const data = this.getElementData(el);
                if (data) {
                    const dataLabel = document.createElement('div');
                    dataLabel.className = 'param-mode-data';
                    dataLabel.textContent = data;
                    el.appendChild(dataLabel);
                }
            });
        });
    },
    
    // 禁用参数模式
    disableParameterMode() {
        const style = document.getElementById('parameter-mode-style');
        if (style) style.remove();
        
        document.querySelectorAll('.param-mode-border').forEach(el => {
            el.classList.remove('param-mode-border');
        });
        
        document.querySelectorAll('.param-mode-label, .param-mode-data').forEach(el => {
            el.remove();
        });
    },
    
    // 获取元素数据
    getElementData(el) {
        if (el.id) return `id="${el.id}"`;
        if (el.value) return `value="${el.value}"`;
        if (el.textContent && el.textContent.length < 30) return `text="${el.textContent.trim()}"`;
        return null;
    },
    
    // 添加功能验证
    addFunctionVerification() {
        const debugContent = document.getElementById('debugPanel-content');
        if (!debugContent) return;
        
        const verificationSection = document.createElement('div');
        verificationSection.className = 'debug-section';
        verificationSection.innerHTML = `
            <div class="debug-section-title">Function Verification</div>
            <div id="function-verification-results"></div>
            <button class="debug-button" onclick="DebugPanelEnhanced.verifyAllFunctions()">Verify All</button>
        `;
        
        debugContent.appendChild(verificationSection);
    },
    
    // 验证所有功能
    verifyAllFunctions() {
        const results = [];
        
        // 验证核心函数
        const coreFunctions = [
            'openPopup',
            'closePopup',
            'saveSettings',
            'performSearch',
            'addEngine',
            'deleteEngine',
            'renderEngines',
            'renderHistory',
            'applyTheme',
            'switchLanguage'
        ];
        
        coreFunctions.forEach(funcName => {
            const exists = typeof window[funcName] === 'function';
            results.push({
                name: funcName,
                status: exists ? '✅' : '❌',
                message: exists ? 'Available' : 'Missing'
            });
        });
        
        // 验证 DOM 元素
        const requiredElements = [
            'searchInput',
            'searchBtn',
            'settingsBtn',
            'settingsPopup',
            'engineList'
        ];
        
        requiredElements.forEach(id => {
            const exists = !!document.getElementById(id);
            results.push({
                name: `#${id}`,
                status: exists ? '✅' : '❌',
                message: exists ? 'Found' : 'Missing'
            });
        });
        
        // 显示结果
        const resultsDiv = document.getElementById('function-verification-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = results.map(r => `
                <div class="debug-item">
                    <span class="debug-label">${r.status} ${r.name}:</span>
                    <span class="debug-value">${r.message}</span>
                </div>
            `).join('');
        }
        
        addDebugLog(`Verified ${results.length} items`, 'debug-success');
    },
    
    // 增强面板 UI
    enhancePanelUI() {
        const panel = document.getElementById('debugPanel');
        if (!panel) return;
        
        // 添加更多统计信息
        const statsSection = document.querySelector('.debug-stats');
        if (statsSection) {
            statsSection.innerHTML += `
                <div class="debug-stat">
                    <div class="debug-stat-value" id="debug-functions-count">0</div>
                    <div class="debug-stat-label">Functions</div>
                </div>
                <div class="debug-stat">
                    <div class="debug-stat-value" id="debug-elements-count">0</div>
                    <div class="debug-stat-label">Elements</div>
                </div>
            `;
        }
        
        // 更新统计
        this.updateStats();
    },
    
    // 更新统计信息
    updateStats() {
        // 统计函数数量
        let functionCount = 0;
        for (let key in window) {
            if (typeof window[key] === 'function') {
                functionCount++;
            }
        }
        
        const funcCountEl = document.getElementById('debug-functions-count');
        if (funcCountEl) funcCountEl.textContent = functionCount;
        
        // 统计元素数量
        const elementCount = document.querySelectorAll('*').length;
        const elemCountEl = document.getElementById('debug-elements-count');
        if (elemCountEl) elemCountEl.textContent = elementCount;
    },
    
    // 获取系统信息
    getSystemInfo() {
        return {
            browser: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            webgl: this.checkWebGL(),
            language: navigator.language,
            theme: document.body.className,
            timestamp: new Date().toISOString()
        };
    },
    
    // 检查 WebGL
    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl ? 'Supported' : 'Not Supported';
        } catch (e) {
            return 'Error';
        }
    },
    
    // 获取 localStorage 信息
    getLocalStorageInfo() {
        const info = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ls-')) {
                try {
                    info[key] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    info[key] = localStorage.getItem(key);
                }
            }
        }
        return info;
    }
};

// ========== 3. 定制 UI 组件 ==========
const CustomUIComponents = {
    // 初始化定制组件
    init() {
        this.createCustomSelect();
        this.createCustomColorPicker();
    },
    
    // 创建定制下拉选择器
    createCustomSelect() {
        const style = document.createElement('style');
        style.textContent = `
            .ls-select-custom {
                position: relative;
                display: inline-block;
                width: 100%;
            }
            
            .ls-select-custom-display {
                padding: 10px 35px 10px 12px;
                border: 1px solid var(--ls-border);
                border-radius: 8px;
                background: var(--ls-card-bg);
                color: var(--ls-text);
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
            }
            
            .ls-select-custom-display:hover {
                border-color: var(--ls-accent);
            }
            
            .ls-select-custom-display::after {
                content: '▼';
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.8rem;
                color: var(--ls-text);
                transition: transform 0.2s ease;
            }
            
            .ls-select-custom.is-open .ls-select-custom-display::after {
                transform: translateY(-50%) rotate(180deg);
            }
            
            .ls-select-custom-options {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 4px;
                background: var(--ls-card-bg);
                border: 1px solid var(--ls-border);
                border-radius: 8px;
                box-shadow: var(--ls-shadow);
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            }
            
            .ls-select-custom.is-open .ls-select-custom-options {
                display: block;
            }
            
            .ls-select-custom-option {
                padding: 10px 12px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .ls-select-custom-option:hover {
                background: rgba(66, 133, 244, 0.1);
            }
            
            .ls-select-custom-option.is-selected {
                background: rgba(66, 133, 244, 0.2);
                color: var(--ls-accent);
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 创建定制调色盘
    createCustomColorPicker() {
        const style = document.createElement('style');
        style.textContent = `
            .ls-color-picker-custom {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--ls-card-bg);
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 10000;
                display: none;
            }
            
            .ls-color-picker-custom.is-active {
                display: block;
            }
            
            .ls-color-picker-custom-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .ls-color-picker-custom-title {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--ls-text);
            }
            
            .ls-color-picker-custom-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--ls-text);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .ls-color-picker-custom-close:hover {
                background: rgba(0,0,0,0.1);
            }
            
            .ls-color-picker-custom-canvas {
                width: 300px;
                height: 300px;
                border-radius: 8px;
                cursor: crosshair;
                margin-bottom: 16px;
            }
            
            .ls-color-picker-custom-preview {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .ls-color-picker-custom-preview-box {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                border: 2px solid var(--ls-border);
            }
            
            .ls-color-picker-custom-preview-value {
                flex: 1;
                padding: 10px;
                border: 1px solid var(--ls-border);
                border-radius: 8px;
                background: var(--ls-card-bg);
                color: var(--ls-text);
                font-family: monospace;
            }
            
            .ls-color-picker-custom-buttons {
                display: flex;
                gap: 8px;
            }
            
            .ls-color-picker-custom-buttons button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            
            .ls-color-picker-custom-buttons button:first-child {
                background: var(--ls-accent);
                color: white;
            }
            
            .ls-color-picker-custom-buttons button:last-child {
                background: #6c757d;
                color: white;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 替换原生 select
    replaceNativeSelects() {
        document.querySelectorAll('.ls-select:not(.ls-select-custom-replaced)').forEach(select => {
            const wrapper = document.createElement('div');
            wrapper.className = 'ls-select-custom';
            
            const display = document.createElement('div');
            display.className = 'ls-select-custom-display';
            display.textContent = select.options[select.selectedIndex].text;
            
            const options = document.createElement('div');
            options.className = 'ls-select-custom-options';
            
            Array.from(select.options).forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'ls-select-custom-option';
                if (index === select.selectedIndex) {
                    optionDiv.classList.add('is-selected');
                }
                optionDiv.textContent = option.text;
                optionDiv.dataset.value = option.value;
                
                optionDiv.onclick = () => {
                    select.selectedIndex = index;
                    select.dispatchEvent(new Event('change'));
                    display.textContent = option.text;
                    wrapper.classList.remove('is-open');
                    
                    options.querySelectorAll('.ls-select-custom-option').forEach(o => {
                        o.classList.remove('is-selected');
                    });
                    optionDiv.classList.add('is-selected');
                };
                
                options.appendChild(optionDiv);
            });
            
            display.onclick = () => {
                wrapper.classList.toggle('is-open');
            };
            
            wrapper.appendChild(display);
            wrapper.appendChild(options);
            
            select.style.display = 'none';
            select.classList.add('ls-select-custom-replaced');
            select.parentNode.insertBefore(wrapper, select);
        });
    }
};

// ========== 4. 初始化所有修复 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 应用自动对比度
    setTimeout(() => {
        ContrastManager.applyAutoContrast();
    }, 500);
    
    // 监听主题变化
    const observer = new MutationObserver(() => {
        ContrastManager.applyAutoContrast();
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // 初始化调试面板增强
    if (document.getElementById('debugPanel')) {
        setTimeout(() => {
            DebugPanelEnhanced.init();
        }, 1000);
    }
    
    // 初始化定制 UI
    CustomUIComponents.init();
    setTimeout(() => {
        CustomUIComponents.replaceNativeSelects();
    }, 1000);
    
    console.log('✅ Comprehensive fixes v2.2 loaded');
});

// 导出到全局
window.ContrastManager = ContrastManager;
window.DebugPanelEnhanced = DebugPanelEnhanced;
window.CustomUIComponents = CustomUIComponents;
