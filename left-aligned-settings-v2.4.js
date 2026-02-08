/*
 * 居左布局设置面板 v2.4
 * 更符合传统设置页面的布局习惯
 */

const createLeftAlignedSettings = () => {
    const style = document.createElement('style');
    style.id = 'left-aligned-settings';
    style.textContent = `
        /* 居左布局设置面板 */
        .ls-popup {
            max-width: 900px !important;
            width: 90% !important;
        }
        
        .ls-popup__body {
            padding: 30px 40px !important;
            text-align: left !important;
        }
        
        /* 设置区块 */
        .ls-settings__section {
            margin-bottom: 40px;
            text-align: left;
        }
        
        .ls-settings__section-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--ls-text);
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--ls-border);
            text-align: left;
        }
        
        /* 设置项 - 居左布局 */
        .ls-settings__item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 16px 0 !important;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            text-align: left !important;
        }
        
        .ls-settings__item:last-child {
            border-bottom: none;
        }
        
        /* 标签在左侧 */
        .ls-settings__label {
            flex: 0 0 auto !important;
            margin-right: 30px !important;
            font-size: 0.95rem;
            color: var(--ls-text);
            white-space: nowrap;
            text-align: left !important;
        }
        
        /* 控件在右侧 */
        .ls-settings__control {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
        }
        
        .ls-select,
        .ls-input {
            max-width: 300px;
            margin-left: auto;
        }
        
        /* 引擎列表 */
        .ls-engine-list {
            margin-top: 15px;
        }
        
        .ls-engine-item {
            display: flex;
            align-items: center;
            padding: 12px;
            background: rgba(0,0,0,0.02);
            border-radius: 8px;
            margin-bottom: 8px;
            text-align: left;
        }
        
        .ls-engine-item__name {
            flex: 0 0 150px;
            font-weight: 500;
            text-align: left;
        }
        
        .ls-engine-item__url {
            flex: 1;
            color: #666;
            font-size: 0.85rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            margin: 0 15px;
        }
        
        .ls-engine-item__delete {
            flex: 0 0 auto;
            margin-left: auto;
        }
        
        /* 添加引擎区域 */
        .ls-engine-add {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            align-items: center;
        }
        
        .ls-engine-add input {
            flex: 1;
        }
        
        .ls-engine-add button {
            flex: 0 0 auto;
        }
        
        /* 颜色选择器 */
        .ls-color-picker {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        
        .ls-color-item {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
        }
        
        .ls-color-item:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .ls-color-item.is-active {
            border-color: var(--ls-text);
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
        }
        
        /* 滑块容器 */
        .ls-slider-wrapper {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
            justify-content: flex-end;
        }
        
        .ls-slider-wrapper .ls-slider {
            flex: 1;
            max-width: 200px;
        }
        
        .ls-slider-value {
            flex: 0 0 40px;
            text-align: right;
            font-weight: 600;
            color: var(--ls-accent);
        }
        
        /* 按钮组 */
        .ls-button-group {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        /* 文件上传按钮 */
        .ls-file-upload {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--ls-accent);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }
        
        .ls-file-upload:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .ls-file-upload input[type="file"] {
            display: none;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            .ls-settings__item {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 10px;
            }
            
            .ls-settings__label {
                margin-right: 0 !important;
                margin-bottom: 8px;
            }
            
            .ls-settings__control {
                width: 100%;
                justify-content: flex-start;
            }
            
            .ls-select,
            .ls-input {
                max-width: 100%;
            }
            
            .ls-slider-wrapper .ls-slider {
                max-width: 100%;
            }
        }
    `;
    
    const oldStyle = document.getElementById('left-aligned-settings');
    if (oldStyle) oldStyle.remove();
    
    document.head.appendChild(style);
    console.log('✅ Left-aligned settings created');
};

// ========== 重构设置HTML结构 ==========
const restructureSettings = () => {
    // 等待设置弹窗打开
    const settingsPopup = document.getElementById('settingsPopup');
    if (!settingsPopup) return;
    
    // 监听设置弹窗打开
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const isVisible = settingsPopup.style.display !== 'none';
                if (isVisible && !settingsPopup.dataset.restructured) {
                    settingsPopup.dataset.restructured = 'true';
                    applyLeftAlignedLayout();
                }
            }
        });
    });
    
    observer.observe(settingsPopup, {
        attributes: true,
        attributeFilter: ['style']
    });
};

// ========== 应用居左布局 ==========
const applyLeftAlignedLayout = () => {
    // 确保所有设置项都有正确的结构
    document.querySelectorAll('.ls-settings__item').forEach(item => {
        // 检查是否已经重构
        if (item.dataset.restructured) return;
        item.dataset.restructured = 'true';
        
        const label = item.querySelector('.ls-settings__label');
        const controls = Array.from(item.children).filter(child => 
            child !== label && 
            !child.classList.contains('ls-settings__label')
        );
        
        if (label && controls.length > 0) {
            // 创建控件容器
            const controlContainer = document.createElement('div');
            controlContainer.className = 'ls-settings__control';
            
            controls.forEach(control => {
                controlContainer.appendChild(control);
            });
            
            // 重新组织结构
            item.innerHTML = '';
            item.appendChild(label);
            item.appendChild(controlContainer);
        }
    });
    
    // 处理滑块
    document.querySelectorAll('.ls-settings__item .ls-slider').forEach(slider => {
        const parent = slider.parentElement;
        if (parent && !parent.classList.contains('ls-slider-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'ls-slider-wrapper';
            
            const valueSpan = parent.querySelector('.ls-slider-value') || 
                            parent.querySelector('[id$="Value"]');
            
            parent.insertBefore(wrapper, slider);
            wrapper.appendChild(slider);
            if (valueSpan) {
                wrapper.appendChild(valueSpan);
            }
        }
    });
    
    console.log('✅ Left-aligned layout applied');
};

// ========== 初始化 ==========
const initLeftAlignedSettings = () => {
    createLeftAlignedSettings();
    restructureSettings();
    
    // 如果设置已经打开，立即应用
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup && settingsPopup.style.display !== 'none') {
        setTimeout(applyLeftAlignedLayout, 100);
    }
};

// 页面加载时执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeftAlignedSettings);
} else {
    initLeftAlignedSettings();
}

// 导出函数
window.leftAlignedSettings = {
    createLeftAlignedSettings,
    applyLeftAlignedLayout,
    restructureSettings
};

console.log('✅ Left-aligned settings module loaded');
