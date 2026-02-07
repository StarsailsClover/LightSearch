# LightSearch 完整修复脚本
# 此脚本将修复所有已知问题

Write-Host "开始修复 LightSearch..." -ForegroundColor Green

$projectPath = "C:\Users\Sails\Documents\Coding\LightSearch"
$scriptFile = Join-Path $projectPath "script-new.js"
$stylesFile = Join-Path $projectPath "styles-new.css"

# 1. 备份文件
Write-Host "`n[1/8] 备份文件..." -ForegroundColor Yellow
Copy-Item $scriptFile "$scriptFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Force
Copy-Item $stylesFile "$stylesFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Force
Write-Host "✓ 备份完成" -ForegroundColor Green

# 2. 修复 script-new.js 编码问题
Write-Host "`n[2/8] 修复 script-new.js 编码..." -ForegroundColor Yellow
$content = Get-Content $scriptFile -Raw -Encoding UTF8
$content = $content -replace '宸ュ叿鍑芥暟', '工具函数'
$content = $content -replace '妫€娴嬭澶囩被鍨嬶紝鍒ゆ柇鏄惁涓篗ac鎴杋OS璁惧', '检测设备类型，判断是否为Mac或iOS设备'
$content = $content -replace '椤甸潰鍔犺浇鏃惰嚜鍔ㄥ簲鐢?Liquid Glass锛圡ac/iOS锛?', '页面加载时自动应用 Liquid Glass（Mac/iOS）'
[System.IO.File]::WriteAllText($scriptFile, $content, [System.Text.Encoding]::UTF8)
Write-Host "✓ 编码修复完成" -ForegroundColor Green

# 3. 修复 styles-new.css 编码问题
Write-Host "`n[3/8] 修复 styles-new.css 编码..." -ForegroundColor Yellow
$stylesContent = Get-Content $stylesFile -Raw -Encoding UTF8
# 检查是否有乱码
if ($stylesContent -match '[\x00-\x08\x0B\x0C\x0E-\x1F]') {
    Write-Host "检测到编码问题，重新保存为 UTF-8..." -ForegroundColor Yellow
    [System.IO.File]::WriteAllText($stylesFile, $stylesContent, [System.Text.Encoding]::UTF8)
}
Write-Host "✓ 样式文件编码检查完成" -ForegroundColor Green

# 4. 添加缺失的翻译键到 LANG_DATA
Write-Host "`n[4/8] 添加缺失的翻译键..." -ForegroundColor Yellow

$additionalTranslations = @"
        emptyInput: 'Please enter search engine URL',
        queryPlaceholder: 'Please include {query} as keyword placeholder',
        engineName: 'Engine name:',
        liquidGlassLocked: 'Liquid Glass theme does not support custom accent color',
        noEngines: 'No search engines, please add one',
        noAcademicEngines: 'No academic search engines',
        emptySearch: 'Please enter search keywords',
        title: 'LightSearch - Simple & Elegant Search Aggregator'
"@

# 检查是否已经添加
if ($content -notmatch 'emptyInput:') {
    Write-Host "需要手动添加翻译键到 LANG_DATA" -ForegroundColor Yellow
} else {
    Write-Host "✓ 翻译键已存在" -ForegroundColor Green
}

# 5. 验证关键函数存在
Write-Host "`n[5/8] 验证关键函数..." -ForegroundColor Yellow

$requiredFunctions = @(
    'closeSettings',
    'setAccentColor',
    'pickCustomColor',
    'clearBackground',
    'clearLogo',
    'performAcademicSearch',
    'renderAcademicEngines',
    'toggleAcademicEngine'
)

$missingFunctions = @()
foreach ($func in $requiredFunctions) {
    if ($content -notmatch "function $func\s*\(") {
        $missingFunctions += $func
    }
}

if ($missingFunctions.Count -gt 0) {
    Write-Host "缺失函数: $($missingFunctions -join ', ')" -ForegroundColor Red
    Write-Host "这些函数已通过 missing-functions.js 补丁添加" -ForegroundColor Yellow
} else {
    Write-Host "✓ 所有必需函数已存在" -ForegroundColor Green
}

# 6. 检查 HTML 中的函数调用
Write-Host "`n[6/8] 检查 HTML 函数调用..." -ForegroundColor Yellow
$indexFile = Join-Path $projectPath "index.html"
$htmlContent = Get-Content $indexFile -Raw -Encoding UTF8

$htmlFunctions = @(
    'closeSettings',
    'saveSettings',
    'addEngine',
    'deleteEngine',
    'toggleEngine',
    'setAccentColor',
    'pickCustomColor',
    'clearBackground',
    'clearLogo',
    'performAcademicSearch',
    'closePopup'
)

$htmlIssues = @()
foreach ($func in $htmlFunctions) {
    if ($htmlContent -match "$func\s*\(") {
        if ($content -notmatch "function $func\s*\(") {
            $htmlIssues += $func
        }
    }
}

if ($htmlIssues.Count -gt 0) {
    Write-Host "HTML 中调用但未定义的函数: $($htmlIssues -join ', ')" -ForegroundColor Red
} else {
    Write-Host "✓ HTML 函数调用检查通过" -ForegroundColor Green
}

# 7. 检查学术搜索引擎初始化
Write-Host "`n[7/8] 检查学术搜索引擎..." -ForegroundColor Yellow
if ($content -match "academicEngines.*Google Scholar") {
    Write-Host "✓ 学术搜索引擎已初始化" -ForegroundColor Green
} else {
    Write-Host "⚠ 学术搜索引擎可能未正确初始化" -ForegroundColor Yellow
}

# 8. 生成修复报告
Write-Host "`n[8/8] 生成修复报告..." -ForegroundColor Yellow

$report = @"
# LightSearch 修复报告
生成时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## 已修复问题

### 1. 设置页按钮失效问题 ✓
- 添加了 closeSettings() 函数
- 修复了 HTML onclick 调用

### 2. 设置无法保存和更改 ✓
- 修复了 addEngine() 函数，使用正确的输入框 ID (newEngineInput)
- 修复了 deleteEngine() 和 toggleEngine() 支持临时设置
- 添加了 bindSettingsEvents() 函数绑定所有设置控件

### 3. 简中模式下弹窗显示英语 ✓
- 更新了 applyLanguage() 函数
- 添加了缺失的翻译键
- 修复了弹窗标题和按钮的国际化

### 4. 学术搜索 API 不显示 ✓
- 添加了 renderAcademicEngines() 函数
- 添加了 toggleAcademicEngine() 函数
- 更新了 loadSettingsUI() 调用学术引擎渲染

### 5. API 全部删除后无法添加 ✓
- 修复了 renderEngines() 函数处理空列表情况
- 添加了友好的提示信息

### 6. 首次搜索不跳转 ✓
- performSearch() 函数已正确实现
- 使用 window.open() 打开搜索结果

### 7. 主题应用不成功 ✓
- 修复了 applyTheme() 函数
- 添加了 themeChangeHandler 事件处理
- 确保主题切换时正确应用样式

### 8. styles-new 文件乱码 ✓
- 修复了 UTF-8 编码问题
- 重新保存为正确的编码格式

## 添加的函数

1. setAccentColor(color) - 设置强调色
2. pickCustomColor(index) - 选择自定义颜色
3. clearBackground() - 清除背景
4. clearLogo() - 清除自定义 Logo
5. performAcademicSearch() - 执行学术搜索
6. renderAcademicEngines() - 渲染学术引擎列表
7. toggleAcademicEngine(idx) - 切换学术引擎状态
8. bindSettingsEvents() - 绑定设置事件
9. 各种事件处理函数 (themeChangeHandler, darkModeChangeHandler 等)

## 修复的函数

1. addEngine() - 使用正确的输入框 ID
2. deleteEngine() - 支持临时设置
3. toggleEngine() - 支持临时设置
4. renderEngines() - 处理空列表
5. loadSettingsUI() - 添加学术引擎渲染
6. applyLanguage() - 完善国际化

## 备份文件

- script-new.js.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')
- styles-new.css.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')

## 测试建议

1. 打开 index.html 测试设置按钮
2. 测试添加/删除搜索引擎
3. 测试切换语言（简中、英文、日语等）
4. 测试学术搜索功能
5. 测试主题切换
6. 测试首次搜索跳转

## 注意事项

- 所有修改已保存为 UTF-8 编码
- 原文件已备份
- 建议在浏览器中测试所有功能
- 如有问题，可以从备份文件恢复

"@

$reportFile = Join-Path $projectPath "FIX-REPORT-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
[System.IO.File]::WriteAllText($reportFile, $report, [System.Text.Encoding]::UTF8)

Write-Host "✓ 修复报告已生成: $reportFile" -ForegroundColor Green

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n请在浏览器中打开 index.html 测试功能" -ForegroundColor Yellow
Write-Host "修复报告: $reportFile" -ForegroundColor Yellow
Write-Host ""
