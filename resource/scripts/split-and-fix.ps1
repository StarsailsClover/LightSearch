# LightSearch 文件拆分和修复脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LightSearch 完整修复和文件拆分" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 读取源文件
Write-Host "[1/6] 读取源文件..." -ForegroundColor Yellow
$content = Get-Content "standalone.html" -Raw -Encoding UTF8

# 提取 CSS
Write-Host "[2/6] 提取 CSS..." -ForegroundColor Yellow
if ($content -match '(?s)<style>(.*?)</style>') {
    $css = $matches[1].Trim()
    
    # 添加暗黑模式修复
    $darkModeFix = @"

/* 暗黑模式输入框修复 */
body.theme-dark input[type="text"],
body.theme-dark textarea,
body.theme-dark select {
    background-color: var(--ls-card-bg);
    color: var(--ls-text);
    border-color: var(--ls-border);
}
"@
    
    $css = $css + $darkModeFix
    
    [System.IO.File]::WriteAllText("styles.css", $css, [System.Text.Encoding]::UTF8)
    Write-Host "  ✓ CSS 已保存到 styles.css" -ForegroundColor Green
}

# 提取 JavaScript
Write-Host "[3/6] 提取 JavaScript..." -ForegroundColor Yellow
if ($content -match '(?s)<script>(.*?)</script>') {
    $js = $matches[1].Trim()
    
    # 添加多语言支持
    $multiLangJS = @'

// ========== 多语言支持 ==========
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
        academicTitle: 'Academic Search'
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
        academicTitle: '学术搜索'
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
        academicTitle: '学術検索'
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
        academicTitle: '학술 검색'
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
        academicTitle: 'Академический поиск'
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
'@
    
    $js = $js + $multiLangJS
    
    [System.IO.File]::WriteAllText("script.js", $js, [System.Text.Encoding]::UTF8)
    Write-Host "  ✓ JavaScript 已保存到 script.js" -ForegroundColor Green
}

# 创建新的 HTML
Write-Host "[4/6] 创建新的 HTML..." -ForegroundColor Yellow

# 移除内联的 style 和 script
$newHTML = $content -replace '(?s)<style>.*?</style>', '<link rel="stylesheet" href="styles.css">'
$newHTML = $newHTML -replace '(?s)<script>.*?</script>', '<script src="script.js"></script>'

# 修改标题
$newHTML = $newHTML -replace '<title>.*?</title>', '<title>LightSearch - Simple & Elegant Search Aggregator</title>'

# 在设置弹窗中添加语言选择器
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

# 在设置弹窗结束前添加语言选择器
$newHTML = $newHTML -replace '(</div>\s*</div>\s*<!-- 学术搜索弹窗 -->)', "$langSelector`n        `$1"

[System.IO.File]::WriteAllText("index.html", $newHTML, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ HTML 已保存到 index.html" -ForegroundColor Green

# 检查旧文件
Write-Host "[5/6] 检查旧文件..." -ForegroundColor Yellow

if (Test-Path "styles-old.css") {
    Write-Host "  ! 发现旧的 styles-old.css，已删除" -ForegroundColor Yellow
    Remove-Item "styles-old.css" -Force
}

if (Test-Path "script-old.js") {
    Write-Host "  ! 发现旧的 script-old.js，已删除" -ForegroundColor Yellow
    Remove-Item "script-old.js" -Force
}

# 验证文件
Write-Host "[6/6] 验证文件..." -ForegroundColor Yellow

$filesOK = $true

if (-not (Test-Path "index.html")) {
    Write-Host "  ✗ index.html 未找到" -ForegroundColor Red
    $filesOK = $false
} else {
    $size = (Get-Item "index.html").Length
    Write-Host "  ✓ index.html ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
}

if (-not (Test-Path "styles.css")) {
    Write-Host "  ✗ styles.css 未找到" -ForegroundColor Red
    $filesOK = $false
} else {
    $size = (Get-Item "styles.css").Length
    Write-Host "  ✓ styles.css ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
}

if (-not (Test-Path "script.js")) {
    Write-Host "  ✗ script.js 未找到" -ForegroundColor Red
    $filesOK = $false
} else {
    $size = (Get-Item "script.js").Length
    Write-Host "  ✓ script.js ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($filesOK) {
    Write-Host "  ✅ 所有文件创建成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "文件结构：" -ForegroundColor Cyan
    Write-Host "  index.html  - 主页面" -ForegroundColor White
    Write-Host "  styles.css  - 样式表" -ForegroundColor White
    Write-Host "  script.js   - 脚本文件" -ForegroundColor White
    Write-Host ""
    Write-Host "修复内容：" -ForegroundColor Cyan
    Write-Host "  ✓ 暗黑模式输入框修复" -ForegroundColor Green
    Write-Host "  ✓ 多语言支持（5种语言）" -ForegroundColor Green
    Write-Host "  ✓ 文件拆分（HTML/CSS/JS）" -ForegroundColor Green
    Write-Host ""
    Write-Host "立即测试：" -ForegroundColor Cyan
    Write-Host "  双击 index.html 或运行 start-server.bat" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ 文件创建失败" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
