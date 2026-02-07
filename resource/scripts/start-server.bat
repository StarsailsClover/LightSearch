@echo off
REM LightSearch 启动脚本
REM 支持多个版本

echo ========================================
echo   LightSearch 本地服务器启动工具
echo ========================================
echo.
echo 请选择要启动的版本：
echo.
echo [1] 标准版 (index.html - 英文)
echo [2] 高级版 (index-advanced.html - 完整功能)
echo [3] 中文版 (index-zh.html)
echo [4] 日文版 (index-ja.html)
echo [5] 韩文版 (index-ko.html)
echo [6] 俄文版 (index-ru.html)
echo.
set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" set page=index.html
if "%choice%"=="2" set page=index-advanced.html
if "%choice%"=="3" set page=index-zh.html
if "%choice%"=="4" set page=index-ja.html
if "%choice%"=="5" set page=index-ko.html
if "%choice%"=="6" set page=index-ru.html

if not defined page (
    echo [错误] 无效的选项
    pause
    exit /b 1
)

REM 检查 Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python
    pause
    exit /b 1
)

echo.
echo [信息] 正在启动服务器...
echo [信息] 页面: %page%
echo [信息] 地址: http://localhost:8000/%page%
echo.
echo 按 Ctrl+C 可停止服务器
echo.

REM 启动浏览器
timeout /t 2 /nobreak >nul
start http://localhost:8000/%page%

REM 启动服务器
python -m http.server 8000
