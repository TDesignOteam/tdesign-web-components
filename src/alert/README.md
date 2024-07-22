---
title: Alert 消息
description: 警告条用于承载需要用户注意的信息。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础的警告

使用简洁文字提示的最基础警告条，包含 4 种情况的提示：普通消息，成功，警示，失败。
{{ base }}

### 带操作的警告

当需要对此警告做操作，可以配置 operation 来增加相关操作。
{{ baseOperation }}

### 带相关描述文字的警告

{{ baseDescription }}

### 折叠的警告

当信息内容超过 `指定行数` 时，可使用折叠的方式将部分信息隐藏。
{{ baseCollapse }}

## API

| 名称               | 类型       | 默认值   | 说明                                                                                                                                                                                                           | 必传 |
|------------------|----------|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|
| className        | String   | -     | 类名                                                                                                                                                                                                           | N  |
| style            | Object   | -     | 样式，TS 类型：`Record<string, string \| number>`                                                                                                                                                                  | N  |
| close            | TNode    | false | 关闭按钮。值为 true 则显示默认关闭按钮；值为 false 则不显示按钮；值类型为 string 则直接显示；值类型为 Function 则可以自定关闭按钮。TS 类型：`string \| boolean\| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)	 | N  |
| icon             | TElement | -     | 图标。TS 类型：TNode。 [通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                                                                     | N  |
| maxLine          | Number   | 0     | 内容显示最大行数，超出的内容会折叠收起，用户点击后再展开。值为 0 表示不折叠  [通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                                            | N  |
| message          | TNode    | -     | 内容（子元素）。TS 类型：`string\| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                                                      | N  |
| operation        | TElement | -     | 跟在告警内容后面的操作区。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                                                          | N  |
| theme            | String   | info  | 组件风格。可选项：success/info/warning/error                                                                                                                                                                          | N  |
| title            | TNode    | -     | 标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/main/src/common.ts)                                                                                          | N  |
| onClose          | Function | -     | TS 类型：`(context: { e: MouseEvent }) => void` <br/>关闭按钮点击时触发                                                                                                                                                  | N  |
| onClosed         | Function | -     | TS 类型：`(context: { e: TransitionEvent }) => void` <br/> 告警提示框关闭动画结束后触发                                                                                                                                       | N  |
| onClick          | Function | -     | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击回到顶部时触发                                                                                                                                                   | N  |
| ignoreAttributes | String[] | -     | 在host标签上忽略的属性                                                                                                                                                                                                | N  |
