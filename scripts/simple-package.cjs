#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  extensionName: 'illustrator-annotation-plugin',
  version: '2.0.0',
  sourceDir: 'dist',
  outputDir: 'release',
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  log(`${colors.bold}🚀 创建简单ZXP包${colors.reset}`, 'blue');
  
  // 检查dist目录
  if (!fs.existsSync(CONFIG.sourceDir)) {
    log(`❌ 错误: ${CONFIG.sourceDir} 目录不存在`, 'red');
    process.exit(1);
  }
  
  // 创建输出目录
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const zipPath = path.join(CONFIG.outputDir, `${CONFIG.extensionName}-v${CONFIG.version}.zip`);
  
  try {
    // 删除现有文件
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    
    // 创建zip文件（macOS）
    const zipCommand = `cd ${CONFIG.sourceDir} && zip -r ../${zipPath} .`;
    execSync(zipCommand, { stdio: 'inherit' });
    
    // 重命名为.zxp
    const zxpPath = zipPath.replace('.zip', '.zxp');
    if (fs.existsSync(zxpPath)) {
      fs.unlinkSync(zxpPath);
    }
    fs.renameSync(zipPath, zxpPath);
    
    log(`✅ ZXP文件创建成功: ${zxpPath}`, 'green');
    
    // 显示文件信息
    const stats = fs.statSync(zxpPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    log(`📊 文件大小: ${fileSizeInMB} MB`, 'blue');
    
    // 创建安装说明
    const instructions = `# ${CONFIG.extensionName} 安装说明

## 文件信息
- 文件名: ${path.basename(zxpPath)}
- 版本: ${CONFIG.version}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 安装方法

⚠️ **注意**: 这是未签名版本，需要启用调试模式

### 启用调试模式

**Windows:**
\`\`\`cmd
reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
\`\`\`

**macOS:**
\`\`\`bash
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
\`\`\`

### 安装插件

1. 使用 Anastasiy's Extension Manager 或 ZXPInstaller
2. 将 .zxp 文件拖拽到安装工具
3. 重启 Illustrator
4. 在菜单栏选择: 窗口 > 扩展功能 > Illustrator Quote (CEP 10)
`;
    
    const instructionsPath = path.join(CONFIG.outputDir, 'INSTALL.md');
    fs.writeFileSync(instructionsPath, instructions);
    
    log('✅ 打包完成!', 'green');
    log(`📁 输出目录: ${CONFIG.outputDir}`, 'blue');
    
  } catch (error) {
    log(`❌ 打包失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();