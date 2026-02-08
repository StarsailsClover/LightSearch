/*
LightSearch - 增强版脚本
Copyright (C) 2025 Sails
遵循GNU GPLv3许可证
*/

// ========== 多语言支持 ==========
// 定义多语言翻译数据，包括英语、中文、日语、韩语和俄语
const LANG_DATA = {
    en: {
        searchPlaceholder: 'Enter search keywords...',
        searchButton: 'Search',
        settingsButton: 'Settings',
        academicButton: 'Academic Search',
        historyTitle: 'Search History',
        noHistory: 'No search history',
        settingsTitle: 'Settings',
        academicTitle: 'Academic Search',
        closeButton: 'Close',
        saveButton: 'Save',
        cancelButton: 'Cancel',
        enginesTitle: 'Search Engines',
        addEngine: 'Add',
        deleteEngine: 'Delete',
        personalizationTitle: 'Personalization',
        themeTitle: 'Theme',
        themeClassic: 'LightSearch Classic',
        themeLiquidGlass: 'Liquid Glass',
        darkMode: 'Dark Mode',
        accentColor: 'Accent Color',
        customColors: 'Custom Colors',
        backgroundTitle: 'Background',
        uploadImage: 'Upload Image',
        uploadVideo: 'Upload Video',
        clearBackground: 'Clear',
        blurEffect: 'Blur Effect',
        videoVolume: 'Volume',
        videoQuality: 'Quality',
        logoTitle: 'Logo',
        logoTyping: 'Typing Animation',
        uploadLogo: 'Upload Logo',
        languageTitle: 'Language',
        timeFilter: 'Publication Time',
        timeAny: 'Any Time',
        time1y: 'Past Year',
        time5y: 'Past 5 Years',
        time10y: 'Past 10 Years',
        unsavedChanges: 'You have unsaved changes. Save before closing?'
    },
    zh: {
        searchPlaceholder: '输入搜索关键词...',
        searchButton: '搜索',
        settingsButton: '设置',
        academicButton: '学术搜索',
        historyTitle: '搜索历史',
        noHistory: '暂无搜索历史',
        settingsTitle: '设置',
        academicTitle: '学术搜索',
        closeButton: '关闭',
        saveButton: '保存',
        cancelButton: '取消',
        enginesTitle: '搜索引擎',
        addEngine: '添加',
        deleteEngine: '删除',
        personalizationTitle: '个性化',
        themeTitle: '主题',
        themeClassic: 'LightSearch Classic',
        themeLiquidGlass: 'Liquid Glass',
        darkMode: '暗黑模式',
        accentColor: '强调色',
        customColors: '自定义颜色',
        backgroundTitle: '背景',
        uploadImage: '上传图片',
        uploadVideo: '上传视频',
        clearBackground: '清除',
        blurEffect: '毛玻璃效果',
        videoVolume: '音量',
        videoQuality: '质量',
        logoTitle: 'Logo',
        logoTyping: '打字机动画',
        uploadLogo: '上传Logo',
        languageTitle: '语言',
        timeFilter: '发表时间',
        timeAny: '不限',
        time1y: '近1年',
        time5y: '近5年',
        time10y: '近10年',
        unsavedChanges: '您有未保存的更改，是否在关闭前保存？'
    },
    ja: {
        searchPlaceholder: '検索キーワードを入力...',
        searchButton: '検索',
        settingsButton: '設定',
        academicButton: '学術検索',
        historyTitle: '検索履歴',
        noHistory: '検索履歴がありません',
        settingsTitle: '設定',
        academicTitle: '学術検索',
        closeButton: '閉じる',
        saveButton: '保存',
        cancelButton: 'キャンセル',
        enginesTitle: '検索エンジン',
        addEngine: '追加',
        deleteEngine: '削除',
        personalizationTitle: 'パーソナライゼーション',
        themeTitle: 'テーマ',
        themeClassic: 'LightSearch Classic',
        themeLiquidGlass: 'Liquid Glass',
        darkMode: 'ダークモード',
        accentColor: 'アクセントカラー',
        customColors: 'カスタムカラー',
        backgroundTitle: '背景',
        uploadImage: '画像をアップロード',
        uploadVideo: '動画をアップロード',
        clearBackground: 'クリア',
        blurEffect: 'ぼかし効果',
        videoVolume: '音量',
        videoQuality: '品質',
        logoTitle: 'ロゴ',
        logoTyping: 'タイピングアニメーション',
        uploadLogo: 'ロゴをアップロード',
        languageTitle: '言語',
        timeFilter: '公開時期',
        timeAny: 'すべて',
        time1y: '過去1年',
        time5y: '過去5年',
        time10y: '過去10年',
        unsavedChanges: '保存されていない変更があります。閉じる前に保存しますか？'
    },
    ko: {
        searchPlaceholder: '검색 키워드 입력...',
        searchButton: '검색',
        settingsButton: '설정',
        academicButton: '학술 검색',
        historyTitle: '검색 기록',
        noHistory: '검색 기록이 없습니다',
        settingsTitle: '설정',
        academicTitle: '학술 검색',
        closeButton: '닫기',
        saveButton: '저장',
        cancelButton: '취소',
        enginesTitle: '검색 엔진',
        addEngine: '추가',
        deleteEngine: '삭제',
        personalizationTitle: '개인화',
        themeTitle: '테마',
        themeClassic: 'LightSearch Classic',
        themeLiquidGlass: 'Liquid Glass',
        darkMode: '다크 모드',
        accentColor: '강조 색상',
        customColors: '사용자 지정 색상',
        backgroundTitle: '배경',
        uploadImage: '이미지 업로드',
        uploadVideo: '동영상 업로드',
        clearBackground: '지우기',
        blurEffect: '흐림 효과',
        videoVolume: '볼륨',
        videoQuality: '품질',
        logoTitle: '로고',
        logoTyping: '타이핑 애니메이션',
        uploadLogo: '로고 업로드',
        languageTitle: '언어',
        timeFilter: '발행 시기',
        timeAny: '전체',
        time1y: '최근 1년',
        time5y: '최근 5년',
        time10y: '최근 10년',
        unsavedChanges: '저장되지 않은 변경사항이 있습니다. 닫기 전에 저장하시겠습니까?'
    },
    ru: {
        searchPlaceholder: 'Введите ключевые слова...',
        searchButton: 'Поиск',
        settingsButton: 'Настройки',
        academicButton: 'Академический поиск',
        historyTitle: 'История поиска',
        noHistory: 'Нет истории поиска',
        settingsTitle: 'Настройки',
        academicTitle: 'Академический поиск',
        closeButton: 'Закрыть',
        saveButton: 'Сохранить',
        cancelButton: 'Отмена',
        enginesTitle: 'Поисковые системы',
        addEngine: 'Добавить',
        deleteEngine: 'Удалить',
        personalizationTitle: 'Персонализация',
        themeTitle: 'Тема',
        themeClassic: 'LightSearch Classic',
        themeLiquidGlass: 'Liquid Glass',
        darkMode: 'Темный режим',
        accentColor: 'Акцентный цвет',
        customColors: 'Пользовательские цвета',
        backgroundTitle: 'Фон',
        uploadImage: 'Загрузить изображение',
        uploadVideo: 'Загрузить видео',
        clearBackground: 'Очистить',
        blurEffect: 'Эффект размытия',
        videoVolume: 'Громкость',
        videoQuality: 'Качество',
        logoTitle: 'Логотип',
        logoTyping: 'Анимация печати',
        uploadLogo: 'Загрузить логотип',
        languageTitle: 'Язык',
        timeFilter: 'Время публикации',
        timeAny: 'Любое время',
        time1y: 'За последний год',
        time5y: 'За последние 5 лет',
        time10y: 'За последние 10 лет',
        unsavedChanges: 'У вас есть несохраненные изменения. Сохранить перед закрытием?'
    }
};

// 获取当前语言，优先从本地存储获取，否则使用浏览器默认语言
let currentLang = localStorage.getItem('ls-language') || navigator.language.slice(0, 2) || 'en';
if (!LANG_DATA[currentLang]) currentLang = 'en';

// 翻译函数，根据当前语言返回对应文本
function t(key) {
    return LANG_DATA[currentLang]?.[key] || LANG_DATA.en[key] || key;
}

// ========== 数据存储 ==========
// 本地存储工具函数，用于保存和读取数据
const storage = {
    get: (key) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// ========== 设置管理 ==========
// 临时设置对象，用于存储未保存的更改
let tempSettings = {}; // 临时设置（未保存）
// 标志变量，指示是否存在未保存的更改
let hasUnsavedChanges = false;

// 加载设置，从本地存储获取用户配置，如果不存在则使用默认值
function loadSettings() {
    return {
        theme: storage.get('theme') || 'classic',
        darkMode: storage.get('darkMode') || false,
        accentColor: storage.get('accentColor') || '#4285f4',
        customColors: storage.get('customColors') || ['', '', '', '', ''],
        background: storage.get('background') || null,
        backgroundType: storage.get('backgroundType') || 'none',
        blurLevel: storage.get('blurLevel') || 0,
        videoVolume: storage.get('videoVolume') || 50,
        videoQuality: storage.get('videoQuality') || 'auto',
        logoTyping: storage.get('logoTyping') || false,
        logoCustom: storage.get('logoCustom') || null,
        engines: storage.get('engines') || [
            { name: 'Google', url: 'https://www.google.com/search?q={query}', enabled: true },
            { name: 'Bing', url: 'https://www.bing.com/search?q={query}', enabled: true },
            { name: 'Baidu', url: 'https://www.baidu.com/s?ie=utf-8&word={query}', enabled: true }
        ],
        academicEngines: storage.get('academicEngines') || [
            { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q={query}', enabled: true },
            { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={query}', enabled: true },
            { name: 'arXiv', url: 'https://arxiv.org/search/?query={query}', enabled: true }
        ],
        history: storage.get('history') || []
    };
}

// 当前生效的设置
let settings = loadSettings();

// 保存设置，将临时设置应用到当前设置并保存到本地存储
function saveSettings() {
    Object.keys(tempSettings).forEach(key => {
        settings[key] = tempSettings[key];
        storage.set(key, tempSettings[key]);
    });
    
    applyAllSettings();
    hasUnsavedChanges = false;
    tempSettings = {};
    
    // 显示保存成功提示
    showToast(t('saveButton') + ' ✓', 'success');
}

// 取消设置更改，丢弃未保存的更改并关闭设置弹窗
function cancelSettings() {
    if (hasUnsavedChanges) {
        if (confirm(t('unsavedChanges'))) {
            saveSettings();
            return;
        }
    }
    tempSettings = {};
    hasUnsavedChanges = false;
    closePopup('settingsPopup');
}

// closeSettings 别名函数，用于HTML中的onclick调用
function closeSettings() {
    cancelSettings();
}

// 更新临时设置，将更改保存到临时设置对象
function updateTempSetting(key, value) {
    tempSettings[key] = value;
    hasUnsavedChanges = true;
}

// 应用所有设置，将当前设置应用到页面
function applyAllSettings() {
    // 应用主题
    applyTheme(settings.theme);
    
    // 应用暗黑模式
    document.body.classList.toggle('theme-dark', settings.darkMode);
    
    // 应用强调色
    document.documentElement.style.setProperty('--ls-accent', settings.accentColor);
    
    // 应用背景
    applyBackground();
    
    // 应用毛玻璃
    document.documentElement.style.setProperty('--ls-blur', settings.blurLevel + 'px');
    
    // 应用Logo动画
    const logo = document.querySelector('.ls-logo');
    if (logo) {
        logo.classList.toggle('typing', settings.logoTyping);
    }
}

// ========== 主题管理 ==========
// 应用主题，根据参数切换不同的视觉主题
function applyTheme(theme) {
    document.body.classList.remove('theme-liquid-glass');
    
    if (theme === 'liquid-glass') {
        document.body.classList.add('theme-liquid-glass');
        // Liquid Glass 锁定强调色
        document.documentElement.style.setProperty('--ls-accent', '#ffffff');
    } else {
        // Classic 主题使用用户自定义强调色
        document.documentElement.style.setProperty('--ls-accent', settings.accentColor);
    }
}

// ========== 背景管理 ==========
// 应用背景，根据设置应用图像或视频背景
function applyBackground() {
    const bgLayer = document.getElementById('backgroundLayer');
    if (!bgLayer) return;
    
    const bgVideo = document.getElementById('backgroundVideo');
    
    if (settings.backgroundType === 'image' && settings.background) {
        bgLayer.style.backgroundImage = `url(${settings.background})`;
        if (bgVideo) bgVideo.style.display = 'none';
    } else if (settings.backgroundType === 'video' && settings.background) {
        bgLayer.style.backgroundImage = 'none';
        if (bgVideo) {
            bgVideo.src = settings.background;
            bgVideo.volume = settings.videoVolume / 100;
            bgVideo.style.display = 'block';
            bgVideo.play();
        }
    } else {
        bgLayer.style.backgroundImage = 'none';
        if (bgVideo) bgVideo.style.display = 'none';
    }
}

// 上传图片背景，处理用户上传的背景图片
function uploadImageBackground(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        updateTempSetting('background', e.target.result);
        updateTempSetting('backgroundType', 'image');
        
        // 预览
        const bgLayer = document.getElementById('backgroundLayer');
        if (bgLayer) {
            bgLayer.style.backgroundImage = `url(${e.target.result})`;
        }
    };
    reader.readAsDataURL(file);
}

// 上传视频背景，处理用户上传的背景视频
function uploadVideoBackground(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        updateTempSetting('background', e.target.result);
        updateTempSetting('backgroundType', 'video');
        
        // 预览
        const bgVideo = document.getElementById('backgroundVideo');
        if (bgVideo) {
            bgVideo.src = e.target.result;
            bgVideo.volume = (tempSettings.videoVolume || settings.videoVolume) / 100;
            bgVideo.style.display = 'block';
            bgVideo.play();
        }
    };
    reader.readAsDataURL(file);
}

// 清除背景，移除当前设置的背景图像或视频
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

// ========== 弹窗拖动 ==========
// 使弹窗可拖动，允许用户通过鼠标拖拽移动弹窗位置
function makeDraggable(popup) {
    const header = popup.querySelector('.ls-popup__header');
    if (!header) return;
    
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.ls-popup__close')) return;
        
        isDragging = true;
        initialX = e.clientX - (popup.offsetLeft || 0);
        initialY = e.clientY - (popup.offsetTop || 0);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    });
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        popup.style.left = currentX + 'px';
        popup.style.top = currentY + 'px';
        popup.style.transform = 'none';
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    // 双击重置位置
    header.addEventListener('dblclick', () => {
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
    });
}

// ========== 弹窗管理 ==========
// 打开指定ID的弹窗，显示弹窗并应用拖动功能
function openPopup(id) {
    const popup = document.getElementById(id);
    const overlay = document.querySelector('.ls-popup-overlay');
    
    if (popup && overlay) {
        overlay.classList.add('is-active');
        popup.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        
        // 初始化拖动
        makeDraggable(popup);
    }
}

// 关闭指定ID的弹窗，处理未保存的更改确认
function closePopup(id) {
    if (hasUnsavedChanges) {
        if (confirm(t('unsavedChanges'))) {
            saveSettings();
        } else {
            tempSettings = {};
            hasUnsavedChanges = false;
        }
    }
    
    const popup = document.getElementById(id);
    const overlay = document.querySelector('.ls-popup-overlay');
    
    if (popup && overlay) {
        popup.classList.remove('is-active');
        
        // 检查是否还有其他打开的弹窗
        const activePopups = document.querySelectorAll('.ls-popup.is-active');
        if (activePopups.length === 0) {
            overlay.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }
}

// ========== 搜索引擎管理 ==========
// 渲染搜索引擎列表，显示当前配置的搜索引擎
function renderEngines() {
    const container = document.getElementById('engineList');
    if (!container) return;
    
    container.innerHTML = settings.engines.map((engine, idx) => `
        <div class="ls-engine-item">
            <input type="checkbox" class="ls-checkbox" ${engine.enabled ? 'checked' : ''} 
                   onchange="toggleEngine(${idx})">
            <span class="ls-engine-item__name">${engine.name}</span>
            <span class="ls-engine-item__url">${engine.url}</span>
            <button class="ls-engine-item__delete" onclick="deleteEngine(${idx})">${t('deleteEngine')}</button>
        </div>
    `).join('');
}

// 添加新的搜索引擎
function addEngine() {
    const input = document.getElementById('newEngine');
    const url = input.value.trim();
    
    if (!url) return;
    if (!url.includes('{query}')) {
        alert('请包含 {query} 作为关键词占位符');
        return;
    }
    
    const name = prompt('引擎名称：');
    if (!name) return;
    
    settings.engines.push({ name, url, enabled: true });
    storage.set('engines', settings.engines);
    renderEngines();
    input.value = '';
}

// 删除指定索引的搜索引擎
function deleteEngine(idx) {
    settings.engines.splice(idx, 1);
    storage.set('engines', settings.engines);
    renderEngines();
}

// 切换指定索引的搜索引擎启用状态
function toggleEngine(idx) {
    settings.engines[idx].enabled = !settings.engines[idx].enabled;
    storage.set('engines', settings.engines);
}

// ========== 搜索历史 ==========
// 渲染搜索历史，显示最近的搜索记录
function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;
    
    if (settings.history.length === 0) {
        container.innerHTML = `<p style="color: #666; font-size: 0.9rem;">${t('noHistory')}</p>`;
        return;
    }
    
    container.innerHTML = `
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">${t('historyTitle')}:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${settings.history.slice(0, 10).map(item => `
                <span class="ls-history__item" onclick="document.getElementById('searchInput').value='${item}'">${item}</span>
            `).join('')}
        </div>
    `;
}

// ========== 搜索功能 ==========
// 执行搜索，打开配置的搜索引擎结果页面
function performSearch(query, isAcademic = false) {
    if (!query) {
        alert(t('emptySearch') || '请输入搜索关键词');
        return;
    }
    
    // 添加到历史
    settings.history = settings.history.filter(item => item !== query);
    settings.history.unshift(query);
    if (settings.history.length > 50) {
        settings.history = settings.history.slice(0, 50);
    }
    storage.set('history', settings.history);
    renderHistory();
    
    // 执行搜索
    const engineList = isAcademic ? settings.academicEngines : settings.engines;
    const enabledEngines = engineList.filter(e => e.enabled);
    
    enabledEngines.forEach(engine => {
        const url = engine.url.replace('{query}', encodeURIComponent(query));
        window.open(url, '_blank');
    });
}

// ========== Toast 提示 ==========
// 显示Toast通知，提供用户操作反馈
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `ls-toast ls-toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#4caf50' : '#4285f4'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ========== 语言管理 ==========
// 应用当前语言设置，更新页面上的所有文本
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
    
    const settingsTitle = document.querySelector('#settingsPopup h2');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');
    
    const academicTitle = document.querySelector('#academicPopup h2');
    if (academicTitle) academicTitle.textContent = t('academicTitle');
    
    const academicInput = document.getElementById('academicInput');
    if (academicInput) academicInput.placeholder = t('searchPlaceholder');
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    // 更新保存/取消按钮
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) saveBtn.textContent = t('saveButton');
    
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    if (cancelBtn) cancelBtn.textContent = t('cancelButton');
    
    renderHistory();
    renderEngines();
}

// 切换语言，更新当前语言设置并应用
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ls-language', lang);
    applyLanguage();
}

// ========== 初始化 ==========
// 页面加载完成后的初始化函数，设置所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 应用语言
    applyLanguage();
    
    // 应用所有设置
    applyAllSettings();
    
    // 渲染界面
    renderEngines();
    renderHistory();
    
    // 绑定事件
    bindEvents();
    
    // Logo 打字机效果
    if (settings.logoTyping) {
        initTypingEffect();
    }
    
    console.log('✨ LightSearch Enhanced initialized');
});

// 绑定所有事件监听器
function bindEvents() {
    // 搜索
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.trim();
        performSearch(query);
    });
    
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value.trim());
        }
    });
    
    // 设置
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        openPopup('settingsPopup');
        loadSettingsUI();
    });
    
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);
    document.getElementById('cancelSettingsBtn')?.addEventListener('click', cancelSettings);
    
    // 学术搜索
    document.getElementById('academicBtn')?.addEventListener('click', () => {
        openPopup('academicPopup');
    });
    
    document.getElementById('academicSearchBtn')?.addEventListener('click', () => {
        const query = document.getElementById('academicInput').value.trim();
        performSearch(query, true);
        closePopup('academicPopup');
    });
    
    // 添加引擎
    document.getElementById('addEngineBtn')?.addEventListener('click', addEngine);
    
    // 遮罩层点击关闭
    document.querySelector('.ls-popup-overlay')?.addEventListener('click', () => {
        closePopup('settingsPopup');
        closePopup('academicPopup');
    });
    
    // ESC 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup('settingsPopup');
            closePopup('academicPopup');
        }
    });
}

// 加载设置UI，将当前设置同步到设置弹窗界面
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
    
    // 渲染强调色
    renderAccentColors();
}

// 渲染强调色选择器，创建颜色选择界面
function renderAccentColors() {
    const container = document.getElementById('accentColorPicker');
    if (!container) return;
    
    const defaultColors = ['#4285f4', '#ea4335', '#34a853', '#fbbc04', '#9c27b0'];
    
    container.innerHTML = defaultColors.map(color => `
        <div class="ls-color-item ${settings.accentColor === color ? 'is-active' : ''}" 
             style="background-color: ${color};"
             onclick="selectAccentColor('${color}')"></div>
    `).join('') + settings.customColors.map((color, idx) => 
        color ? `
            <div class="ls-color-item ${settings.accentColor === color ? 'is-active' : ''}" 
                 style="background-color: ${color};"
                 onclick="selectAccentColor('${color}')"></div>
        ` : `
            <div class="ls-color-item ls-color-item--custom" 
                 onclick="addCustomColor(${idx})">+</div>
        `
    ).join('');
}

// 选择强调色，设置新的强调色并更新界面
function selectAccentColor(color) {
    if (settings.theme === 'liquid-glass') {
        alert('Liquid Glass 主题不支持自定义强调色');
        return;
    }
    updateTempSetting('accentColor', color);
    document.documentElement.style.setProperty('--ls-accent', color);
    renderAccentColors();
}

// 添加自定义颜色，允许用户添加自己的颜色
function addCustomColor(idx) {
    const color = prompt('请输入颜色代码（例如：#ff0000）：');
    if (!color) return;
    
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        alert('无效的颜色代码');
        return;
    }
    
    const customColors = [...settings.customColors];
    customColors[idx] = color;
    updateTempSetting('customColors', customColors);
    renderAccentColors();
}

// 更新滑块显示值，同步滑块数值到对应的文本显示
function updateSliderValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

// Logo 打字机效果，为Logo添加动态打字效果
function initTypingEffect() {
    const logo = document.querySelector('.ls-logo');
    if (!logo) return;
    
    const text = 'LightSearch';
    let index = 0;
    logo.textContent = '';
    logo.classList.add('typing');
    
    function type() {
        if (index < text.length) {
            logo.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150);
        } else {
            setTimeout(() => {
                logo.classList.remove('typing');
            }, 500);
        }
    }
    
    type();
}

// ========== 工具函数 ==========
// 检测设备类型，判断是否为Mac或iOS设备
function isMacOrIOS() {
    const ua = navigator.userAgent;
    return /Mac|iPhone|iPad|iPod/.test(ua);
}

// 页面加载时自动应用 Liquid Glass（Mac/iOS）
if (isMacOrIOS() && !storage.get('theme')) {
    settings.theme = 'liquid-glass';
    storage.set('theme', 'liquid-glass');
}
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
