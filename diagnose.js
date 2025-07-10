#!/usr/bin/env node

/**
 * Illustrator Quote Plugin 诊断脚本
 * 检查插件安装和配置的常见问题
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Illustrator Quote Plugin 诊断工具');
console.log('=====================================\n');

// 检查项目文件
const requiredFiles = [
  'dist/index.html',
  'dist/CSXS/manifest.xml',
  'dist/jsx/applyMaterial.jsx',
  'dist/jsx/exportQuote.jsx',
  'dist/lib/CSInterface.js',
  'dist/assets/index.js'
];

console.log('📁 检查必要文件...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 缺失`);
    missingFiles.push(file);
  }
});

// 检查CSS是否内联到JS中
console.log('\n🎨 检查CSS样式...');
if (fs.existsSync('dist/assets/index.js')) {
  const jsContent = fs.readFileSync('dist/assets/index.js', 'utf8');
  if (jsContent.includes('plugin-container') && jsContent.includes('form-group')) {
    console.log('✅ CSS 样式已内联到 JavaScript 中');
  } else {
    console.log('❌ CSS 样式缺失或未正确内联');
  }
} else {
  console.log('❌ JavaScript 文件不存在，无法检查 CSS');
}

if (missingFiles.length > 0) {
  console.log('\n⚠️  发现缺失文件，请运行：npm run build:cep');
  console.log('缺失的文件：');
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('\n✅ 所有必要文件都存在');
}

// 检查 manifest.xml 内容
console.log('\n📋 检查 manifest.xml...');
if (fs.existsSync('dist/CSXS/manifest.xml')) {
  const manifest = fs.readFileSync('dist/CSXS/manifest.xml', 'utf8');
  
  // 检查关键配置
  const checks = [
    { name: 'ExtensionBundleId', regex: /ExtensionBundleId="com\.illustrator\.quote"/, required: true },
    { name: 'Host Name ILST', regex: /Host Name="ILST"/, required: true },
    { name: 'MainPath', regex: /MainPath>\.\/index\.html<\/MainPath/, required: true },
    { name: 'CSXS Version', regex: /RequiredRuntime Name="CSXS" Version="10\.0"/, required: true }
  ];
  
  checks.forEach(check => {
    if (check.regex.test(manifest)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - 配置错误`);
    }
  });
} else {
  console.log('❌ manifest.xml 文件不存在');
}

// 检查 index.html 内容
console.log('\n📄 检查 index.html...');
if (fs.existsSync('dist/index.html')) {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  
  const htmlChecks = [
    { name: 'CSInterface 引用', regex: /src="\.\/lib\/CSInterface\.js"/, required: true },
    { name: 'JavaScript 引用', regex: /src="\.\/assets\/index\.js"/, required: true },
    { name: 'Root 元素', regex: /<div id="root">/, required: true }
  ];
  
  htmlChecks.forEach(check => {
    if (check.regex.test(html)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - 缺失或错误`);
    }
  });
  
  // 检查是否有单独的CSS引用（不应该有，因为CSS已内联）
  if (html.includes('index.css')) {
    console.log('⚠️  发现单独的 CSS 引用，但 CSS 已内联到 JS 中');
  } else {
    console.log('✅ 无单独 CSS 引用（CSS 已内联）');
  }
} else {
  console.log('❌ index.html 文件不存在');
}

// 检查 CSInterface.js
console.log('\n🔗 检查 CSInterface.js...');
if (fs.existsSync('dist/lib/CSInterface.js')) {
  const csInterface = fs.readFileSync('dist/lib/CSInterface.js', 'utf8');
  
  if (csInterface.includes('CSInterface') && csInterface.includes('evalScript')) {
    console.log('✅ CSInterface 库正常');
  } else {
    console.log('❌ CSInterface 库内容异常');
  }
} else {
  console.log('❌ CSInterface.js 文件不存在');
}

// 检查 package.json 脚本
console.log('\n📦 检查构建脚本...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const scripts = ['build', 'build:cep', 'prepare-cep'];
  scripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ ${script}: ${pkg.scripts[script]}`);
    } else {
      console.log(`❌ ${script} 脚本缺失`);
    }
  });
} else {
  console.log('❌ package.json 文件不存在');
}

// 提供建议
console.log('\n💡 建议和解决方案：');
console.log('====================');

if (missingFiles.length > 0) {
  console.log('1. 运行构建命令：');
  console.log('   npm install');
  console.log('   npm run build:cep');
  console.log('');
}

console.log('2. 如果插件显示白屏：');
console.log('   - 在插件面板中右键 → 检查元素');
console.log('   - 查看 Console 选项卡的错误信息');
console.log('   - 检查 Network 选项卡的资源加载情况');
console.log('   - 确认 CSInterface 是否正确加载');
console.log('');

console.log('3. 测试插件 UI：');
console.log('   - 打开 debug.html 在浏览器中测试');
console.log('   - 或运行：python3 -m http.server 8080');
console.log('   - 然后访问：http://localhost:8080/debug.html');
console.log('');

console.log('4. 安装到 Illustrator：');
console.log('   - macOS: ~/Library/Application Support/Adobe/CEP/extensions/');
console.log('   - Windows: %APPDATA%\\Adobe\\CEP\\extensions\\');
console.log('   - 复制 dist 文件夹并重命名为：com.illustrator.quote.panel');
console.log('');

console.log('5. 启用调试模式：');
console.log('   - macOS: defaults write com.adobe.CSXS.10 PlayerDebugMode 1');
console.log('   - Windows: 注册表添加 HKEY_CURRENT_USER\\Software\\Adobe\\CSXS.10\\PlayerDebugMode=1');
console.log('');

console.log('6. 常见白屏原因：');
console.log('   - JavaScript 执行错误（检查控制台）');
console.log('   - CSInterface 库未加载');
console.log('   - React 组件渲染失败');
console.log('   - 资源文件路径错误');
console.log('');

console.log('🎯 诊断完成！如果问题仍然存在，请检查上述建议。'); 