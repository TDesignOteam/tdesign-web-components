---
title: Divider 分割线
description: 分割线是一个呈线状的轻量化组件，起到分隔、组织、细化的作用，用于有逻辑的组织元素内容和页面结构。
isComponent: true
usage: { title: '', description: '' }
spline: layout
---

### 基础分割线

基础分割线是没有文字的独立线条，又分为水平分割线和垂直分割线。

#### 水平分割线

水平分割线常用来对不同元素内容进行分割。

{{ base }}

#### 垂直分割线

垂直分割线常用来做行内分割。

{{ vertical }}

### 带文字的分割线

带文字的分割线是在分割线中嵌入文字，在需要对分割内容进行解释说明时使用。

{{ text }}

### 自定义粗细和颜色

通过 width 和 color 自定义分割线的粗细和颜色

{{ custom }}

## API
### Divider Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | center | 文本位置（仅在水平分割线有效）。可选项：left/right/center | N
children | TNode | - | 子元素，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
dashed | Boolean | false | 是否虚线（仅在水平分割线有效） | N
layout | String | horizontal | 分隔线类型有两种：水平和垂直。可选项：horizontal/vertical | N
color | String | - | 分割线颜色 | N
width | String / Number | - | 分割线粗细，如 "2px" 或数字 2 | N
