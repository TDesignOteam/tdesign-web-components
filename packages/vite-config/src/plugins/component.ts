import type { Plugin } from 'vite';
import * as t from '@babel/types';

import babelAddPartAttributePlugin from './babel-plugin-add-part-attribute.cjs';

const COMPONENT_SOURCE_RE = /\/packages\/(components|pro-components\/chat)\//;
const STYLE_IMPORT_RE = /\.(less|css)$/;
const SOURCE_FILE_RE = /\.(?:[cm]?[jt]sx?)$/;

function isComponentSource(id?: string) {
  if (!id) return false;
  const normalizedId = id.replace(/\\/g, '/');
  return !normalizedId.includes('/node_modules/') && COMPONENT_SOURCE_RE.test(normalizedId);
}

/**
 * 将组件的样式默认导入转为 ?inline，供 Omi 的 css`` 使用。
 * 文档站的副作用样式仍由 Vite 默认处理。
 */
export function createComponentStylePlugin(): Plugin {
  return {
    name: 'vite-plugin-component-style-inline',
    enforce: 'pre',

    resolveId(source, importer, options) {
      if (!STYLE_IMPORT_RE.test(source) || /[?&](inline|raw|url)/.test(source) || !isComponentSource(importer)) {
        return null;
      }

      return this.resolve(`${source}?inline`, importer, { skipSelf: true, ...options });
    },
  };
}

/**
 * 只为组件源码中的 Omi JSX 自动补充 Shadow DOM part 属性。
 *
 * 文档站的 JSX 会被编译为 `OmiComponent.h(...)`，库构建（ESM/IIFE）的 JSX 会被
 * 编译为 `Component.h(...)`，两者的 pragma 不同，因此需要按场景传入 jsxFactoryName。
 */
export function createPartAttributePlugin(jsxFactoryName: string = 'OmiComponent'): Plugin {
  const { visitor } = babelAddPartAttributePlugin({
    types: t,
    jsxFactoryName,
  });

  return {
    name: 'vite-plugin-add-component-part',

    async transform(code, id) {
      if (!SOURCE_FILE_RE.test(id) || !isComponentSource(id)) return null;

      const { transformAsync } = await import('@babel/core');
      const result = await transformAsync(code, {
        filename: id,
        plugins: [
          () => ({
            visitor,
          }),
        ],
        sourceMaps: true,
        configFile: false,
      });

      return result && { code: result.code ?? code, map: result.map };
    },
  };
}

/** 文档站需要的组件源码转换集合。 */
export function createComponentSitePlugins(): Plugin[] {
  return [createComponentStylePlugin(), createPartAttributePlugin('OmiComponent')];
}
