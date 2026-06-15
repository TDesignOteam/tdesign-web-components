/** 项目最低 Node 版本要求（Vite 8 要求 22.12+） */
const MIN_NODE = [22, 12, 0];

function parseVersion(version) {
  return version.replace(/^v/, '').split('.').map((part) => Number(part));
}

function isBelowMin(current, min) {
  for (let i = 0; i < min.length; i += 1) {
    const currentPart = current[i] ?? 0;
    const minPart = min[i] ?? 0;
    if (currentPart > minPart) return false;
    if (currentPart < minPart) return true;
  }
  return false;
}

const current = parseVersion(process.version);

if (isBelowMin(current, MIN_NODE)) {
  console.error(
    `\n[tdesign-web-components] 需要 Node.js >= ${MIN_NODE.join('.')}，当前为 ${process.version}。\n` +
      '请升级 Node 后重试，例如：nvm install 22.12.0 && nvm use\n',
  );
  process.exit(1);
}
