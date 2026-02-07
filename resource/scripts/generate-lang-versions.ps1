# LightSearch - 多语言版本生成脚本

# 语言配置
$languages = @{
    'en' = @{
        code = 'en'
        name = 'English'
        file = 'index.html'
        lang = 'en'
        title = 'LightSearch - Simple & Elegant Search Aggregator'
        searchPlaceholder = 'Enter search keywords...'
        searchButton = 'Search'
        settingsButton = 'Settings'
        academicButton = 'Academic Search'
        historyTitle = 'Search History'
        noHistory = 'No search history'
        settingsTitle = 'Settings'
        closeButton = 'Close'
        enginesTitle = 'Search Engines'
        addEngine = 'Add'
        addEnginePlaceholder = 'Add engine (include {query})'
        deleteEngine = 'Delete'
        themeTitle = 'Theme'
        toggleTheme = 'Toggle Theme'
        languageTitle = 'Language'
        academicTitle = 'Academic Search'
        academicPlaceholder = 'Enter academic keywords...'
        timeFilter = 'Publication Time'
        timeAny = 'Any Time'
        time1y = 'Past Year'
        time5y = 'Past 5 Years'
        time10y = 'Past 10 Years'
    }
    'zh' = @{
        code = 'zh'
        name = '简体中文'
        file = 'index-zh.html'
        lang = 'zh-CN'
        title = 'LightSearch - 简洁优雅的聚合搜索引擎'
        searchPlaceholder = '输入搜索关键词...'
        searchButton = '搜索'
        settingsButton = '设置'
        academicButton = '学术搜索'
        historyTitle = '搜索历史'
        noHistory = '暂无搜索历史'
        settingsTitle = '设置'
        closeButton = '关闭'
        enginesTitle = '搜索引擎'
        addEngine = '添加'
        addEnginePlaceholder = '添加引擎（包含 {query}）'
        deleteEngine = '删除'
        themeTitle = '主题'
        toggleTheme = '切换主题'
        languageTitle = '语言'
        academicTitle = '学术搜索'
        academicPlaceholder = '输入学术关键词...'
        timeFilter = '发表时间'
        timeAny = '不限'
        time1y = '近1年'
        time5y = '近5年'
        time10y = '近10年'
    }
    'ja' = @{
        code = 'ja'
        name = '日本語'
        file = 'index-ja.html'
        lang = 'ja'
        title = 'LightSearch - シンプルでエレガントな検索アグリゲーター'
        searchPlaceholder = '検索キーワードを入力...'
        searchButton = '検索'
        settingsButton = '設定'
        academicButton = '学術検索'
        historyTitle = '検索履歴'
        noHistory = '検索履歴がありません'
        settingsTitle = '設定'
        closeButton = '閉じる'
        enginesTitle = '検索エンジン'
        addEngine = '追加'
        addEnginePlaceholder = 'エンジンを追加（{query}を含む）'
        deleteEngine = '削除'
        themeTitle = 'テーマ'
        toggleTheme = 'テーマ切替'
        languageTitle = '言語'
        academicTitle = '学術検索'
        academicPlaceholder = '学術キーワードを入力...'
        timeFilter = '公開時期'
        timeAny = 'すべて'
        time1y = '過去1年'
        time5y = '過去5年'
        time10y = '過去10年'
    }
    'ko' = @{
        code = 'ko'
        name = '한국어'
        file = 'index-ko.html'
        lang = 'ko'
        title = 'LightSearch - 간단하고 우아한 검색 통합 도구'
        searchPlaceholder = '검색 키워드 입력...'
        searchButton = '검색'
        settingsButton = '설정'
        academicButton = '학술 검색'
        historyTitle = '검색 기록'
        noHistory = '검색 기록이 없습니다'
        settingsTitle = '설정'
        closeButton = '닫기'
        enginesTitle = '검색 엔진'
        addEngine = '추가'
        addEnginePlaceholder = '엔진 추가 ({query} 포함)'
        deleteEngine = '삭제'
        themeTitle = '테마'
        toggleTheme = '테마 전환'
        languageTitle = '언어'
        academicTitle = '학술 검색'
        academicPlaceholder = '학술 키워드 입력...'
        timeFilter = '발행 시기'
        timeAny = '전체'
        time1y = '최근 1년'
        time5y = '최근 5년'
        time10y = '최근 10년'
    }
    'ru' = @{
        code = 'ru'
        name = 'Русский'
        file = 'index-ru.html'
        lang = 'ru'
        title = 'LightSearch - Простой и элегантный агрегатор поиска'
        searchPlaceholder = 'Введите ключевые слова...'
        searchButton = 'Поиск'
        settingsButton = 'Настройки'
        academicButton = 'Академический поиск'
        historyTitle = 'История поиска'
        noHistory = 'Нет истории поиска'
        settingsTitle = 'Настройки'
        closeButton = 'Закрыть'
        enginesTitle = 'Поисковые системы'
        addEngine = 'Добавить'
        addEnginePlaceholder = 'Добавить движок (включить {query})'
        deleteEngine = 'Удалить'
        themeTitle = 'Тема'
        toggleTheme = 'Переключить тему'
        languageTitle = 'Язык'
        academicTitle = 'Академический поиск'
        academicPlaceholder = 'Введите академические ключевые слова...'
        timeFilter = 'Время публикации'
        timeAny = 'Любое время'
        time1y = 'За последний год'
        time5y = 'За последние 5 лет'
        time10y = 'За последние 10 лет'
    }
}

Write-Host "正在生成多语言版本..." -ForegroundColor Green

# 读取模板文件
$templatePath = "standalone.html"
if (-not (Test-Path $templatePath)) {
    Write-Host "错误: 找不到模板文件 standalone.html" -ForegroundColor Red
    exit 1
}

$template = Get-Content $templatePath -Raw -Encoding UTF8

# 为每种语言生成文件
foreach ($langCode in $languages.Keys) {
    $lang = $languages[$langCode]
    Write-Host "生成 $($lang.name) 版本..." -ForegroundColor Cyan
    
    # 替换文本
    $content = $template
    $content = $content -replace '<html lang="zh-CN">', "<html lang=`"$($lang.lang)`">"
    $content = $content -replace '<title>.*?</title>', "<title>$($lang.title)</title>"
    
    # 替换所有文本
    $content = $content -replace '输入搜索关键词\.\.\.', $lang.searchPlaceholder
    $content = $content -replace '搜索', $lang.searchButton
    $content = $content -replace '设置', $lang.settingsButton
    $content = $content -replace '学术搜索', $lang.academicButton
    $content = $content -replace '搜索历史', $lang.historyTitle
    $content = $content -replace '暂无搜索历史', $lang.noHistory
    $content = $content -replace '关闭', $lang.closeButton
    $content = $content -replace '搜索引擎', $lang.enginesTitle
    $content = $content -replace '添加', $lang.addEngine
    $content = $content -replace '添加引擎（包含 \{query\}）', $lang.addEnginePlaceholder
    $content = $content -replace '删除', $lang.deleteEngine
    $content = $content -replace '主题', $lang.themeTitle
    $content = $content -replace '切换主题', $lang.toggleTheme
    $content = $content -replace '语言', $lang.languageTitle
    $content = $content -replace '输入学术关键词\.\.\.', $lang.academicPlaceholder
    $content = $content -replace '发表时间', $lang.timeFilter
    $content = $content -replace '不限', $lang.timeAny
    $content = $content -replace '近1年', $lang.time1y
    $content = $content -replace '近5年', $lang.time5y
    $content = $content -replace '近10年', $lang.time10y
    
    # 添加语言切换脚本
    $langScript = @"
<script>
// 语言检测和跳转
(function() {
    const currentLang = '$langCode';
    const savedLang = localStorage.getItem('ls-language');
    
    // 保存当前语言
    if (!savedLang || savedLang !== currentLang) {
        localStorage.setItem('ls-language', currentLang);
    }
})();

// 语言切换函数
function switchLanguage(langCode) {
    const langFiles = {
        'en': 'index.html',
        'zh': 'index-zh.html',
        'ja': 'index-ja.html',
        'ko': 'index-ko.html',
        'ru': 'index-ru.html'
    };
    
    localStorage.setItem('ls-language', langCode);
    window.location.href = langFiles[langCode] || 'index.html';
}
</script>
"@
    
    # 在 </body> 前插入脚本
    $content = $content -replace '</body>', "$langScript`n</body>"
    
    # 保存文件
    $outputPath = $lang.file
    [System.IO.File]::WriteAllText($outputPath, $content, [System.Text.Encoding]::UTF8)
    
    Write-Host "  ✓ $outputPath 生成完成" -ForegroundColor Green
}

Write-Host "`n所有语言版本生成完成！" -ForegroundColor Green
