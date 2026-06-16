/**
 * 验证文档站 preview 产物是否可正常访问
 * 用法：先 pnpm run site:ui && pnpm run preview:ui
 */
const SITES = [
  {
    name: 'UI',
    port: 15010,
    prefix: '/web-components',
    home: '/web-components/getting-started',
  },
  {
    name: 'Chat',
    port: 15011,
    prefix: '/pro-web-components',
    home: '/pro-web-components/getting-started',
  },
];

async function checkUrl(label, url) {
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const hasApp = html.includes('id="app"');
  const hasScript = /type="module"/.test(html) && /assets\/index-/.test(html);
  const ok = res.ok && hasApp && hasScript;
  console.log(`  ${ok ? '✅' : '❌'} ${label}: HTTP ${res.status}, script=${hasScript}`);
  if (!ok) console.log('    url:', url);
  return ok;
}

async function checkAssetFromHtml(html, port) {
  const m = html.match(/src="([^"]+assets\/index-[^"]+\.js)"/);
  if (!m) return false;
  const assetUrl = `http://127.0.0.1:${port}${m[1]}`;
  const res = await fetch(assetUrl);
  const js = await res.text();
  const hasRoute = js.includes('/getting-started');
  console.log(`  ${hasRoute ? '✅' : '❌'} 主包含 getting-started 路由: ${hasRoute}`);
  return res.ok && hasRoute;
}

let allPass = true;

for (const site of SITES) {
  const base = `http://127.0.0.1:${site.port}`;
  console.log(`\n======== ${site.name} preview (:${site.port}) ========`);
  console.log(`  请访问: ${base}${site.home}`);

  allPass &= await checkUrl('根路径 /', `${base}/`);
  allPass &= await checkUrl('base 路径', `${base}${site.prefix}/`);
  allPass &= await checkUrl('首页', `${base}${site.home}`);

  const homeRes = await fetch(`${base}${site.home}`);
  const homeHtml = await homeRes.text();
  allPass &= await checkAssetFromHtml(homeHtml, site.port);
}

console.log(`\n${allPass ? '✅ preview 静态检查通过' : '❌ 存在问题，请检查上方输出'}\n`);
process.exit(allPass ? 0 : 1);
