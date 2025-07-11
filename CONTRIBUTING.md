# 贡献指南

感谢您对 Illustrator 报价插件的关注！我们欢迎所有形式的贡献。

## 🤝 贡献方式

### 报告问题
- 🐛 [报告 Bug](https://github.com/xuanheScript/illustrator-quote-plugin/issues/new?template=bug_report.md)
- 💡 [功能建议](https://github.com/xuanheScript/illustrator-quote-plugin/issues/new?template=feature_request.md)
- 📝 [文档改进](https://github.com/xuanheScript/illustrator-quote-plugin/issues/new?template=documentation.md)

### 代码贡献
- 🔧 修复 Bug
- ✨ 新功能开发
- 📖 文档更新
- 🎨 UI/UX 改进

## 🛠️ 开发环境设置

### 前置要求
- **Node.js** 17.7.1 或更高版本
- **Yarn** 包管理器
- **Adobe Illustrator 2025+** 用于测试
- **Git** 版本控制

### 环境配置

1. **Fork 并克隆仓库**
   ```bash
   git clone https://github.com/xuanheScript/illustrator-quote-plugin.git
   cd illustrator-quote-plugin
   ```

2. **安装依赖**
   ```bash
   yarn install
   ```

3. **启用 CEP 调试模式**
   
   **Windows (注册表):**
   ```
   HKEY_CURRENT_USER\Software\Adobe\CSXS.12
   创建字符串值：PlayerDebugMode = 1
   ```
   
   **macOS (终端):**
   ```bash
   defaults write com.adobe.CSXS.12 PlayerDebugMode 1
   ```

4. **构建并安装插件**
   ```bash
   yarn build:cep
   ./install.sh  # macOS/Linux
   # 或
   install.bat   # Windows
   ```

## 📋 开发流程

### 1. 创建分支
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发和测试
```bash
# 开发模式（热重载）
yarn dev

# 构建插件
yarn build:cep

# 代码检查
yarn lint

# 在 Illustrator 中测试功能
```

### 3. 提交代码
```bash
git add .
git commit -m "feat: 添加新的材质管理功能"
# 或
git commit -m "fix: 修复 JSON 解析错误"
```

### 4. 推送并创建 PR
```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## 📝 代码规范

### 提交信息格式
使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 格式：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

**类型：**
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

**示例：**
```
feat(material): 添加材质管理功能

- 实现材质的增删改查
- 添加本地存储支持
- 完善用户界面

Closes #123
```

### 代码风格
- 使用 **TypeScript** 进行类型检查
- 遵循 **ESLint** 配置规则
- 使用 **Prettier** 格式化代码
- 组件使用 **React Hooks**
- 样式使用 **CSS Modules** 或内联样式

### 文件命名
- 组件文件：`PascalCase.tsx`
- 工具函数：`camelCase.ts`
- 样式文件：`kebab-case.css`
- 测试文件：`ComponentName.test.tsx`

## 🧪 测试指南

### 手动测试
1. **基础功能测试**
   - 插件加载和初始化
   - 材质选择和价格更新
   - 对象选择和面积计算

2. **材质管理测试**
   - 添加新材质
   - 编辑现有材质
   - 删除材质
   - 数据持久化

3. **报价功能测试**
   - 单个对象报价
   - 多对象批量报价
   - CSV 导出功能

4. **错误处理测试**
   - 无选中对象的情况
   - 无效输入的处理
   - 网络错误的处理

### 兼容性测试
- **Illustrator 版本**: 2025, 2026+
- **操作系统**: Windows 10/11, macOS 10.15+
- **浏览器引擎**: Chromium 99+

## 📖 文档贡献

### 文档类型
- **README.md**: 项目概述和使用指南
- **CHANGELOG.md**: 版本更新记录
- **API 文档**: 代码接口说明
- **用户手册**: 详细使用教程

### 文档标准
- 使用 **Markdown** 格式
- 包含代码示例和截图
- 保持简洁清晰的表达
- 支持中英文双语

## 🎨 UI/UX 贡献

### 设计原则
- **简洁性**: 界面简洁，功能明确
- **一致性**: 保持统一的设计风格
- **可用性**: 易于使用和理解
- **可访问性**: 支持无障碍访问

### 设计资源
- 使用系统默认字体
- 遵循 Adobe 设计规范
- 支持明暗主题切换
- 响应式设计

## 🔍 代码审查

### 审查要点
- **功能正确性**: 代码是否实现了预期功能
- **性能优化**: 是否有性能问题
- **安全性**: 是否存在安全漏洞
- **可维护性**: 代码是否易于理解和维护

### 审查流程
1. 自动化检查（ESLint, TypeScript）
2. 功能测试验证
3. 代码审查反馈
4. 修改和完善
5. 合并到主分支

## 🚀 发布流程

### 版本管理
- 使用 [语义化版本](https://semver.org/lang/zh-CN/)
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 发布检查清单
- [ ] 所有测试通过
- [ ] 文档更新完成
- [ ] 更新日志记录
- [ ] 版本号更新
- [ ] 标签和发布说明

## 📞 联系我们

- **问题讨论**: [GitHub Issues](https://github.com/xuanheScript/illustrator-quote-plugin/issues)
- **功能建议**: [GitHub Discussions](https://github.com/xuanheScript/illustrator-quote-plugin/discussions)
- **邮件联系**: [your.email@example.com](mailto:your.email@example.com)

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT 许可证](LICENSE) 下进行许可。

---

**感谢您的贡献！** 🎉

每一个贡献都让这个项目变得更好，无论是代码、文档、测试还是反馈，我们都非常感谢！ 