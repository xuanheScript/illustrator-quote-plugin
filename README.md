# Illustrator 报价插件 (CEP 12)

<div align="center">

![Plugin Logo](icons/icon.png)

**一个专业的 Adobe Illustrator 材质报价插件，支持 CEP 12 和 Illustrator 2025+**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CEP Version](https://img.shields.io/badge/CEP-12.0-blue.svg)](https://github.com/Adobe-CEP/CEP-Resources)
[![Illustrator](https://img.shields.io/badge/Illustrator-2025%2B-orange.svg)](https://www.adobe.com/products/illustrator.html)
[![Node.js](https://img.shields.io/badge/Node.js-17.7.1%2B-green.svg)](https://nodejs.org/)

[功能特性](#功能特性) • [安装方法](#安装方法) • [使用教程](#使用教程) • [开发指南](#开发指南) • [故障排除](#故障排除)

</div>

## 🎯 功能特性

### 🎨 材质管理系统
- **📦 可管理材质库** - 添加、编辑、删除自定义材质
- **💾 本地存储** - 材质数据持久化保存
- **🔄 实时同步** - 选择材质时自动更新单价
- **📋 预设材质** - 内置常用材质数据

### 🔧 报价功能
- **📏 自动计算** - 基于对象边界框自动计算面积
- **🏷️ 智能标注** - 在对象旁自动添加材质信息
- **📊 数据导出** - 一键导出 CSV 格式报价单
- **🎯 多对象支持** - 批量处理多个选中对象

### 🚀 技术特性
- **CEP 12** - 支持最新的 Adobe Illustrator 2025+
- **Chromium 99** - 现代 Web 标准支持
- **React + TypeScript** - 现代前端技术栈
- **ExtendScript** - 深度集成 Illustrator API

## 📦 预设材质

| 材质类型 | 默认单价 (元/m²) | 描述 |
|---------|----------------|------|
| 亚克力板 | 120 | 透明度高，适合展示 |
| PVC板 | 80 | 成本低，适合大面积使用 |
| 铝塑板 | 150 | 耐用性好，适合户外 |
| 不锈钢板 | 200 | 高端质感，耐腐蚀 |
| 木质板 | 100 | 自然质感，环保材质 |

> 💡 **提示**：所有材质都可以通过材质管理功能进行自定义修改

## 🛠️ 系统要求

### 必需版本
- **Adobe Illustrator 2025** (版本 29.0) 或更高版本
- **CEP 12** 支持
- **Node.js 17.7.1** 或更高版本（开发环境）

### 操作系统
- **Windows 10/11** 或更高版本
- **macOS 10.15** 或更高版本

## 🚀 安装方法

### 自动安装（推荐）

#### macOS/Linux
```bash
# 克隆仓库
git clone https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 运行安装脚本
chmod +x install.sh
./install.sh
```

#### Windows
```cmd
# 克隆仓库
git clone https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 运行安装脚本
install.bat
```

### 手动安装

1. **构建插件**
   ```bash
   # 安装依赖
   yarn install
   
   # 构建插件
   yarn build:cep
   ```

2. **启用调试模式**
   
   **Windows (注册表):**
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.12
   创建字符串值：PlayerDebugMode = 1
   ```
   
   **macOS (终端):**
   ```bash
   defaults write com.adobe.CSXS.12 PlayerDebugMode 1
   ```

3. **复制插件文件**
   
   将 `dist` 文件夹复制到 CEP 扩展目录：
   
   **Windows:**
   ```
   C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\extensions\illustrator-quote-plugin
   ```
   
   **macOS:**
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/illustrator-quote-plugin
   ```

## 📖 使用教程

### 1. 启动插件

1. 打开 Adobe Illustrator 2025+
2. 菜单栏 → **窗口** → **扩展** → **Illustrator Quote**
3. 插件面板将在右侧显示

### 2. 材质管理

<details>
<summary>点击展开材质管理教程</summary>

#### 添加新材质
1. 点击"**管理材质**"按钮
2. 在材质管理面板中输入材质名称和单价
3. 点击"**添加材质**"按钮

#### 编辑材质
1. 在材质列表中点击材质的"**编辑**"按钮
2. 修改材质名称或单价
3. 点击"**保存修改**"按钮

#### 删除材质
1. 在材质列表中点击材质的"**删除**"按钮
2. 确认删除操作

> ⚠️ **注意**：系统至少保留一个材质，无法删除最后一个材质

</details>

### 3. 应用材质报价

<details>
<summary>点击展开报价操作教程</summary>

#### 基本操作
1. 在 Illustrator 中选择要报价的对象
2. 在插件面板中选择材质类型
3. 调整单价（可选）
4. 点击"**应用材质**"按钮

#### 批量处理
1. 使用 Shift 或 Ctrl 选择多个对象
2. 选择材质类型和单价
3. 点击"**应用材质**"按钮
4. 插件会为每个对象单独计算并标注

#### 导出报价单
1. 完成所有对象的材质应用
2. 点击"**导出报价**"按钮
3. CSV 文件将自动保存到桌面

</details>

### 4. 调试功能

- 点击"**调试测试**"按钮检查插件状态
- 查看调试信息确认系统工作正常
- 如有问题，查看浏览器控制台 (http://localhost:8088)

## 🔧 开发指南

### 技术栈
- **前端**: React 19 + TypeScript + Vite
- **CEP**: CEP 12 + ExtendScript
- **构建**: Yarn + ESLint

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建 CEP 插件
yarn build:cep

# 代码检查
yarn lint
```

### 项目结构

```
illustrator-quote-plugin/
├── src/                    # React 源代码
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 样式文件
│   └── main.tsx           # 入口文件
├── jsx/                   # ExtendScript 文件
│   ├── applyMaterial.jsx  # 材质应用脚本
│   └── exportQuote.jsx    # 报价导出脚本
├── CSXS/                  # CEP 配置
│   └── manifest.xml       # 插件清单
├── lib/                   # CEP 库文件
│   └── CSInterface.js     # CEP 接口
├── dist/                  # 构建输出
└── docs/                  # 文档
```

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 🔍 故障排除

### 常见问题

<details>
<summary>插件显示白屏</summary>

**解决方案:**
1. 确认使用 Illustrator 2025+ 版本
2. 检查 CEP 12 调试模式是否启用
3. 查看浏览器控制台错误信息 (http://localhost:8088)
4. 验证插件文件完整性

</details>

<details>
<summary>插件菜单中不显示</summary>

**解决方案:**
1. 检查插件是否正确安装到 CEP 扩展目录
2. 确认 manifest.xml 版本配置正确
3. 重启 Illustrator 应用程序
4. 检查 CEP 调试模式设置

</details>

<details>
<summary>材质应用失败</summary>

**解决方案:**
1. 确认已选择对象
2. 检查对象是否支持边界框计算
3. 查看 ExtendScript 错误信息
4. 尝试使用"调试测试"功能

</details>

### 调试工具

- **浏览器控制台**: http://localhost:8088
- **ExtendScript 调试**: 使用 Adobe ExtendScript Toolkit
- **CEP 调试**: 启用 PlayerDebugMode

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 致谢

- [Adobe CEP](https://github.com/Adobe-CEP/CEP-Resources) - CEP 开发资源
- [React](https://reactjs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 构建工具

## 📞 支持与反馈

- 🐛 [报告 Bug](https://github.com/yourusername/illustrator-quote-plugin/issues)
- 💡 [功能建议](https://github.com/yourusername/illustrator-quote-plugin/issues)
- 📧 [联系作者](mailto:your.email@example.com)

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐️**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
