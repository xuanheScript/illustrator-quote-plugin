#!/bin/bash

echo "🚀 CEP 12 插件部署和测试脚本"
echo "=================================="

# 1. 构建插件
echo "📦 构建插件..."
npm run build:cep

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 2. 检查调试模式
echo "🔍 检查调试模式..."
DEBUG_MODE=$(defaults read com.adobe.CSXS.12 PlayerDebugMode 2>/dev/null || echo "0")
if [ "$DEBUG_MODE" != "1" ]; then
    echo "⚠️  启用 CEP 12 调试模式..."
    defaults write com.adobe.CSXS.12 PlayerDebugMode 1
    echo "✅ 调试模式已启用"
else
    echo "✅ 调试模式已启用"
fi

# 3. 设置插件安装目录
CEP_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
PLUGIN_DIR="$CEP_DIR/com.illustrator.quote.panel"

echo "📁 设置插件目录: $PLUGIN_DIR"

# 4. 创建目录（如果不存在）
mkdir -p "$CEP_DIR"

# 5. 删除旧版本（如果存在）
if [ -d "$PLUGIN_DIR" ]; then
    echo "🗑️  删除旧版本..."
    rm -rf "$PLUGIN_DIR"
fi

# 6. 复制新版本
echo "📋 复制插件文件..."
cp -r dist "$PLUGIN_DIR"

# 7. 验证文件
echo "🔍 验证插件文件..."
REQUIRED_FILES=(
    "index.html"
    "CSXS/manifest.xml"
    "jsx/applyMaterial.jsx"
    "jsx/exportQuote.jsx"
    "lib/CSInterface.js"
    "assets/index.js"
    ".debug"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$PLUGIN_DIR/$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - 缺失"
    fi
done

# 8. 检查 Extension ID 匹配
echo "🔍 检查 Extension ID 匹配..."
MANIFEST_ID=$(grep -o 'Id="[^"]*"' "$PLUGIN_DIR/CSXS/manifest.xml" | head -1 | sed 's/Id="//;s/"//')
DEBUG_ID=$(grep -o 'Id="[^"]*"' "$PLUGIN_DIR/.debug" | sed 's/Id="//;s/"//')

if [ "$MANIFEST_ID" = "$DEBUG_ID" ]; then
    echo "✅ Extension ID 匹配: $MANIFEST_ID"
else
    echo "❌ Extension ID 不匹配:"
    echo "   manifest.xml: $MANIFEST_ID"
    echo "   .debug: $DEBUG_ID"
fi

# 9. 显示调试信息
echo ""
echo "🎯 调试信息:"
echo "   插件目录: $PLUGIN_DIR"
echo "   调试端口: http://localhost:8088"
echo "   Extension ID: $MANIFEST_ID"

# 10. 检查 Illustrator 进程
echo ""
echo "🎨 检查 Illustrator 状态..."
if pgrep -f "Adobe Illustrator" > /dev/null; then
    echo "⚠️  Illustrator 正在运行"
    echo "   建议重启 Illustrator 以加载新插件"
    echo "   或者使用: pkill -f 'Adobe Illustrator'"
else
    echo "✅ Illustrator 未运行"
fi

# 11. 测试调试端口
echo ""
echo "🌐 测试调试端口..."
if command -v curl > /dev/null; then
    # 启动 Illustrator 并等待几秒
    echo "🚀 启动 Illustrator..."
    open -a "Adobe Illustrator 2025" 2>/dev/null || open -a "Adobe Illustrator" 2>/dev/null
    
    echo "⏳ 等待 Illustrator 启动..."
    sleep 5
    
    # 测试调试端口
    if curl -s http://localhost:8088 > /dev/null; then
        echo "✅ 调试端口 8088 可访问"
        echo "   在浏览器中打开: http://localhost:8088"
    else
        echo "❌ 调试端口 8088 不可访问"
        echo "   请检查:"
        echo "   1. Illustrator 是否已启动"
        echo "   2. 插件是否正确安装"
        echo "   3. 调试模式是否启用"
    fi
else
    echo "⚠️  curl 命令不可用，跳过端口测试"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 下一步操作:"
echo "1. 确保 Illustrator 2025 已启动"
echo "2. 在菜单中找到: 窗口 → 扩展 → Illustrator Quote"
echo "3. 打开浏览器访问: http://localhost:8088"
echo "4. 选择 'com.illustrator.quote.panel' 进行调试"
echo ""
echo "🐛 如果遇到问题:"
echo "1. 检查 Console 选项卡的错误信息"
echo "2. 确认 JSON 错误是否已修复"
echo "3. 测试平方符号显示是否正常"
echo ""
echo "📞 需要帮助？查看 DEBUG_GUIDE.md 获取详细调试指南" 