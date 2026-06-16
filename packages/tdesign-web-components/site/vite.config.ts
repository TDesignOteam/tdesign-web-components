import { fileURLToPath } from 'node:url';
import { dirname } from 'path';

import { createSiteViteConfig } from '../../../script/vite.site.config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createSiteViteConfig({
  siteDir: __dirname,
  port: 15000,
  previewPort: 15010,
  publicPathMap: {
    preview: '/',
    production: '/web-components/',
  },
});
