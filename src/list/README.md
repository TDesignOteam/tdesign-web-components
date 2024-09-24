---
title: List 列表
description: 列表用一个连续的列来显示多行元素，常用于具有相同构成及内容的模块批量展示，可承载多样化的信息内容，从纯文字到复杂的图文组合。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础文字列表

仅包含简单文字的列表。对较简单的信息进行陈列时使用。

{{ base }}


### 多行文字列表

仅包含主要文字及描述性文字的列表。对较复杂的，包含多个字段或内容的信息进行展示时使用。

{{ multiline }}


### 基础图文列表

包含简单图文的列表。需使用图片和文字结合展示信息。

{{ image-text }}

### 带操作列表

包含操作的列表。需要对所在列进行操作时使用。

{{ operation }}

### 不同尺寸的列表

提供大、中（默认）、小三种尺寸。

{{ size }}

### 斑马纹区分列表

{{ stripe }}

<!-- ### 异步加载的列表

{{ asyncLoading }}

### 带头部及尾部的列表

{{ header-footer }}

### 带滚动事件的列表

{{ scroll }} -->

## API
### List Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
asyncLoading | TNode | - | 自定义加载中。值为空不显示加载中，值为 'loading' 显示加载中状态，值为 'load-more' 显示加载更多状态。值类型为函数，则表示自定义加载状态呈现内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
footer | TNode | - | 底部。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
header | TNode | - | 头部。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
layout | String | horizontal | 排列方式（待设计稿输出）。可选项：horizontal/vertical | N
size | String | medium | 尺寸。可选项：small/medium/large | N
split | Boolean | false | 是否展示分割线 | N
stripe | Boolean | false | 是否展示斑马纹 | N


### ListItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
action | TNode | - | 操作栏。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
children | TNode | - | 内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N

### ListItemMeta Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
description | TNode | - | 列表项内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
image | TNode | - | 列表项图片。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
title | TNode | - | 列表项标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
