@echo off
REM LightSearch 增强版部署脚本

echo ========================================
echo   LightSearch 增强版部署
echo ========================================
echo.

echo [1/5] 备份当前文件...
if exist index.html (
    copy /Y index.html index-old.html >nul
    echo   ✓ 已备份 index.html
)
if exist styles.css (
    copy /Y styles.css styles-old.css >nul
    echo   ✓ 已备份 styles.css
)
if exist script.js (
    copy /Y script.js script-old.js >nul
    echo   ✓ 已备份 script.js
)

echo.
echo [2/5] 部署新文件...
copy /Y index-new.html index.html >nul
copy /Y styles-new.css styles.css >nul
copy /Y script-new.js script.js >nul
echo   ✓ 新文件已部署

echo.
echo [3/5] 验证文件...
if exist index.html (
    echo   ✓ index.html
) else (
    echo   ✗ index.html 缺失
)
if exist styles.css (
    echo   ✓ styles.css
) else (
    echo   ✗ styles.css 缺失
)
if exist script.js (
    echo   ✓ script.js
) else (
    echo   ✗ script.js 缺失
)
if exist icon.png (
    echo   ✓ icon.png
) else (
    echo   ! icon.png 未找到（可选）
)

echo.
echo [4/5] 清理临时文件...
if exist index-new.html del index-new.html
if exist styles-new.css del styles-new.css
if exist script-new.js del script-new.js
echo   ✓ 临时文件已清理

echo.
echo [5/5] 完成！
echo.
echo ========================================
echo   ✅ 增强版部署完成！
echo ========================================
echo.
echo 新功能：
echo   ✓ 多语言支持（5种语言）
echo   ✓ 暗黑模式修复
echo   ✓ 设置需保存才应用
echo   ✓ 背景上传（图片/视频）
echo   ✓ 毛玻璃效果调节
echo   ✓ 强调色自定义
echo   ✓ Liquid Glass主题
echo   ✓ Logo动画
echo   ✓ 弹窗可拖动
echo.
echo 立即测试：
echo   双击 index.html 或运行 test-now.bat
echo.
pause
