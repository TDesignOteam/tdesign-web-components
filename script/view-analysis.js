#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const analysisFiles = [
  'stats-umd.html',
  'stats-umd-sunburst.html', 
  'stats-umd-network.html',
  'stats-lib.html',
  'stats-esm.html'
];

console.log('🔍 TDesign Web Components 包体积分析报告');
console.log('=' .repeat(50));

// 检查分析文件是否存在
const existingFiles = analysisFiles.filter(file => {
  const filePath = path.join(distDir, file);
  return fs.existsSync(filePath);
});

if (existingFiles.length === 0) {
  console.log('❌ 未找到分析报告文件');
  console.log('请先运行: npm run analyze');
  process.exit(1);
}

console.log('📊 可用的分析报告:');
existingFiles.forEach((file, index) => {
  const filePath = path.join(distDir, file);
  const stats = fs.statSync(filePath);
  const size = (stats.size / 1024).toFixed(2);
  
  console.log(`${index + 1}. ${file} (${size} KB)`);
});

console.log('\n🚀 快速操作:');
console.log('- 打开主报告: npm run analyze:open');
console.log('- 查看所有报告: open dist/stats-*.html');
console.log('- 重新分析: npm run analyze');

// 如果是 macOS，提供快速打开选项
if (process.platform === 'darwin') {
  console.log('\n💡 提示: 在 macOS 上，你可以运行以下命令快速打开所有报告:');
  console.log('open dist/stats-*.html');
}

// 显示构建产物大小信息
console.log('\n📦 构建产物大小:');
const buildFiles = [
  { name: 'UMD (开发版)', path: 'dist/TDesign Web Components.js' },
  { name: 'UMD (生产版)', path: 'dist/TDesign Web Components.min.js' },
  { name: 'CSS 样式', path: 'dist/tdesign.css' }
];

buildFiles.forEach(({ name, path: filePath }) => {
  const fullPath = path.join(distDir, '..', filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`- ${name}: ${size} KB`);
  }
});

console.log('\n📖 更多信息请查看: BUNDLE_ANALYSIS.md');