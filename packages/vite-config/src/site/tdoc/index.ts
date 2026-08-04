import vitePluginTdoc from 'vite-plugin-tdoc';

import renderDemo from './demo.ts';
import transforms from './transforms.ts';

export default () =>
  vitePluginTdoc({
    transforms,
    markdown: {
      anchor: {
        tabIndex: false,
        config: (anchor: any) => ({
          permalink: anchor.permalink.linkInsideHeader({ symbol: '' }),
        }),
      },
      toc: {
        listClass: 'tdesign-toc_list',
        itemClass: 'tdesign-toc_list_item',
        linkClass: 'tdesign-toc_list_item_a',
        containerClass: 'tdesign-toc_container',
      },
      container(md: any, container: any) {
        renderDemo(md, container);
      },
    },
  });
