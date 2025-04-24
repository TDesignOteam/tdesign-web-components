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

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actionBar | `TdChatItemActionName[] / boolean` | true | 操作按钮配置项，可配置操作按钮选项和顺序。TDChatItemActionName枚举：`'replay'/'copy'/'good'/'bad'/'goodActived'/'badActived'/'share'` | N
onActions | `Record<TdChatItemActionName, (data?: any, callback?: Function) => void>` | - | 操作按钮回调函数 | N
presetActions | `Record<{name: TdChatItemActionName, render: TNode, condition?: (message: ChatMessagesData) => boolean;}>` | - | 预制按钮 | N
message | `any` | - | 对话数据信息 | N

