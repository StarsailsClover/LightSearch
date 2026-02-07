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


// ========== 澧炲己鍔熻兘 ==========
/*
 * LightSearch 综合修复与增强脚本 v2.0
 * 修复所有已知问题并添加新功能
 */

// ========== 错误监视器和错误码体系 ==========
const ErrorMonitor = {
    errors: [],
    errorCodes: {
        // 1xxx: 初始化错误
        E1001: '页面初始化失败',
        E1002: 'DOM元素未找到',
        E1003: '本地存储不可用',
        
        // 2xxx: 设置相关错误
        E2001: '设置加载失败',
        E2002: '设置保存失败',
        E2003: '无效的设置值',
        
        // 3xxx: 搜索引擎错误
        E3001: '搜索引擎列表为空',
        E3002: '无效的搜索引擎URL',
        E3003: '搜索引擎添加失败',
        
        // 4xxx: 国际化错误
        E4001: '语言文件加载失败',
        E4002: '翻译键缺失',
        E4003: '语言切换失败',
        
        // 5xxx: 主题相关错误
        E5001: '主题加载失败',
        E5002: '主题应用失败',
        E5003: 'LiquidGlass初始化失败',
        
        // 6xxx: 文件上传错误
        E6001: '文件读取失败',
        E6002: '不支持的文件格式',
        E6003: '文件大小超限',
        
        // 7xxx: 搜索功能错误
        E7001: '搜索执行失败',
        E7002: '历史记录保存失败',
        E7003: '历史记录加载失败'
    },
    
    log(code, message, details = null) {
        const error = {
            code,
            message: this.errorCodes[code] || '未知错误',
            customMessage: message,
            details,
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        };
        
        this.errors.push(error);
        console.error(`[${code}] ${error.message}:`, message, details);
        
        // 保存到本地存储
        try {
            const savedErrors = JSON.parse(localStorage.getItem('ls-error-log') || '[]');
            savedErrors.push(error);
            // 只保留最近100条错误
            if (savedErrors.length > 100) {
                savedErrors.shift();
            }
            localStorage.setItem('ls-error-log', JSON.stringify(savedErrors));
        } catch (e) {
            console.error('无法保存错误日志:', e);
        }
    },
    
    getErrors() {
        return this.errors;
    },
    
    clearErrors() {
        this.errors = [];
        try {
            localStorage.removeItem('ls-error-log');
        } catch (e) {
            console.error('无法清除错误日志:', e);
        }
    },
    
    getErrorLog() {
        try {
            return JSON.parse(localStorage.getItem('ls-error-log') || '[]');
        } catch (e) {
            return [];
        }
    }
};

// 全局错误处理
window.addEventListener('error', (event) => {
    ErrorMonitor.log('E1001', '全局错误', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorMonitor.log('E1001', 'Promise拒绝未处理', {
        reason: event.reason
    });
});

// ========== LiquidGlass 增强实现 ==========
class LiquidGlassEffect {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.isInitialized = false;
        this.animationId = null;
        this.isDarkMode = false;
        this.sunAngle = 0;
        this.lightIntensity = 1.0;
    }
    
    init() {
        try {
            // 创建 canvas
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'liquidglass-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.insertBefore(this.canvas, document.body.firstChild);
            
            // 初始化 WebGL
            this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true }) 
                   || this.canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
            
            if (!this.gl) {
                throw new Error('WebGL not supported');
            }
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // 编译着色器
            this.compileShaders();
            
            // 计算太阳/月亮角度
            this.updateSunAngle();
            setInterval(() => this.updateSunAngle(), 60000); // 每分钟更新一次
            
            this.isInitialized = true;
            this.startAnimation();
            
            console.log('✨ LiquidGlass effect initialized');
        } catch (error) {
            ErrorMonitor.log('E5003', 'LiquidGlass初始化失败', error);
            console.error('LiquidGlass init failed:', error);
        }
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    compileShaders() {
        // 简化版着色器（完整版太长，这里是基础实现）
        const vertexShaderSrc = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
        
        const fragmentShaderSrc = `
            precision mediump float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_lightAngle;
            uniform float u_lightIntensity;
            uniform bool u_darkMode;
            varying vec2 v_uv;
            
            void main() {
                vec2 uv = v_uv;
                
                // 基础玻璃效果
                float brightness = u_darkMode ? 0.1 : 0.95;
                vec3 glassColor = vec3(brightness);
                
                // 根据光照角度添加渐变
                float gradient = sin(uv.y * 3.14159 + u_lightAngle) * 0.5 + 0.5;
                glassColor += vec3(gradient * 0.1 * u_lightIntensity);
                
                // 添加微妙的噪声
                float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
                glassColor += vec3(noise * 0.02);
                
                gl_FragColor = vec4(glassColor, 0.95);
            }
        `;
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSrc);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSrc);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Program link failed');
        }
        
        this.gl.useProgram(this.program);
        
        // 设置顶点
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    updateSunAngle() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeInHours = hours + minutes / 60;
        
        // 6:00 = 0度 (日出), 12:00 = 90度 (正午), 18:00 = 180度 (日落)
        // 0:00-6:00 和 18:00-24:00 是夜晚
        if (timeInHours >= 6 && timeInHours <= 18) {
            // 白天
            this.sunAngle = ((timeInHours - 6) / 12) * Math.PI;
            this.lightIntensity = Math.sin(this.sunAngle) * 0.5 + 0.5;
            this.isDarkMode = false;
        } else {
            // 夜晚
            this.sunAngle = Math.PI;
            this.lightIntensity = 0.2;
            this.isDarkMode = true;
        }
    }
    
    startAnimation() {
        const animate = (time) => {
            if (!this.isInitialized) return;
            
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            
            // 更新 uniforms
            const u_resolution = this.gl.getUniformLocation(this.program, 'u_resolution');
            const u_time = this.gl.getUniformLocation(this.program, 'u_time');
            const u_lightAngle = this.gl.getUniformLocation(this.program, 'u_lightAngle');
            const u_lightIntensity = this.gl.getUniformLocation(this.program, 'u_lightIntensity');
            const u_darkMode = this.gl.getUniformLocation(this.program, 'u_darkMode');
            
            this.gl.uniform2f(u_resolution, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(u_time, time * 0.001);
            this.gl.uniform1f(u_lightAngle, this.sunAngle);
            this.gl.uniform1f(u_lightIntensity, this.lightIntensity);
            this.gl.uniform1i(u_darkMode, this.isDarkMode ? 1 : 0);
            
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    setDarkMode(isDark) {
        this.isDarkMode = isDark;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.isInitialized = false;
    }
}

// 全局 LiquidGlass 实例
let liquidGlassEffect = null;

// ========== 搜索历史删除功能 ==========
function deleteHistoryItem(query) {
    settings.history = settings.history.filter(item => item !== query);
    storage.set('history', settings.history);
    renderHistory();
}

function clearAllHistory() {
    if (confirm(t('clearHistoryConfirm') || '确定要清除所有搜索历史吗？')) {
        settings.history = [];
        storage.set('history', settings.history);
        renderHistory();
    }
}

// ========== 显示模式管理（替代黑暗模式） ==========
const DisplayModeManager = {
    mode: 'manual', // 'manual' or 'auto'
    isDark: false,
    autoSwitchTimes: {
        light: 6, // 6:00 切换到明亮模式
        dark: 18  // 18:00 切换到黑暗模式
    },
    checkInterval: null,
    
    init() {
        const savedMode = storage.get('displayMode') || 'manual';
        const savedIsDark = storage.get('darkMode') || false;
        const savedTimes = storage.get('autoSwitchTimes') || this.autoSwitchTimes;
        
        this.mode = savedMode;
        this.isDark = savedIsDark;
        this.autoSwitchTimes = savedTimes;
        
        if (this.mode === 'auto') {
            this.startAutoSwitch();
        }
        
        this.apply();
    },
    
    setMode(mode) {
        this.mode = mode;
        storage.set('displayMode', mode);
        
        if (mode === 'auto') {
            this.startAutoSwitch();
            this.checkAndSwitch();
        } else {
            this.stopAutoSwitch();
        }
    },
    
    setDarkMode(isDark) {
        this.isDark = isDark;
        storage.set('darkMode', isDark);
        this.apply();
    },
    
    setAutoSwitchTimes(lightHour, darkHour) {
        this.autoSwitchTimes = { light: lightHour, dark: darkHour };
        storage.set('autoSwitchTimes', this.autoSwitchTimes);
    },
    
    startAutoSwitch() {
        this.stopAutoSwitch();
        this.checkInterval = setInterval(() => {
            this.checkAndSwitch();
        }, 60000); // 每分钟检查一次
    },
    
    stopAutoSwitch() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },
    
    checkAndSwitch() {
        const now = new Date();
        const currentHour = now.getHours();
        
        const shouldBeDark = currentHour >= this.autoSwitchTimes.dark || 
                            currentHour < this.autoSwitchTimes.light;
        
        if (shouldBeDark !== this.isDark) {
            this.setDarkMode(shouldBeDark);
        }
    },
    
    apply() {
        document.body.classList.toggle('theme-dark', this.isDark);
        
        // 如果是 LiquidGlass 模式，只调整亮度和文字颜色
        if (settings.theme === 'liquid-glass') {
            if (liquidGlassEffect) {
                liquidGlassEffect.setDarkMode(this.isDark);
            }
            
            // 调整文字颜色
            document.documentElement.style.setProperty(
                '--ls-text', 
                this.isDark ? '#ffffff' : '#000000'
            );
            
            // 不修改背景颜色，保持透明
            document.documentElement.style.setProperty('--ls-bg', 'transparent');
            document.documentElement.style.setProperty('--ls-card-bg', 'rgba(255, 255, 255, 0.1)');
        } else {
            // Classic 主题正常切换
            if (this.isDark) {
                document.documentElement.style.setProperty('--ls-bg', '#1a1a1a');
                document.documentElement.style.setProperty('--ls-text', '#ffffff');
                document.documentElement.style.setProperty('--ls-card-bg', '#2a2a2a');
            } else {
                document.documentElement.style.setProperty('--ls-bg', '#ffffff');
                document.documentElement.style.setProperty('--ls-text', '#000000');
                document.documentElement.style.setProperty('--ls-card-bg', '#ffffff');
            }
        }
    }
};

// ========== 图片裁剪功能 ==========
class ImageCropper {
    constructor() {
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.cropArea = { x: 0, y: 0, width: 0, height: 0 };
        this.isDragging = false;
        this.callback = null;
    }
    
    open(imageFile, aspectRatio, callback) {
        this.callback = callback;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.image = new Image();
            this.image.onload = () => {
                this.createModal(aspectRatio);
                this.drawImage();
            };
            this.image.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }
    
    createModal(aspectRatio) {
        // 创建模态框
        this.modal = document.createElement('div');
        this.modal.className = 'image-cropper-modal';
        this.modal.innerHTML = `
            <div class="image-cropper-content">
                <h3>${t('cropImage') || '裁剪图片'}</h3>
                <canvas id="cropCanvas"></canvas>
                <div class="image-cropper-controls">
                    <button class="ls-btn ls-btn--secondary" onclick="imageCropper.cancel()">${t('cancelButton')}</button>
                    <button class="ls-btn ls-btn--primary" onclick="imageCropper.confirm()">${t('confirmButton') || '确认'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        this.canvas = document.getElementById('cropCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置 canvas 大小
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.6;
        
        let canvasWidth = this.image.width;
        let canvasHeight = this.image.height;
        
        if (canvasWidth > maxWidth) {
            canvasHeight = (maxWidth / canvasWidth) * canvasHeight;
            canvasWidth = maxWidth;
        }
        
        if (canvasHeight > maxHeight) {
            canvasWidth = (maxHeight / canvasHeight) * canvasWidth;
            canvasHeight = maxHeight;
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // 初始化裁剪区域
        const cropWidth = Math.min(canvasWidth * 0.8, canvasHeight * aspectRatio);
        const cropHeight = cropWidth / aspectRatio;
        
        this.cropArea = {
            x: (canvasWidth - cropWidth) / 2,
            y: (canvasHeight - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight
        };
        
        // 绑定事件
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    }
    
    drawImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制图片
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制遮罩
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 清除裁剪区域
        this.ctx.clearRect(
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
        
        // 重新绘制裁剪区域的图片
        this.ctx.drawImage(
            this.image,
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
        
        // 绘制裁剪框
        this.ctx.strokeStyle = '#4285f4';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height
        );
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否在裁剪区域内
        if (x >= this.cropArea.x && x <= this.cropArea.x + this.cropArea.width &&
            y >= this.cropArea.y && y <= this.cropArea.y + this.cropArea.height) {
            this.isDragging = true;
            this.dragStartX = x - this.cropArea.x;
            this.dragStartY = y - this.cropArea.y;
        }
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.cropArea.x = Math.max(0, Math.min(x - this.dragStartX, this.canvas.width - this.cropArea.width));
        this.cropArea.y = Math.max(0, Math.min(y - this.dragStartY, this.canvas.height - this.cropArea.height));
        
        this.drawImage();
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    confirm() {
        // 创建裁剪后的图片
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = this.cropArea.width;
        croppedCanvas.height = this.cropArea.height;
        
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(
            this.canvas,
            this.cropArea.x,
            this.cropArea.y,
            this.cropArea.width,
            this.cropArea.height,
            0,
            0,
            this.cropArea.width,
            this.cropArea.height
        );
        
        const croppedImage = croppedCanvas.toDataURL('image/png');
        
        if (this.callback) {
            this.callback(croppedImage);
        }
        
        this.close();
    }
    
    cancel() {
        this.close();
    }
    
    close() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.image = null;
    }
}

const imageCropper = new ImageCropper();

console.log('✅ 综合修复脚本已加载');


// ========== HTML鏂囨湰鏇存柊 ==========
/*
 * HTML 动态文本更新脚本
 * 将所有硬编码的英文文本改为通过 JavaScript 动态设置
 */

// 在 DOMContentLoaded 后执行
function updateHTMLTexts() {
    try {
        // 更新设置弹窗中的所有静态文本
        const textsToUpdate = [
            // 设置弹窗
            { selector: '#settingsPopup .ls-settings__section:nth-child(1) .ls-settings__section-title', key: 'enginesTitle' },
            { selector: '#newEngineInput', key: 'addEnginePlaceholder', attr: 'placeholder' },
            { selector: '#settingsPopup .ls-settings__section:nth-child(1) button', key: 'addEngine' },
            
            // 个性化部分
            { selector: '#settingsPopup .ls-settings__section:nth-child(2) .ls-settings__section-title', key: 'personalizationTitle' },
            { selector: '#settingsPopup .ls-settings__item:nth-child(2) .ls-settings__label', key: 'themeTitle' },
            { selector: '#themeSelect option[value="classic"]', key: 'themeClassic' },
            { selector: '#themeSelect option[value="liquid-glass"]', key: 'themeLiquidGlass' },
            { selector: '#settingsPopup .ls-settings__item:nth-child(3) .ls-settings__label', key: 'displayMode' },
            
            // 强调色
            { selector: '#settingsPopup .ls-settings__item:nth-child(4) .ls-settings__label', key: 'accentColor' },
            
            // 背景
            { selector: '#settingsPopup .ls-settings__item:nth-child(5) .ls-settings__label', key: 'backgroundTitle' },
            
            // 语言
            { selector: '#settingsPopup .ls-settings__section:nth-child(3) .ls-settings__section-title', key: 'languageTitle' },
            
            // 学术搜索弹窗
            { selector: '#academicInput', key: 'searchPlaceholder', attr: 'placeholder' },
            { selector: '#academicPopup .ls-settings__section-title', key: 'academicEnginesTitle' }
        ];
        
        textsToUpdate.forEach(({ selector, key, attr }) => {
            const element = document.querySelector(selector);
            if (element) {
                if (attr) {
                    element.setAttribute(attr, t(key));
                } else {
                    element.textContent = t(key);
                }
            }
        });
        
        console.log('✅ HTML texts updated');
    } catch (error) {
        ErrorMonitor.log('E4003', 'HTML文本更新失败', error);
    }
}

// 增强的 applyLanguage 函数
function applyLanguageEnhanced() {
    // 调用原有的 applyLanguage
    if (typeof applyLanguage === 'function') {
        applyLanguage();
    }
    
    // 更新 HTML 中的静态文本
    updateHTMLTexts();
    
    // 更新页面标题
    document.title = t('title') || 'LightSearch - Simple & Elegant Search Aggregator';
    
    // 更新所有按钮文本
    const buttons = {
        '#searchBtn': 'searchButton',
        '#settingsBtn': 'settingsButton',
        '#academicBtn': 'academicButton'
    };
    
    Object.entries(buttons).forEach(([selector, key]) => {
        const btn = document.querySelector(selector);
        if (btn) btn.textContent = t(key);
    });
    
    // 更新弹窗标题
    const popupTitles = {
        '#settingsPopup .ls-popup__title': 'settingsTitle',
        '#academicPopup .ls-popup__title': 'academicTitle'
    };
    
    Object.entries(popupTitles).forEach(([selector, key]) => {
        const title = document.querySelector(selector);
        if (title) title.textContent = t(key);
    });
    
    // 更新弹窗底部按钮
    document.querySelectorAll('.ls-popup__footer .ls-btn--secondary').forEach(btn => {
        if (btn.textContent.includes('Cancel') || btn.textContent.includes('取消')) {
            btn.textContent = t('cancelButton');
        }
    });
    
    document.querySelectorAll('.ls-popup__footer .ls-btn--primary').forEach(btn => {
        if (btn.textContent.includes('Save') || btn.textContent.includes('保存')) {
            btn.textContent = t('saveButton');
        }
    });
    
    // 更新输入框占位符
    const inputs = {
        '#searchInput': 'searchPlaceholder',
        '#academicInput': 'searchPlaceholder',
        '#newEngineInput': 'addEnginePlaceholder'
    };
    
    Object.entries(inputs).forEach(([selector, key]) => {
        const input = document.querySelector(selector);
        if (input) input.placeholder = t(key);
    });
}

// 添加缺失的翻译键
const additionalTranslations = {
    en: {
        displayMode: 'Display Mode',
        displayModeManual: 'Manual',
        displayModeAuto: 'Auto',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        switchTime: 'Switch Time',
        lightSwitchTime: 'Switch to Light',
        darkSwitchTime: 'Switch to Dark',
        clearHistory: 'Clear History',
        clearHistoryConfirm: 'Are you sure you want to clear all search history?',
        deleteHistory: 'Delete',
        cropImage: 'Crop Image',
        confirmButton: 'Confirm',
        errorLog: 'Error Log',
        noErrors: 'No errors recorded',
        clearErrors: 'Clear Errors',
        academicEnginesTitle: 'Academic Engines',
        addEnginePlaceholder: 'Add engine (include {query})',
        accentColorLocked: 'Accent color is locked in Liquid Glass theme'
    },
    zh: {
        displayMode: '显示模式',
        displayModeManual: '手动',
        displayModeAuto: '自动',
        lightMode: '明亮模式',
        darkMode: '黑暗模式',
        switchTime: '切换时间',
        lightSwitchTime: '切换到明亮',
        darkSwitchTime: '切换到黑暗',
        clearHistory: '清除历史',
        clearHistoryConfirm: '确定要清除所有搜索历史吗？',
        deleteHistory: '删除',
        cropImage: '裁剪图片',
        confirmButton: '确认',
        errorLog: '错误日志',
        noErrors: '没有记录的错误',
        clearErrors: '清除错误',
        academicEnginesTitle: '学术引擎',
        addEnginePlaceholder: '添加引擎（包含 {query}）',
        accentColorLocked: 'Liquid Glass 主题下强调色已锁定'
    },
    ja: {
        displayMode: '表示モード',
        displayModeManual: '手動',
        displayModeAuto: '自動',
        lightMode: 'ライトモード',
        darkMode: 'ダークモード',
        switchTime: '切り替え時間',
        lightSwitchTime: 'ライトに切り替え',
        darkSwitchTime: 'ダークに切り替え',
        clearHistory: '履歴をクリア',
        clearHistoryConfirm: 'すべての検索履歴をクリアしてもよろしいですか？',
        deleteHistory: '削除',
        cropImage: '画像をトリミング',
        confirmButton: '確認',
        errorLog: 'エラーログ',
        noErrors: 'エラーは記録されていません',
        clearErrors: 'エラーをクリア',
        academicEnginesTitle: '学術エンジン',
        addEnginePlaceholder: 'エンジンを追加（{query}を含む）',
        accentColorLocked: 'Liquid Glass テーマではアクセントカラーがロックされています'
    },
    ko: {
        displayMode: '표시 모드',
        displayModeManual: '수동',
        displayModeAuto: '자동',
        lightMode: '라이트 모드',
        darkMode: '다크 모드',
        switchTime: '전환 시간',
        lightSwitchTime: '라이트로 전환',
        darkSwitchTime: '다크로 전환',
        clearHistory: '기록 지우기',
        clearHistoryConfirm: '모든 검색 기록을 지우시겠습니까?',
        deleteHistory: '삭제',
        cropImage: '이미지 자르기',
        confirmButton: '확인',
        errorLog: '오류 로그',
        noErrors: '기록된 오류가 없습니다',
        clearErrors: '오류 지우기',
        academicEnginesTitle: '학술 엔진',
        addEnginePlaceholder: '엔진 추가 ({query} 포함)',
        accentColorLocked: 'Liquid Glass 테마에서는 강조 색상이 잠겨 있습니다'
    },
    ru: {
        displayMode: 'Режим отображения',
        displayModeManual: 'Ручной',
        displayModeAuto: 'Авто',
        lightMode: 'Светлый режим',
        darkMode: 'Темный режим',
        switchTime: 'Время переключения',
        lightSwitchTime: 'Переключить на светлый',
        darkSwitchTime: 'Переключить на темный',
        clearHistory: 'Очистить историю',
        clearHistoryConfirm: 'Вы уверены, что хотите очистить всю историю поиска?',
        deleteHistory: 'Удалить',
        cropImage: 'Обрезать изображение',
        confirmButton: 'Подтвердить',
        errorLog: 'Журнал ошибок',
        noErrors: 'Ошибок не зарегистрировано',
        clearErrors: 'Очистить ошибки',
        academicEnginesTitle: 'Академические движки',
        addEnginePlaceholder: 'Добавить движок (включить {query})',
        accentColorLocked: 'Акцентный цвет заблокирован в теме Liquid Glass'
    }
};

// 合并翻译到 LANG_DATA
function mergeTranslations() {
    if (typeof LANG_DATA !== 'undefined') {
        Object.keys(additionalTranslations).forEach(lang => {
            if (LANG_DATA[lang]) {
                Object.assign(LANG_DATA[lang], additionalTranslations[lang]);
            }
        });
        console.log('✅ Additional translations merged');
    }
}

// 在页面加载时执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mergeTranslations();
        setTimeout(() => {
            applyLanguageEnhanced();
        }, 100);
    });
} else {
    mergeTranslations();
    applyLanguageEnhanced();
}

console.log('✅ HTML动态文本更新脚本已加载');
