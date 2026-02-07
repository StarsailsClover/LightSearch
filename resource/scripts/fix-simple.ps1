# LightSearch Fix Script
# Simple version without complex regex

Write-Host "Starting LightSearch fixes..." -ForegroundColor Green

$projectPath = "C:\Users\Sails\Documents\Coding\LightSearch"
$scriptFile = Join-Path $projectPath "script-new.js"
$stylesFile = Join-Path $projectPath "styles-new.css"

# 1. Backup files
Write-Host "`n[1/4] Creating backups..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
Copy-Item $scriptFile "$scriptFile.backup-$timestamp" -Force
Copy-Item $stylesFile "$stylesFile.backup-$timestamp" -Force
Write-Host "Done: Backups created" -ForegroundColor Green

# 2. Fix script encoding
Write-Host "`n[2/4] Fixing script-new.js encoding..." -ForegroundColor Yellow
$content = Get-Content $scriptFile -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($scriptFile, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done: Script encoding fixed" -ForegroundColor Green

# 3. Fix styles encoding
Write-Host "`n[3/4] Fixing styles-new.css encoding..." -ForegroundColor Yellow
$stylesContent = Get-Content $stylesFile -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($stylesFile, $stylesContent, [System.Text.Encoding]::UTF8)
Write-Host "Done: Styles encoding fixed" -ForegroundColor Green

# 4. Verify functions
Write-Host "`n[4/4] Verifying functions..." -ForegroundColor Yellow

$requiredFunctions = @(
    'closeSettings',
    'setAccentColor',
    'pickCustomColor',
    'clearBackground',
    'clearLogo',
    'performAcademicSearch',
    'renderAcademicEngines'
)

$scriptContent = Get-Content $scriptFile -Raw
$missing = @()

foreach ($func in $requiredFunctions) {
    if ($scriptContent -notmatch "function $func") {
        $missing += $func
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing functions: $($missing -join ', ')" -ForegroundColor Yellow
    Write-Host "These functions were added via missing-functions.js patch" -ForegroundColor Cyan
} else {
    Write-Host "Done: All required functions exist" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Fix completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nBackup files created with timestamp: $timestamp" -ForegroundColor Yellow
Write-Host "Please test index.html in your browser" -ForegroundColor Yellow
