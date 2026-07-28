---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.3.1-alpha.13 `2026-07-28`

### 🚧 Refactor（Breaking Changes）

- **独立发布包**：Chat 从合包 `tdesign-web-components` 拆分为 `@tdesign/web-components-chat`
- **Peer 依赖**：需安装 `@tdesign/web-components`（提供 `t-collapse`、`t-message` 等基础组件）
- **按需引入**：`import '@tdesign/web-components-chat/chatbot'` 注册 `<t-chatbot>` 自定义元素
- **构建**：`vite build` 产出 `esm` / `dist`；`shared` 按需内联，`@tdesign/ai-chat-engine` 为 runtime 依赖
- **exports**：`"."` 全量 + `"./*"` 子模块（`chatbot`、`chat-message`、`chat-engine` 等）

### 📦 迁移说明（自 1.2.x 合包版本）

| 旧写法（develop） | 新写法 |
|------------------|--------|
| `import 'tdesign-web-components/chatbot'` | `import '@tdesign/web-components-chat/chatbot'` |
| `import type { TdChatMessageProps } from '@tdesign/web-components-chat/chat-message/type'` | `import type { TdChatMessageProps } from '@tdesign/web-components-chat/chat-message'` |
| `import type { TdChatMarkdownContentProps } from '@tdesign/web-components-chat/chat-message/content/markdown-content'` | `import type { TdChatMarkdownContentProps } from '@tdesign/web-components-chat/chat-message'` |
| 无需单独装 UI 包 | `npm i @tdesign/web-components @tdesign/web-components-chat` |

### 🐞 构建修复

- 构建产物排除 `**/mock/**`（文档站 Demo 假数据不再打入 npm 包）

---

## 历史版本

`1.2.x` 及更早版本为 **UI + Chat 合包** 时期，完整记录见 [@tdesign/web-components CHANGELOG](../tdesign-web-components/CHANGELOG.md#历史版本12x-及更早ui--chat-合包)。
