/**
 * 验证 UI / Chat 文档站 dev 是否合理
 * 用法：先启动 dev:ui / dev:chat，再执行 node script/verify-dev.mjs
 */
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITES = [
  {
    name: 'UI',
    port: 15000,
    componentStyle: 'packages/components/button/style/index.js',
    componentTsx: 'packages/components/button/button.tsx',
    lessFile: 'common-utils/_common/style/web/components/button/_index.less',
    chatOnly: null,
  },
  {
    name: 'Chat',
    port: 15001,
    componentStyle: 'packages/components/button/style/index.js',
    componentTsx: 'packages/pro-components/chat/chat-sender/chat-sender.tsx',
    lessFile: 'common-utils/_common/style/web/components/button/_index.less',
    chatOnly: 'packages/pro-components/chat/chatbot/style/index.js',
  },
];

async function fetchText(url) {
  const res = await fetch(url);
  return { status: res.status, body: await res.text() };
}

function check(name, ok, detail = '') {
  const mark = ok ? '✅' : '❌';
  console.log(`  ${mark} ${name}${detail ? ` — ${detail}` : ''}`);
  return ok;
}

let allPass = true;

for (const site of SITES) {
  const base = `http://127.0.0.1:${site.port}`;
  console.log(`\n======== ${site.name} dev (:${site.port}) ========`);

  // 1. 入口可访问
  const index = await fetchText(`${base}/`);
  allPass &= check('index.html 200', index.status === 200, `status=${index.status}`);

  const main = await fetchText(`${base}/main.tsx`);
  allPass &= check('main.tsx 200', main.status === 200);
  allPass &= check(
    'main 引用组件全局样式',
    main.body.includes('packages/components/style/index.js'),
  );
  allPass &= check(
    'main 使用 OmiComponent JSX 注入',
    main.body.includes('Component as OmiComponent'),
  );
  allPass &= check(
    '站点 CSS 走默认注入（非 ?inline）',
    main.body.includes('tdesign-site-components/lib/styles/style.css') &&
      !main.body.includes('tdesign-site-components/lib/styles/style.css?inline'),
  );
  allPass &= check(
    'docs.less 走默认注入（非 ?inline）',
    main.body.includes('docs.less') && !main.body.includes('docs.less?inline'),
  );

  // 2. 组件样式模块
  const styleUrl = `${base}/@fs/${resolve(ROOT, site.componentStyle)}`;
  const style = await fetchText(styleUrl);
  allPass &= check('组件 style 模块 200', style.status === 200);
  allPass &= check('style 含 globalCSS', /globalCSS/.test(style.body));
  allPass &= check('style 使用 ?inline 导入 Less', /\?inline/.test(style.body));
  allPass &= check('style 无 undefined 样式', !/=\s*undefined/.test(style.body));

  // 3. Less 内联编译
  const lessUrl = `${base}/@fs/${resolve(ROOT, site.lessFile)}?inline`;
  const less = await fetchText(lessUrl);
  allPass &= check('Less ?inline 200', less.status === 200);
  allPass &= check('Less 编译出 CSS 类名', /\.t-button/.test(less.body));
  allPass &= check('Less 非空', less.body.length > 1000, `${less.body.length} bytes`);

  // 4. 组件 TSX 走源码 alias
  const tsxUrl = `${base}/@fs/${resolve(ROOT, site.componentTsx)}`;
  const tsx = await fetchText(tsxUrl);
  allPass &= check('组件 TSX 200', tsx.status === 200);
  allPass &= check('TSX 走 @fs 源码路径', tsx.body.includes('/@fs/'));

  // 5. Chat 专属样式
  if (site.chatOnly) {
    const chatStyleUrl = `${base}/@fs/${resolve(ROOT, site.chatOnly)}`;
    const chatStyle = await fetchText(chatStyleUrl);
    allPass &= check('Chat 专属 style 200', chatStyle.status === 200);
    allPass &= check('Chat style ?inline', /\?inline/.test(chatStyle.body));
  }
}

console.log(`\n${allPass ? '✅ 全部通过：两者 dev 配置合理' : '❌ 存在失败项，请检查上方输出'}\n`);
process.exit(allPass ? 0 : 1);
