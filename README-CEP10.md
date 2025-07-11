# Illustrator 报价插件 (CEP 10)

<div align="center">

![Plugin Logo](icons/icon.png)

**Adobe Illustrator 材质报价插件 - CEP 10 兼容版本**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CEP Version](https://img.shields.io/badge/CEP-10.0-blue.svg)](https://github.com/Adobe-CEP/CEP-Resources)
[![Illustrator](https://img.shields.io/badge/Illustrator-2021--2024-orange.svg)](https://www.adobe.com/products/illustrator.html)
[![Node.js](https://img.shields.io/badge/Node.js-16.14.0%2B-green.svg)](https://nodejs.org/)

**🎯 专为 Adobe Illustrator 2021-2024 设计的稳定兼容版本**

[功能特性](#功能特性) • [快速安装](#快速安装) • [使用教程](#使用教程) • [故障排除](#故障排除)

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
- **CEP 10** - 稳定兼容 Adobe Illustrator 2021-2024
- **Chromium 89** - 可靠的Web标准支持
- **React 18 + TypeScript** - 现代前端技术栈
- **ExtendScript** - 深度集成 Illustrator API

## 📦 版本兼容性

| Illustrator 版本 | CEP 版本 | 插件版本 | 状态 |
|-----------------|---------|---------|------|
| **2021-2024** | **CEP 10** | **v1.5.x** | ✅ **推荐** |
| 2025+ | CEP 12 | v2.x.x | [切换到主分支](https://github.com/yourusername/illustrator-quote-plugin) |

> 💡 **注意**: 此版本专为 Illustrator 2021-2024 优化，如果您使用 Illustrator 2025+，请使用 [CEP 12 版本](https://github.com/yourusername/illustrator-quote-plugin)

## 🛠️ 系统要求

### 必需版本
- **Adobe Illustrator 2021-2024** (版本 25.0-28.9)
- **CEP 10** 支持
- **Node.js 16.14.0** 或更高版本（开发环境）

### 操作系统
- **Windows 10/11** 或更高版本
- **macOS 10.14** 或更高版本

## 🚀 快速安装

### 方法一：自动安装（推荐）

#### macOS/Linux
```bash
# 克隆仓库
git clone -b cep10-support https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 自动检测版本并安装
chmod +x install-auto.sh
./install-auto.sh
```

#### Windows
```cmd
# 克隆仓库
git clone -b cep10-support https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 运行安装脚本
install-cep10.bat
```

### 方法二：手动安装

1. **下载 CEP 10 版本**
   ```bash
   # 下载 CEP 10 分支
   git clone -b cep10-support https://github.com/yourusername/illustrator-quote-plugin.git
   cd illustrator-quote-plugin
   ```

2. **构建插件**
   ```bash
   # 安装依赖
   yarn install
   
   # 构建插件
   yarn build:cep
   ```

3. **启用调试模式**
   
   **Windows (注册表):**
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.10
   创建字符串值：PlayerDebugMode = 1
   ```
   
   **macOS (终端):**
   ```bash
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   ```

4. **安装插件**
   ```bash
   # macOS/Linux
   ./install-cep10.sh
   
   # Windows
   install-cep10.bat
   ```

## 📖 使用教程

### 1. 启动插件

1. 打开 Adobe Illustrator 2021-2024
2. 菜单栏 → **窗口** → **扩展** → **Illustrator Quote (CEP 10)**
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

</details>

### 3. 应用材质报价

<details>
<summary>点击展开报价操作教程</summary>

#### 基本操作
1. 在 Illustrator 中选择要报价的对象
2. 在插件面板中选择材质类型
3. 调整单价（可选）
4. 点击"**应用材质**"按钮

#### 导出报价单
1. 完成所有对象的材质应用
2. 点击"**导出报价**"按钮
3. CSV 文件将自动保存到桌面

</details>

## 📦 预设材质

| 材质类型 | 默认单价 (元/m²) | 描述 |
|---------|----------------|------|
| 亚克力板 | 120 | 透明度高，适合展示 |
| PVC板 | 80 | 成本低，适合大面积使用 |
| 铝塑板 | 150 | 耐用性好，适合户外 |
| 不锈钢板 | 200 | 高端质感，耐腐蚀 |
| 木质板 | 100 | 自然质感，环保材质 |

## 🔍 故障排除

### 常见问题

<details>
<summary>插件显示白屏</summary>

**解决方案:**
1. 确认使用 Illustrator 2021-2024 版本
2. 检查 CEP 10 调试模式是否启用
3. 查看浏览器控制台错误信息 (http://localhost:8080)
4. 验证插件文件完整性

</details>

<details>
<summary>插件菜单中不显示</summary>

**解决方案:**
1. 确认 Illustrator 版本在 2021-2024 范围内
2. 检查 CEP 10 调试模式设置
3. 重启 Illustrator 应用程序
4. 验证插件安装路径正确

</details>

<details>
<summary>功能不兼容</summary>

**解决方案:**
1. 如果使用 Illustrator 2025+，请切换到 [CEP 12 版本](https://github.com/yourusername/illustrator-quote-plugin)
2. 检查 manifest.xml 中的版本范围设置
3. 确认使用正确的 CEP 版本

</details>

### 调试工具

- **浏览器控制台**: http://localhost:8080
- **CEP 调试**: 启用 CSXS.10 PlayerDebugMode
- **版本检查**: 确认 Illustrator 版本 25.0-28.9

## 🔄 版本升级

### 升级到 CEP 12

如果您升级到 Illustrator 2025+，建议切换到 CEP 12 版本：

```bash
# 切换到 CEP 12 主分支
git checkout main
git pull origin main

# 安装 CEP 12 版本
./install.sh
```

### 版本差异对比

| 特性 | CEP 10 版本 | CEP 12 版本 |
|------|------------|------------|
| 支持版本 | Illustrator 2021-2024 | Illustrator 2025+ |
| 核心功能 | ✅ 完整支持 | ✅ 完整支持 |
| 性能 | 🟡 稳定 | 🟢 更快 |
| 新特性 | 🟡 基础功能 | 🟢 最新功能 |

## 🔧 开发指南

### 技术栈
- **前端**: React 18 + TypeScript + Vite
- **CEP**: CEP 10 + ExtendScript
- **构建**: Yarn + ESLint

### 开发环境设置

```bash
# 克隆 CEP 10 分支
git clone -b cep10-support https://github.com/yourusername/illustrator-quote-plugin.git
cd illustrator-quote-plugin

# 安装依赖
yarn install

# 开发模式
yarn dev

# 构建 CEP 10 插件
yarn build:cep
```

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持与反馈

- 🐛 [报告 Bug](https://github.com/yourusername/illustrator-quote-plugin/issues)
- 💡 [功能建议](https://github.com/yourusername/illustrator-quote-plugin/issues)
- 📧 [联系作者](mailto:your.email@example.com)

---

<div align="center">

**🎯 CEP 10 稳定兼容版本 - 专为 Illustrator 2021-2024 优化**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div> 