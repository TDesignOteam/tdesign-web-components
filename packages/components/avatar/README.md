---
title: Avatar 头像
description: 用图标、图片、字符的形式展示用户或事物信息
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 头像类型

头像提供了 3 种不同类型的头像：图标头像、图片头像、字符头像
{{ base }}

### 头像形状

头像默认支持两种形状：round、circle，用户也可自定义设置头像形状
{{ shape }}

### 头像大小

头像默认支持三种大小：small、medium、large，用户可自定义设置大小
{{ size }}

### 字符头像大小自适应

头像支持字符自适应，即字符长度过长时，头像可自动调整字符以便呈现完整内容
{{ adjust }}

### 组合头像

组合头像展现
{{ group }}

### 组合头像偏移方向

组合头像可控制层叠方向
{{ groupCascading }}

### 组合头像个数

组合头像可设置最大展示个数，超过则隐藏显示
{{ groupMax }}

## API

### Avatar Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
alt | String | - | 头像替换文本，仅当图片加载失败时有效 | N
children | TNode | - | 子元素内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
content | TNode | - | 子元素内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
hideOnLoadFailed | Boolean | false | 加载失败时隐藏图片 | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
image | String | - | 图片地址 | N
imageProps | Object | - | 透传至 Image 组件。TS 类型：`ImageProps`，[Image API Documents](./image?tab=api)。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/avatar/type.ts) | N
shape | String | circle | 形状。可选项：circle/round。TS 类型：`ShapeEnum ` `type ShapeEnum = 'circle' \| 'round'`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/avatar/type.ts) | N
size | String | - | 尺寸，示例值：small/medium/large/24px/38px 等。优先级高于 AvatarGroup.size 。Avatar 单独存在时，默认值为 medium。如果父组件存在 AvatarGroup，默认值便由 AvatarGroup.size 决定 | N
onError | Function |  | TS 类型：`(context: { e: ImageEvent }) => void`<br/>图片加载失败时触发 | N

### AvatarGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
cascading | String | 'right-up' | 图片之间的层叠关系，可选值：左侧图片在上和右侧图片在上。可选项：left-up/right-up。TS 类型：`CascadingValue` `type CascadingValue = 'left-up' \| 'right-up'`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/avatar/type.ts) | N
collapseAvatar | TNode | - | 头像数量超出时，会出现一个头像折叠元素。该元素内容可自定义。默认为 `+N`。示例：`+5`，`...`, `更多`。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
max | Number | - | 能够同时显示的最多头像数量 | N
popupProps | Object | - | 头像右上角提示信息。TS 类型：`PopupProps`，[Popup API Documents](./popup?tab=api)。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/avatar/type.ts) | N
size | String | - | 尺寸，示例值：small/medium/large/24px/38px 等。优先级低于 Avatar.size | N