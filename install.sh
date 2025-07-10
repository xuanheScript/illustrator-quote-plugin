#!/bin/bash

# Illustrator 报价插件安装脚本 (macOS/Linux)

echo "🚀 开始安装 Illustrator 报价插件..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：请先安装 Node.js"
    echo "   下载地址：https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "🔨 构建插件..."
npm run build:cep

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 设置 CEP 扩展目录
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CEP_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
    echo "🍎 检测到 macOS 系统"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CEP_DIR="$HOME/.adobe/CEP/extensions"
    echo "🐧 检测到 Linux 系统"
else
    echo "❌ 不支持的操作系统：$OSTYPE"
    echo "   请手动复制 dist 文件夹到 CEP 扩展目录"
    exit 1
fi

PLUGIN_DIR="$CEP_DIR/com.illustrator.quote.panel"

echo "📁 CEP 扩展目录：$CEP_DIR"

# 创建 CEP 扩展目录（如果不存在）
mkdir -p "$CEP_DIR"

# 删除现有插件（如果存在）
if [ -d "$PLUGIN_DIR" ]; then
    echo "🗑️  删除现有插件..."
    rm -rf "$PLUGIN_DIR"
fi

# 复制插件文件
echo "📋 复制插件文件..."
cp -r dist "$PLUGIN_DIR"

if [ $? -ne 0 ]; then
    echo "❌ 复制失败"
    exit 1
fi

# 启用 CEP 调试模式 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🔧 启用 CEP 调试模式..."
    defaults write com.adobe.CSXS.10 PlayerDebugMode 1
    defaults write com.adobe.CSXS.11 PlayerDebugMode 1
    echo "   调试模式已启用"
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "📌 下一步："
echo "   1. 重启 Adobe Illustrator"
echo "   2. 菜单栏 → 窗口 → 扩展 → Illustrator Quote"
echo "   3. 插件面板将显示在右侧"
echo ""
echo "🛠️  如果插件不显示，请检查："
echo "   - Illustrator 版本是否支持 CEP 扩展"
echo "   - 是否已重启 Illustrator"
echo "   - 调试模式是否正确启用"
echo ""
echo "📖 详细使用说明请查看 README.md" 