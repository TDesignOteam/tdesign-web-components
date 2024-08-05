---
title: Breadcrumb 面包屑
description: 显示当前页面在系统层级结构的位置，并能返回之前任意层级的页面。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础面包屑
适用于广泛的基础用法，系统拥有超过两级以上的层级结构，用于切换向上任意层级的内容。
{{ base }}

### 自定义分隔符的面包屑
通过 separator 属性自定义分隔符，建议用图标而非文本符号。
{{ custom }}

### 使用 options 配置面包屑
使用 `options` 属性配置面包屑内容。
{{ options }}

### 带跳转/点击的面包屑
自定义响应点击事件。

{{ href }}
## API

### Breadcrumb Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
maxItemWidth | String | undefined | 单项最大宽度，超出后会以省略号形式呈现 | N
options | Array | - | 面包屑项，功能同 BreadcrumbItem。TS 类型：`Array<TdBreadcrumbItemProps>` | N
separator | TNode | - | 自定义分隔符。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N


### BreadcrumbItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
content | TNode | - | 子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | 是否禁用当前项点击 | N
href | String | - | 跳转链接 | N
maxWidth | String | undefined | 最大宽度，超出后会以省略号形式呈现。优先级高于 Breadcrumb 中的 maxItemWidth | N
target | String | _self | 链接或路由跳转方式。可选项：_blank/_self/_parent/_top | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发 | N
