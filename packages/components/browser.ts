// CDN 浏览器入口，保持与 UI 包根入口一致的公开能力。
import { styleSheet } from './style/index.js';

export * from './index';

const globalStyle = styleSheet ? document.getElementById('tdesign-wc-global-style') : null;

void globalStyle;
