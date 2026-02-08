/*
 * LightSearch 紧急修复 v3.0 - 简化版
 * 立即修复搜索栏消失和关键问题
 */

console.log('🚨 Emergency Fix v3.0 Loading...');

// 1. 立即恢复搜索栏
(function() {
    const css = `
    /* 强制显示所有搜索元素 */
    .ls-search-container { display: block !important; visibility: visible !important; opacity: 1 !important; }
    .ls-search-box { display: flex !important; gap: 10px; justify-content: center; }
    .ls-search-input { display: block !important; flex: 1; min-width: 300px; max-width: 600px; padding: 15px 20px; border: 2px solid #ddd; border-radius: 24px; font-size: 1rem; }
    .ls-search-btn { display: block !important; padding: 15px 30px; background: #4285f4; color: white; border: none; border-radius: 24px; cursor: pointer; }
    .ls-logo { display: block !important; font-size: 3rem; margin-bottom: 2rem; }
    .ls-history { display: block !important; margin-top: 2rem; }
    
    /* 修复 LiquidGlass 模式下的可疑方框 */
    body.theme-liquid-glass input[type="color"],
    body.theme-liquid-glass #colorPicker {
        display: none !important;
        position: absolute !important;
        left: -99999px !important;
        width: 0 !important;
        height: 0 !important;
        opacity: 0 !important;
    }
    
    /* LiquidGlass 样式 - 基于开源包 */
    body.theme-liquid-glass {
        background: transparent;
    }
    
    body.theme-liquid-glass .ls-search-container,
    body.theme-liquid-glass .ls-search-box,
    body.theme-liquid-glass .ls-search-input,
    body.theme-liquid-glass .ls-search-btn,
    body.theme-liquid-glass .ls-history {
        background: rgba(255, 255, 255, 0.08) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    }
    
    body.theme-liquid-glass.theme-dark .ls-search-container,
    body.theme-liquid-glass.theme-dark .ls-search-box,
    body.theme-liquid-glass.theme-dark .ls-search-input,
    body.theme-liquid-glass.theme-dark .ls-search-btn {
        background: rgba(0, 0, 0, 0.3) !important;
        color: #ffffff !important;
    }
    
    body.theme-liquid-glass:not(.theme-dark) .ls-search-container,
    body.theme-liquid-glass:not(.theme-dark) .ls-search-box,
    body.theme-liquid-glass:not(.theme-dark) .ls-search-input,
    body.theme-liquid-glass:not(.theme-dark) .ls-search-btn {
        background: rgba(255, 255, 255, 0.6) !important;
        color: #000000 !important;
    }
    
    /* 统一 Classic 主题样式 */
    body:not(.theme-liquid-glass) {
        --ls-bg: #ffffff;
        --ls-text: #000000;
        --ls-accent: #4285f4;
        --ls-border: #ddd;
        --ls-card-bg: #ffffff;
    }
    
    body.theme-dark:not(.theme-liquid-glass) {
        --ls-bg: #1a1a1a;
        --ls-text: #ffffff;
        --ls-border: #444;
        --ls-card-bg: #2a2a2a;
    }
    
    /* 设置弹窗 - Webintosh 风格 */
    .ls-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--ls-card-bg);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        z-index: 1001;
        padding: 20px;
    }
    
    .ls-popup__header {
        padding: 20px;
        border-bottom: 1px solid var(--ls-border);
    }
    
    .ls-popup__body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .ls-popup__footer {
        padding: 20px;
        border-top: 1px solid var(--ls-border);
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    
    /* 设置项布局 */
    .ls-settings__section {
        margin-bottom: 30px;
    }
    
    .ls-settings__section-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--ls-text);
    }
    
    .ls-settings__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .ls-settings__label {
        flex: 0 0 auto;
        margin-right: 20px;
        font-size: 0.95rem;
    }
    
    .ls-settings__control {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }
    
    /* iOS 风格开关 */
    .ls-switch {
        position: relative;
        display: inline-block;
        width: 51px;
        height: 31px;
    }
    
    .ls-switch input {
        opacity: 0;
        width: 0;
        height: 0;
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
        border-radius: 31px;
    }
    
    .ls-switch__slider:before {
        position: absolute;
        content: "";
        height: 27px;
        width: 27px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .ls-switch input:checked + .ls-switch__slider {
        background-color: #4285f4;
    }
    
    .ls-switch input:checked + .ls-switch__slider:before {
        transform: translateX(20px);
    }
    `;
    
    const style = document.createElement('style');
    style.id = 'emergency-fix-v3';
    style.textContent = css;
    document.head.appendChild(style);
    
    console.log('✅ Emergency styles applied');
})();

// 2. 清理可疑元素
setTimeout(() => {
    document.querySelectorAll('input[type="color"], #colorPicker').forEach(el => {
        el.style.display = 'none';
        el.style.position = 'absolute';
        el.style.left = '-99999px';
    });
    
    // 清理空元素
    document.querySelectorAll('.ls-search-container > *:empty, .ls-search-box > *:empty').forEach(el => {
        if (!el.querySelector('input, button')) {
            el.style.display = 'none';
        }
    });
    
    console.log('✅ Suspicious elements cleaned');
}, 500);

// 3. 重写显示模式设置
function rewriteDisplayMode() {
    const displayModeHTML = `
    <div class="ls-settings__item" style="flex-direction: column; align-items: flex-start; gap: 15px;">
        <span class="ls-settings__label" style="font-weight: 600;">显示模式</span>
        
        <div style="width: 100%;">
            <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <input type="radio" name="displayMode" value="manual" checked>
                <span>手动</span>
            </label>
            
            <div id="manualModeSettings" style="margin-left: 30px; display: block;">
                <label class="ls-switch" style="display: inline-flex; align-items: center; gap: 10px;">
                    <span>明亮模式 / 黑暗模式</span>
                    <div style="position: relative; width: 51px; height: 31px;">
                        <input type="checkbox" id="manualDarkModeSwitch">
                        <span class="ls-switch__slider"></span>
                    </div>
                </label>
            </div>
        </div>
        
        <div style="width: 100%;">
            <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <input type="radio" name="displayMode" value="auto">
                <span>按时间自动</span>
            </label>
            
            <div id="autoModeSettings" style="margin-left: 30px; display: none;">
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">切换到明亮模式: <span id="lightTimeValue">6</span>:00</label>
                    <input type="range" class="ls-slider" id="lightTimeSlider" min="0" max="23" value="6" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">切换到黑暗模式: <span id="darkTimeValue">18</span>:00</label>
                    <input type="range" class="ls-slider" id="darkTimeSlider" min="0" max="23" value="18" style="width: 100%;">
                </div>
            </div>
        </div>
    </div>
    `;
    
    // 查找并替换显示模式设置项
    const darkModeItem = document.querySelector('.ls-settings__item:has(#darkModeSwitch)');
    if (darkModeItem) {
        const temp = document.createElement('div');
        temp.innerHTML = displayModeHTML;
        darkModeItem.replaceWith(temp.firstElementChild);
        
        // 绑定事件
        document.querySelectorAll('input[name="displayMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const manual = document.getElementById('manualModeSettings');
                const auto = document.getElementById('autoModeSettings');
                if (e.target.value === 'manual') {
                    manual.style.display = 'block';
                    auto.style.display = 'none';
                } else {
                    manual.style.display = 'none';
                    auto.style.display = 'block';
                }
            });
        });
        
        // 滑块事件
        ['lightTimeSlider', 'darkTimeSlider'].forEach(id => {
            const slider = document.getElementById(id);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const valueId = id.replace('Slider', 'Value');
                    document.getElementById(valueId).textContent = e.target.value;
                });
            }
        });
        
        console.log('✅ Display mode rewritten');
    }
}

// 4. 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Emergency Fix v3.0 initialized');
    
    // 延迟执行以确保DOM完全加载
    setTimeout(() => {
        rewriteDisplayMode();
    }, 1000);
});

// 导出函数供调试使用
window.emergencyFixV3 = {
    rewriteDisplayMode
};

console.log('✅ Emergency Fix v3.0 loaded');
