/**
 * 文档站根路径重定向（兼容 production base 子路径 preview）
 * @param prefix 站点前缀，如 /web-components
 * @param homePath 首页完整路径
 */
export function createSiteRootRedirects(prefix: string, homePath: string) {
  return [
    { path: '/', redirect: homePath },
    { path: prefix, redirect: homePath },
    { path: `${prefix}/`, redirect: homePath },
  ];
}
