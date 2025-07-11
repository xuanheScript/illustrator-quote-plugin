# 🧪 插件功能测试指南 (CEP 12)

## 🆕 CEP 12 测试环境要求

### 系统要求
- **Adobe Illustrator 2025** (版本 29.0) 或更高版本
- **CEP 12** 运行时支持
- **Node.js 17.7.1** 或更高版本（开发环境）
- **操作系统**：Windows 10/11 或 macOS 10.15+

### 调试配置
- **调试端口**：8088 (CEP 12 默认)
- **远程调试**：http://localhost:8088
- **调试模式**：CSXS.12 PlayerDebugMode = 1

## 测试步骤

### 1. 基础测试 (CEP 12)
1. 在 Illustrator 2025+ 中打开插件面板
2. 点击"调试测试"按钮
3. 查看调试信息是否显示正确的应用程序信息
4. 验证 CEP 12 特定信息：
   - Chromium 99 引擎状态
   - Node.js 17.7.1 版本信息
   - V8 引擎版本

### 2. 应用材质测试 (增强版)
1. 在 Illustrator 中创建一个矩形 (Rectangle Tool)
2. 选中这个矩形
3. 在插件中选择材质类型（例如：亚克力）
4. 设置单价（例如：200）
5. 点击"应用材质"按钮
6. 查看结果：
   - 矩形右侧应该出现材质标注文本
   - 插件显示成功消息
   - 浏览器控制台显示执行日志
   - 验证 CEP 12 性能提升

### 3. 导出报价测试 (CEP 12 优化)
1. 确保已经应用了材质（完成步骤2）
2. 点击"导出报价"按钮
3. 查看结果：
   - 插件显示成功消息，包含文件名
   - 桌面上生成 CSV 文件
   - 文件内容包含材质信息
   - 验证 UTF-8 编码正确性

### 4. 多对象测试 (性能测试)
1. 创建多个不同形状的对象（测试 CEP 12 性能）
2. 分别选中并应用不同材质
3. 导出报价，验证所有对象都被包含
4. 监控内存使用和渲染性能

### 5. CEP 12 特定功能测试
1. **远程调试测试**：
   - 访问 http://localhost:8088
   - 验证 Chrome DevTools 功能
   - 测试性能分析工具

2. **现代 JavaScript 特性测试**：
   - 验证 ES2015+ 语法支持
   - 测试 async/await 功能
   - 检查 Promise 支持

3. **Chromium 99 兼容性测试**：
   - 测试现代 CSS 特性
   - 验证 GPU 加速
   - 检查 Web API 支持

## 预期结果

### 调试测试结果 (CEP 12)
```json
{
  "success": true,
  "message": "调试测试成功",
  "data": {
    "appName": "Adobe Illustrator",
    "appVersion": "29.0.0",
    "cepVersion": "12.0",
    "chromiumVersion": "99.0.4844.84",
    "nodeVersion": "17.7.1",
    "v8Version": "9.9.115",
    "documentExists": true,
    "selectionCount": 1,
    "osInfo": {
      "platform": "darwin",
      "version": "macOS 10.15+"
    }
  }
}
```

### 应用材质成功消息 (增强版)
```
成功：成功应用材质到对象
性能：处理时间 12ms (CEP 12 优化)
```

### 导出报价成功消息 (CEP 12)
```
成功：报价单已导出到桌面: 报价单_20241225_1430.csv
性能：导出时间 8ms，文件大小 2.1KB
```

### CSV 文件内容示例 (UTF-8 优化)
```csv
图层,材质,面积(m²),单价(元/m²),总价(元)
材质对象_1,亚克力,0.001,200,0.20

总计,1项,,,,0.20
```

## 常见问题 (CEP 12)

### 问题1：调试测试失败
- **现象**：点击调试测试按钮无反应或显示错误
- **原因**：CEP 12 CSInterface 未正确初始化
- **解决**：
  - 检查 CSInterface.js 版本是否为 v12.0.0
  - 确认 Illustrator 版本为 2025+
  - 验证 CSXS.12 调试模式已启用

### 问题2：版本不兼容错误
- **现象**：插件在 Illustrator 2025 中不显示
- **原因**：manifest.xml 版本配置错误
- **解决**：
  - 确认 manifest.xml 版本为 12.0
  - 检查 Host 版本范围 [29.0,99.9]
  - 验证 CSXS 版本为 12.0

### 问题3：Chromium 99 兼容性问题
- **现象**：某些 Web API 不工作
- **原因**：使用了已弃用的 API
- **解决**：
  - 更新到 Chromium 99 兼容的 API
  - 检查 console 中的弃用警告
  - 使用现代 JavaScript 特性

### 问题4：Node.js 版本问题
- **现象**：某些功能不工作或报错
- **原因**：Node.js 版本不兼容
- **解决**：
  - 确保开发环境使用 Node.js 17.7.1+
  - 检查 package.json 中的 engines 配置
  - 更新不兼容的 npm 包

### 问题5：Metal API 渲染问题 (macOS)
- **现象**：渲染异常或性能问题
- **原因**：OpenGL 已弃用，需要 Metal API
- **解决**：
  - 确保 macOS 10.15+ 并支持 Metal
  - 更新显卡驱动
  - 检查硬件兼容性

## 日志查看方法 (CEP 12 增强)

### 1. 浏览器控制台 (增强版)
1. 在插件面板中右键点击
2. 选择"检查元素"
3. 切换到 Console 选项卡
4. 查看以下关键日志：
   - `CSInterface v12.0.0 initialized`
   - `Chromium 99 engine ready`
   - `Node.js 17.7.1 available`
   - `Running debug test`
   - `Debug result: ...`
   - `Applying material`
   - `Apply result: ...`
   - `Exporting quote`
   - `Export result: ...`

### 2. 远程调试 (CEP 12 新功能)
1. 访问 http://localhost:8088
2. 使用完整的 Chrome DevTools
3. 功能包括：
   - 性能分析
   - 内存监控
   - 网络请求分析
   - 源码调试

### 3. 性能监控 (CEP 12)
```javascript
// 性能测试代码
console.time('MaterialApplication');
// ... 应用材质代码 ...
console.timeEnd('MaterialApplication');

// 内存使用监控
console.log('Memory usage:', {
  used: process.memoryUsage().heapUsed / 1024 / 1024,
  total: process.memoryUsage().heapTotal / 1024 / 1024
});
```

### 成功日志示例 (CEP 12)
```
CSInterface v12.0.0 initialized
Chromium 99 engine ready
Node.js 17.7.1 available
Metal API (macOS) rendering enabled
Running debug test
Debug result: {"success":true,"message":"调试测试成功","data":{"appName":"Adobe Illustrator","appVersion":"29.0.0","cepVersion":"12.0","chromiumVersion":"99.0.4844.84","nodeVersion":"17.7.1","documentExists":true,"selectionCount":1}}
MaterialApplication: 12.345ms
Applying material
Apply result: {"success":true,"message":"成功应用材质到对象","data":{"material":"亚克力","area":"0.001","unitPrice":200,"totalPrice":"0.20"}}
Exporting quote
Export result: {"success":true,"message":"报价单已导出到桌面: 报价单_20241225_1430.csv","data":{"itemCount":1,"totalAmount":"0.20","filePath":"/Users/username/Desktop/报价单_20241225_1430.csv"}}
```

### 错误日志示例 (CEP 12)
```
[CEP 12] Error: Extension manifest version mismatch
[CEP 12] Warning: Deprecated API usage detected
Apply result: {"success":false,"message":"请先选择要应用材质的对象"}
Export result: {"success":false,"message":"未找到任何已应用材质的对象"}
```

## 测试清单 (CEP 12)

### 基础功能测试
- [ ] 插件在 Illustrator 2025+ 中正常显示
- [ ] CEP 12 调试模式正常工作
- [ ] 远程调试端口 8088 可访问
- [ ] 调试测试按钮工作正常
- [ ] 可以查看 CEP 12 系统信息

### 材质应用测试
- [ ] 可以选择不同材质
- [ ] 可以修改单价
- [ ] 应用材质功能正常
- [ ] 生成的标注文本正确
- [ ] 性能表现良好 (< 50ms)

### 导出功能测试
- [ ] 导出报价功能正常
- [ ] CSV 文件生成在桌面
- [ ] CSV 文件内容正确
- [ ] UTF-8 编码正确
- [ ] 文件大小合理

### CEP 12 特定测试
- [ ] Chromium 99 引擎正常工作
- [ ] Node.js 17.7.1 功能正常
- [ ] V8 引擎性能优化生效
- [ ] Metal API (macOS) 渲染正常
- [ ] 现代 JavaScript 特性支持

### 兼容性测试
- [ ] 多对象测试正常
- [ ] 复杂形状测试正常
- [ ] 大文档性能测试
- [ ] 内存使用合理
- [ ] 无内存泄漏

### 错误处理测试
- [ ] 版本不兼容错误提示
- [ ] 权限错误处理
- [ ] 网络错误处理
- [ ] 文件系统错误处理
- [ ] 浏览器控制台无未处理错误

## 性能测试 (CEP 12)

### 1. 渲染性能测试
- 创建 50+ 个对象
- 应用不同材质
- 监控渲染时间
- 预期：< 100ms 总处理时间

### 2. 内存使用测试
- 长时间运行插件
- 执行多次操作
- 监控内存使用
- 预期：无明显内存泄漏

### 3. 大文档测试
- 打开复杂的 AI 文档
- 应用材质到多个对象
- 导出大型报价单
- 预期：稳定运行，无崩溃

## 兼容性测试 (CEP 12)

### Illustrator 版本测试
- [ ] **Illustrator 2025 (29.0)** ✅ 完全支持
- [ ] **Illustrator 2024 (28.0)** ❌ 不兼容
- [ ] **Illustrator 2021-2023** ❌ 不兼容

### 操作系统测试
- [ ] **macOS 10.15+** ✅ 支持 Metal API
- [ ] **Windows 10/11** ✅ 支持 DirectX
- [ ] **Linux** ❌ 不支持

### 浏览器引擎测试
- [ ] **Chromium 99** ✅ 原生支持
- [ ] **旧版本 Chromium** ❌ 不兼容

---

**重要提示**：CEP 12 专为 Adobe Illustrator 2025+ 设计。如需支持旧版本，请使用相应的 CEP 版本。测试时请确保满足所有系统要求。 