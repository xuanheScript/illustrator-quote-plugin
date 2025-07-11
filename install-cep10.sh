#!/bin/bash

# Illustrator Quote Plugin - CEP 10 安装脚本
# 兼容 Adobe Illustrator 2021-2024

echo "🚀 开始安装 Illustrator Quote Plugin (CEP 10版本)"
echo "📋 兼容版本: Adobe Illustrator 2021-2024"
echo ""

# 检查操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    EXTENSIONS_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
    PLIST_PATH="$HOME/Library/Preferences/com.adobe.CSXS.10.plist"
    echo "🍎 检测到 macOS 系统"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    EXTENSIONS_DIR="$HOME/.adobe/CEP/extensions"
    echo "🐧 检测到 Linux 系统"
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    echo "请使用 Windows 批处理文件 install-cep10.bat"
    exit 1
fi

# 创建扩展目录
echo "📁 创建扩展目录..."
mkdir -p "$EXTENSIONS_DIR"

# 设置插件目录
PLUGIN_DIR="$EXTENSIONS_DIR/illustrator-quote-plugin-cep10"

# 检查是否已存在旧版本
if [ -d "$PLUGIN_DIR" ]; then
    echo "⚠️  发现已存在的插件版本"
    read -p "是否删除并重新安装? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  删除旧版本..."
        rm -rf "$PLUGIN_DIR"
    else
        echo "❌ 安装已取消"
        exit 1
    fi
fi

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
    echo "📦 构建插件..."
    if command -v yarn &> /dev/null; then
        yarn install
        yarn build:cep
    elif command -v npm &> /dev/null; then
        npm install
        npm run build:cep
    else
        echo "❌ 未找到 yarn 或 npm，请先安装 Node.js"
        exit 1
    fi
fi

# 复制插件文件
echo "📋 复制插件文件..."
cp -r dist "$PLUGIN_DIR"

# 设置权限
echo "🔐 设置文件权限..."
chmod -R 755 "$PLUGIN_DIR"

# 启用 CEP 10 调试模式 (仅 macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🔧 启用 CEP 10 调试模式..."
    defaults write com.adobe.CSXS.10 PlayerDebugMode 1
    echo "✅ CEP 10 调试模式已启用"
fi

# 验证安装
echo ""
echo "🔍 验证安装..."
if [ -f "$PLUGIN_DIR/index.html" ] && [ -f "$PLUGIN_DIR/CSXS/manifest.xml" ]; then
    echo "✅ 插件文件安装成功"
    echo "📍 安装路径: $PLUGIN_DIR"
    echo ""
    echo "🎉 安装完成！"
    echo ""
    echo "📖 使用说明:"
    echo "1. 重启 Adobe Illustrator"
    echo "2. 菜单栏 → 窗口 → 扩展 → Illustrator Quote (CEP 10)"
    echo "3. 如果插件不显示，请检查 Illustrator 版本是否为 2021-2024"
    echo ""
    echo "🔧 调试信息:"
    echo "- CEP 版本: 10.0"
    echo "- 支持的 Illustrator 版本: 2021-2024 (25.0-28.9)"
    echo "- 调试端口: http://localhost:8080"
    echo ""
    echo "❓ 如有问题，请查看故障排除指南:"
    echo "   https://github.com/yourusername/illustrator-quote-plugin/blob/cep10-support/README.md"
else
    echo "❌ 安装失败，请检查文件权限和路径"
    exit 1
fi 