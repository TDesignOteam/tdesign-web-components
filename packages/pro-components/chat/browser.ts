// CDN 浏览器入口。基础 UI 作为 peer 依赖，需先加载 UI 的 IIFE 构建。
import '@tdesign/web-components';

export * from './index';

const currentScript = document.currentScript as HTMLScriptElement | null;

if (currentScript?.src) {
  const assetBase = new URL('./assets/', currentScript.src).href;

  for (const style of document.querySelectorAll('style')) {
    if (style.textContent?.includes('../assets/ch-icon.')) {
      style.textContent = style.textContent.replace(/\.\.\/assets\//g, assetBase);
    }
  }
}
