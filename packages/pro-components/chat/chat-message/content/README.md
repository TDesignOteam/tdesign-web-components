# ChatMessage 内容渲染器

ChatMessage 内置 Markdown、附件、搜索、建议、Thinking 和 Reasoning 渲染器。消息协议类型来自 `@tdesign/ai-chat-engine`；本目录只维护 Web Components 的展示属性。

## MarkdownContent

`t-chat-md-content` 使用与 ChatMessage 相同的 Cherry Markdown 流式渲染器。

| 名称    | 类型                     | 默认值 | 说明                   |
| ------- | ------------------------ | ------ | ---------------------- |
| content | String                   | -      | Markdown 内容          |
| options | `TdChatContentMDOptions` | `{}`   | Cherry Markdown 配置项 |

`options` 会排除由组件接管的 `id`、`el`、`toolbars`，并支持通过 `themeSettings.codeBlockTheme` 配置代码块主题。

## SearchContent

`t-chat-search-content` 展示搜索标题及引用链接。

| 名称                    | 类型                                                                                    | 默认值 | 说明                         |
| ----------------------- | --------------------------------------------------------------------------------------- | ------ | ---------------------------- |
| content                 | `TdChatSearchContentData`                                                               | -      | 搜索标题和引用列表           |
| status                  | `ChatMessageStatus`                                                                     | -      | 当前消息状态                 |
| useCollapse             | Boolean                                                                                 | `true` | 是否使用折叠面板             |
| collapsed               | Boolean                                                                                 | -      | 折叠状态                     |
| handleSearchResultClick | `({ event, content }: { event: MouseEvent; content: TdChatSearchContentData }) => void` | -      | 非折叠模式点击搜索结果时触发 |
| handleSearchItemClick   | `({ event, content }: { event: MouseEvent; content: ReferenceItem }) => void`           | -      | 点击引用项时触发             |

## SuggestionContent

`t-chat-suggestion-content` 展示推荐问题。

| 名称              | 类型                                                                           | 默认值 | 说明             |
| ----------------- | ------------------------------------------------------------------------------ | ------ | ---------------- |
| content           | `SuggestionItem[]`                                                             | -      | 推荐问题列表     |
| handlePromptClick | `({ event, content }: { event: MouseEvent; content: SuggestionItem }) => void` | -      | 点击推荐问题回调 |

## AttachmentContent

`t-chat-attachment-content` 展示消息中的附件列表。

| 名称        | 类型                                             | 默认值 | 说明           |
| ----------- | ------------------------------------------------ | ------ | -------------- |
| content     | `AttachmentItem[]`                               | -      | 附件列表       |
| onFileClick | `(event: CustomEvent<TdAttachmentItem>) => void` | -      | 点击附件时触发 |

## ThinkingContent

`t-chat-thinking-content` 用于展示简单思考内容。

| 名称              | 类型                                | 默认值     | 说明           |
| ----------------- | ----------------------------------- | ---------- | -------------- |
| content           | `{ text?: string; title?: string }` | -          | 思考标题和正文 |
| status            | `ChatMessageStatus`                 | -          | 当前消息状态   |
| maxHeight         | Number                              | -          | 正文最大高度   |
| animation         | `ChatLoadingAnimationType`          | `'circle'` | 进行中动画     |
| collapsed         | Boolean                             | -          | 受控折叠状态   |
| defaultCollapsed  | Boolean                             | `false`    | 默认折叠状态   |
| layout            | `'block' \| 'border'`               | `'block'`  | 展示布局       |
| onCollapsedChange | `(e: CustomEvent<boolean>) => void` | -          | 折叠状态变化   |

## ReasoningContent

`t-chat-reasoning-content` 用于展示由文本与工具调用等内容交错组成的推理过程。文本自动渲染，其他内容通过插槽交给业务侧处理。

| 名称              | 类型                                | 默认值     | 说明         |
| ----------------- | ----------------------------------- | ---------- | ------------ |
| content           | `AIMessageContent[]`                | `[]`       | 推理内容     |
| status            | `ChatMessageStatus`                 | -          | 当前消息状态 |
| maxHeight         | Number                              | -          | 正文最大高度 |
| animation         | `ChatLoadingAnimationType`          | `'circle'` | 进行中动画   |
| collapsed         | Boolean                             | -          | 受控折叠状态 |
| defaultCollapsed  | Boolean                             | `false`    | 默认折叠状态 |
| layout            | `'block' \| 'border'`               | `'border'` | 展示布局     |
| onCollapsedChange | `(e: CustomEvent<boolean>) => void` | -          | 折叠状态变化 |

非文本内容的插槽名为 `reasoning-{type}-{index}`，例如 `reasoning-toolcall-1`。

```tsx
<t-chat-reasoning-content content={reasoningData} status="complete" maxHeight={400} layout="border">
  <div slot="reasoning-toolcall-1">自定义工具调用结果</div>
</t-chat-reasoning-content>
```

## 内部复用边界

`BaseThinkingComponent` 和 `renderBaseThinkingContainer` 是 Thinking/Reasoning 的内部复用实现，不属于稳定的组件 API。外部消费者应使用已导出的内容组件及其 Props，避免继承内部基础类。
