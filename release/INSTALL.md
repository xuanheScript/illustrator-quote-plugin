# illustrator-annotation-plugin 安装说明

## 文件信息
- 文件名: illustrator-annotation-plugin-v1.5.0.zxp
- 版本: 1.5.0
- 生成时间: 2025/7/22 01:41:17

## 安装方法

⚠️ **注意**: 这是未签名版本，需要启用调试模式

### 启用调试模式

**Windows:**
```cmd
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS:**
```bash
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
```

### 安装插件

1. 使用 Anastasiy's Extension Manager 或 ZXPInstaller
2. 将 .zxp 文件拖拽到安装工具
3. 重启 Illustrator
4. 在菜单栏选择: 窗口 > 扩展功能 > Illustrator Quote (CEP 10)
