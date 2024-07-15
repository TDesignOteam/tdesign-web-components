---
title: Tag 标签
description: 定义：标签常用于标记、分类和选择。
isComponent: true
usage: { title: "", description: "" }
spline: data
---

### 基础标签

基础标签为默认的标签样式。适用于常规表单。

{{ base }}

### 带图标的标签

在标签内嵌入图标。适用于用图标来辅助标签分类，或表达标签的属性。

{{ icon }}

### 可删除和添加标签

可删除或添加的标签。添加标签可组合输入框组件使用。

{{ delete }}


### 超长省略文本标签

通过 `maxWidth` 设置最大宽度，超出部分自动省略。

{{ long-text }}

### 不同尺寸的标签

提供大、中（默认）、小三种尺寸。

{{ size }}

### 不同形状的标签

提供方形、圆角方形、标记型三种形状。

{{ shape }}

## API
### Tag Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
closable | Boolean | false | 标签是否可关闭 | N
color | String | - | 自定义标签颜色 | N
content | TNode | - | 组件子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态 | N
icon | TElement | undefined | 标签中的图标，可自定义图标呈现。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
maxWidth | String / Number | - | 标签最大宽度，宽度超出后会出现省略号。示例：'50px' / 80 | N
shape | String | square | 标签类型，有三种：方形、圆角方形、标记型。可选项：square/round/mark | N
size | String | medium | 标签尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
theme | String | default | 组件风格，用于描述组件不同的应用场景。可选项：default/primary/warning/danger/success | N
variant | String | dark | 标签风格变体。可选项：dark/light/outline/light-outline | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N
onClose | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果关闭按钮存在，点击关闭按钮时触发 | N
