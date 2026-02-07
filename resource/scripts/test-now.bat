@echo off
echo ========================================
echo   LightSearch 快速测试
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 测试清单：
echo [1] 页面正常加载
echo [2] 暗黑模式输入框（无白色撕裂）
echo [3] 语言切换功能
echo [4] 所有基础功能
echo.
echo 服务器地址: http://localhost:8000/index.html
echo.
echo 按 Ctrl+C 停止服务器
echo.

timeout /t 2 /nobreak >nul
start http://localhost:8000/index.html

python -m http.server 8000
