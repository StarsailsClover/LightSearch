// ========== 缺失函数补丁 ==========
// 将此文件内容添加到 script-new.js 文件末尾

// setAccentColor 函数 - 修复强调色设置（HTML中使用）
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
    if (event && event.target) {
        event.target.classList.add('is-active');
    }
}

// pickCustomColor 函数 - 自定义颜色选择（HTML中使用）
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
            customColorDiv.classList.remove('ls-color-item--custom');
            customColorDiv.onclick = () => setAccentColor(color);
        }
    };
    
    colorPicker.click();
}

// clearBackground 函数 - 清除背景（HTML中使用）
function clearBackground() {
    updateTempSetting('background', null);
    updateTempSetting('backgroundType', 'none');
    
    const bgLayer = document.getElementById('backgroundLayer');
    if (bgLayer) {
        bgLayer.style.backgroundImage = 'none';
    }
    
    const bgVideo = document.getElementById('backgroundVideo');
    if (bgVideo) {
        bgVideo.style.display = 'none';
        bgVideo.src = '';
    }
}

// clearLogo 函数 - 清除自定义Logo（HTML中使用）
function clearLogo() {
    updateTempSetting('logoCustom', null);
    const logo = document.getElementById('logo');
    if (logo) {
        logo.style.backgroundImage = 'none';
        logo.textContent = 'LightSearch';
    }
}

// performAcademicSearch 函数 - 执行学术搜索（HTML中使用）
function performAcademicSearch() {
    const query = document.getElementById('academicInput')?.value.trim();
    if (!query) {
        alert(t('emptySearch') || '请输入搜索关键词');
        return;
    }
    
    performSearch(query, true);
    closePopup('academicPopup');
}

// renderAcademicEngines 函数 - 渲染学术搜索引擎列表
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

// toggleAcademicEngine 函数 - 切换学术引擎启用状态
function toggleAcademicEngine(idx) {
    if (!settings.academicEngines[idx]) return;
    settings.academicEngines[idx].enabled = !settings.academicEngines[idx].enabled;
    storage.set('academicEngines', settings.academicEngines);
}

// ========== 修复现有函数 ==========

// 修复 addEngine 函数 - 使用正确的输入框ID
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
    
    const engines = [...(tempSettings.engines || settings.engines)];
    engines.push({ name, url, enabled: true });
    updateTempSetting('engines', engines);
    renderEngines();
    input.value = '';
}

// 修复 deleteEngine 函数 - 支持临时设置
function deleteEngine(idx) {
    const engines = [...(tempSettings.engines || settings.engines)];
    engines.splice(idx, 1);
    updateTempSetting('engines', engines);
    renderEngines();
}

// 修复 toggleEngine 函数 - 支持临时设置
function toggleEngine(idx) {
    const engines = [...(tempSettings.engines || settings.engines)];
    if (!engines[idx]) return;
    engines[idx].enabled = !engines[idx].enabled;
    updateTempSetting('engines', engines);
    renderEngines();
}

// 修复 renderEngines 函数 - 支持临时设置和空列表
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

// 修复 loadSettingsUI 函数 - 添加学术引擎渲染和事件绑定
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

// bindSettingsEvents 函数 - 绑定所有设置控件事件
function bindSettingsEvents() {
    // 主题选择
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.removeEventListener('change', themeChangeHandler);
        themeSelect.addEventListener('change', themeChangeHandler);
    }
    
    // 暗黑模式
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.removeEventListener('change', darkModeChangeHandler);
        darkModeSwitch.addEventListener('change', darkModeChangeHandler);
    }
    
    // 毛玻璃效果
    const blurSlider = document.getElementById('blurSlider');
    if (blurSlider) {
        blurSlider.removeEventListener('input', blurChangeHandler);
        blurSlider.addEventListener('input', blurChangeHandler);
    }
    
    // 视频音量
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.removeEventListener('input', volumeChangeHandler);
        volumeSlider.addEventListener('input', volumeChangeHandler);
    }
    
    // Logo打字机动画
    const logoTypingSwitch = document.getElementById('logoTypingSwitch');
    if (logoTypingSwitch) {
        logoTypingSwitch.removeEventListener('change', logoTypingChangeHandler);
        logoTypingSwitch.addEventListener('change', logoTypingChangeHandler);
    }
    
    // 背景图片上传
    const bgImageInput = document.getElementById('bgImageInput');
    if (bgImageInput) {
        bgImageInput.removeEventListener('change', bgImageChangeHandler);
        bgImageInput.addEventListener('change', bgImageChangeHandler);
    }
    
    // 背景视频上传
    const bgVideoInput = document.getElementById('bgVideoInput');
    if (bgVideoInput) {
        bgVideoInput.removeEventListener('change', bgVideoChangeHandler);
        bgVideoInput.addEventListener('change', bgVideoChangeHandler);
    }
    
    // Logo上传
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.removeEventListener('change', logoChangeHandler);
        logoInput.addEventListener('change', logoChangeHandler);
    }
    
    // 语言选择
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.removeEventListener('change', langChangeHandler);
        langSelect.addEventListener('change', langChangeHandler);
    }
}

// 事件处理函数
function themeChangeHandler(e) {
    updateTempSetting('theme', e.target.value);
    applyTheme(e.target.value);
}

function darkModeChangeHandler(e) {
    updateTempSetting('darkMode', e.target.checked);
    document.body.classList.toggle('theme-dark', e.target.checked);
}

function blurChangeHandler(e) {
    const value = e.target.value;
    updateTempSetting('blurLevel', parseInt(value));
    document.documentElement.style.setProperty('--ls-blur', value + 'px');
    updateSliderValue('blurValue', value);
}

function volumeChangeHandler(e) {
    const value = e.target.value;
    updateTempSetting('videoVolume', parseInt(value));
    updateSliderValue('volumeValue', value);
    
    const bgVideo = document.getElementById('backgroundVideo');
    if (bgVideo) {
        bgVideo.volume = value / 100;
    }
}

function logoTypingChangeHandler(e) {
    updateTempSetting('logoTyping', e.target.checked);
}

function bgImageChangeHandler(e) {
    const file = e.target.files[0];
    if (file) uploadImageBackground(file);
}

function bgVideoChangeHandler(e) {
    const file = e.target.files[0];
    if (file) uploadVideoBackground(file);
}

function logoChangeHandler(e) {
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
}

function langChangeHandler(e) {
    switchLanguage(e.target.value);
}

// 修复 applyLanguage 函数 - 添加更多翻译
function applyLanguage() {
    document.title = t('title') || 'LightSearch';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    
    // 更新所有文本元素
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = t('searchButton');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.textContent = t('settingsButton');
    
    const academicBtn = document.getElementById('academicBtn');
    if (academicBtn) academicBtn.textContent = t('academicButton');
    
    // 更新设置弹窗
    const settingsTitle = document.querySelector('#settingsPopup .ls-popup__title');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');
    
    // 更新学术搜索弹窗
    const academicTitle = document.querySelector('#academicPopup .ls-popup__title');
    if (academicTitle) academicTitle.textContent = t('academicTitle');
    
    const academicInput = document.getElementById('academicInput');
    if (academicInput) academicInput.placeholder = t('searchPlaceholder');
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    // 更新按钮文本
    const saveButtons = document.querySelectorAll('.ls-btn--primary');
    saveButtons.forEach(btn => {
        if (btn.textContent.includes('Save') || btn.textContent.includes('保存')) {
            btn.textContent = t('saveButton');
        }
    });
    
    const cancelButtons = document.querySelectorAll('.ls-btn--secondary');
    cancelButtons.forEach(btn => {
        if (btn.textContent.includes('Cancel') || btn.textContent.includes('取消')) {
            btn.textContent = t('cancelButton');
        }
    });
    
    renderHistory();
    renderEngines();
    renderAcademicEngines();
}

console.log('✅ 缺失函数补丁已加载');
