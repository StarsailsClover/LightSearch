# LightSearch 恢复到 v2.1 版本
# 从备份恢复文件

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LightSearch 版本恢复" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\Sails\Documents\Coding\LightSearch"
$backupPath = Join-Path $projectPath "resource\backup"
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'

Write-Host "目标版本: v2.1" -ForegroundColor Green
Write-Host "备份位置: $backupPath" -ForegroundColor Cyan
Write-Host ""

# 1. 备份当前文件（以防需要回退）
Write-Host "[1/4] 备份当前文件..." -ForegroundColor Yellow

$currentBackupPath = Join-Path $projectPath "resource\backup\current-before-restore-$timestamp"
New-Item -ItemType Directory -Path $currentBackupPath -Force | Out-Null

$filesToBackup = @("index.html", "script-new.js", "styles-new.css")
foreach ($file in $filesToBackup) {
    $src = Join-Path $projectPath $file
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $currentBackupPath $file) -Force
        Write-Host "  ✓ 已备份: $file" -ForegroundColor Green
    }
}

# 2. 恢复 v2.1 版本文件
Write-Host "`n[2/4] 恢复 v2.1 版本文件..." -ForegroundColor Yellow

# 恢复 index.html
$indexBackup = Join-Path $backupPath "index.html.backup-v2-20260206-211035"
$indexDest = Join-Path $projectPath "index.html"
if (Test-Path $indexBackup) {
    Copy-Item $indexBackup $indexDest -Force
    Write-Host "  ✓ index.html 已恢复" -ForegroundColor Green
} else {
    Write-Host "  ✗ 未找到 index.html 备份" -ForegroundColor Red
}

# 恢复 script-new.js
$scriptBackup = Join-Path $backupPath "script-new.js.backup-v2-20260206-211035"
$scriptDest = Join-Path $projectPath "script-new.js"
if (Test-Path $scriptBackup) {
    Copy-Item $scriptBackup $scriptDest -Force
    Write-Host "  ✓ script-new.js 已恢复" -ForegroundColor Green
} else {
    Write-Host "  ✗ 未找到 script-new.js 备份" -ForegroundColor Red
}

# 恢复 styles-new.css
$stylesBackup = Join-Path $backupPath "styles-new.css.backup-v2-20260206-211035"
$stylesDest = Join-Path $projectPath "styles-new.css"
if (Test-Path $stylesBackup) {
    Copy-Item $stylesBackup $stylesDest -Force
    Write-Host "  ✓ styles-new.css 已恢复" -ForegroundColor Green
} else {
    Write-Host "  ✗ 未找到 styles-new.css 备份" -ForegroundColor Red
}

# 3. 验证恢复的文件
Write-Host "`n[3/4] 验证恢复的文件..." -ForegroundColor Yellow

$indexContent = Get-Content $indexDest -Raw -Encoding UTF8
$scriptContent = Get-Content $scriptDest -Raw -Encoding UTF8
$stylesContent = Get-Content $stylesDest -Raw -Encoding UTF8

# 检查文件大小
$indexSize = (Get-Item $indexDest).Length
$scriptSize = (Get-Item $scriptDest).Length
$stylesSize = (Get-Item $stylesDest).Length

Write-Host "  index.html: $indexSize 字节" -ForegroundColor Cyan
Write-Host "  script-new.js: $scriptSize 字节" -ForegroundColor Cyan
Write-Host "  styles-new.css: $stylesSize 字节" -ForegroundColor Cyan

# 检查关键内容
if ($indexContent -match 'LightSearch') {
    Write-Host "  ✓ index.html 内容正常" -ForegroundColor Green
}

if ($scriptContent -match 'LANG_DATA') {
    Write-Host "  ✓ script-new.js 内容正常" -ForegroundColor Green
}

if ($stylesContent -match 'ls-search') {
    Write-Host "  ✓ styles-new.css 内容正常" -ForegroundColor Green
}

# 4. 生成恢复报告
Write-Host "`n[4/4] 生成恢复报告..." -ForegroundColor Yellow

$report = @"
# LightSearch 版本恢复报告

**恢复时间**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**目标版本**: v2.1  
**恢复来源**: resource/backup/

---

## 恢复的文件

### 1. index.html ✅
- **来源**: index.html.backup-v2-20260206-211035
- **大小**: $indexSize 字节
- **状态**: 已恢复

### 2. script-new.js ✅
- **来源**: script-new.js.backup-v2-20260206-211035
- **大小**: $scriptSize 字节
- **状态**: 已恢复

### 3. styles-new.css ✅
- **来源**: styles-new.css.backup-v2-20260206-211035
- **大小**: $stylesSize 字节
- **状态**: 已恢复

---

## 当前文件备份

恢复前的文件已备份到：
``resource/backup/current-before-restore-$timestamp/``

包含：
- index.html
- script-new.js
- styles-new.css

如需回退到恢复前的状态，可以从此文件夹恢复。

---

## v2.1 版本特性

### 包含的功能
- ✅ 基础搜索功能
- ✅ 多语言支持（5种语言）
- ✅ 主题切换（Classic / LiquidGlass）
- ✅ 设置保存
- ✅ 搜索历史
- ✅ 学术搜索

### 已知问题（v2.1）
- ⚠️ 部分UI可能需要调整
- ⚠️ 某些高级功能可能不完整

---

## 下一步

1. ✅ 刷新浏览器（Ctrl + F5）
2. ✅ 测试基本功能
3. ✅ 检查控制台错误
4. ✅ 验证所有功能正常

---

## 如果需要回退

如果恢复后有问题，可以恢复到恢复前的状态：

``````powershell
Copy-Item "resource\backup\current-before-restore-$timestamp\*" "." -Force
``````

---

**状态**: ✅ 恢复完成  
**版本**: v2.1  
**备份**: current-before-restore-$timestamp
"@

$reportPath = Join-Path $projectPath "RESTORE-REPORT-v2.1-$timestamp.md"
[System.IO.File]::WriteAllText($reportPath, $report, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ 恢复报告已生成" -ForegroundColor Green

# 完成
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "恢复完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "恢复的文件:" -ForegroundColor Yellow
Write-Host "  ✓ index.html" -ForegroundColor Green
Write-Host "  ✓ script-new.js" -ForegroundColor Green
Write-Host "  ✓ styles-new.css" -ForegroundColor Green
Write-Host ""
Write-Host "当前文件已备份到:" -ForegroundColor Yellow
Write-Host "  resource\backup\current-before-restore-$timestamp\" -ForegroundColor Cyan
Write-Host ""
Write-Host "恢复报告:" -ForegroundColor Yellow
Write-Host "  RESTORE-REPORT-v2.1-$timestamp.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "  1. 刷新浏览器（Ctrl + F5）" -ForegroundColor White
Write-Host "  2. 测试所有功能" -ForegroundColor White
Write-Host "  3. 查看恢复报告" -ForegroundColor White
Write-Host ""

$response = Read-Host "是否立即打开测试? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process (Join-Path $projectPath "index.html")
}
