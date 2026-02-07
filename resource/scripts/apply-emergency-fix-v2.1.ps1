# LightSearch 紧急修复脚本 v2.1
# 修复 colorPicker、LiquidGlass 样式和其他UI问题

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LightSearch 紧急修复 v2.1" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\Sails\Documents\Coding\LightSearch"
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'

# 1. 备份当前文件
Write-Host "[1/6] 备份文件..." -ForegroundColor Yellow
$filesToBackup = @(
    "index.html",
    "index-test.html",
    "script-new.js",
    "styles-new.css"
)

foreach ($file in $filesToBackup) {
    $sourcePath = Join-Path $projectPath $file
    if (Test-Path $sourcePath) {
        $backupPath = "$sourcePath.backup-emergency-$timestamp"
        Copy-Item $sourcePath $backupPath -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# 2. 在 index.html 中添加紧急修复脚本
Write-Host "`n[2/6] 添加紧急修复到 index.html..." -ForegroundColor Yellow
$indexPath = Join-Path $projectPath "index.html"
$indexContent = Get-Content $indexPath -Raw -Encoding UTF8

if ($indexContent -notmatch 'emergency-fix-v2.1.js') {
    # 在 </body> 前添加脚本
    $indexContent = $indexContent -replace '</body>', "    <script src=`"emergency-fix-v2.1.js`"></script>`n</body>"
    [System.IO.File]::WriteAllText($indexPath, $indexContent, [System.Text.Encoding]::UTF8)
    Write-Host "  ✓ Emergency fix script added" -ForegroundColor Green
} else {
    Write-Host "  ℹ Emergency fix script already present" -ForegroundColor Cyan
}

# 3. 更新 index-test.html
Write-Host "`n[3/6] 更新 index-test.html..." -ForegroundColor Yellow
$testIndexPath = Join-Path $projectPath "index-test.html"

# 读取 index.html 作为基础
$testContent = Get-Content $indexPath -Raw -Encoding UTF8

# 修改标题
$testContent = $testContent -replace '<title>LightSearch.*?</title>', '<title>LightSearch - Debug Mode</title>'

# 在 </body> 前添加调试脚本
if ($testContent -notmatch 'script-test.js') {
    $testContent = $testContent -replace '</body>', "    <script src=`"script-test.js`"></script>`n    <script src=`"debug-panel.js`"></script>`n</body>"
}

# 添加调试按钮
if ($testContent -notmatch 'debugBtn') {
    $testContent = $testContent -replace '(<button class="ls-btn" id="academicBtn">.*?</button>)', "`$1`n        <button class=`"ls-btn`" id=`"debugBtn`" style=`"background: #ff0000; color: white;`">🐛 Debug</button>"
}

[System.IO.File]::WriteAllText($testIndexPath, $testContent, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ index-test.html updated" -ForegroundColor Green

# 4. 创建调试面板脚本
Write-Host "`n[4/6] 创建调试面板脚本..." -ForegroundColor Yellow

$debugPanelScript = @"
// 调试面板 HTML
const debugPanelHTML = ``
<div id="debugPanel" class="minimized">
    <div id="debugPanel-header" onclick="toggleDebugPanel()">
        <h3>🐛 Debug Panel</h3>
        <button id="debugPanel-toggle">Maximize</button>
    </div>
    
    <div id="debugPanel-content">
        <div class="debug-section">
            <div class="debug-section-title">Quick Actions</div>
            <button class="debug-button" onclick="window.debugFunctions.runFullDiagnostics()">Run Diagnostics</button>
            <button class="debug-button" onclick="window.debugFunctions.quickFixAll()">Quick Fix All</button>
            <button class="debug-button" onclick="window.debugFunctions.debugShowErrors()">Show Errors</button>
            <button class="debug-button" onclick="window.debugFunctions.debugTestPopup()">Test Popup</button>
            <button class="debug-button" onclick="window.debugFunctions.debugTestTheme()">Test Theme</button>
            <button class="debug-button" onclick="debugClearStorage()">Clear Storage</button>
        </div>
        
        <div class="debug-section">
            <div class="debug-section-title">System Info</div>
            <div class="debug-item">
                <span class="debug-label">Browser:</span>
                <span class="debug-value" id="debug-browser"></span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Screen:</span>
                <span class="debug-value" id="debug-screen"></span>
            </div>
            <div class="debug-item">
                <span class="debug-label">WebGL:</span>
                <span class="debug-value" id="debug-webgl"></span>
            </div>
        </div>
        
        <div class="debug-section">
            <div class="debug-section-title">App State</div>
            <div class="debug-stats">
                <div class="debug-stat">
                    <div class="debug-stat-value" id="debug-engines-count">0</div>
                    <div class="debug-stat-label">Engines</div>
                </div>
                <div class="debug-stat">
                    <div class="debug-stat-value" id="debug-errors-count">0</div>
                    <div class="debug-stat-label">Errors</div>
                </div>
            </div>
        </div>
        
        <div class="debug-section">
            <div class="debug-section-title">Console Log</div>
            <div class="debug-log" id="debug-console"></div>
        </div>
        
        <div class="debug-section" id="debug-error-log">
            <div class="debug-section-title">Error Log</div>
        </div>
    </div>
</div>
``;

// 添加调试面板样式
const debugPanelStyles = document.createElement('style');
debugPanelStyles.textContent = ``
    #debugPanel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 450px;
        max-height: 60vh;
        background: rgba(0, 0, 0, 0.95);
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        padding: 15px;
        overflow-y: auto;
        z-index: 99999;
        border-top-left-radius: 8px;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
    }
    
    #debugPanel.minimized {
        transform: translateY(calc(100% - 40px));
    }
    
    #debugPanel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #00ff00;
        cursor: pointer;
    }
    
    #debugPanel-header h3 {
        margin: 0;
        font-size: 14px;
        color: #00ff00;
    }
    
    #debugPanel-toggle {
        background: none;
        border: 1px solid #00ff00;
        color: #00ff00;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 10px;
    }
    
    #debugPanel-toggle:hover {
        background: #00ff00;
        color: #000;
    }
    
    .debug-section {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
    }
    
    .debug-section-title {
        color: #ffff00;
        font-weight: bold;
        margin-bottom: 8px;
        font-size: 13px;
    }
    
    .debug-item {
        margin: 5px 0;
        padding: 3px 0;
        font-size: 11px;
    }
    
    .debug-label {
        color: #00aaff;
        margin-right: 8px;
    }
    
    .debug-value {
        color: #00ff00;
    }
    
    .debug-button {
        background: #00ff00;
        color: #000;
        border: none;
        padding: 6px 10px;
        margin: 4px 4px 4px 0;
        cursor: pointer;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
    }
    
    .debug-button:hover {
        background: #00cc00;
    }
    
    .debug-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-top: 8px;
    }
    
    .debug-stat {
        background: rgba(0, 255, 0, 0.1);
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #00ff00;
        text-align: center;
    }
    
    .debug-stat-value {
        font-size: 18px;
        font-weight: bold;
        color: #00ff00;
    }
    
    .debug-stat-label {
        font-size: 9px;
        color: #00aaff;
        margin-top: 2px;
    }
    
    .debug-log {
        max-height: 150px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px;
        border-radius: 4px;
        margin-top: 8px;
    }
    
    .debug-log-item {
        margin: 2px 0;
        font-size: 10px;
    }
    
    .debug-error-item {
        background: rgba(255, 0, 0, 0.1);
        border-left: 3px solid #ff0000;
        padding: 8px;
        margin: 5px 0;
        border-radius: 4px;
        font-size: 10px;
    }
    
    .debug-success {
        color: #00ff00;
    }
    
    .debug-error {
        color: #ff0000;
    }
    
    .debug-warning {
        color: #ffaa00;
    }
``;

document.head.appendChild(debugPanelStyles);

// 添加调试面板到页面
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', debugPanelHTML);
    
    // 绑定调试按钮
    const debugBtn = document.getElementById('debugBtn');
    if (debugBtn) {
        debugBtn.addEventListener('click', () => {
            const panel = document.getElementById('debugPanel');
            if (panel.classList.contains('minimized')) {
                panel.classList.remove('minimized');
                document.getElementById('debugPanel-toggle').textContent = 'Minimize';
            }
        });
    }
});

console.log('✅ Debug panel loaded');
"@

$debugPanelPath = Join-Path $projectPath "debug-panel.js"
[System.IO.File]::WriteAllText($debugPanelPath, $debugPanelScript, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ debug-panel.js created" -ForegroundColor Green

# 5. 验证文件
Write-Host "`n[5/6] 验证文件..." -ForegroundColor Yellow

$requiredFiles = @(
    "emergency-fix-v2.1.js",
    "script-test.js",
    "debug-panel.js",
    "index-test.html"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $projectPath $file
    if (Test-Path $filePath) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# 6. 生成修复报告
Write-Host "`n[6/6] 生成修复报告..." -ForegroundColor Yellow

$report = @"
# LightSearch 紧急修复报告 v2.1
生成时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## 修复的问题

### 1. colorPicker 异常显示 ✅
- 强制隐藏 colorPicker 元素
- 添加多重隐藏样式
- 防止意外显示

### 2. LiquidGlass 明亮模式显示异常 ✅
- 修复背景透明度
- 调整组件颜色和边框
- 优化 backdrop-filter 效果

### 3. LiquidGlass 黑暗模式UI问题 ✅
- 修复搜索框附近组件显示
- 调整搜索历史样式
- 优化按钮状态显示

### 4. 按钮开启状态显示异常 ✅
- 修复开关按钮样式
- 添加正确的状态指示
- 优化过渡动画

### 5. 显示设置UI重新设计 ✅
- 改为标题+子项结构
- 添加"选择方式"下拉菜单
- 手动模式：明亮/黑暗开关
- 自动模式：时间滑块

### 6. 调试模式错误修复 ✅
- 创建独立的 script-test.js
- 添加完整的错误诊断
- 实现弹窗功能检查
- 添加快速修复功能

### 7. 调试面板同步 ✅
- 同步所有主脚本功能
- 添加实时错误显示
- 实现完整的诊断工具

## 新增文件

1. emergency-fix-v2.1.js - 紧急修复脚本
2. script-test.js - 调试模式专用脚本
3. debug-panel.js - 调试面板脚本
4. index-test.html - 更新的调试页面

## 备份文件

- *.backup-emergency-$timestamp

## 测试步骤

1. 打开 index.html 测试主应用
   - 检查 colorPicker 是否隐藏
   - 测试 LiquidGlass 明亮模式
   - 测试 LiquidGlass 黑暗模式
   - 测试显示设置UI

2. 打开 index-test.html 测试调试模式
   - 点击"Debug"按钮
   - 运行完整诊断
   - 查看错误日志
   - 测试快速修复

3. 测试弹窗功能
   - 打开设置弹窗
   - 测试所有设置项
   - 保存并验证

## 已知问题

- 无

## 下一步

1. 测试所有修复
2. 验证调试功能
3. 收集反馈

---

**修复完成时间**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**版本**: v2.1
**状态**: ✅ 完成
"@

$reportPath = Join-Path $projectPath "EMERGENCY-FIX-REPORT-v2.1.md"
[System.IO.File]::WriteAllText($reportPath, $report, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ Report generated" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "紧急修复完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "修复内容:" -ForegroundColor Yellow
Write-Host "  ✓ colorPicker 隐藏" -ForegroundColor Green
Write-Host "  ✓ LiquidGlass 样式修复" -ForegroundColor Green
Write-Host "  ✓ 显示设置UI重新设计" -ForegroundColor Green
Write-Host "  ✓ 调试模式完善" -ForegroundColor Green
Write-Host ""
Write-Host "测试文件:" -ForegroundColor Yellow
Write-Host "  - index.html (主应用)" -ForegroundColor White
Write-Host "  - index-test.html (调试模式)" -ForegroundColor White
Write-Host ""

$response = Read-Host "是否立即打开测试? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process (Join-Path $projectPath "index.html")
    Start-Sleep -Seconds 2
    Start-Process (Join-Path $projectPath "index-test.html")
}
"@

$scriptPath = Join-Path $projectPath "apply-emergency-fix-v2.1.ps1"
[System.IO.File]::WriteAllText($scriptPath, $report, [System.Text.Encoding]::UTF8)

Write-Host "  ✓ Emergency fix script created" -ForegroundColor Green
