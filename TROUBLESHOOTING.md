# 🔧 Illustrator Quote Plugin 故障排除指南 (CEP 12)

## 🆕 CEP 12 专用故障排除

### 版本兼容性检查

**首先确认您的环境：**
- ✅ **Adobe Illustrator 2025** (版本 29.0) 或更高版本
- ✅ **CEP 12** 运行时支持
- ✅ **Node.js 17.7.1** 或更高版本（开发环境）
- ✅ **操作系统**：Windows 10/11 或 macOS 10.15+

### CEP 12 调试端口

- **新调试端口**：8088 (CEP 12 默认)
- **远程调试地址**：http://localhost:8088
- **旧版本端口**：8080 (CEP 10/11)

## 白屏问题解决方案

如果插件在 Illustrator 中显示白屏，请按照以下步骤进行排查：

### 第一步：检查 CEP 12 兼容性

#### 1. 确认 Illustrator 版本
```bash
# 检查 Illustrator 版本
# 菜单栏 → 帮助 → 关于 Illustrator
# 确保版本为 29.0 (2025) 或更高
```

#### 2. 确认 CEP 12 调试模式
**macOS:**
```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

**Windows:**
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.12
名称: PlayerDebugMode
类型: REG_SZ
值: 1
```

#### 3. 检查 manifest.xml 配置
确保以下配置正确：
```xml
<ExtensionManifest Version="12.0">
  <RequiredRuntime Name="CSXS" Version="12.0" />
  <Host Name="ILST" Version="[29.0,99.9]" />
</ExtensionManifest>
```

### 第二步：运行诊断工具

```bash
npm run diagnose
```

诊断工具会检查：
- ✅ CEP 12 配置文件
- ✅ Chromium 99 兼容性
- ✅ Node.js 17.7.1+ 支持
- ✅ manifest.xml 版本配置
- ✅ CSInterface.js v12.0.0
- ✅ 调试端口配置

### 第三步：检查浏览器控制台 (CEP 12 增强)

1. 在插件面板中右键点击
2. 选择"检查元素"或按 F12
3. 访问远程调试：http://localhost:8088
4. 查看 Console 选项卡中的错误信息

**CEP 12 特定错误及解决方案：**

#### `CSInterface v12.0.0 is not defined`
- **原因**：CEP 12 CSInterface 库未正确加载
- **解决**：检查 `dist/lib/CSInterface.js` 是否为 v12.0.0 版本
- **修复**：重新下载 CEP 12 版本的 CSInterface.js

#### `Chromium 99 API not supported`
- **原因**：使用了 Chromium 99 不支持的 API
- **解决**：检查代码中是否使用了弃用的 Web API
- **修复**：更新到 Chromium 99 兼容的 API

#### `Node.js 17.7.1 module error`
- **原因**：Node.js 版本不兼容
- **解决**：确保开发环境使用 Node.js 17.7.1+
- **修复**：`nvm use 17.7.1` 或更新 Node.js

#### `Metal API rendering error (macOS)`
- **原因**：macOS 上 OpenGL 已弃用，需要 Metal API
- **解决**：确保 macOS 10.15+ 并支持 Metal
- **修复**：更新 macOS 或使用支持 Metal 的硬件

### 第四步：检查 CEP 12 环境

#### 确认 CEP 12 调试模式已启用

**macOS:**
```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

**Windows:**
在注册表中添加：
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.12
名称: PlayerDebugMode
类型: REG_SZ
值: 1
```

#### 检查 Illustrator 版本兼容性

- **Illustrator 2025 (29.0)** 使用 CEP 12 ✅
- **Illustrator 2024 (28.0)** 使用 CEP 11 ❌
- **Illustrator 2021-2023** 使用 CEP 10 ❌
- 确保 manifest.xml 中的版本匹配

#### CEP 版本对照表

| CEP 版本 | Illustrator 版本 | 调试设置 | 支持状态 |
|---------|-----------------|---------|---------|
| CEP 12  | 2025 (29.0+)    | CSXS.12 | ✅ 当前版本 |
| CEP 11  | 2024 (28.0)     | CSXS.11 | ❌ 不兼容 |
| CEP 10  | 2021-2023       | CSXS.10 | ❌ 不兼容 |

### 第五步：CEP 12 特定问题

#### 1. V8 引擎 9.9.115 兼容性
- **问题**：某些 JavaScript 语法可能需要更新
- **解决**：使用现代 JavaScript 特性
- **示例**：
  ```javascript
  // 旧版本
  var self = this;
  
  // CEP 12 推荐
  const self = this;
  ```

#### 2. Chromium 99 安全策略
- **问题**：更严格的安全策略
- **解决**：在 manifest.xml 中添加必要的 CEF 参数
- **配置**：
  ```xml
  <CEFCommandLine>
    <Parameter>--disable-web-security</Parameter>
    <Parameter>--enable-nodejs</Parameter>
  </CEFCommandLine>
  ```

#### 3. Node.js 17.7.1 模块兼容性
- **问题**：某些 npm 包可能不兼容
- **解决**：使用 CEP 12 兼容的包版本
- **检查**：
  ```bash
  npm ls --depth=0
  ```

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

## CEP 12 增强调试功能

### 1. 远程调试
- **地址**：http://localhost:8088
- **功能**：完整的 Chrome DevTools 支持
- **新特性**：
  - 更好的性能分析
  - 现代 JavaScript 调试
  - 网络请求监控
  - 内存使用分析

### 2. 日志增强
CEP 12 提供更详细的日志信息：
```javascript
// 系统信息
console.log('CEP Version:', window.__adobe_cep__.getCEPVersion());
console.log('Chromium Version:', window.__adobe_cep__.getChromiumVersion());
console.log('Node.js Version:', process.version);

// 性能监控
console.time('MaterialApplication');
// ... 应用材质代码 ...
console.timeEnd('MaterialApplication');
```

### 3. 错误追踪
```javascript
// 捕获 CEP 12 特定错误
window.addEventListener('error', (event) => {
  console.error('CEP 12 Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});
```

## 升级迁移问题

### 从 CEP 10 升级到 CEP 12

#### 1. 版本不兼容
- **问题**：插件在 Illustrator 2025 中不显示
- **原因**：manifest.xml 版本配置错误
- **解决**：更新版本配置
  ```xml
  <!-- 旧版本 -->
  <ExtensionManifest Version="10.0">
    <RequiredRuntime Name="CSXS" Version="10.0" />
    <Host Name="ILST" Version="[25.0,99.9]" />
  
  <!-- 新版本 -->
  <ExtensionManifest Version="12.0">
    <RequiredRuntime Name="CSXS" Version="12.0" />
    <Host Name="ILST" Version="[29.0,99.9]" />
  ```

#### 2. CSInterface 库版本
- **问题**：CSInterface 方法调用失败
- **原因**：使用了旧版本的 CSInterface.js
- **解决**：更新到 v12.0.0 版本

#### 3. 调试端口变更
- **问题**：无法访问调试界面
- **原因**：端口从 8080 变更为 8088
- **解决**：使用新的调试地址 http://localhost:8088

### 常见迁移错误

#### 错误1：`Extension not loaded`
```
Error: Extension not loaded. Check manifest.xml version.
```
**解决**：确保 manifest.xml 版本为 12.0

#### 错误2：`Host version mismatch`
```
Error: Host version [28.0] not supported. Required: [29.0,99.9]
```
**解决**：升级到 Illustrator 2025 或调整版本范围

#### 错误3：`CSInterface API deprecated`
```
Warning: CSInterface method 'xxx' is deprecated in CEP 12
```
**解决**：使用新的 API 方法

## 性能优化 (CEP 12)

### 1. Chromium 99 优化
- 使用现代 CSS 特性
- 利用 GPU 加速
- 优化 JavaScript 性能

### 2. 内存管理
```javascript
// 避免内存泄漏
window.addEventListener('beforeunload', () => {
  // 清理资源
  cleanup();
});
```

### 3. 渲染优化
```css
/* 使用 GPU 加速 */
.accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

## 日志分析指南

### CEP 12 成功日志
```
CSInterface v12.0.0 initialized
Chromium 99 engine ready
Node.js 17.7.1 available
Metal API (macOS) or DirectX (Windows) rendering enabled
Extension loaded successfully
```

### 错误日志分析
```
[CEP 12] Error: Extension manifest version mismatch
[CEP 12] Warning: Deprecated API usage detected
[CEP 12] Info: Remote debugging available at localhost:8088
```

---

**重要提示**：CEP 12 专为 Adobe Illustrator 2025+ 设计。如需支持旧版本，请使用相应的 CEP 版本。 