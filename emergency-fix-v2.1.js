/*
 * LightSearch 紧急修复补丁 v2.1
 * 修复 colorPicker 显示、LiquidGlass 样式和其他UI问题
 */

// ========== 修复1: colorPicker 显示问题 ==========
document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        // 强制隐藏
        colorPicker.style.cssText = 'display: none !important; position: absolute; left: -9999px; opacity: 0; pointer-events: none;';
    }
});

// ========== 修复2: LiquidGlass 样式修复 ==========
function fixLiquidGlassStyles() {
    const style = document.createElement('style');
    style.id = 'liquidglass-fix';
    style.textContent = `
        /* 强制隐藏 colorPicker */
        #colorPicker {
            display: none !important;
            position: absolute !important;
            left: -9999px !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        
        /* LiquidGlass 明亮模式修复 */
        body.theme-liquid-glass:not(.theme-dark) {
            background: rgba(255, 255, 255, 0.95) !important;
        }
        
        body.theme-liquid-glass:not(.theme-dark) .ls-search-container,
        body.theme-liquid-glass:not(.theme-dark) .ls-popup,
        body.theme-liquid-glass:not(.theme-dark) .ls-btn {
            background: rgba(255, 255, 255, 0.6) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.8) !important;
            color: #000000 !important;
        }
        
        body.theme-liquid-glass:not(.theme-dark) .ls-search-input,
        body.theme-liquid-glass:not(.theme-dark) .ls-select,
        body.theme-liquid-glass:not(.theme-dark) .ls-input {
            background: rgba(255, 255, 255, 0.4) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            color: #000000 !important;
        }
        
        body.theme-liquid-glass:not(.theme-dark) .ls-search-btn {
            background: rgba(66, 133, 244, 0.9) !important;
            color: white !important;
        }
        
        /* LiquidGlass 黑暗模式修复 */
        body.theme-liquid-glass.theme-dark {
            background: rgba(0, 0, 0, 0.9) !important;
        }
        
        body.theme-liquid-glass.theme-dark .ls-search-container,
        body.theme-liquid-glass.theme-dark .ls-popup,
        body.theme-liquid-glass.theme-dark .ls-btn {
            background: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
        }
        
        body.theme-liquid-glass.theme-dark .ls-search-input,
        body.theme-liquid-glass.theme-dark .ls-select,
        body.theme-liquid-glass.theme-dark .ls-input {
            background: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
        }
        
        /* 修复搜索历史显示 */
        body.theme-liquid-glass .ls-history {
            background: transparent !important;
        }
        
        body.theme-liquid-glass .ls-history__item {
            background: rgba(66, 133, 244, 0.2) !important;
            border: 1px solid rgba(66, 133, 244, 0.3) !important;
            color: var(--ls-text) !important;
        }
        
        /* 修复按钮状态显示 */
        .ls-switch input:checked + .ls-switch__slider {
            background-color: #4285f4 !important;
        }
        
        .ls-switch input:checked + .ls-switch__slider::before {
            transform: translateX(20px) !important;
        }
        
        /* 修复弹窗在 LiquidGlass 模式下的显示 */
        body.theme-liquid-glass .ls-popup {
            max-height: 80vh !important;
            overflow-y: auto !important;
        }
        
        body.theme-liquid-glass .ls-popup__body {
            max-height: calc(80vh - 120px) !important;
            overflow-y: auto !important;
        }
        
        /* 隐藏不应该显示的元素 */
        .display-mode-settings,
        .display-mode-option,
        .display-mode-sub-settings {
            display: none !important;
        }
    `;
    
    // 移除旧的修复样式
    const oldFix = document.getElementById('liquidglass-fix');
    if (oldFix) {
        oldFix.remove();
    }
    
    document.head.appendChild(style);
    console.log('✅ LiquidGlass styles fixed');
}

// ========== 修复3: 显示模式UI重新设计 ==========
function createDisplayModeUI() {
    // 找到暗黑模式设置项
    const darkModeItem = document.querySelector('.ls-settings__item:has(#darkModeSwitch)');
    if (!darkModeItem) return;
    
    // 创建新的显示模式UI
    const displayModeHTML = `
        <div class="ls-settings__item" style="flex-direction: column; align-items: flex-start;">
            <span class="ls-settings__label" style="margin-bottom: 12px;">${t('displayMode') || '显示模式'}</span>
            
            <!-- 选择方式 -->
            <div style="width: 100%; margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-size: 0.9rem;">
                    ${t('displayModeMethod') || '选择方式'}
                </label>
                <select class="ls-select" id="displayModeMethod" style="width: 100%;">
                    <option value="manual">${t('displayModeManual') || '手动'}</option>
                    <option value="auto">${t('displayModeAuto') || '按时间自动'}</option>
                </select>
            </div>
            
            <!-- 手动模式子项 -->
            <div id="manualModeSettings" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px; display: none;">
                <label class="ls-switch" style="display: flex; align-items: center; justify-content: space-between;">
                    <span>${t('lightMode') || '明亮模式'} / ${t('darkMode') || '黑暗模式'}</span>
                    <div style="position: relative; width: 50px; height: 24px;">
                        <input type="checkbox" id="manualDarkModeSwitch" style="opacity: 0; width: 0; height: 0;">
                        <span class="ls-switch__slider"></span>
                    </div>
                </label>
            </div>
            
            <!-- 自动模式子项 -->
            <div id="autoModeSettings" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px; display: none;">
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 8px; color: #666; font-size: 0.9rem;">
                        ${t('lightSwitchTime') || '切换到明亮模式'}: <span id="lightTimeValue">6</span>:00
                    </label>
                    <input type="range" class="ls-slider" id="lightTimeSlider" min="0" max="23" value="6" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; color: #666; font-size: 0.9rem;">
                        ${t('darkSwitchTime') || '切换到黑暗模式'}: <span id="darkTimeValue">18</span>:00
                    </label>
                    <input type="range" class="ls-slider" id="darkTimeSlider" min="0" max="23" value="18" style="width: 100%;">
                </div>
            </div>
        </div>
    `;
    
    // 替换原有的暗黑模式设置
    darkModeItem.outerHTML = displayModeHTML;
    
    // 绑定事件
    setTimeout(() => {
        const methodSelect = document.getElementById('displayModeMethod');
        const manualSettings = document.getElementById('manualModeSettings');
        const autoSettings = document.getElementById('autoModeSettings');
        const lightTimeSlider = document.getElementById('lightTimeSlider');
        const darkTimeSlider = document.getElementById('darkTimeSlider');
        const lightTimeValue = document.getElementById('lightTimeValue');
        const darkTimeValue = document.getElementById('darkTimeValue');
        const manualSwitch = document.getElementById('manualDarkModeSwitch');
        
        if (methodSelect) {
            // 加载保存的设置
            const savedMode = storage.get('displayMode') || 'manual';
            const savedIsDark = storage.get('darkMode') || false;
            const savedTimes = storage.get('autoSwitchTimes') || { light: 6, dark: 18 };
            
            methodSelect.value = savedMode;
            if (manualSwitch) manualSwitch.checked = savedIsDark;
            if (lightTimeSlider) lightTimeSlider.value = savedTimes.light;
            if (darkTimeSlider) darkTimeSlider.value = savedTimes.dark;
            if (lightTimeValue) lightTimeValue.textContent = savedTimes.light;
            if (darkTimeValue) darkTimeValue.textContent = savedTimes.dark;
            
            // 显示对应的设置
            if (savedMode === 'manual') {
                if (manualSettings) manualSettings.style.display = 'block';
                if (autoSettings) autoSettings.style.display = 'none';
            } else {
                if (manualSettings) manualSettings.style.display = 'none';
                if (autoSettings) autoSettings.style.display = 'block';
            }
            
            // 方式切换事件
            methodSelect.addEventListener('change', (e) => {
                const mode = e.target.value;
                updateTempSetting('displayMode', mode);
                
                if (mode === 'manual') {
                    if (manualSettings) manualSettings.style.display = 'block';
                    if (autoSettings) autoSettings.style.display = 'none';
                } else {
                    if (manualSettings) manualSettings.style.display = 'none';
                    if (autoSettings) autoSettings.style.display = 'block';
                }
            });
            
            // 手动模式开关
            if (manualSwitch) {
                manualSwitch.addEventListener('change', (e) => {
                    updateTempSetting('darkMode', e.target.checked);
                    document.body.classList.toggle('theme-dark', e.target.checked);
                });
            }
            
            // 自动模式滑块
            if (lightTimeSlider) {
                lightTimeSlider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (lightTimeValue) lightTimeValue.textContent = value;
                    const times = tempSettings.autoSwitchTimes || storage.get('autoSwitchTimes') || { light: 6, dark: 18 };
                    times.light = parseInt(value);
                    updateTempSetting('autoSwitchTimes', times);
                });
            }
            
            if (darkTimeSlider) {
                darkTimeSlider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (darkTimeValue) darkTimeValue.textContent = value;
                    const times = tempSettings.autoSwitchTimes || storage.get('autoSwitchTimes') || { light: 6, dark: 18 };
                    times.dark = parseInt(value);
                    updateTempSetting('autoSwitchTimes', times);
                });
            }
        }
    }, 100);
    
    console.log('✅ Display mode UI created');
}

// ========== 修复4: 搜索历史删除按钮 ==========
function enhanceHistoryItems() {
    const historyItems = document.querySelectorAll('.ls-history__item');
    historyItems.forEach(item => {
        // 检查是否已经添加删除按钮
        if (item.querySelector('.ls-history__item-delete')) return;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'ls-history__item-delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            const query = item.textContent.replace('×', '').trim();
            deleteHistoryItem(query);
        };
        
        item.appendChild(deleteBtn);
    });
}

// ========== 初始化修复 ==========
function initEmergencyFixes() {
    console.log('🚨 Applying emergency fixes...');
    
    // 修复1: colorPicker
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.style.cssText = 'display: none !important; position: absolute; left: -9999px; opacity: 0; pointer-events: none;';
    }
    
    // 修复2: LiquidGlass 样式
    fixLiquidGlassStyles();
    
    // 修复3: 显示模式UI
    setTimeout(() => {
        createDisplayModeUI();
    }, 500);
    
    // 修复4: 搜索历史
    const observer = new MutationObserver(() => {
        enhanceHistoryItems();
    });
    
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer) {
        observer.observe(historyContainer, { childList: true, subtree: true });
        enhanceHistoryItems();
    }
    
    console.log('✅ Emergency fixes applied');
}

// 在 DOM 加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmergencyFixes);
} else {
    initEmergencyFixes();
}

// 监听主题切换
document.addEventListener('themeChanged', () => {
    fixLiquidGlassStyles();
});

// 添加缺失的翻译
if (typeof LANG_DATA !== 'undefined') {
    const additionalTranslations = {
        displayModeMethod: { en: 'Selection Method', zh: '选择方式', ja: '選択方法', ko: '선택 방법', ru: 'Метод выбора' },
        lightSwitchTime: { en: 'Switch to Light', zh: '切换到明亮模式', ja: 'ライトに切り替え', ko: '라이트로 전환', ru: 'Переключить на светлый' },
        darkSwitchTime: { en: 'Switch to Dark', zh: '切换到黑暗模式', ja: 'ダークに切り替え', ko: '다크로 전환', ru: 'Переключить на темный' }
    };
    
    Object.keys(additionalTranslations).forEach(key => {
        Object.keys(additionalTranslations[key]).forEach(lang => {
            if (LANG_DATA[lang]) {
                LANG_DATA[lang][key] = additionalTranslations[key][lang];
            }
        });
    });
}

console.log('✅ Emergency patch v2.1 loaded');
