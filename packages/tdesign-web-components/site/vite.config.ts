import { createSiteViteConfig } from '@tdesign/vite-config/site';
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';

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
