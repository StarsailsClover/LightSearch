# LightSearch 资源整理脚本
# 将过时和不需要的文件移动到 resource 文件夹并分类

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LightSearch 资源整理" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\Sails\Documents\Coding\LightSearch"
$resourcePath = Join-Path $projectPath "resource"

# 创建 resource 文件夹结构
Write-Host "[1/5] 创建资源文件夹结构..." -ForegroundColor Yellow

$folders = @(
    "resource",
    "resource/backup",
    "resource/old-versions",
    "resource/documentation",
    "resource/scripts",
    "resource/demos",
    "resource/reports",
    "resource/snippets"
)

foreach ($folder in $folders) {
    $folderPath = Join-Path $projectPath $folder
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
        Write-Host "  ✓ Created: $folder" -ForegroundColor Green
    }
}

# 定义要移动的文件分类
Write-Host "`n[2/5] 分类文件..." -ForegroundColor Yellow

$filesToMove = @{
    # 备份文件
    'backup' = @(
        'index.html.backup-v2-20260206-211035',
        'script-new.js.backup',
        'script-new.js.backup-20260206-203135',
        'script-new.js.backup-v2-20260206-211035',
        'styles-new.css.backup-20260206-203135',
        'styles-new.css.backup-v2-20260206-211035'
    )
    
    # 旧版本文件
    'old-versions' = @(
        'index-advanced.html',
        'index-backup.html',
        'index-fixed.html',
        'index-new.html',
        'index-old.html',
        'script-old.js',
        'styles-old.css',
        'standalone.html',
        'test.html'
    )
    
    # 文档文件（过时的）
    'documentation' = @(
        'COMPLETE-FIX-GUIDE.md',
        'COMPLETION-REPORT.md',
        'CORS-FIX.md',
        'DELIVERY.md',
        'DEPLOY-READY.md',
        'DEVELOPER.md',
        'ENHANCED-COMPLETED.md',
        'ENHANCEMENT-PLAN.md',
        'FILE-CHECKLIST.md',
        'FINAL-UPDATE.md',
        'FIX-SUMMARY.md',
        'FIX-SUMMARY.txt',
        'GITHUB-PAGES-DEPLOY.md',
        'MIGRATION.md',
        'MULTILANG-COMPLETED.md',
        'MULTILANG-GUIDE.md',
        'MULTILANG-SIMPLE.md',
        'PROJECT-STRUCTURE.md',
        'PROJECT-SUMMARY.md',
        'QUICK-FIX-DONE.md',
        'QUICK-FIX.md',
        'QUICKSTART.md',
        'README-REFACTOR.md',
        'SPLIT-COMPLETED.md',
        'START-HERE.md',
        'TROUBLESHOOTING.md',
        'UPDATE-LOG.md'
    )
    
    # 脚本文件（过时的）
    'scripts' = @(
        'additional-translations.js',
        'apply-emergency-fix-v2.1.ps1',
        'apply-fixes-v2.ps1',
        'deploy-enhanced.bat',
        'deploy-github-pages.bat',
        'fix-all-issues.js',
        'fix-all.ps1',
        'fix-multilang.ps1',
        'fix-simple.ps1',
        'generate-lang-versions.bat',
        'generate-lang-versions.ps1',
        'html-text-updater.js',
        'missing-functions.js',
        'quick-test.ps1',
        'restore-working.bat',
        'split-and-fix.ps1',
        'split-and-fix.py',
        'start-server.bat',
        'test-now.bat'
    )
    
    # 演示和测试文件
    'demos' = @(
        'completion-v2.html',
        'test-fixes.html',
        'LightSearch_LiquidGlass_demo.zip'
    )
    
    # 报告文件
    'reports' = @(
        'FIX-REPORT-V2.md',
        'FIX-REPORT.md'
    )
    
    # 代码片段
    'snippets' = @(
        'lang-config.js',
        'utils.js'
    )
}

# 移动文件
Write-Host "`n[3/5] 移动文件..." -ForegroundColor Yellow

$movedFiles = @{}
$totalMoved = 0

foreach ($category in $filesToMove.Keys) {
    $categoryPath = Join-Path $resourcePath $category
    $movedFiles[$category] = @()
    
    Write-Host "`n  Category: $category" -ForegroundColor Cyan
    
    foreach ($file in $filesToMove[$category]) {
        $sourcePath = Join-Path $projectPath $file
        
        if (Test-Path $sourcePath) {
            $destPath = Join-Path $categoryPath $file
            
            try {
                Move-Item -Path $sourcePath -Destination $destPath -Force
                Write-Host "    ✓ $file" -ForegroundColor Green
                $movedFiles[$category] += $file
                $totalMoved++
            } catch {
                Write-Host "    ✗ $file (error: $_)" -ForegroundColor Red
            }
        } else {
            Write-Host "    - $file (not found)" -ForegroundColor Gray
        }
    }
}

# 移动文件夹
Write-Host "`n[4/5] 移动文件夹..." -ForegroundColor Yellow

$foldersToMove = @(
    @{ Name = 'LightSearch_LiquidGlass_demo'; Dest = 'demos' },
    @{ Name = 'snippets'; Dest = 'snippets' },
    @{ Name = 'AcademicSearch'; Dest = 'old-versions' },
    @{ Name = 'src'; Dest = 'old-versions' }
)

foreach ($folder in $foldersToMove) {
    $sourcePath = Join-Path $projectPath $folder.Name
    $destPath = Join-Path (Join-Path $resourcePath $folder.Dest) $folder.Name
    
    if (Test-Path $sourcePath) {
        try {
            if (Test-Path $destPath) {
                Remove-Item -Path $destPath -Recurse -Force
            }
            Move-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "  ✓ $($folder.Name) -> $($folder.Dest)" -ForegroundColor Green
            $totalMoved++
        } catch {
            Write-Host "  ✗ $($folder.Name) (error: $_)" -ForegroundColor Red
        }
    }
}

# 创建资源描述文档
Write-Host "`n[5/5] 创建资源描述文档..." -ForegroundColor Yellow

$resourceDoc = @"
# LightSearch 资源文件说明

**整理日期**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  
**整理版本**: v2.1  
**总计文件**: $totalMoved

---

## 📁 文件夹结构

``````
resource/
├── backup/              # 备份文件
├── old-versions/        # 旧版本文件
├── documentation/       # 过时的文档
├── scripts/            # 过时的脚本
├── demos/              # 演示和测试文件
├── reports/            # 修复报告
└── snippets/           # 代码片段
``````

---

## 📋 文件分类详情

### 1. backup/ - 备份文件

**用途**: 保存各个版本的备份文件

**文件列表**:
"@

foreach ($file in $movedFiles['backup']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**说明**: 这些是在修复过程中创建的备份文件，用于在出现问题时恢复。

**是否需要**: ⚠️ 建议保留一段时间，确认新版本稳定后可删除

---

### 2. old-versions/ - 旧版本文件

**用途**: 保存项目的旧版本和废弃的文件

**文件列表**:
"@

foreach ($file in $movedFiles['old-versions']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**文件夹**:
- ``AcademicSearch/`` - 旧的学术搜索独立版本
- ``src/`` - 旧的模块化源代码结构

**说明**: 这些是项目早期版本的文件，已被新版本替代。

**是否需要**: ❌ 可以安全删除，除非需要参考旧代码

---

### 3. documentation/ - 过时的文档

**用途**: 保存过时的文档和指南

**文件列表**:
"@

foreach ($file in $movedFiles['documentation']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**说明**: 这些文档记录了项目的开发过程和各个阶段的状态，但已被新文档替代。

**是否需要**: 📖 可以保留作为历史记录，但不再需要参考

---

### 4. scripts/ - 过时的脚本

**用途**: 保存过时的构建、部署和修复脚本

**文件列表**:
"@

foreach ($file in $movedFiles['scripts']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**说明**: 这些脚本用于早期的开发和修复工作，已被新脚本替代。

**是否需要**: ❌ 可以安全删除

---

### 5. demos/ - 演示和测试文件

**用途**: 保存演示页面和测试文件

**文件列表**:
"@

foreach ($file in $movedFiles['demos']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**文件夹**:
- ``LightSearch_LiquidGlass_demo/`` - LiquidGlass 效果演示

**说明**: 这些是用于展示功能和测试的文件。

**是否需要**: 📦 可以保留作为参考，或打包归档

---

### 6. reports/ - 修复报告

**用途**: 保存各个版本的修复报告

**文件列表**:
"@

foreach ($file in $movedFiles['reports']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**说明**: 这些报告详细记录了每次修复的内容和结果。

**是否需要**: 📊 建议保留作为项目历史记录

---

### 7. snippets/ - 代码片段

**用途**: 保存可重用的代码片段

**文件列表**:
"@

foreach ($file in $movedFiles['snippets']) {
    $resourceDoc += "`n- ``$file``"
}

$resourceDoc += @"


**文件夹**:
- ``snippets/`` - 各种代码片段和示例

**说明**: 这些是开发过程中创建的代码片段，可能在未来有用。

**是否需要**: 💡 建议保留，可能在未来开发中参考

---

## 🗂️ 当前项目结构（整理后）

### 核心文件
- ``index.html`` - 主应用页面
- ``index-test.html`` - 调试模式页面
- ``index-test-new.html`` - 新调试页面
- ``script-new.js`` - 主脚本（已集成所有功能）
- ``script.js`` - 原始脚本（保留兼容性）
- ``script-test.js`` - 调试脚本
- ``styles-new.css`` - 主样式（已集成增强样式）
- ``styles.css`` - 原始样式（保留兼容性）

### 增强功能文件
- ``emergency-fix-v2.1.js`` - 紧急修复脚本
- ``enhanced-features.js`` - 增强功能脚本
- ``enhanced-styles.css`` - 增强样式

### 文档文件
- ``README.md`` - 项目说明
- ``LICENSE`` - 许可证
- ``USAGE-GUIDE-v2.1.md`` - 使用指南

### 配置文件
- ``icon.png`` - 应用图标
- ``.nojekyll`` - GitHub Pages 配置
- ``BingSiteAuth.xml`` - Bing 站点验证

### 多语言文件
- ``locales/`` - 语言文件目录
  - ``en.json`` - 英语
  - ``zh.json`` - 简体中文
  - ``ja.json`` - 日语
  - ``ko.json`` - 韩语
  - ``ru.json`` - 俄语

---

## 📊 整理统计

- **总计移动文件**: $totalMoved
- **备份文件**: $($movedFiles['backup'].Count)
- **旧版本文件**: $($movedFiles['old-versions'].Count)
- **文档文件**: $($movedFiles['documentation'].Count)
- **脚本文件**: $($movedFiles['scripts'].Count)
- **演示文件**: $($movedFiles['demos'].Count)
- **报告文件**: $($movedFiles['reports'].Count)
- **代码片段**: $($movedFiles['snippets'].Count)

---

## 🧹 清理建议

### 可以立即删除
- ``backup/`` - 确认新版本稳定后（建议保留1周）
- ``scripts/`` - 所有过时脚本
- ``old-versions/`` - 除非需要参考旧代码

### 建议保留
- ``reports/`` - 作为项目历史记录
- ``snippets/`` - 可能在未来开发中使用
- ``documentation/`` - 作为开发过程记录

### 可以归档
- ``demos/`` - 打包为 zip 文件归档

---

## 🔄 恢复文件

如需恢复某个文件，使用以下命令：

``````powershell
# 恢复单个文件
Move-Item "resource/[category]/[filename]" "./"

# 恢复整个分类
Move-Item "resource/[category]/*" "./"
``````

---

## 📝 维护建议

1. **定期清理**: 每月检查 resource 文件夹
2. **备份管理**: 保留最近3个版本的备份
3. **文档归档**: 将过时文档打包归档
4. **脚本清理**: 删除不再使用的脚本

---

**整理完成**: ✅  
**下一步**: 测试项目功能，确认无遗漏文件
"@

$docPath = Join-Path $resourcePath "resourceid&describe.md"
[System.IO.File]::WriteAllText($docPath, $resourceDoc, [System.Text.Encoding]::UTF8)
Write-Host "  ✓ Resource documentation created" -ForegroundColor Green

# 生成摘要
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "整理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "统计信息:" -ForegroundColor Yellow
Write-Host "  总计移动: $totalMoved 个文件/文件夹" -ForegroundColor White
Write-Host "  备份文件: $($movedFiles['backup'].Count)" -ForegroundColor White
Write-Host "  旧版本: $($movedFiles['old-versions'].Count)" -ForegroundColor White
Write-Host "  文档: $($movedFiles['documentation'].Count)" -ForegroundColor White
Write-Host "  脚本: $($movedFiles['scripts'].Count)" -ForegroundColor White
Write-Host "  演示: $($movedFiles['demos'].Count)" -ForegroundColor White
Write-Host "  报告: $($movedFiles['reports'].Count)" -ForegroundColor White
Write-Host "  代码片段: $($movedFiles['snippets'].Count)" -ForegroundColor White
Write-Host ""
Write-Host "资源文档: resource/resourceid&describe.md" -ForegroundColor Cyan
Write-Host ""

# 显示当前项目结构
Write-Host "当前项目核心文件:" -ForegroundColor Yellow
$coreFiles = @(
    'index.html',
    'index-test.html',
    'script-new.js',
    'styles-new.css',
    'emergency-fix-v2.1.js',
    'README.md',
    'USAGE-GUIDE-v2.1.md'
)

foreach ($file in $coreFiles) {
    $filePath = Join-Path $projectPath $file
    if (Test-Path $filePath) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing!)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "建议:" -ForegroundColor Yellow
Write-Host "  1. 测试项目功能，确认无遗漏文件" -ForegroundColor White
Write-Host "  2. 查看 resource/resourceid&describe.md 了解详情" -ForegroundColor White
Write-Host "  3. 确认稳定后，可删除 resource/backup/" -ForegroundColor White
Write-Host ""
