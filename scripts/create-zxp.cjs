#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置
const CONFIG = {
  extensionName: 'illustrator-annotation-plugin',
  version: '1.5.0',
  sourceDir: 'dist',
  outputDir: 'release',
  certDir: 'certs',
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

function checkDependencies() {
  log('📋 检查依赖...', 'blue');
  
  // 检查dist目录
  if (!fs.existsSync(CONFIG.sourceDir)) {
    log(`❌ 错误: ${CONFIG.sourceDir} 目录不存在。请先运行 npm run build:cep`, 'red');
    process.exit(1);
  }
  
  // 检查zxp-sign-cmd
  try {
    execSync('node node_modules/zxp-sign-cmd/index.js --version', { stdio: 'ignore' });
    log('✅ zxp-sign-cmd 已安装', 'green');
  } catch (error) {
    log('❌ 错误: zxp-sign-cmd 未找到。正在安装...', 'red');
    try {
      execSync('npm install zxp-sign-cmd --save-dev', { stdio: 'inherit' });
    } catch (installError) {
      log('❌ 无法安装 zxp-sign-cmd', 'red');
      process.exit(1);
    }
  }
}

function createOutputDir() {
  log('📁 创建输出目录...', 'blue');
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
}

function generateCertificate() {
  log('🔐 生成自签名证书...', 'blue');
  
  if (!fs.existsSync(CONFIG.certDir)) {
    fs.mkdirSync(CONFIG.certDir, { recursive: true });
  }
  
  const certPath = path.join(CONFIG.certDir, 'cert.p12');
  
  if (!fs.existsSync(certPath)) {
    log('📝 生成新的自签名证书...', 'yellow');
    
    const certCommand = [
      'node node_modules/zxp-sign-cmd/index.js',
      '--selfSignedCert',
      `CN="${CONFIG.extensionName}"`,
      'C=US',
      'ST=CA',
      'O=Developer',
      'OU=Extension',
      '--password password',
      `--output "${certPath}"`
    ].join(' ');
    
    try {
      execSync(certCommand, { stdio: 'inherit' });
      log('✅ 证书生成成功', 'green');
    } catch (error) {
      log('❌ 证书生成失败', 'red');
      process.exit(1);
    }
  } else {
    log('✅ 使用现有证书', 'green');
  }
  
  return certPath;
}

function createZXP(certPath) {
  log('📦 创建ZXP文件...', 'blue');
  
  const zxpFileName = `${CONFIG.extensionName}-v${CONFIG.version}.zxp`;
  const zxpPath = path.join(CONFIG.outputDir, zxpFileName);
  
  // 删除旧的ZXP文件
  if (fs.existsSync(zxpPath)) {
    fs.unlinkSync(zxpPath);
  }
  
  const signCommand = [
    'node node_modules/zxp-sign-cmd/index.js',
    '--sign',
    `"${CONFIG.sourceDir}"`,
    `"${zxpPath}"`,
    `"${certPath}"`,
    'password'
  ].join(' ');
  
  try {
    execSync(signCommand, { stdio: 'inherit' });
    log(`✅ ZXP文件创建成功: ${zxpPath}`, 'green');
    
    // 显示文件信息
    const stats = fs.statSync(zxpPath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    log(`📊 文件大小: ${fileSizeInMB} MB`, 'blue');
    
    return zxpPath;
  } catch (error) {
    log('❌ ZXP文件创建失败', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

function createInstallInstructions(zxpPath) {
  log('📄 生成安装说明...', 'blue');
  
  const instructions = `# ${CONFIG.extensionName} 安装说明

## 文件信息
- 文件名: ${path.basename(zxpPath)}
- 版本: ${CONFIG.version}
- 生成时间: ${new Date().toLocaleString('zh-CN')}

## 安装方法

### 方法一：使用 Anastasiy's Extension Manager （推荐）
1. 下载并安装 Anastasiy's Extension Manager
   - 网址: https://install.anastasiy.com/
2. 打开 Extension Manager
3. 将 ${path.basename(zxpPath)} 拖拽到窗口中
4. 点击安装

### 方法二：使用 ZXPInstaller
1. 下载并安装 ZXPInstaller
   - 网址: https://aescripts.com/learn/zxp-installer/
2. 打开 ZXPInstaller
3. 将 ${path.basename(zxpPath)} 拖拽到窗口中

## 使用说明
1. 打开 Adobe Illustrator
2. 在菜单栏选择: 窗口 > 扩展功能 > Illustrator Quote (CEP 10)
3. 插件面板将会显示

## 故障排除
- 如果插件未显示，请重启 Illustrator
- 确保您的 Illustrator 版本支持 (2021-2024)
- 如有问题，请查看详细安装指南

## 系统要求
- Adobe Illustrator 2021 或更新版本
- Windows 10+ 或 macOS 10.14+
`;
  
  const instructionsPath = path.join(CONFIG.outputDir, 'INSTALL.md');
  fs.writeFileSync(instructionsPath, instructions);
  log(`✅ 安装说明已创建: ${instructionsPath}`, 'green');
}

function main() {
  log(`${colors.bold}🚀 开始创建 ${CONFIG.extensionName} ZXP 文件${colors.reset}`, 'blue');
  log('', 'reset');
  
  try {
    checkDependencies();
    createOutputDir();
    const certPath = generateCertificate();
    const zxpPath = createZXP(certPath);
    createInstallInstructions(zxpPath);
    
    log('', 'reset');
    log('🎉 ZXP 打包完成!', 'green');
    log(`📁 输出目录: ${CONFIG.outputDir}`, 'blue');
    log(`📦 ZXP文件: ${path.basename(zxpPath)}`, 'blue');
    log('', 'reset');
    log('💡 提示: 您可以将ZXP文件分发给用户，用户可使用Extension Manager安装', 'yellow');
    
  } catch (error) {
    log(`❌ 打包失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();