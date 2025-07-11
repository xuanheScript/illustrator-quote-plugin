#!/bin/bash

# Illustrator Quote Plugin - 自动版本检测安装脚本
# 自动检测 Illustrator 版本并安装对应的 CEP 版本

echo "🚀 Illustrator Quote Plugin - 自动安装"
echo "🔍 正在检测您的 Illustrator 版本..."
echo ""

# 检查操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 检测到 macOS 系统"
    
    # 检查 Illustrator 安装路径
    AI_2025_PATH="/Applications/Adobe Illustrator 2025/Adobe Illustrator.app"
    AI_2024_PATH="/Applications/Adobe Illustrator 2024/Adobe Illustrator.app"
    AI_2023_PATH="/Applications/Adobe Illustrator 2023/Adobe Illustrator.app"
    AI_2022_PATH="/Applications/Adobe Illustrator 2022/Adobe Illustrator.app"
    AI_2021_PATH="/Applications/Adobe Illustrator 2021/Adobe Illustrator.app"
    
    # 检测最新版本
    if [ -d "$AI_2025_PATH" ]; then
        DETECTED_VERSION="2025"
        RECOMMENDED_CEP="CEP 12"
        INSTALL_SCRIPT="install.sh"
    elif [ -d "$AI_2024_PATH" ]; then
        DETECTED_VERSION="2024"
        RECOMMENDED_CEP="CEP 10"
        INSTALL_SCRIPT="install-cep10.sh"
    elif [ -d "$AI_2023_PATH" ]; then
        DETECTED_VERSION="2023"
        RECOMMENDED_CEP="CEP 10"
        INSTALL_SCRIPT="install-cep10.sh"
    elif [ -d "$AI_2022_PATH" ]; then
        DETECTED_VERSION="2022"
        RECOMMENDED_CEP="CEP 10"
        INSTALL_SCRIPT="install-cep10.sh"
    elif [ -d "$AI_2021_PATH" ]; then
        DETECTED_VERSION="2021"
        RECOMMENDED_CEP="CEP 10"
        INSTALL_SCRIPT="install-cep10.sh"
    else
        echo "❌ 未检测到 Adobe Illustrator 安装"
        echo "请确保已安装 Adobe Illustrator 2021 或更高版本"
        exit 1
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 检测到 Linux 系统"
    echo "⚠️  Linux 系统无法自动检测 Illustrator 版本"
    echo "请手动选择安装版本"
    
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    echo "请使用 Windows 批处理文件 install-auto.bat"
    exit 1
fi

# 显示检测结果
echo "✅ 检测完成！"
echo ""
echo "📋 检测结果:"
echo "- Illustrator 版本: $DETECTED_VERSION"
echo "- 推荐 CEP 版本: $RECOMMENDED_CEP"
echo "- 安装脚本: $INSTALL_SCRIPT"
echo ""

# 版本兼容性说明
echo "📖 版本兼容性说明:"
echo "┌─────────────────┬──────────┬─────────────────┐"
echo "│ Illustrator版本 │ CEP版本  │ 功能特性        │"
echo "├─────────────────┼──────────┼─────────────────┤"
echo "│ 2025+          │ CEP 12   │ 最新功能+性能   │"
echo "│ 2021-2024      │ CEP 10   │ 稳定兼容版本    │"
echo "└─────────────────┴──────────┴─────────────────┘"
echo ""

# 询问用户是否继续
read -p "是否继续安装推荐版本? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 开始安装..."
    echo ""
    
    # 确保脚本有执行权限
    chmod +x "$INSTALL_SCRIPT"
    
    # 执行对应的安装脚本
    if [ -f "$INSTALL_SCRIPT" ]; then
        ./"$INSTALL_SCRIPT"
    else
        echo "❌ 安装脚本 $INSTALL_SCRIPT 不存在"
        echo "请检查文件是否完整或手动安装"
        exit 1
    fi
    
else
    echo ""
    echo "📋 手动安装选项:"
    echo ""
    echo "🔹 CEP 12 版本 (Illustrator 2025+):"
    echo "   ./install.sh"
    echo ""
    echo "🔹 CEP 10 版本 (Illustrator 2021-2024):"
    echo "   ./install-cep10.sh"
    echo ""
    echo "💡 提示: 选择与您的 Illustrator 版本匹配的 CEP 版本"
    echo "❌ 安装已取消"
fi 