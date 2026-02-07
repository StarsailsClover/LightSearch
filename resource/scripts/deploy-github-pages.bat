@echo off
REM LightSearch - GitHub Pages 部署脚本
REM 自动准备 GitHub Pages 部署文件

echo ========================================
echo   LightSearch GitHub Pages 部署准备
echo ========================================
echo.

echo [1/5] 检查文件...
if not exist "index.html" (
    echo [错误] index.html 不存在
    pause
    exit /b 1
)
if not exist ".nojekyll" (
    echo [错误] .nojekyll 不存在
    pause
    exit /b 1
)
echo [✓] 文件检查完成

echo.
echo [2/5] 检查 Git 仓库...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 当前目录不是 Git 仓库
    echo 请先初始化 Git 仓库：
    echo   git init
    echo   git remote add origin https://github.com/StarsailsClover/LightSearch.git
    pause
    exit /b 1
)
echo [✓] Git 仓库检查完成

echo.
echo [3/5] 添加文件到 Git...
git add .
echo [✓] 文件已添加

echo.
echo [4/5] 提交更改...
git commit -m "Deploy to GitHub Pages"
if %errorlevel% neq 0 (
    echo [提示] 没有新的更改需要提交
)
echo [✓] 提交完成

echo.
echo [5/5] 推送到 GitHub...
echo [提示] 即将推送到远程仓库
echo 按任意键继续，或 Ctrl+C 取消
pause >nul

git push origin main
if %errorlevel% neq 0 (
    echo.
    echo [错误] 推送失败
    echo 可能的原因：
    echo   1. 远程仓库未设置
    echo   2. 没有推送权限
    echo   3. 网络连接问题
    echo.
    echo 请手动执行：
    echo   git push origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo   部署准备完成！
echo ========================================
echo.
echo 下一步：
echo 1. 访问 GitHub 仓库设置
echo 2. 进入 Settings ^> Pages
echo 3. Source 选择 main 分支
echo 4. 点击 Save
echo 5. 等待几分钟后访问：
echo    https://StarsailsClover.github.io/LightSearch
echo.
pause
