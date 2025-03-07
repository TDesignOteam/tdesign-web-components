// @ts-nocheck
import t from '@babel/types'; // 新增导入
import { createFilter } from '@rollup/pluginutils';

import babelAddPartAttributePlugin from '../plugins/babel-plugin-add-part-attribute.cjs'

const { visitor } = babelAddPartAttributePlugin({ types: t, jsxFactoryName: 'OmiComponent' })

export default function addPartAttributePlugin(options = {}) {
  const filter = createFilter(options.include || /\.(jsx?|tsx?|mjs)$/, options.exclude || /node_modules/);

  return {
    name: 'add-part-attribute',

    async transform(code, id) {
      if (!filter(id)) return;

      const { transformAsync } = await import('@babel/core');

      try {
        const result = await transformAsync(code, {
          filename: id,
          plugins: [
            function originalPlugin() {
              return {
                visitor
              };
            },
          ],
          sourceMaps: true,
          configFile: false,
        });

        return {
          code: result.code,
          map: result.map,
        };
      } catch (err) {
        console.error(`Error processing ${id}`);
        throw err;
      }
    },
  };
}
