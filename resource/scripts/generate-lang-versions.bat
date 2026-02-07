@echo off
REM LightSearch - 多语言版本生成脚本
echo ========================================
echo   LightSearch 多语言版本生成工具
echo ========================================
echo.

echo [信息] 正在生成多语言版本...
echo.

REM 使用 PowerShell 生成文件
powershell -ExecutionPolicy Bypass -File "generate-lang-versions.ps1"

if %errorlevel% neq 0 (
    echo [错误] 生成失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   生成完成！
echo ========================================
echo.
echo 已生成以下文件：
echo   ✓ index.html (English)
echo   ✓ index-zh.html (简体中文)
echo   ✓ index-ja.html (日本語)
echo   ✓ index-ko.html (한국어)
echo   ✓ index-ru.html (Русский)
echo.
pause
