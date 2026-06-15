/**
 * Omi 组件库样式导入兼容插件
 *
 * Omi 组件通过 `import styles from './foo.less'` 将样式作为字符串传入 css``，
 * Vite 8（Rolldown）对裸 .less/.css 默认导入更严格，需转为 ?inline 才能导出 default。
 */
export default function omiStyleImportPlugin() {
  return {
    name: 'vite-plugin-omi-style-import',

    enforce: 'pre',

    resolveId(source, importer, options) {
      if (!/\.(less|css)$/.test(source) || /[?&](inline|raw|url)/.test(source)) {
        return null;
      }

      return this.resolve(`${source}?inline`, importer, { skipSelf: true, ...options });
    },
  };
}
