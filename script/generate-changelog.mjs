#!/usr/bin/env node

/**
 * 基于 git log 生成 CHANGELOG
 * 用法: node script/generate-changelog.mjs [package-name] [--since=tag]
 * 
 * 示例:
 *   node script/generate-changelog.mjs ui --since=v1.2.10
 *   node script/generate-changelog.mjs chat
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// 解析命令行参数
const args = process.argv.slice(2);
const packageName = args.find(arg => !arg.startsWith('--'));
const sinceArg = args.find(arg => arg.startsWith('--since='));
const since = sinceArg ? sinceArg.split('=')[1] : null;

if (!packageName || !['ui', 'chat', 'shared'].includes(packageName)) {
  console.error('用法: node script/generate-changelog.mjs <ui|chat|shared> [--since=tag]');
  process.exit(1);
}

const scopeMap = {
  ui: 'ui',
  chat: 'chat',
  shared: 'shared',
};

const scope = scopeMap[packageName];
const packageDir = resolve(rootDir, `packages/${packageName}`);
const changelogPath = resolve(packageDir, 'CHANGELOG.md');

// 获取 git log
const sinceOption = since ? `${since}..HEAD` : '';
const gitLogCmd = `git log ${sinceOption} --pretty=format:"%h|%s|%an|%ad" --date=short -- packages/${packageName}/`;

let commits;
try {
  const output = execSync(gitLogCmd, { cwd: rootDir, encoding: 'utf-8' });
  commits = output.trim().split('\n').filter(Boolean);
} catch (error) {
  console.error('获取 git log 失败:', error.message);
  process.exit(1);
}

if (commits.length === 0) {
  console.log(`没有找到 packages/${packageName}/ 相关的提交`);
  process.exit(0);
}

// 解析提交并分类
const categories = {
  feat: { title: '✨ Features', commits: [] },
  fix: { title: '🐛 Bug Fixes', commits: [] },
  refactor: { title: '♻️ Refactor', commits: [] },
  perf: { title: '⚡ Performance', commits: [] },
  docs: { title: '📝 Documentation', commits: [] },
  chore: { title: '🔧 Chores', commits: [] },
  other: { title: '📦 Other', commits: [] },
};

for (const line of commits) {
  const [hash, subject, author, date] = line.split('|');
  
  // 解析 conventional commit 格式
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  
  if (match) {
    const [, type, commitScope, message] = match;
    // 只包含匹配 scope 的提交，或者没有 scope 的提交
    if (!commitScope || commitScope === scope) {
      const category = categories[type] || categories.other;
      category.commits.push({ hash, message: message || subject, author, date });
    }
  } else {
    categories.other.commits.push({ hash, message: subject, author, date });
  }
}

// 生成 CHANGELOG 内容
const today = new Date().toISOString().split('T')[0];
let changelog = `## [Unreleased] - ${today}\n\n`;

for (const [, category] of Object.entries(categories)) {
  if (category.commits.length > 0) {
    changelog += `### ${category.title}\n\n`;
    for (const commit of category.commits) {
      changelog += `- ${commit.message} (${commit.hash}) - ${commit.author}\n`;
    }
    changelog += '\n';
  }
}

// 读取现有 CHANGELOG 并追加
let existingChangelog = '';
try {
  existingChangelog = readFileSync(changelogPath, 'utf-8');
} catch {
  existingChangelog = `# @tdesign/web-components-${packageName} Changelog\n\n`;
}

// 在文件头部插入新内容（标题之后）
const headerMatch = existingChangelog.match(/^# .+\n\n/);
if (headerMatch) {
  const header = headerMatch[0];
  const rest = existingChangelog.slice(header.length);
  existingChangelog = header + changelog + rest;
} else {
  existingChangelog = `# @tdesign/web-components-${packageName} Changelog\n\n${changelog}${existingChangelog}`;
}

writeFileSync(changelogPath, existingChangelog);
console.log(`✅ CHANGELOG 已更新: ${changelogPath}`);
console.log(`   包含 ${commits.length} 个提交`);
