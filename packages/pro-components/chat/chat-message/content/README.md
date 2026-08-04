# ChatMessage 内容渲染器

ChatMessage 内置 Markdown、附件、搜索、建议、Thinking 和 Reasoning 渲染器。消息协议类型来自 `@tdesign/ai-chat-engine`；本目录只维护 Web Components 的展示属性。

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
