# 🔍 CEP 12 调试指南

## 📋 调试环境配置

### 1. 启用 CEP 12 调试模式

**macOS:**
```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

**Windows:**
```
注册表路径: HKEY_CURRENT_USER\Software\Adobe\CSXS.12
名称: PlayerDebugMode
类型: REG_SZ
值: 1
```

### 2. 重启 Adobe Illustrator 2025

启用调试模式后，必须重启 Illustrator 才能生效。

## 🔧 .debug 文件配置

### 正确的 .debug 文件配置

您需要在**插件安装目录**中放置 .debug 文件：

**文件位置:**
- macOS: `~/Library/Application Support/Adobe/CEP/extensions/com.illustrator.quote.panel/.debug`
- Windows: `%APPDATA%\Adobe\CEP\extensions\com.illustrator.quote.panel\.debug`

**文件内容:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.illustrator.quote.panel">
        <HostList>
            <Host Name="ILST" Port="8088"/>
        </HostList>
    </Extension>
</ExtensionList>
```

### 重要说明

1. **Extension ID 必须匹配**: .debug 文件中的 `Id="com.illustrator.quote.panel"` 必须与 manifest.xml 中的 Extension ID 完全一致
2. **端口配置**: CEP 12 推荐使用端口 8088
3. **文件位置**: .debug 文件必须放在插件的根目录中

## 🌐 远程调试访问

### 1. 访问调试界面

启用调试模式后，在浏览器中访问：
```
http://localhost:8088
```

### 2. 选择调试目标

在调试页面中，您会看到：
- **com.illustrator.quote.panel**: 您的插件实例
- 点击进入 Chrome DevTools 调试界面

### 3. 调试功能

**Console 选项卡:**
- 查看 JavaScript 日志
- 执行 JavaScript 命令
- 查看错误信息

**Network 选项卡:**
- 监控资源加载
- 检查 API 调用

**Sources 选项卡:**
- 设置断点
- 单步调试
- 查看变量值

**Performance 选项卡:**
- 性能分析
- 内存使用监控

## 📊 日志查看方法

### 1. 插件面板调试

**步骤:**
1. 在 Illustrator 中打开插件面板
2. 右键点击插件面板 → 检查元素
3. 或者访问 http://localhost:8088 选择插件实例

**查看日志:**
```javascript
// 基础日志
console.log('插件初始化');
console.log('CSInterface version:', window.__adobe_cep__.getCEPVersion());

// 调试测试日志
console.log('Running debug test');
console.log('Debug result:', result);

// 应用材质日志
console.log('Applying material:', materialName);
console.log('Apply result:', result);

// 导出报价日志
console.log('Exporting quote');
console.log('Export result:', result);
```

### 2. ExtendScript 调试

**ExtendScript 日志:**
```javascript
// 在 jsx 文件中添加日志
$.writeln('ExtendScript log: ' + message);

// 使用 alert 进行调试（仅测试时使用）
alert('Debug: ' + JSON.stringify(data));
```

**查看 ExtendScript 日志:**
- macOS: 打开 Console.app，搜索 "ExtendScript"
- Windows: 打开事件查看器，查看应用程序日志

### 3. 错误处理和日志

**前端错误处理:**
```javascript
window.addEventListener('error', (event) => {
    console.error('Global error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
    });
});
```

**ExtendScript 错误处理:**
```javascript
try {
    // 执行代码
} catch (error) {
    $.writeln('ExtendScript error: ' + error.message);
    return JSON.stringify({
        success: false,
        message: error.message,
        stack: error.stack
    });
}
```

## 🚀 实际调试步骤

### 1. 启动调试会话

```bash
# 1. 确保调试模式已启用
defaults read com.adobe.CSXS.12 PlayerDebugMode

# 2. 启动 Illustrator 2025
open -a "Adobe Illustrator 2025"

# 3. 在浏览器中访问调试界面
open http://localhost:8088
```

### 2. 调试插件功能

**调试测试:**
1. 点击插件中的"调试测试"按钮
2. 在 Console 中查看输出：
   ```javascript
   Running debug test
   Debug result: {"success":true,"message":"调试测试成功","data":{...}}
   ```

**应用材质调试:**
1. 在 Illustrator 中创建一个矩形
2. 选中矩形
3. 在插件中选择材质并点击"应用材质"
4. 查看 Console 日志：
   ```javascript
   Applying material: 亚克力
   Apply result: {"success":true,"message":"成功应用材质到 1 个对象",...}
   ```

**导出报价调试:**
1. 确保已应用材质
2. 点击"导出报价"按钮
3. 查看 Console 日志：
   ```javascript
   Exporting quote
   Export result: {"success":true,"message":"报价单已导出到桌面: 报价单_20240711_1430.csv",...}
   ```

### 3. 常见调试场景

**场景1: 插件不显示**
```javascript
// 检查插件是否加载
console.log('Plugin loaded:', !!window.CSInterface);
console.log('CEP version:', window.__adobe_cep__.getCEPVersion());
```

**场景2: 功能不工作**
```javascript
// 检查 ExtendScript 调用
csInterface.evalScript('app.name', function(result) {
    console.log('Illustrator app name:', result);
});
```

**场景3: 性能问题**
```javascript
// 性能监控
console.time('MaterialApplication');
// ... 执行代码 ...
console.timeEnd('MaterialApplication');
```

## 🔍 故障排除

### 1. 调试端口不可访问

**检查:**
```bash
# 检查端口是否被占用
lsof -i :8088

# 检查调试模式是否启用
defaults read com.adobe.CSXS.12 PlayerDebugMode
```

**解决:**
- 重启 Illustrator
- 检查防火墙设置
- 使用其他端口（修改 .debug 文件）

### 2. 插件不在调试列表中

**检查:**
- Extension ID 是否匹配
- .debug 文件是否在正确位置
- 插件是否正确安装

### 3. Console 无日志输出

**检查:**
- 是否选择了正确的调试目标
- 是否有 JavaScript 错误阻止执行
- 检查 Sources 选项卡是否有断点

## 📱 移动端调试（可选）

如果需要在移动设备上调试，可以：

1. 修改 .debug 文件允许外部访问：
```xml
<Host Name="ILST" Port="8088" IP="0.0.0.0"/>
```

2. 在移动设备浏览器中访问：
```
http://[电脑IP]:8088
```

## 🎯 调试最佳实践

1. **使用有意义的日志信息**
2. **添加错误处理和异常捕获**
3. **使用 console.group() 组织日志**
4. **定期清理调试代码**
5. **使用条件断点提高效率**

---

**重要提示**: 
- 调试模式仅用于开发，生产环境应禁用
- 定期检查和清理调试日志
- 使用 CEP 12 的新调试功能提高开发效率 