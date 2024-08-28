---
title: Card 卡片
description: 最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 极简卡片

仅有内容的卡片形式。

#### 有边框

{{ bordered }}

#### 无边框

{{ bordered-none }}

### 带header的卡片

由极简卡片上方的标题栏组成，标题栏中可包含标题、图片、操作区、状态等内容。顶部栏可以定义所有的内容，以用户的自定义元素为准

#### 不带分割线

{{ header }}

#### 带分割线

{{ header-bordered }}

### 带footer的卡片

由极简卡片下方的底部栏组成，可包含标题、图片、操作区、状态等内容。

{{ footer }}

#### 全部为操作内容的底部栏

{{ footer-actions }}

#### 全部为展示内容的底部栏

{{ footer-content }}

#### 同时带展示内容与操作内容的底部栏

{{ footer-content-actions }}

### 同时带header和footer的卡片

由顶部栏、底部栏和极简卡片组成的复杂卡片，三个区域内容可根据需要对内容进行配置。

{{ header-subtitle-footer-actions }}

{{ header-footer-actions }}

### 不同标题内容的卡片

带有主标题、副标题、或标题描述的卡片。

#### 带主副标题的卡片

{{ header-subtitle }}

#### 带标题描述的卡片

{{ header-description }}

#### 同时带主副标题与标题描述的卡片

{{ header-all-props }}

#### 自定义loadingProps的卡片

{{ custom-loading-props }}



## API

### Card Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
actions | TNode | - | 卡片操作区。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
avatar | TNode | - | 卡片中的用户头像，仅在海报风格的卡片中有效。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
bordered | Boolean | true | 是否有边框 | N
children | TNode | - | 卡片内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 卡片内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
cover | TNode | - | 卡片封面图。值类型为字符串，会自动使用 `img` 标签输出封面图；也可以完全最定义封面图。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
description | TNode | - | 卡片描述文案。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
footer | TNode | - | 卡片底部内容，可完全自定义。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
header | TNode | - | 卡片顶部内容，优先级高于其他所有元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
headerBordered | Boolean | false | 头部是否带分割线，仅在有header时有效 | N
hoverShadow | Boolean | false | hover时是否有阴影 | N
loading | TNode | false | 加载状态，值为 true 会根据不同的布局显示不同的加载状态，值为 false 则表示非加载状态。也可以使用 Skeleton 组件完全自定义加载态呈现内容。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loadingProps | Object | - | 透传加载组件(Loading)全部属性。TS 类型：`LoadingProps`，[Loading API Documents](./loading?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/card/type.ts) | N
shadow | Boolean | false | 是否显示卡片阴影，默认不显示 | N
size | String | medium | 尺寸。可选项：medium/small | N
status | String | - | 卡片状态内容，仅在操作区域不在顶部时有效（即 `theme=poster2` ） | N
subtitle | TNode | - | 卡片副标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | normal | 卡片风格：普通风格、海报风格1（操作区域在顶部）、海报风格2（操作区域在底部）。可选项：normal/poster1/poster2 | N
title | TNode | - | 卡片标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N


