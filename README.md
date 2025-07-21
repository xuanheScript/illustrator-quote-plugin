# Illustrator 标注插件 (CEP 12)

<div align="center">

**一个专业的 Adobe Illustrator 材质标注插件，支持 CEP 12 和 Illustrator 2025+**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CEP Version](https://img.shields.io/badge/CEP-12.0-blue.svg)](https://github.com/Adobe-CEP/CEP-Resources)
[![Illustrator](https://img.shields.io/badge/Illustrator-2025%2B-orange.svg)](https://www.adobe.com/products/illustrator.html)
[![Node.js](https://img.shields.io/badge/Node.js-17.7.1%2B-green.svg)](https://nodejs.org/)

[功能特性](#功能特性) • [插件预览](#插件预览) • [安装方法](#安装方法) • [使用教程](#使用教程) • [开发指南](#开发指南) • [故障排除](#故障排除)

</div>

## 🎯 功能特性

### 🎨 材质管理系统
- **📦 可管理材质库** - 添加、编辑、删除自定义材质，支持单位管理
- **💾 本地存储** - 材质数据持久化保存
- **🏷️ 多选支持** - 同时选择多个材质进行标注
- **📋 预设材质** - 内置常用材质数据

### 🔧 标注功能
- **📏 自动计算** - 基于对象边界框自动计算尺寸和面积
- **🏷️ 智能标注** - 在对象旁自动添加材质信息和引导线
- **📊 数据导出** - 一键导出包含宽高信息的 CSV 格式文件
- **🎯 多对象支持** - 批量处理多个选中对象
- **📐 单位管理** - 为每个材质设置默认单位，支持个性化数值输入

### 🚀 技术特性
- **CEP 12** - 支持最新的 Adobe Illustrator 2025+
- **Chromium 99** - 现代 Web 标准支持
- **React + TypeScript** - 现代前端技术栈
- **ExtendScript** - 深度集成 Illustrator API

## 📦 预设材质

| 材质类型 | 颜色标识 | 描述 |
|---------|---------|------|
| 亚克力 | 🔴 | 透明度高，适合展示 |
| PVC | 🟢 | 成本低，适合大面积使用 |
| 宣绒布 | 🟠 | 质感好，适合高端应用 |
| 不锈钢 | 🔴 | 高端质感，耐腐蚀 |
| 木塑 | 🟣 | 自然质感，环保材质 |

> 💡 **提示**：所有材质都可以通过材质管理功能进行自定义修改，可设置默认单位

## 📸 插件预览

### 主界面
<img src="images/PluginView.png" alt="插件主界面" width="400"/>

*主界面展示了材质选择、单位设置和应用功能*

### 材质管理
<img src="images/PluginDetailedView.png" alt="材质管理界面" width="400"/>

*材质管理界面支持添加、编辑和删除材质，设置默认单位和颜色*

### 实际应用效果
<img src="images/ExampleView.png" alt="应用效果示例" width="400"/>

*在Illustrator中的实际应用效果，显示多材质标注和尺寸信息*

## 🛠️ 系统要求

### 必需版本
- **Adobe Illustrator 2025** (版本 29.0) 或更高版本
- **CEP 12** 支持
- **Node.js 17.7.1** 或更高版本（开发环境）

### 操作系统
- **Windows 10/11** 或更高版本
- **macOS 10.15** 或更高版本

## 🚀 安装方法

### 版本选择指南

请根据您的 Illustrator 版本选择对应的插件版本：

| Illustrator 版本 | CEP 版本 | 插件版本 | 分支 | 推荐程度 |
|-----------------|---------|---------|------|---------|
| **2025+** | **CEP 12** | **v2.x.x** | **main** | ✅ **最新版本** |
| 2021-2024 | CEP 10 | v1.5.x | cep10-support | 🟡 **稳定兼容** |

### 方法一：ZXP 文件安装 (推荐)

#### 步骤 1: 安装工具
下载以下任一安装工具：

- **[Anastasiy's Extension Manager](https://install.anastasiy.com/)** (推荐)
- **[ZXPInstaller](https://aescripts.com/learn/zxp-installer/)**

#### 步骤 2: 安装插件
1. 下载最新的 `illustrator-annotation-plugin-v2.0.0.zxp` 文件
2. 打开安装工具
3. 将 `.zxp` 文件拖拽到工具窗口
4. 点击安装

> 📄 详细安装说明请查看 [INSTALLATION.md](INSTALLATION.md)

### 方法二：开发环境安装

```bash
# 克隆项目
git clone https://github.com/yourusername/illustrator-annotation-plugin.git
cd illustrator-annotation-plugin

# 安装依赖
npm install

# 构建并安装到开发环境
npm run install-debug
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
   C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\extensions\illustrator-annotation-plugin
   ```
   
   **macOS:**
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/illustrator-annotation-plugin
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
2. 输入材质名称、默认单位和颜色
3. 点击"**添加材质**"按钮

#### 编辑材质
1. 在材质列表中点击材质的"**编辑**"按钮
2. 修改材质名称、单位或颜色
3. 点击"**保存修改**"按钮

#### 删除材质
1. 在材质列表中点击材质的"**删除**"按钮
2. 确认删除操作

> ⚠️ **注意**：系统至少保留一个材质，无法删除最后一个材质

</details>

### 3. 应用材质标注

<details>
<summary>点击展开标注操作教程</summary>

#### 基本操作
1. 在 Illustrator 中选择要标注的对象
2. 在插件面板中选择一个或多个材质类型
3. 为有单位的材质设置数值（可选）
4. 点击"**应用材质**"按钮
5. 选择标注位置

#### 多材质标注
1. 选择多个材质（点击材质卡片选择/取消）
2. 为每个材质单独设置数值
3. 应用后将显示如："12 cm 亚克力 + 5 mm PVC"

#### 导出标注数据
1. 完成所有对象的材质应用
2. 点击"**导出标注**"按钮
3. CSV 文件将自动保存到桌面

**导出内容包括:**
- 图层名称
- 材质信息（含数值和单位）
- 宽度 (mm)
- 高度 (mm)
- 面积 (m²)

</details>

### 4. 调试功能

- 勾选"显示调试信息"查看详细操作过程
- 点击"**调试测试**"按钮检查插件状态
- 查看调试信息确认系统工作正常

## 🔧 开发指南

### 技术栈
- **前端**: React 19 + TypeScript + Vite
- **CEP**: CEP 12 + ExtendScript
- **构建**: Yarn + ESLint

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/yourusername/illustrator-annotation-plugin.git
cd illustrator-annotation-plugin

# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建 CEP 插件
yarn build:cep

# 代码检查
yarn lint

# 创建发布包
yarn release
```

### 项目结构

```
illustrator-annotation-plugin/
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
├── scripts/               # 构建脚本
│   ├── create-zxp.js      # ZXP 打包脚本
│   └── install-debug.js   # 开发安装脚本
├── dist/                  # 构建输出
├── release/               # 发布文件
└── docs/                  # 文档
```

### 发布流程

1. **构建插件**: `yarn build:cep`
2. **创建ZXP**: `yarn create-zxp`
3. **测试安装**: 使用生成的ZXP文件测试
4. **发布**: 上传ZXP文件和安装说明

## 🔍 故障排除

### 常见问题

<details>
<summary>插件显示白屏</summary>

**解决方案:**
1. 确认使用 Illustrator 2025+ 版本
2. 检查 CEP 12 调试模式是否启用
3. 查看浏览器控制台错误信息
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
3. 查看调试信息中的错误信息
4. 尝试使用"调试测试"功能

</details>

### 调试模式设置

**Windows:**
```cmd
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS:**
```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 致谢

- [Adobe CEP](https://github.com/Adobe-CEP/CEP-Resources) - CEP 开发资源
- [React](https://reactjs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 构建工具
- [zxp-sign-cmd](https://github.com/codearoni/zxp-sign-cmd) - ZXP 签名工具

## 📞 支持与反馈

- 🐛 [报告 Bug](https://github.com/yourusername/illustrator-annotation-plugin/issues)
- 💡 [功能建议](https://github.com/yourusername/illustrator-annotation-plugin/issues)
- 📄 [详细安装指南](INSTALLATION.md)

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐️**

Made with ❤️ by Illustrator Annotation Plugin Team

</div>