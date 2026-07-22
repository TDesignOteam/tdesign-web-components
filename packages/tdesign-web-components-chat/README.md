# @tdesign/web-components-chat

TDesign AI Chat Web Components（Omi）。依赖基础 UI 包 `@tdesign/web-components`。

## 安装

```bash
npm i @tdesign/web-components @tdesign/web-components-chat
```

## 使用

```js
import '@tdesign/web-components-chat/chatbot';
import '@tdesign/web-components/style/index.css';
```

## 产物说明

| 目录 | 说明 |
|------|------|
| `esm/` | ESM 按需（`import`） |
| `dist/` | IIFE 浏览器构建（CDN 直引） |

```html
<script src="https://unpkg.com/@tdesign/web-components@<version>/dist/web-components.min.js"></script>
<script src="https://unpkg.com/@tdesign/web-components-chat@<version>/dist/web-components-chat.min.js"></script>
<t-chatbot></t-chatbot>
```

## Peer Dependencies

- `@tdesign/web-components` — 提供 `t-collapse`、`t-message` 等基础组件

## License

MIT
