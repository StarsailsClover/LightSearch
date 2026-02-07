# LightSearch 完整修复脚本

Write-Host "正在修复 LightSearch..." -ForegroundColor Green

# 读取原文件
$content = Get-Content "standalone.html" -Raw -Encoding UTF8

# 1. 修复标题
$content = $content -replace '<title>LightSearch - 单文件版</title>', '<title>LightSearch - Simple & Elegant Search Aggregator</title>'

# 2. 添加暗黑模式输入框修复
$darkModeCSS = @"
        
        body.theme-dark input[type="text"],
        body.theme-dark textarea,
        body.theme-dark select {
            background-color: var(--ls-card-bg);
            color: var(--ls-text);
            border-color: var(--ls-border);
        }
"@

$content = $content -replace '(body\.theme-dark \{[^}]+\})', "`$1$darkModeCSS"

# 3. 在 </body> 前添加多语言支持脚本
$multiLangScript = @'
<script>
// 多语言支持
const LANG_DATA = {
    en: {
        searchPlaceholder: 'Enter search keywords...',
        searchButton: 'Search',
        settingsButton: 'Settings',
        academicButton: 'Academic Search',
        themeButton: 'Toggle Theme',
        historyTitle: 'Search History',
        noHistory: 'No search history',
        settingsTitle: 'Settings',
        academicTitle: 'Academic Search',
        closeButton: 'Close',
        enginesTitle: 'Search Engines',
        addEngine: 'Add',
        deleteEngine: 'Delete',
        languageTitle: 'Language',
        academicPlaceholder: 'Enter academic keywords...',
        timeFilter: 'Publication Time',
        timeAny: 'Any Time',
        time1y: 'Past Year',
        time5y: 'Past 5 Years',
        time10y: 'Past 10 Years'
    },
    zh: {
        searchPlaceholder: '输入搜索关键词...',
        searchButton: '搜索',
        settingsButton: '设置',
        academicButton: '学术搜索',
        themeButton: '切换主题',
        historyTitle: '搜索历史',
        noHistory: '暂无搜索历史',
        settingsTitle: '设置',
        academicTitle: '学术搜索',
        closeButton: '关闭',
        enginesTitle: '搜索引擎',
        addEngine: '添加',
        deleteEngine: '删除',
        languageTitle: '语言',
        academicPlaceholder: '输入学术关键词...',
        timeFilter: '发表时间',
        timeAny: '不限',
        time1y: '近1年',
        time5y: '近5年',
        time10y: '近10年'
    },
    ja: {
        searchPlaceholder: '検索キーワードを入力...',
        searchButton: '検索',
        settingsButton: '設定',
        academicButton: '学術検索',
        themeButton: 'テーマ切替',
        historyTitle: '検索履歴',
        noHistory: '検索履歴がありません',
        settingsTitle: '設定',
        academicTitle: '学術検索',
        closeButton: '閉じる',
        enginesTitle: '検索エンジン',
        addEngine: '追加',
        deleteEngine: '削除',
        languageTitle: '言語',
        academicPlaceholder: '学術キーワードを入力...',
        timeFilter: '公開時期',
        timeAny: 'すべて',
        time1y: '過去1年',
        time5y: '過去5年',
        time10y: '過去10年'
    },
    ko: {
        searchPlaceholder: '검색 키워드 입력...',
        searchButton: '검색',
        settingsButton: '설정',
        academicButton: '학술 검색',
        themeButton: '테마 전환',
        historyTitle: '검색 기록',
        noHistory: '검색 기록이 없습니다',
        settingsTitle: '설정',
        academicTitle: '학술 검색',
        closeButton: '닫기',
        enginesTitle: '검색 엔진',
        addEngine: '추가',
        deleteEngine: '삭제',
        languageTitle: '언어',
        academicPlaceholder: '학술 키워드 입력...',
        timeFilter: '발행 시기',
        timeAny: '전체',
        time1y: '최근 1년',
        time5y: '최근 5년',
        time10y: '최근 10년'
    },
    ru: {
        searchPlaceholder: 'Введите ключевые слова...',
        searchButton: 'Поиск',
        settingsButton: 'Настройки',
        academicButton: 'Академический поиск',
        themeButton: 'Переключить тему',
        historyTitle: 'История поиска',
        noHistory: 'Нет истории поиска',
        settingsTitle: 'Настройки',
        academicTitle: 'Академический поиск',
        closeButton: 'Закрыть',
        enginesTitle: 'Поисковые системы',
        addEngine: 'Добавить',
        deleteEngine: 'Удалить',
        languageTitle: 'Язык',
        academicPlaceholder: 'Введите академические ключевые слова...',
        timeFilter: 'Время публикации',
        timeAny: 'Любое время',
        time1y: 'За последний год',
        time5y: 'За последние 5 лет',
        time10y: 'За последние 10 лет'
    }
};

let currentLang = localStorage.getItem('ls-language') || navigator.language.slice(0, 2) || 'en';
if (!LANG_DATA[currentLang]) currentLang = 'en';

function t(key) {
    return LANG_DATA[currentLang]?.[key] || LANG_DATA.en[key] || key;
}

function applyLanguage() {
    document.title = 'LightSearch - ' + (currentLang === 'zh' ? '简洁优雅的聚合搜索引擎' : 'Simple & Elegant Search Aggregator');
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.textContent = t('searchButton');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.textContent = t('settingsButton');
    
    const academicBtn = document.getElementById('academicBtn');
    if (academicBtn) academicBtn.textContent = t('academicButton');
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.textContent = t('themeButton');
    
    const settingsTitle = document.querySelector('#settingsPopup h2');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');
    
    const academicTitle = document.querySelector('#academicPopup h2');
    if (academicTitle) academicTitle.textContent = t('academicTitle');
    
    const academicInput = document.getElementById('academicInput');
    if (academicInput) academicInput.placeholder = t('academicPlaceholder');
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
    
    renderHistory();
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ls-language', lang);
    applyLanguage();
}

// 页面加载时应用语言
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLanguage);
} else {
    applyLanguage();
}
</script>
'@

$content = $content -replace '</body>', "$multiLangScript`n</body>"

# 4. 在设置弹窗中添加语言选择器
$langSelector = @"
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--ls-border);">
                <h3 style="margin-bottom: 10px; font-size: 1rem;">语言 / Language</h3>
                <select id="langSelect" onchange="switchLanguage(this.value)" style="width: 100%; padding: 10px; border: 1px solid var(--ls-border); border-radius: var(--ls-radius-sm); font-size: 0.95rem; background-color: var(--ls-card-bg); color: var(--ls-text);">
                    <option value="en">English</option>
                    <option value="zh">简体中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="ru">Русский</option>
                </select>
            </div>
"@

# 在设置弹窗的最后一个 </div> 前添加
$content = $content -replace '(</div>\s*</div>\s*<!-- 学术搜索弹窗 -->)', "$langSelector`n        `$1"

# 保存文件
[System.IO.File]::WriteAllText("index.html", $content, [System.Text.Encoding]::UTF8)

Write-Host "✅ 修复完成！" -ForegroundColor Green
Write-Host "文件已保存为: index.html" -ForegroundColor Cyan
