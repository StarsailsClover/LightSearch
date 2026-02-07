@echo off
echo 正在修复 LightSearch...

REM 备份当前文件
copy /Y index.html index-old-broken.html >nul

REM 使用standalone.html作为基础
copy /Y standalone.html index.html >nul

echo ✅ 已恢复为standalone.html版本
echo.
echo 现在需要手动添加多语言支持
echo 请查看 MANUAL-FIX.md 获取详细步骤
echo.
pause
