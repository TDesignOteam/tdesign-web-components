# Chat 类型与文档契约对照

本文档记录 Web Components Chat 的公共类型、运行时 `propTypes`、README、打包声明，以及与 TDesign Vue Next、React、common 的共享类型关系。它是可复查的快照，不替代各仓库的发布说明。

## 快照基线

对照日期：2026-08-06。

| 仓库           | 分支/变更                                                                                                          | 对照提交                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Web Components | `rss1102/standardize-chat-types-docs` / [PR #409](https://github.com/TDesignOteam/tdesign-web-components/pull/409) | 以当前 PR HEAD 为准                                                                                              |
| Vue Next       | `develop`                                                                                                          | [Vue Next snapshot](https://github.com/Tencent/tdesign-vue-next/commit/cc1698ba5c85138506c5be6d6cabcdb2e28a53a1) |
| React          | `develop`                                                                                                          | [`a2a87056`](https://github.com/Tencent/tdesign-react/commit/a2a87056f5c8d2e6dbdf7199ce7e51f75b494efe)           |
| tdesign-common | `develop`                                                                                                          | [`22c612b2`](https://github.com/Tencent/tdesign-common/commit/22c612b2475a14fd42876a9ea816fab9851aa77d)          |

## Web Components Chat 内部契约

`pnpm run check:chat-contracts` 对以下三层进行双向检查：

1. 公共 TypeScript Props 是否存在对应运行时 `propTypes`。
2. 运行时 `propTypes` 是否都存在公共类型声明。
3. 公共 Props 是否在对应 README 中出现。

当前覆盖 7 个主组件：

| 组件        | 公共类型             | 运行时组件        | 文档                     |
| ----------- | -------------------- | ----------------- | ------------------------ |
| Chatbot     | `TdChatProps`        | `chat.tsx`        | `chatbot/README.md`      |
| ChatMessage | `TdChatMessageProps` | `chat-item.tsx`   | `chat-message/README.md` |
| ChatSender  | `TdChatSenderProps`  | `chat-sender.tsx` | `chat-sender/README.md`  |
| Attachments | `TdAttachmentsProps` | `attachments.tsx` | `attachments/README.md`  |
| FileCard    | `TdFileCardProps`    | `filecard.tsx`    | `filecard/README.md`     |
| ChatAction  | `ChatActionProps`    | `action.tsx`      | `chat-action/README.md`  |
| ChatLoading | `ChatLoadingProps`   | `loading.tsx`     | `chat-loading/README.md` |

同时覆盖 6 个内容组件：

| 组件              | 公共类型                       | 本轮处理                                                    |
| ----------------- | ------------------------------ | ----------------------------------------------------------- |
| MarkdownContent   | `TdChatMarkdownContentProps`   | 补齐完整 API 文档                                           |
| SearchContent     | `TdChatSearchContentProps`     | 回调 validator 改为 `Function`；移除不生效的函数型 `status` |
| SuggestionContent | `TdChatSuggestionContentProps` | `content` 改为 `Array` validator；回调改为 `Function`       |
| AttachmentContent | `TdChatAttachmentContentProps` | `content` 改为 `Array` validator；补公共入口导出            |
| ThinkingContent   | `TdChatThinkContentProps`      | 内部渲染 `key` 不再污染公共 Props                           |
| ReasoningContent  | `TdChatReasoningProps`         | 内部渲染 `key` 不再污染公共 Props                           |

契约检查还固定验证容易回退的 validator：ChatAction `actionBar`、`handleAction`，ChatMessage `actions`，以及 Search、Suggestion、Attachment 的函数/数组属性。

## Chat 附件与 UploadFile 共享关系

Chat 的 `TdAttachmentItem` 继承 tdesign-common 的 `UploadFile`，Web Components 基础 Upload 的 `UploadFile` 也继承同一来源。

核心字段在 Web Components、Vue Next、React 中一致：

`lastModified`、`name`、`percent`、`raw`、`response`、`size`、`status`、`type`、`uploadTime`、`url`。

三个框架锁定的 common 提交不同，但本次核对时 `js/upload/types.ts` 的 Git Blob 均为 `e795fc9ed3535423ae1070b28ffa4b6bb6b765a6`，因此这 10 个字段没有实际漂移。

## 基础 Upload Props 跨框架对照

| 对照项                                   | Web Components |          Vue Next |   React | 判断                       |
| ---------------------------------------- | -------------: | ----------------: | ------: | -------------------------- |
| `UploadFile` 核心字段                    |             10 |                10 |      10 | 一致                       |
| `TdUploadProps` 成员数                   |             22 |                63 |      61 | 能力范围不同               |
| `UploadInstanceFunctions` 成员数         |              3 |                 3 |       3 | 一致                       |
| `UploadChangeContext` 成员数             |              6 |                 6 |       6 | 语义一致，事件类型适配不同 |
| `UploadChangeTrigger` 是否包含 `default` |             是 |                否 |      是 | Vue 存在差异               |
| `tips`                                   |       `string` | `string \| TNode` | `TNode` | 框架渲染能力差异           |

Vue Next 和 React 共同支持、但 Web Components 尚未实现的 Upload Props 有 37 项，主要包括：

- 多文件与批量上传：`multiple`、`max`、`isBatchUpload`、`uploadAllFilesInOneRequest`；
- 请求控制：`headers`、`method`、`data`、`requestMethod`、`formatRequest`；
- 拖拽和粘贴：`draggable`、`onDrop`、`uploadPastedFiles`；
- 单文件过程事件：`onOneFileSuccess`、`onOneFileFail`、`onProgress`；
- 自定义展示：`trigger`、`dragContent`、`imageViewerProps`；
- 批量操作按钮：`uploadButton`、`cancelUploadButton`。

这些差异不能只通过补类型解决。Web Components 运行时未实现对应能力时，声明同名 Props 会形成“类型允许但运行时无效”的假 API。

## 下游 Chat 包关系

Vue Next Chat 和 React Chat 的部分组件直接包装并重新导出 `tdesign-web-components` 类型，因此同一个安装依赖内不会形成第二份 Chat 核心类型。但两个仓库固定的 Web Components 版本不同：

- Vue Next Chat：`tdesign-web-components@1.3.1-alpha.14`；
- React Chat：`tdesign-web-components@1.3.0-alpha.2`。

PR #409 的类型修复只有在 Web Components 发布、下游升级依赖并重新生成声明后才会生效。

## 已知但暂缓的 breaking 项

| 项目                    | 当前状态                                            | 暂缓原因                                     | 后续方向                                                 |
| ----------------------- | --------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| DOM 事件命名            | camelCase、`chat-after-send`、snake_case 并存       | 直接改名会影响现有监听方                     | 新名称统一 camelCase，旧名称标记 deprecated 并保留迁移期 |
| `handleActions` payload | 仍有 `any`                                          | suggestion/search/普通 action 的数据结构不同 | 建立按 action name 映射的 payload 类型后再收紧           |
| Markdown 插件 `options` | 仍有 `any`                                          | 插件参数由 Cherry Markdown 插件决定          | 为 preset/plugin 配置增加泛型                            |
| ChatEngine 导出         | 原样重导出 `@tdesign/ai-chat-engine`                | 当前没有上游导出快照                         | 对打包后的导出名和依赖版本增加快照检查                   |
| Search 折叠状态         | 独立组件和 ChatMessage 内部渲染路径存在不同状态来源 | 调整会改变交互行为                           | 单独设计受控/非受控契约并补交互测试                      |

## 验证命令

```bash
pnpm run check:chat-contracts
pnpm run check:types
pnpm run check:pack
pnpm --filter @tdesign/web-components-chat-site build
```

其中静态检查与构建不能替代浏览器交互测试。事件传播、受控折叠、Shadow DOM 样式注入仍需要独立运行时用例。
