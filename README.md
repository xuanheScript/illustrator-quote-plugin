# Illustrator 报价插件 (CEP Plugin)

一个用于 Adobe Illustrator 的 CEP 插件，可以为选中的对象应用材质信息并生成报价单。

## 功能特性

- 🎨 **材质应用**：为选中对象应用材质类型和单价
- 📏 **自动计算**：自动计算对象面积（基于边界框）
- 🏷️ **智能标注**：在对象旁边自动添加材质信息标注
- 📊 **报价导出**：一键导出 CSV 格式的报价单到桌面
- 🎯 **多对象支持**：同时处理多个选中对象
- 💾 **数据持久化**：材质信息保存在对象标签中

## 预设材质

插件包含以下预设材质选项：

| 材质类型 | 默认单价 (元/m²) |
|---------|----------------|
| 亚克力   | 200           |
| 木材     | 150           |
| 金属     | 300           |
| 玻璃     | 250           |
| 塑料     | 100           |
| 石材     | 400           |
| 皮革     | 350           |
| 布料     | 80            |

## 系统要求

- Adobe Illustrator CC 2018 或更高版本
- Windows 10/11 或 macOS 10.14 或更高版本
- 支持 CEP 扩展的 Illustrator 版本

## 快速安装

### macOS/Linux
```bash
chmod +x install.sh
./install.sh
```

### Windows
```cmd
install.bat
```

## 手动安装

### 方法一：开发模式安装（推荐用于测试）

1. **构建插件**
   ```bash
   npm install
   npm run build:cep
   ```

2. **找到 CEP 扩展目录**
   
   **Windows:**
   ```
   C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\extensions\
   ```
   
   **macOS:**
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/
   ```

3. **复制插件文件**
   - 将 `dist` 文件夹复制到扩展目录
   - 重命名为 `com.illustrator.quote.panel`

4. **启用调试模式**
   
   **Windows (注册表):**
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.10
   创建字符串值：PlayerDebugMode = 1
   ```
   
   **macOS (终端):**
   ```bash
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   ```

## 故障排除

### 🔧 插件显示白屏

如果插件在 Illustrator 中显示白屏，请按以下步骤调试：

#### 1. 检查浏览器控制台
- 在插件面板中右键 → 检查元素 (或按 F12)
- 查看 Console 选项卡中的错误信息
- 常见错误：
  - `CSInterface is not defined` - CSInterface 库未加载
  - `Failed to load resource` - 资源文件路径错误
  - JavaScript 语法错误

#### 2. 验证文件结构
确保 `dist` 目录包含以下文件：
```
dist/
├── index.html
├── CSXS/
│   └── manifest.xml
├── jsx/
│   ├── applyMaterial.jsx
│   └── exportQuote.jsx
├── lib/
│   └── CSInterface.js
└── assets/
    ├── index.js
    └── index.css
```

#### 3. 检查 manifest.xml
确认 manifest.xml 中的主机名称和版本正确：
```xml
<Host Name="ILST" Version="[25.0,99.9]" />
```

#### 4. 浏览器调试
打开 `debug.html` 在浏览器中测试插件 UI：
```bash
# 启动简单的 HTTP 服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080/debug.html
```

#### 5. 重新构建
如果问题持续，尝试清理并重新构建：
```bash
rm -rf dist node_modules
npm install
npm run build:cep
```

#### 6. 检查 CEP 版本兼容性
- Illustrator 2021 使用 CEP 10
- 确保 manifest.xml 中的版本匹配：
  ```xml
  <RequiredRuntime Name="CSXS" Version="10.0" />
  ```

### 🔧 ExtendScript 错误

#### 1. 脚本路径问题
确保 jsx 文件在正确位置且语法正确

#### 2. 权限问题
- 确认 Illustrator 有文件系统访问权限
- 检查桌面写入权限（用于导出 CSV）

#### 3. 对象选择问题
- 确保在 Illustrator 中选中了对象
- 检查对象类型是否支持边界框计算

### 🔧 常见问题

**Q: 插件菜单中不显示**
A: 检查调试模式是否启用，重启 Illustrator

**Q: 点击按钮没有反应**
A: 打开浏览器控制台查看 JavaScript 错误

**Q: 导出的 CSV 文件为空**
A: 确保文档中有已应用材质的对象

**Q: 面积计算不准确**
A: 当前使用边界框计算，复杂形状可能需要自定义算法

## 使用方法

### 1. 启动插件

1. 打开 Adobe Illustrator
2. 菜单栏 → 窗口 → 扩展 → Illustrator Quote
3. 插件面板将在右侧显示

### 2. 调试测试

1. 点击"调试测试"按钮检查插件状态
2. 查看调试信息确认：
   - Illustrator 应用程序信息
   - 文档是否打开
   - 选中对象数量
3. 如有问题，查看浏览器控制台的错误信息

### 3. 应用材质

1. 在 Illustrator 中选择要应用材质的对象
2. 在插件面板中选择材质类型
3. 调整单价（可选）
4. 点击"应用材质"按钮
5. 插件会自动：
   - 计算对象面积
   - 在对象右侧添加标注文本
   - 保存材质信息到对象标签

### 4. 导出报价

1. 确保文档中有已应用材质的对象
2. 点击"导出报价"按钮
3. CSV 文件将自动保存到桌面
4. 文件名格式：`报价单_YYYYMMDD_HHMM.csv`

### 5. 查看日志和调试

#### 浏览器控制台
在插件面板中右键点击 → 检查元素 → Console 选项卡，查看详细执行日志：

- `CSInterface initialized` - 插件初始化成功
- `Running debug test` - 调试测试执行
- `Debug result: {...}` - 调试结果详情
- `Applying material` - 应用材质执行
- `Apply result: {...}` - 应用材质结果
- `Exporting quote` - 导出报价执行
- `Export result: {...}` - 导出结果详情

#### 生成的文件位置
- **CSV 报价文件**: `~/Desktop/报价单_YYYYMMDD_HHMM.csv`
- **文件格式**: UTF-8 编码，支持 Excel 直接打开

#### 检查生成的文件
```bash
# 查看最近生成的报价文件
ls -lt ~/Desktop/报价单_*.csv

# 查看文件内容
cat ~/Desktop/报价单_*.csv
```

### 6. 报价单格式

导出的 CSV 文件包含以下列：

```csv
图层,材质,面积(m²),单价(元/m²),总价(元)
对象1,亚克力,2.500,200,500.00
对象2,木材,1.200,150,180.00

总计,2项,,,680.00
```

## 开发和自定义

### 项目结构

```
illustrator-quote/
├── CSXS/
│   └── manifest.xml          # CEP 插件配置
├── jsx/
│   ├── applyMaterial.jsx     # 应用材质脚本
│   └── exportQuote.jsx       # 导出报价脚本
├── lib/
│   └── CSInterface.js        # CEP 通信库
├── icons/
│   └── icon.png              # 插件图标
├── src/
│   ├── App.tsx               # 主要 React 组件
│   ├── App.css               # 样式文件
│   └── main.tsx              # 入口文件
├── index.html                # 开发用 HTML
├── index-cep.html            # CEP 专用 HTML
├── debug.html                # 浏览器调试页面
├── package.json              # 项目配置
└── vite.config.ts            # 构建配置
```

### 自定义材质

在 `src/App.tsx` 中修改 `MATERIALS` 数组：

```typescript
const MATERIALS = [
  { name: '自定义材质', price: 100 },
  // 添加更多材质...
];
```

### 修改面积计算

在 `jsx/applyMaterial.jsx` 中修改面积计算逻辑：

```javascript
// 当前：简单矩形边界
var areaM2 = (width * height) / 1000000;

// 可以替换为更复杂的面积计算
```

### 构建命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 构建 CEP 插件
npm run build:cep

# 浏览器调试
# 打开 debug.html 在浏览器中测试

# 打包插件
npm run package
```

## 技术支持

如果遇到问题，请检查：

1. **浏览器控制台**：F12 打开开发者工具查看错误
2. **Illustrator 控制台**：ExtendScript Toolkit 中的错误信息
3. **插件日志**：CEP 调试模式下的日志输出

## 版本历史

### v1.0.0
- 初始版本
- 基本材质应用功能
- CSV 报价导出
- 8种预设材质
- 支持 Illustrator 2021+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：此插件仅用于演示目的，实际使用前请根据具体需求进行调整和测试。
