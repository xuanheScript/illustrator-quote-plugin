# 🧪 插件功能测试指南

## 测试步骤

### 1. 基础测试
1. 在 Illustrator 中打开插件面板
2. 点击"调试测试"按钮
3. 查看调试信息是否显示正确的应用程序信息

### 2. 应用材质测试
1. 在 Illustrator 中创建一个矩形 (Rectangle Tool)
2. 选中这个矩形
3. 在插件中选择材质类型（例如：亚克力）
4. 设置单价（例如：200）
5. 点击"应用材质"按钮
6. 查看结果：
   - 矩形右侧应该出现材质标注文本
   - 插件显示成功消息
   - 浏览器控制台显示执行日志

### 3. 导出报价测试
1. 确保已经应用了材质（完成步骤2）
2. 点击"导出报价"按钮
3. 查看结果：
   - 插件显示成功消息，包含文件名
   - 桌面上生成 CSV 文件
   - 文件内容包含材质信息

### 4. 多对象测试
1. 创建多个不同形状的对象
2. 分别选中并应用不同材质
3. 导出报价，验证所有对象都被包含

## 预期结果

### 调试测试结果
```json
{
  "appName": "Adobe Illustrator",
  "appVersion": "25.0.0",
  "documentExists": true,
  "selectionCount": 1
}
```

### 应用材质成功消息
```
成功：成功应用材质到对象
```

### 导出报价成功消息
```
成功：报价单已导出到桌面: 报价单_20241225_1430.csv
```

### CSV 文件内容示例
```csv
图层,材质,面积(m²),单价(元/m²),总价(元)
材质对象_1,亚克力,0.001,200,0.20

总计,1项,,,,0.20
```

## 常见问题

### 问题1：调试测试失败
- **现象**：点击调试测试按钮无反应或显示错误
- **原因**：CSInterface 未正确初始化
- **解决**：检查浏览器控制台，确认 CSInterface.js 加载正确

### 问题2：应用材质没有效果
- **现象**：点击应用材质按钮后没有生成标注文本
- **原因**：
  - 未选中对象
  - 未打开文档
  - 选中的对象类型不支持
- **解决**：
  - 确保在 Illustrator 中打开了文档
  - 确保选中了图形对象（矩形、圆形等）
  - 查看浏览器控制台的错误信息

### 问题3：导出报价没有生成文件
- **现象**：点击导出报价后没有在桌面找到 CSV 文件
- **原因**：
  - 没有已应用材质的对象
  - 文件权限问题
  - 文件路径错误
- **解决**：
  - 确保先应用了材质
  - 检查 Illustrator 的文件访问权限
  - 查看浏览器控制台的具体错误信息

### 问题4：CSV 文件内容异常
- **现象**：CSV 文件为空或内容不正确
- **原因**：
  - 对象标签信息丢失
  - 数据解析错误
- **解决**：
  - 重新应用材质
  - 检查对象是否有 QuoteMaterial 标签

## 日志查看方法

### 浏览器控制台
1. 在插件面板中右键点击
2. 选择"检查元素"
3. 切换到 Console 选项卡
4. 查看以下关键日志：
   - `CSInterface initialized`
   - `Running debug test`
   - `Debug result: ...`
   - `Applying material`
   - `Apply result: ...`
   - `Exporting quote`
   - `Export result: ...`

### 成功日志示例
```
CSInterface initialized
Running debug test
Debug result: {"success":true,"message":"调试测试成功","data":{"appName":"Adobe Illustrator","appVersion":"25.0.0","documentExists":true,"selectionCount":1}}
Applying material
Apply result: {"success":true,"message":"成功应用材质到对象","data":{"material":"亚克力","area":"0.001","unitPrice":200,"totalPrice":"0.20"}}
Exporting quote
Export result: {"success":true,"message":"报价单已导出到桌面: 报价单_20241225_1430.csv","data":{"itemCount":1,"totalAmount":"0.20","filePath":"/Users/username/Desktop/报价单_20241225_1430.csv"}}
```

### 错误日志示例
```
Apply result: {"success":false,"message":"请先选择要应用材质的对象"}
Export result: {"success":false,"message":"未找到任何已应用材质的对象"}
```

## 测试清单

- [ ] 插件正常显示
- [ ] 调试测试按钮工作正常
- [ ] 可以查看调试信息
- [ ] 可以选择不同材质
- [ ] 可以修改单价
- [ ] 应用材质功能正常
- [ ] 生成的标注文本正确
- [ ] 导出报价功能正常
- [ ] CSV 文件生成在桌面
- [ ] CSV 文件内容正确
- [ ] 多对象测试正常
- [ ] 浏览器控制台无错误

## 性能测试

### 大量对象测试
1. 创建 10+ 个对象
2. 分别应用材质
3. 导出报价
4. 验证性能和准确性

### 复杂形状测试
1. 创建复杂路径
2. 应用材质
3. 验证面积计算是否合理

## 兼容性测试

### Illustrator 版本
- [ ] Illustrator 2021
- [ ] Illustrator 2022
- [ ] Illustrator 2023

### 操作系统
- [ ] macOS
- [ ] Windows

### 文件格式
- [ ] 新建文档
- [ ] 打开的 AI 文件
- [ ] 导入的文件

---

**提示**：如果任何测试失败，请参考 TROUBLESHOOTING.md 中的详细解决方案。 