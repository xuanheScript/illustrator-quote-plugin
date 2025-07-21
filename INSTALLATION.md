# Illustrator 标注插件 - 安装说明

> **Adobe Illustrator 材质标注插件**，支持多材质选择、单位管理和标注导出功能

## 🎯 系统要求

- **Adobe Illustrator**: 2021, 2022, 2023, 2024 版本
- **操作系统**: Windows 10+ 或 macOS 10.14+
- **CEP版本**: 10.0 (向上兼容)

## 📦 安装方法

### 方法一：ZXP文件安装 (推荐)

#### 步骤 1: 下载安装工具

选择以下任一工具：

**🔹 Anastasiy's Extension Manager (推荐)**
- 下载地址: https://install.anastasiy.com/
- 支持: Windows & macOS
- 特点: 界面友好，功能完整

**🔹 ZXPInstaller**
- 下载地址: https://aescripts.com/learn/zxp-installer/
- 支持: Windows & macOS
- 特点: 轻量级，简单易用

#### 步骤 2: 安装插件

1. 下载插件的 `.zxp` 文件
2. 打开您选择的安装工具
3. 将 `.zxp` 文件拖拽到工具窗口中
4. 点击安装按钮
5. 等待安装完成

### 方法二：手动安装

#### Windows 系统

1. **定位扩展目录**:
   ```
   C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\extensions\
   ```

2. **创建插件文件夹**:
   ```
   C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\extensions\illustrator-annotation-plugin\
   ```

3. **复制插件文件**: 
   - 将所有插件文件复制到上述文件夹中

4. **启用调试模式** (必需):
   - 按 `Win + R`，输入 `regedit`
   - 导航到: `HKEY_CURRENT_USER\Software\Adobe\CSXS.10`
   - 创建字符串值: `PlayerDebugMode` = `1`

#### macOS 系统

1. **定位扩展目录**:
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/
   ```

2. **创建插件文件夹**:
   ```
   ~/Library/Application Support/Adobe/CEP/extensions/illustrator-annotation-plugin/
   ```

3. **复制插件文件**: 
   - 将所有插件文件复制到上述文件夹中

4. **启用调试模式** (必需):
   ```bash
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   ```

## 🚀 使用插件

### 启动插件

1. **打开 Adobe Illustrator**
2. **访问菜单**: 窗口 > 扩展功能 > Illustrator Quote (CEP 10)
3. **插件面板**: 将在屏幕右侧显示

### 基本操作流程

1. **管理材质**:
   - 点击"管理材质"按钮
   - 添加/编辑材质及其默认单位

2. **应用标注**:
   - 在AI中选择要标注的对象
   - 选择一个或多个材质
   - 为每个材质设置数值（可选）
   - 点击"应用材质"按钮

3. **导出数据**:
   - 完成标注后点击"导出标注"
   - CSV文件将保存到桌面

## 🔧 故障排除

### 插件未显示

**症状**: 在扩展功能菜单中找不到插件

**解决方案**:
1. 检查AI版本是否支持 (2021-2024)
2. 确认调试模式已启用
3. 重启 Illustrator
4. 检查插件文件是否正确安装

### 调试模式设置

**Windows**:
```cmd
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS**:
```bash
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
```

### 插件功能异常

1. **检查控制台**:
   - 右键点击插件面板 > 检查
   - 查看控制台错误信息

2. **重新安装**:
   - 删除插件文件夹
   - 重新安装插件

3. **清除偏好设置**:
   - 重置 Illustrator 偏好设置

## 📋 功能特性

### ✨ 主要功能

- **多材质选择**: 同时选择多个材质进行标注
- **单位管理**: 为每个材质设置默认单位 (cm, mm, m², 个等)
- **智能标注**: 自动计算对象尺寸和面积
- **数据导出**: 导出包含材质信息、尺寸和面积的CSV文件
- **可视化标注**: 在AI中创建标注线和文本说明

### 📊 导出格式

生成的CSV文件包含以下信息:
- 图层名称
- 材质信息 (格式: "数值 单位 材质名")
- 宽度 (mm)
- 高度 (mm)  
- 面积 (m²)

## 📞 技术支持

### 开发信息
- **版本**: 1.5.0
- **CEP版本**: 10.0
- **兼容性**: Illustrator 2021-2024

### 反馈渠道
- **GitHub Issues**: 报告问题和建议
- **文档**: 查看最新使用说明

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

*最后更新: 2025年1月*