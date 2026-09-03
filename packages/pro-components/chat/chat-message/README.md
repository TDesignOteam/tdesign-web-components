---
title: ChatMessage 对话消息内容
description: 用于渲染用户、助手和系统消息，以及 Markdown、思考、搜索、建议和附件等内容。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

## 消息体样式

{{ style }}

## 特殊状态

{{ loading }}

## 消息内容

### markdown内容

{{ markdown }}

### 思考内容

{{ thinking }}

### 推荐Prompt

{{ suggestion }}

### 搜索内容

{{ search }}

### 图片内容

{{ image }}

### 附件内容

{{ attachment }}

### 自定义内容

{{ custom }}

### 混合内容

{{ reasoning }}

## API

### ChatMessage Props

| 名称             | 类型                                                         | 默认值                                       | 说明                                                                                   | 必传 |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------- | ---- |
| actions          | `Array<TdChatActionsName \| TdChatMessageAction> \| boolean` | `['replay', 'copy', 'good', 'bad', 'share']` | 消息操作按钮及顺序；预设名称仅支持 `TdChatActionsName`，可用 `{ name, render }` 自定义 | N    |
| animation        | `ChatLoadingAnimation`                                   | `'skeleton'`                                 | 消息加载动画                                                                           | N    |
| handleActions    | `TdChatMessageActionHandlers`                                | -                                            | 操作按钮和内容事件回调；参数按 action 名称提供精确类型                                 | N    |
| name             | `string \| TNode`                                            | -                                            | 作者名称                                                                               | N    |
| avatar           | `string \| TNode`                                            | -                                            | 作者头像                                                                               | N    |
| datetime         | `string \| TNode`                                            | -                                            | 消息时间                                                                               | N    |
| role             | `ChatMessageRole`                                            | -                                            | 消息角色                                                                               | N    |
| content          | `AIMessageContent[] \| UserMessageContent[]`                 | -                                            | 消息内容；优先级高于 `message.content`                                                 | N    |
| status           | `ChatMessageStatus`                                          | -                                            | 消息状态；优先级高于 `message.status`                                                  | N    |
| id               | String                                                       | -                                            | 消息 ID；优先级高于 `message.id`                                                       | N    |
| variant          | `'base' \| 'text' \| 'outline'`                              | `'text'`                                     | 消息样式                                                                               | N    |
| placement        | `'left' \| 'right'`                                          | `'left'`                                     | 消息方向                                                                               | N    |
| message          | `ChatMessagesData`                                           | -                                            | 完整消息对象                                                                           | N    |
| chatContentProps | `TdChatContentProps`                                         | -                                            | Markdown、搜索、思考、建议和附件等内容配置                                             | N    |

### 操作名称

`TdChatMessageActionName` 包含 `copy`、`good`、`bad`、`replay`、`share`、`searchResult`、`searchItem`、`suggestion` 和 `codeCopy`。其中后四项是内容事件名称，只用于 `handleActions`，不作为 `actions` 的预设字符串。

### 内容配置

`TdChatContentProps` 提供以下内置配置：

- `markdown`：Markdown 渲染配置。
- `search`：搜索结果折叠配置。
- `thinking`、`reasoning`：思考过程布局和动画。
- `suggestion`：推荐问题配置。
- `attachments`：附件点击、移除和预览配置。

消息内容的协议类型来自 `@tdesign/ai-chat-engine`，并由 `@tdesign/web-components-chat/chat-engine` 导出。
