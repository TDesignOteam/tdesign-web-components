---
title: ChatAction 对话操作
description: 对话操作。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

## API

### ChatAction Props

| 名称         | 类型                                                      | 默认值 | 说明                                                         | 必传 |
| ------------ | --------------------------------------------------------- | ------ | ------------------------------------------------------------ | ---- |
| actionBar    | `Array<TdChatActionsName \| TdChatActionItem> \| boolean` | `true` | 操作按钮及顺序；可使用预设名称或 `{ name, render }` 自定义项 | N    |
| handleAction | `(name: TdChatActionsName, data: any) => void`            | -      | 操作按钮点击回调                                             | N    |
| comment      | `ChatComment`                                             | `''`   | 当前点赞点踩状态                                             | N    |
| copyText     | String                                                    | `''`   | 复制按钮使用的文本                                           | N    |
| tooltipProps | `TooltipProps`                                            | `{}`   | 透传 Tooltip 属性                                            | N    |
