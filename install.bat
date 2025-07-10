@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始安装 Illustrator 报价插件...
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：请先安装 Node.js
    echo    下载地址：https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：请先安装 npm
    pause
    exit /b 1
)

echo 📦 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo 🔨 构建插件...
call npm run build:cep
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 设置 CEP 扩展目录
set "CEP_DIR=%APPDATA%\Adobe\CEP\extensions"
set "PLUGIN_DIR=%CEP_DIR%\com.illustrator.quote.panel"

echo 💻 检测到 Windows 系统
echo 📁 CEP 扩展目录：%CEP_DIR%

REM 创建 CEP 扩展目录（如果不存在）
if not exist "%CEP_DIR%" (
    mkdir "%CEP_DIR%"
)

REM 删除现有插件（如果存在）
if exist "%PLUGIN_DIR%" (
    echo 🗑️  删除现有插件...
    rmdir /s /q "%PLUGIN_DIR%"
)

REM 复制插件文件
echo 📋 复制插件文件...
xcopy /e /i /y "dist" "%PLUGIN_DIR%"
if errorlevel 1 (
    echo ❌ 复制失败
    pause
    exit /b 1
)

REM 启用 CEP 调试模式
echo 🔧 启用 CEP 调试模式...
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo    调试模式已启用

echo.
echo ✅ 安装完成！
echo.
echo 📌 下一步：
echo    1. 重启 Adobe Illustrator
echo    2. 菜单栏 → 窗口 → 扩展 → Illustrator Quote
echo    3. 插件面板将显示在右侧
echo.
echo 🛠️  如果插件不显示，请检查：
echo    - Illustrator 版本是否支持 CEP 扩展
echo    - 是否已重启 Illustrator
echo    - 调试模式是否正确启用
echo.
echo 📖 详细使用说明请查看 README.md
echo.
pause 