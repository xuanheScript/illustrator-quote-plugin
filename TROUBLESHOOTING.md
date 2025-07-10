# 🔧 Illustrator Quote Plugin 故障排除指南

## 白屏问题解决方案

如果插件在 Illustrator 中显示白屏，请按照以下步骤进行排查：

### 第一步：运行诊断工具

```bash
npm run diagnose
```

诊断工具会检查：
- ✅ 所有必要文件是否存在
- ✅ manifest.xml 配置是否正确
- ✅ HTML 文件引用是否正确
- ✅ CSS 样式是否正确内联
- ✅ CSInterface 库是否正常

### 第二步：检查浏览器控制台

1. 在插件面板中右键点击
2. 选择"检查元素"或按 F12
3. 查看 Console 选项卡中的错误信息

**常见错误及解决方案：**

#### `CSInterface is not defined`
- **原因**：CSInterface 库未正确加载
- **解决**：检查 `dist/lib/CSInterface.js` 是否存在
- **修复**：`npm run build:cep`

#### `Failed to load resource: ./assets/index.js`
- **原因**：JavaScript 文件路径错误或文件不存在
- **解决**：检查 `dist/assets/index.js` 是否存在
- **修复**：`npm run build:cep`

#### `Uncaught TypeError: Cannot read property 'createElement' of null`
- **原因**：React 渲染失败，可能是 DOM 元素不存在
- **解决**：检查 HTML 中是否有 `<div id="root"></div>`
- **修复**：确保 HTML 文件正确

#### `Script error`
- **原因**：JavaScript 执行错误
- **解决**：启用详细错误信息，检查具体错误

### 第三步：浏览器调试

在浏览器中测试插件 UI：

```bash
# 启动本地服务器
npm run debug

# 或者手动启动
python3 -m http.server 8080
```

然后访问 `http://localhost:8080/debug.html`

如果浏览器中也显示白屏，说明是 React 组件问题：
- 检查 JavaScript 控制台错误
- 确认 React 组件正确渲染
- 检查 CSS 样式是否正确应用

## 功能问题解决方案

### 🔧 应用材质没有反应

#### 1. 使用调试测试按钮
- 点击插件中的"调试测试"按钮
- 查看调试信息，确认：
  - Illustrator 应用程序信息
  - 文档是否打开
  - 选中对象数量

#### 2. 检查前置条件
- **文档状态**：确保 Illustrator 中有打开的文档
- **对象选择**：确保选中了至少一个对象
- **对象类型**：确保选中的是可以应用材质的对象（路径、形状等）

#### 3. 查看详细日志
在插件面板中打开浏览器控制台：
```javascript
// 查看脚本执行日志
console.log('Applying material');
console.log('Apply result:', result);
```

#### 4. 常见问题
- **"请先打开一个文档"**：在 Illustrator 中创建或打开一个文档
- **"请先选择要应用材质的对象"**：使用选择工具选中图形对象
- **脚本执行错误**：检查对象类型是否支持边界框计算

### 🔧 导出报价没有反应

#### 1. 检查已应用材质的对象
- 确保之前已成功应用过材质
- 查看对象旁边是否有材质标注文本
- 使用"调试测试"确认文档中有对象

#### 2. 检查文件导出位置
导出的 CSV 文件保存在：
- **macOS**: `~/Desktop/报价单_YYYYMMDD_HHMM.csv`
- **Windows**: `%USERPROFILE%\Desktop\报价单_YYYYMMDD_HHMM.csv`

#### 3. 检查文件权限
确保 Illustrator 有桌面写入权限：
- **macOS**: 系统偏好设置 → 安全性与隐私 → 隐私 → 文件和文件夹
- **Windows**: 检查用户账户控制设置

#### 4. 手动检查文件
```bash
# macOS
ls -la ~/Desktop/报价单_*.csv

# Windows
dir %USERPROFILE%\Desktop\报价单_*.csv
```

### 🔧 查看详细日志

#### 1. 浏览器控制台日志
在插件面板中：
1. 右键 → 检查元素
2. Console 选项卡
3. 查看以下日志：
   - `CSInterface initialized`
   - `Running debug test`
   - `Applying material`
   - `Exporting quote`
   - `Script result:` 或 `Apply result:`

#### 2. ExtendScript 错误日志
ExtendScript 错误会在控制台中显示为：
```javascript
{
  "success": false,
  "message": "应用材质时发生错误: 错误描述",
  "error": "具体错误信息"
}
```

#### 3. 启用详细调试
在插件代码中，所有脚本执行都会记录到控制台：
```javascript
console.log('Debug result:', result);
console.log('Apply result:', result);
console.log('Export result:', result);
```

### 🔧 文件生成位置

#### CSV 报价文件
- **默认位置**: 桌面
- **文件名格式**: `报价单_YYYYMMDD_HHMM.csv`
- **编码**: UTF-8 with BOM（支持 Excel 中文显示）

#### 文件内容示例
```csv
图层,材质,面积(m²),单价(元/m²),总价(元)
材质对象_1,亚克力,2.500,200,500.00
材质对象_2,木材,1.200,150,180.00

总计,2项,,,,680.00
```

#### 检查文件是否生成
```bash
# 查看最近生成的报价文件
ls -lt ~/Desktop/报价单_*.csv | head -5

# 查看文件内容
cat ~/Desktop/报价单_*.csv
```

### 第四步：检查 CEP 环境

#### 确认调试模式已启用

**macOS:**
```bash
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
```

**Windows:**
在注册表中添加：
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.10
名称: PlayerDebugMode
类型: REG_SZ
值: 1
```

#### 检查 Illustrator 版本兼容性

- Illustrator 2021 使用 CEP 10
- Illustrator 2020 使用 CEP 9
- 确保 manifest.xml 中的版本匹配

#### 检查插件安装位置

**macOS:**
```
~/Library/Application Support/Adobe/CEP/extensions/com.illustrator.quote.panel/
```

**Windows:**
```
%APPDATA%\Adobe\CEP\extensions\com.illustrator.quote.panel\
```

### 第五步：重新构建和安装

如果上述步骤都没有解决问题，尝试完全重新构建：

```bash
# 清理和重新构建
rm -rf dist node_modules
npm install
npm run build:cep

# 重新安装到 Illustrator
# 删除旧的插件文件夹
# 复制新的 dist 文件夹到扩展目录
# 重命名为 com.illustrator.quote.panel
```

### 第六步：检查网络选项卡

在浏览器开发者工具的 Network 选项卡中：
- 确认所有资源都正确加载（状态码 200）
- 检查是否有 404 错误
- 确认文件路径正确

### 常见解决方案总结

| 问题 | 解决方案 | 日志位置 |
|------|----------|----------|
| 白屏 | 检查控制台错误，运行诊断工具 | 浏览器控制台 |
| CSInterface 未定义 | 确保 CSInterface.js 存在并正确引用 | 浏览器控制台 |
| 应用材质无反应 | 检查文档和选择状态，使用调试测试 | 浏览器控制台 |
| 导出报价无反应 | 检查已应用材质的对象，确认文件权限 | 浏览器控制台 + 桌面文件 |
| 找不到生成的文件 | 检查桌面，确认文件权限 | `~/Desktop/报价单_*.csv` |
| React 渲染失败 | 在浏览器中测试，检查组件代码 | 浏览器控制台 |
| 插件不显示 | 检查调试模式，确认安装位置 | CEP 日志 |
| 版本不兼容 | 更新 manifest.xml 中的版本设置 | manifest.xml |

### 调试命令汇总

```bash
# 诊断插件状态
npm run diagnose

# 构建插件
npm run build:cep

# 浏览器调试
npm run debug

# 查看构建输出
ls -la dist/

# 检查 JavaScript 是否包含 CSS
grep -n "plugin-container" dist/assets/index.js

# 检查 HTML 文件内容
cat dist/index.html

# 查看生成的报价文件
ls -lt ~/Desktop/报价单_*.csv

# 检查文件内容
cat ~/Desktop/报价单_*.csv
```

### 逐步调试流程

1. **基础检查**
   ```bash
   npm run diagnose
   ```

2. **功能测试**
   - 点击"调试测试"按钮
   - 查看调试信息显示

3. **应用材质测试**
   - 在 Illustrator 中创建一个矩形
   - 选中矩形
   - 点击"应用材质"
   - 查看是否生成标注文本

4. **导出测试**
   - 确保已应用材质
   - 点击"导出报价"
   - 检查桌面是否生成 CSV 文件

5. **日志分析**
   - 打开浏览器控制台
   - 查看详细的执行日志
   - 分析错误信息

### 联系支持

如果问题仍然存在，请提供以下信息：
1. 诊断工具的输出结果
2. 浏览器控制台的错误信息
3. 调试测试的结果
4. Illustrator 版本信息
5. 操作系统版本
6. 插件安装位置和文件列表
7. 具体的操作步骤和期望结果

---

**提示**：大多数功能问题都是由于前置条件不满足（如未选中对象、未打开文档）或权限问题导致的。通过调试测试按钮和浏览器控制台通常能找到具体原因。 