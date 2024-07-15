---
title: Image 图片
description: 用于展示图片素材。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础图片

不同填充模式的图片

提供 fill、contain、cover、none、scale-down 5 种填充类型。

{{ fill-mode }}

不同填充位置的图片

图片相对于容器的位置。当图片过大时，提供显示图片的局部左侧对齐、或右侧对齐的不同位置。

{{ fill-position }}

### 不同形状的图片

提供方形、圆角方形、圆角 3 种形状。

当图片长宽不相等时，无法使用 circle 展示一个正圆。

{{ shape }}

### 图集样式的图片

图片呈现图集样式的效果。

{{ gallery-cover }}

### 加载状态的图片

显示加载的不同状态，提供默认、自定义两种占位样式。

{{ placeholder }}

### 图片懒加载

#### 单图用法

placeholder 在图像加载时占位显示。

{{ lazy-single }}

#### 图片列表用法

多张图片滚动下拉时，尚未出现的图片会用占位图表示，呈现懒加载的效果。

{{ lazy-list }}

### 图片扩展元素

带有悬浮层的图片。

#### 始终显示

悬浮层常驻显示，不因用户操作出现或消失。

{{ extra-always }}

#### 悬浮显示

默认不显示悬浮层，鼠标悬浮到图片区域后悬浮层出现。

{{ extra-hover }}

### 支持 `avif` 和 `webp` 格式的图片

支持使用 `srcset` 设置特殊格式的图片渲染，如 `.avif` 和 `.webp`。图片转码为 AVIF/WEBP 推荐使用腾讯云数据万象<a href="https://cloud.tencent.com/document/product/436/60455">图片压缩服务</a>。

{{ avif }}

## API
### Image Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
alt | String | - | 图片描述 | N
error | TNode | - | 自定义图片加载失败状态下的显示内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
fallback | String | - | 图片加载失败时，显示当前链接设置的图片地址。如果要使用组件图标或完全自定义加载失败时显示的内容，请更为使用 `error` | N
fit | String | fill | 图片填充模式。可选项：contain/cover/fill/none/scale-down | N
gallery | Boolean | false | 是否展示为图集样式 | N
lazy | Boolean | false | 是否开启图片懒加载 | N
loading | TNode | - | 自定义加载中状态的图片内容，如：“加载中”。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
overlayContent | TNode | - | 图片上方的浮层内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
overlayTrigger | String | always | 浮层 `overlayContent` 出现的时机。可选项：always/hover | N
placeholder | TNode | - | 占位元素，展示层级低于 `loading` `error` 和图片本身，值类型为字符串时表示占位图片地址。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/src/common.ts) | N
position | String | center | 等同于原生的 object-position 属性，可选值为 top right bottom left 或 string，可以自定义任何单位，px 或者 百分比 | N
referrerpolicy | String | - | `<img>` 标签的原生属性，[MDN 定义](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)。可选项：no-referrer/no-referrer-when-downgrade/origin/origin-when-cross-origin/same-origin/strict-origin/strict-origin-when-cross-origin/unsafe-url | N
shape | String | square | 图片圆角类型。可选项：circle/round/square | N
src | String / Object | - | 用于显示图片的链接或原始图片文件对象。TS 类型：`string \| File` | N
srcset | Object | - | 图片链接集合，用于支持特殊格式的图片，如 `.avif` 和 `.webp`。会优先加载 `srcset` 中的图片格式，浏览器不支持的情况下，加载 `src` 设置的图片地址。TS 类型：`ImageSrcset` `interface ImageSrcset { 'image/avif': string; 'image/webp': string; }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/image/type.ts) | N
onError | Function |  | TS 类型：`(context: { e: ImageEvent }) => void`<br/>图片加载失败时触发 | N
onLoad | Function |  | TS 类型：`(context: { e: ImageEvent }) => void`<br/>图片加载完成时触发 | N
