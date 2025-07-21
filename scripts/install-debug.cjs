#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

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

function getExtensionPath() {
  const platform = os.platform();
  let extensionPath;
  
  if (platform === 'win32') {
    extensionPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Adobe', 'CEP', 'extensions');
  } else if (platform === 'darwin') {
    extensionPath = path.join(os.homedir(), 'Library', 'Application Support', 'Adobe', 'CEP', 'extensions');
  } else {
    log('❌ 不支持的操作系统', 'red');
    process.exit(1);
  }
  
  return extensionPath;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function enableDebugMode() {
  log('🔧 启用调试模式...', 'blue');
  
  const platform = os.platform();
  let debugFlag = false;
  
  if (platform === 'win32') {
    // Windows Registry
    const { execSync } = require('child_process');
    try {
      execSync('reg add "HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f', { stdio: 'ignore' });
      debugFlag = true;
    } catch (error) {
      log('⚠️  无法自动设置Windows注册表，请手动设置调试模式', 'yellow');
    }
  } else if (platform === 'darwin') {
    // macOS defaults
    const { execSync } = require('child_process');
    try {
      execSync('defaults write com.adobe.CSXS.10 PlayerDebugMode 1', { stdio: 'ignore' });
      debugFlag = true;
    } catch (error) {
      log('⚠️  无法自动设置macOS调试模式，请手动设置', 'yellow');
    }
  }
  
  if (debugFlag) {
    log('✅ 调试模式已启用', 'green');
  }
  
  return debugFlag;
}

function main() {
  log(`${colors.bold}🔧 安装插件到开发环境${colors.reset}`, 'blue');
  log('', 'reset');
  
  // 检查dist目录
  const distDir = 'dist';
  if (!fs.existsSync(distDir)) {
    log(`❌ 错误: ${distDir} 目录不存在。请先运行 npm run build:cep`, 'red');
    process.exit(1);
  }
  
  // 获取扩展目录
  const extensionDir = getExtensionPath();
  const targetDir = path.join(extensionDir, 'illustrator-annotation-plugin');
  
  log(`📁 扩展目录: ${extensionDir}`, 'blue');
  
  // 创建扩展目录
  if (!fs.existsSync(extensionDir)) {
    log('📁 创建扩展目录...', 'blue');
    fs.mkdirSync(extensionDir, { recursive: true });
  }
  
  try {
    // 删除现有安装
    if (fs.existsSync(targetDir)) {
      log('🗑️  删除现有安装...', 'yellow');
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    // 复制文件
    log('📋 复制插件文件...', 'blue');
    copyDirectory(distDir, targetDir);
    
    // 启用调试模式
    enableDebugMode();
    
    log('', 'reset');
    log('✅ 插件安装成功!', 'green');
    log(`📁 安装位置: ${targetDir}`, 'blue');
    log('', 'reset');
    log('💡 使用说明:', 'yellow');
    log('1. 重启 Adobe Illustrator', 'reset');
    log('2. 在菜单栏选择: 窗口 > 扩展功能 > Illustrator Quote (CEP 10)', 'reset');
    log('3. 插件面板将会显示', 'reset');
    log('', 'reset');
    log('🔍 调试说明:', 'yellow');
    log('- 可以使用浏览器开发者工具调试', 'reset');
    log('- 右键点击插件面板 > 检查 (如果调试模式已启用)', 'reset');
    
  } catch (error) {
    log(`❌ 安装失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();