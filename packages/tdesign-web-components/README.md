# @tdesign/web-components

TDesign Web Components 组件库（Omi）。完整文档见 [tdesign.tencent.com](https://tdesign.tencent.com/) 与仓库 [README](https://github.com/Tencent/tdesign-web-components/blob/main/README.md)。

## 安装

```bash
npm i @tdesign/web-components
```

## 使用

```js
// 按需
import '@tdesign/web-components/button';
import '@tdesign/web-components/style/index.css';

// 或全量
import '@tdesign/web-components';
```

## 产物说明

| 目录 | 说明 |
|------|------|
| `esm/` | ESM 按需（`import`） |
| `dist/` | IIFE 浏览器构建（CDN 直引） |

```html
<script src="https://unpkg.com/@tdesign/web-components@<version>/dist/web-components.min.js"></script>
<t-button theme="primary">按钮</t-button>
```

## License

MIT
