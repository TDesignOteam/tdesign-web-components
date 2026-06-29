# @tdesign/web-components-chat

TDesign AI Chat Web Components（Omi）。依赖基础 UI 包 `@tdesign/web-components`。

## 安装

```bash
npm i @tdesign/web-components @tdesign/web-components-chat omi
```

## 使用

```js
import '@tdesign/web-components';
import '@tdesign/web-components-chat/chatbot';
import '@tdesign/web-components/lib/style/index.css';
```

## 产物说明

| 目录 | 说明 |
|------|------|
| `esm/` | ESM 按需（`import`） |
| `cjs/` | CommonJS 按需（`require`） |
| `lib/` | 类型声明（`.d.ts`） |
| `dist/` | UMD（CDN） |

## Peer Dependencies

- `@tdesign/web-components` — 提供 `t-collapse`、`t-message` 等基础组件
- `omi` — Web Components 运行时

## License

MIT
