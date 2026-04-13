---
title: Link 链接
description: 文字超链接用于跳转一个新页面，如当前项目跳转，友情链接等。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 文字链接

#### 基础文字链接

最简单的文字链接形式，点击后直接跳转到对应链接。

{{ base }}

#### 下划线文字链接

在文字下加横线，表明此处为链接。

{{ underline }}

#### 带图标的文字链接

文字链接与图标搭配使用，通过图标快速了解链接所代表的含义。

{{ icon }}

### 链接悬浮态样式的链接

悬浮状态包含 2 种状态：文本颜色变化 和 添加下划线。由 `hover` 控制，可选值：`color | underline`

{{ hover }}

### 提示不同状态的链接

在`default、primary、success、warning、danger`不同状态下，可提供对应的链接主题色。

{{ theme }}

### 禁用的链接

当链接不可用时，显示禁用状态。

{{ disabled }}

### 不同尺寸的链接

提供大、中（默认）、小三种尺寸。

{{ size }}

## API

### Link Props

| 名称       | 类型     | 默认值    | 说明                                                                                                                                       | 必传 |
| ---------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| className  | String   | -         | 类名                                                                                                                                       | N    |
| style      | Object   | -         | 样式，TS 类型：`React.CSSProperties`                                                                                                       | N    |
| children   | TNode    | -         | 链接内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)      | N    |
| content    | TNode    | -         | 链接内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)                  | N    |
| disabled   | Boolean  | -         | 禁用链接                                                                                                                                   | N    |
| hover      | String   | underline | 链接悬浮态样式，有 文本颜色变化、添加下划线等 2 种方法。可选项：color/underline                                                            | N    |
| href       | String   | -         | 跳转链接                                                                                                                                   | N    |
| prefixIcon | TElement | -         | 前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)                            | N    |
| size       | String   | medium    | 尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N    |
| suffixIcon | TElement | -         | 后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)                            | N    |
| target     | String   | -         | 跳转方式，如：当前页面打开、新页面打开等，同 HTML 属性 target 含义相同                                                                     | N    |
| theme      | String   | default   | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success                                     | N    |
| underline  | Boolean  | -         | 普通状态是否显示链接下划线                                                                                                                 | N    |
| onClick    | Function |           | TS 类型：`(e: MouseEvent) => void`<br/>点击事件，禁用状态不会触发点击事件                                                                  | N    |
