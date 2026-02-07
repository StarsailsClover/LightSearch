// LightSearch 问题修复脚本
// 此脚本包含所有需要添加到 script-new.js 的修复代码

// ========== 修复1: 添加缺失的函数 ==========

// closeSettings 函数 - 修复按钮失效问题
function closeSettings() {
    cancelSettings();
}

// addEngine 函数修复 - 使用正确的输入框ID
function addEngine() {
    const input = document.getElementById('newEngineInput');
    const url = input?.value.trim();
    
    if (!url) {
        alert(t('emptyInput') || '请输入搜索引擎URL');
        return;
    }
    if (!url.includes('{query}')) {
        alert(t('queryPlaceholder') || '请包含 {query} 作为关键词占位符');
        return;
    }
    
    const name = prompt(t('engineName') || '引擎名称：');
    if (!name) return;
    
    const engines = tempSettings.engines || settings.engines;
    const newEngines = [...engines, { name, url, enabled: true }];
    updateTempSetting('engines', newEngines);
    renderEngines();
    input.value = '';
}

// setAccentColor 函数 - 修复强调色设置
function setAccentColor(color) {
    if (settings.theme === 'liquid-glass') {
        alert(t('liquidGlassLocked') || 'Liquid Glass 主题不支持自定义强调色');
        return;
    }
    updateTempSetting('accentColor', color);
    document.documentElement.style.setProperty('--ls-accent', color);
    
    // 更新选中状态
    document.querySelectorAll('.ls-color-item').forEach(item => {
        item.classList.remove('is-active');
    });
    event.target.classList.add('is-active');
}

// pickCustomColor 函数 - 自定义颜色选择
function pickCustomColor(index) {
    const colorPicker = document.getElementById('colorPicker');
    if (!colorPicker) return;
    
    colorPicker.onchange = function() {
        const color = this.value;
        const customColors = [...(tempSettings.customColors || settings.customColors)];
        customColors[index - 1] = color;
        updateTempSetting('customColors', customColors);
        
        // 更新显示
        const customColorDiv = document.getElementById(`customColor${index}`);
        if (customColorDiv) {
            customColorDiv.style.backgroundColor = color;
            customColorDiv.textContent = '';
            customColorDiv.onclick = () => setAccentColor(color);
        }
    };
    
    colorPicker.click();
}

// clearLogo 函数 - 清除自定义Logo
function clearLogo() {
    updateTempSetting('logoCustom', null);
    const logo = document.getElementById('logo');
    if (logo) {
        logo.style.backgroundImage = 'none';
        logo.textContent = 'LightSearch';
    }
}

// performAcademicSearch 函数 - 执行学术搜索
function performAcademicSearch() {
    const query = document.getElementById('academicInput')?.value.trim();
    if (!query) {
        alert(t('emptySearch') || '请输入搜索关键词');
        return;
    }
    
    const timeFilter = document.getElementById('timeFilter')?.value || 'any';
    performSearch(query, true, timeFilter);
    closePopup('academicPopup');
}

// ========== 修复2: 更新 renderEngines 函数以支持临时设置 ==========
function renderEngines() {
    const container = document.getElementById('engineList');
    if (!container) return;
    
    const engines = tempSettings.engines || settings.engines;
    
    if (!engines || engines.length === 0) {
        container.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">${t('noEngines') || '暂无搜索引擎，请添加'}</p>`;
        return;
    }
    
    container.innerHTML = engines.map((engine, idx) => `
        <div class="ls-engine-item">
            <input type="checkbox" class="ls-checkbox" ${engine.enabled ? 'checked' : ''} 
                   onchange="toggleEngine(${idx})">
            <span class="ls-engine-item__name">${engine.name}</span>
            <span class="ls-engine-item__url">${engine.url}</span>
            <button class="ls-engine-item__delete" onclick="deleteEngine(${idx})">${t('deleteEngine')}</button>
        </div>
    `).join('');
}

// ========== 修复3: 更新 renderAcademicEngines 函数 ==========
function renderAcademicEngines() {
    const container = document.getElementById('academicEngineList');
    if (!container) return;
    
    const engines = settings.academicEngines || [];
    
    if (engines.length === 0) {
        container.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">${t('noAcademicEngines') || '暂无学术搜索引擎'}</p>`;
        return;
    }
    
    container.innerHTML = engines.map((engine, idx) => `
        <div class="ls-engine-item">
            <input type="checkbox" class="ls-checkbox" ${engine.enabled ? 'checked' : ''} 
                   onchange="toggleAcademicEngine(${idx})">
            <span class="ls-engine-item__name">${engine.name}</span>
            <span class="ls-engine-item__url">${engine.url}</span>
        </div>
    `).join('');
}

// toggleAcademicEngine 函数
function toggleAcademicEngine(idx) {
    if (!settings.academicEngines[idx]) return;
    settings.academicEngines[idx].enabled = !settings.academicEngines[idx].enabled;
    storage.set('academicEngines', settings.academicEngines);
}

// ========== 修复4: 更新 deleteEngine 和 toggleEngine 以支持临时设置 ==========
function deleteEngine(idx) {
    const engines = [...(tempSettings.engines || settings.engines)];
    engines.splice(idx, 1);
    updateTempSetting('engines', engines);
    renderEngines();
}

function toggleEngine(idx) {
    const engines = [...(tempSettings.engines || settings.engines)];
    if (!engines[idx]) return;
    engines[idx].enabled = !engines[idx].enabled;
    updateTempSetting('engines', engines);
    renderEngines();
}

// ========== 修复5: 更新 bindEvents 函数以绑定所有设置控件 ==========
function bindSettingsEvents() {
    // 主题选择
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            updateTempSetting('theme', e.target.value);
            applyTheme(e.target.value);
        });
    }
    
    // 暗黑模式
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', (e) => {
            updateTempSetting('darkMode', e.target.checked);
            document.body.classList.toggle('theme-dark', e.target.checked);
        });
    }
    
    // 毛玻璃效果
    const blurSlider = document.getElementById('blurSlider');
    if (blurSlider) {
        blurSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            updateTempSetting('blurLevel', parseInt(value));
            document.documentElement.style.setProperty('--ls-blur', value + 'px');
            updateSliderValue('blurValue', value);
        });
    }
    
    // 视频音量
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            updateTempSetting('videoVolume', parseInt(value));
            updateSliderValue('volumeValue', value);
            
            const bgVideo = document.getElementById('backgroundVideo');
            if (bgVideo) {
                bgVideo.volume = value / 100;
            }
        });
    }
    
    // Logo打字机动画
    const logoTypingSwitch = document.getElementById('logoTypingSwitch');
    if (logoTypingSwitch) {
        logoTypingSwitch.addEventListener('change', (e) => {
            updateTempSetting('logoTyping', e.target.checked);
        });
    }
    
    // 背景图片上传
    const bgImageInput = document.getElementById('bgImageInput');
    if (bgImageInput) {
        bgImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) uploadImageBackground(file);
        });
    }
    
    // 背景视频上传
    const bgVideoInput = document.getElementById('bgVideoInput');
    if (bgVideoInput) {
        bgVideoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) uploadVideoBackground(file);
        });
    }
    
    // Logo上传
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                updateTempSetting('logoCustom', event.target.result);
                const logo = document.getElementById('logo');
                if (logo) {
                    logo.style.backgroundImage = `url(${event.target.result})`;
                    logo.textContent = '';
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 语言选择
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });
    }
}

// ========== 修复6: 更新 loadSettingsUI 以加载学术引擎 ==========
function loadSettingsUI() {
    // 加载当前设置到UI
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) darkModeSwitch.checked = settings.darkMode;
    
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = settings.theme;
    
    const blurSlider = document.getElementById('blurSlider');
    if (blurSlider) {
        blurSlider.value = settings.blurLevel;
        updateSliderValue('blurValue', settings.blurLevel);
    }
    
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.value = settings.videoVolume;
        updateSliderValue('volumeValue', settings.videoVolume);
    }
    
    const logoTypingSwitch = document.getElementById('logoTypingSwitch');
    if (logoTypingSwitch) logoTypingSwitch.checked = settings.logoTyping;
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    // 渲染引擎列表
    renderEngines();
    renderAcademicEngines();
    
    // 绑定设置事件
    bindSettingsEvents();
}

console.log('✅ 修复脚本已加载');
