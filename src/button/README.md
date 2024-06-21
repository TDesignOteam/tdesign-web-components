---
title: Button 按钮
description: 按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 图标按钮

图标按钮由图标+文字或图标构成。通过图标可增强识别性，以便直观理解。

{{ icon }}

### 幽灵按钮

幽灵按钮将按钮的内容反色，背景变为透明，一般是底色透明。常用于有色背景上，例如 banner 图等。

{{ ghost }}

### Block 按钮

Block 按钮在宽度上充满其所在的父容器（无 padding 和 margin 值）。该按钮常见于移动端和一些表单场景中。

{{ block }}

### 不同颜色主题按钮

提供浅灰色、蓝色、红色、黄色和绿色为主题的按钮。

{{ theme }}

### 不同状态的按钮

提供加载、禁用两种状态。

{{ status }}

### 不同尺寸的按钮

提供大、中（默认）、小三种尺寸。

{{ size }}

### 不同形状的按钮

提供长方形、正方形、圆角长方形、圆形四种形状。

{{ shape }}


## API

### Button Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
block | Boolean | false | 是否为块级元素 | N
children | TNode | - | 按钮内容，TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | 禁用状态 | N
ghost | Boolean | false | 是否为幽灵按钮（镂空按钮） | N
href | String | - | 跳转地址。href 存在时，按钮标签默认使用 `<a>` 渲染；如果指定了 `tag` 则使用指定的标签渲染 | N
icon | TElement | - | 按钮内部图标，可完全自定义。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loading | Boolean | false | 是否显示为加载状态 | N
shape | String | rectangle | 按钮形状，有 4 种：长方形、正方形、圆角长方形、圆形。可选项：rectangle/square/round/circle | N
size | String | medium | 组件尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tag | String | - | 渲染按钮的 HTML 标签，默认使用标签 `<button>` 渲染，可以自定义为 `<a>` `<div>` 等。透传全部 HTML 属性，如：`href/target/data-*` 等。⚠️ 禁用按钮 `<button disabled>`无法显示 Popup 浮层信息，可通过修改 `tag=div` 解决这个问题。可选项：button/a/div | N
theme | String | - | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success | N
type | String | button | 按钮类型。可选项：submit/reset/button | N
variant | String | base | 按钮形式，基础、线框、虚线、文字。可选项：base/outline/dashed/text | N
ignoreAttrs | Array<string> | [] | 在host标签上忽略的属性，例如`['style']`就不会生成style属性 | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发 | N

