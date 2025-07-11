@echo off
chcp 65001 >nul

REM Illustrator Quote Plugin - CEP 10 安装脚本 (Windows)
REM 兼容 Adobe Illustrator 2021-2024

echo 🚀 开始安装 Illustrator Quote Plugin (CEP 10版本)
echo 📋 兼容版本: Adobe Illustrator 2021-2024
echo.

REM 设置扩展目录
set "EXTENSIONS_DIR=%APPDATA%\Adobe\CEP\extensions"
set "PLUGIN_DIR=%EXTENSIONS_DIR%\illustrator-quote-plugin-cep10"

echo 🖥️ 检测到 Windows 系统
echo.

REM 创建扩展目录
echo 📁 创建扩展目录...
if not exist "%EXTENSIONS_DIR%" mkdir "%EXTENSIONS_DIR%"

REM 检查是否已存在旧版本
if exist "%PLUGIN_DIR%" (
    echo ⚠️  发现已存在的插件版本
    set /p "choice=是否删除并重新安装? (y/n): "
    if /i "%choice%"=="y" (
        echo 🗑️  删除旧版本...
        rmdir /s /q "%PLUGIN_DIR%"
    ) else (
        echo ❌ 安装已取消
        pause
        exit /b 1
    )
)

REM 检查 dist 目录是否存在
if not exist "dist" (
    echo 📦 构建插件...
    where yarn >nul 2>&1
    if %errorlevel% equ 0 (
        call yarn install
        call yarn build:cep
    ) else (
        where npm >nul 2>&1
        if %errorlevel% equ 0 (
            call npm install
            call npm run build:cep
        ) else (
            echo ❌ 未找到 yarn 或 npm，请先安装 Node.js
            pause
            exit /b 1
        )
    )
)

REM 复制插件文件
echo 📋 复制插件文件...
xcopy /e /i /h /y "dist" "%PLUGIN_DIR%"

REM 启用 CEP 10 调试模式
echo 🔧 启用 CEP 10 调试模式...
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ CEP 10 调试模式已启用
) else (
    echo ⚠️  无法启用调试模式，请手动设置注册表
)

REM 验证安装
echo.
echo 🔍 验证安装...
if exist "%PLUGIN_DIR%\index.html" (
    if exist "%PLUGIN_DIR%\CSXS\manifest.xml" (
        echo ✅ 插件文件安装成功
        echo 📍 安装路径: %PLUGIN_DIR%
        echo.
        echo 🎉 安装完成！
        echo.
        echo 📖 使用说明:
        echo 1. 重启 Adobe Illustrator
        echo 2. 菜单栏 → 窗口 → 扩展 → Illustrator Quote (CEP 10)
        echo 3. 如果插件不显示，请检查 Illustrator 版本是否为 2021-2024
        echo.
        echo 🔧 调试信息:
        echo - CEP 版本: 10.0
        echo - 支持的 Illustrator 版本: 2021-2024 (25.0-28.9)
        echo - 调试端口: http://localhost:8080
        echo.
        echo ❓ 如有问题，请查看故障排除指南:
        echo   https://github.com/yourusername/illustrator-quote-plugin/blob/cep10-support/README.md
        echo.
        echo 按任意键退出...
        pause >nul
    ) else (
        echo ❌ 安装失败，manifest.xml 文件缺失
        pause
        exit /b 1
    )
) else (
    echo ❌ 安装失败，请检查文件权限和路径
    pause
    exit /b 1
) 