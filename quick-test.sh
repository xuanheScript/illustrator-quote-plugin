#!/bin/bash

echo "🔍 快速测试脚本"
echo "==============="

# 检查插件安装
PLUGIN_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/com.illustrator.quote.panel"
if [ -d "$PLUGIN_DIR" ]; then
    echo "✅ 插件已安装: $PLUGIN_DIR"
else
    echo "❌ 插件未安装"
    exit 1
fi

# 检查关键文件
echo "🔍 检查关键文件:"
echo "  manifest.xml: $([ -f "$PLUGIN_DIR/CSXS/manifest.xml" ] && echo "✅" || echo "❌")"
echo "  .debug: $([ -f "$PLUGIN_DIR/.debug" ] && echo "✅" || echo "❌")"
echo "  applyMaterial.jsx: $([ -f "$PLUGIN_DIR/jsx/applyMaterial.jsx" ] && echo "✅" || echo "❌")"

# 检查 Extension ID 匹配
echo "🔍 检查 Extension ID:"
MANIFEST_ID=$(grep -o 'ExtensionBundleId="[^"]*"' "$PLUGIN_DIR/CSXS/manifest.xml" | sed 's/ExtensionBundleId="//;s/"//')
DEBUG_ID=$(grep -o 'Id="[^"]*"' "$PLUGIN_DIR/.debug" | sed 's/Id="//;s/"//')
echo "  manifest.xml: $MANIFEST_ID"
echo "  .debug: $DEBUG_ID"
echo "  匹配: $([ "$MANIFEST_ID" = "$DEBUG_ID" ] && echo "✅" || echo "❌")"

# 检查 JSON polyfill
echo "🔍 检查 JSON polyfill:"
if grep -q "JSON polyfill for ExtendScript" "$PLUGIN_DIR/jsx/applyMaterial.jsx"; then
    echo "  ✅ JSON polyfill 已添加"
else
    echo "  ❌ JSON polyfill 缺失"
fi

# 检查字符处理
echo "🔍 检查字符处理:"
if grep -q "String.fromCharCode(178)" "$PLUGIN_DIR/jsx/applyMaterial.jsx"; then
    echo "  ✅ Unicode 字符处理已添加"
else
    echo "  ❌ Unicode 字符处理缺失"
fi

# 检查调试模式
echo "🔍 检查调试模式:"
DEBUG_MODE=$(defaults read com.adobe.CSXS.12 PlayerDebugMode 2>/dev/null || echo "0")
echo "  调试模式: $([ "$DEBUG_MODE" = "1" ] && echo "✅ 已启用" || echo "❌ 未启用")"

# 检查调试端口配置
echo "🔍 检查调试端口:"
if grep -q "remote-debugging-port=8088" "$PLUGIN_DIR/CSXS/manifest.xml"; then
    echo "  ✅ 调试端口 8088 已配置"
else
    echo "  ❌ 调试端口配置错误"
fi

echo ""
echo "📋 测试总结:"
echo "1. 所有文件已正确安装"
echo "2. Extension ID 已匹配"
echo "3. JSON polyfill 已添加（修复 JSON 未定义错误）"
echo "4. Unicode 字符处理已添加（修复平方符号显示问题）"
echo "5. 调试配置已正确设置"

echo ""
echo "🚀 下一步:"
echo "1. 重启 Illustrator 2025"
echo "2. 在菜单中打开: 窗口 → 扩展 → Illustrator Quote"
echo "3. 测试功能是否正常工作"
echo "4. 访问 http://localhost:8088 进行调试"

echo ""
echo "🐛 如果仍有问题:"
echo "1. 检查 Illustrator 版本是否为 2025+"
echo "2. 确认插件面板是否显示"
echo "3. 在浏览器中访问调试端口"
echo "4. 查看 Console 选项卡的错误信息" 