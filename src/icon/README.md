---
title: Icon 图标
description: Icon 作为UI构成中重要的元素，一定程度上影响UI界面整体呈现出的风格。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 安装独立 Icon 包

图标相对其他基础组件较为独立，所以作为一个独立的 `npm` 包做发布管理。如果项目中直接使用，请安装 `tdesign-icons-web-components`。
图标库中共包含超过 **25** 类，**1200+** 个图标，推荐您按需引用图标，减少产物的体积。

### 按需引入图标

推荐使用按需引入的方式使用图标，通过如下方式按需引入。

`import 'tdesign-icons-web-components/esm/components/add';`

{{ IconExample }}

### 全量引入使用图标

图标尺寸单位支持多种， 'small', 'medium', 'large', '35px', '3em' 等。
图标颜色使用 CSS 控制，如：style="color: red"，或者 style="fill: red"。
点击右侧导航「全部图标」即可查看组件库全部图标。

{{ SvgSpriteExample }}

### IconFont 图标

您也可以以 IconFont 的形式使用图标，通过如下来使用图标。

```js
import 'tdesign-icons-web-components/esm/iconfont/index.css';// 极少的字体定义代码`

import 'tdesign-icons-web-components/esm/iconfont';
```

{{ IconFontExample }}

### 图标选择器

在一些业务场景中，存在需要选择图标的情况，可以配合`Select`组件来实现`图标选择器`。

{{ IconSelect }}

### FAQ

#### 如何获取全部图标的名称列表？

可以通过`import { manifest } from 'tdesign-icons-web-components'` 获取全部图标的名称列表。

### 全部图标

<td-icons-view frame="web-components" />;

## API
### IconSVG Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style=\"color: red\" | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N

### Iconfont Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
loadDefaultIcons | Boolean | true | 是否加载组件库内置图标 | N
name | String | - | 必需。图标名称 | Y
size | String | undefined | 图标尺寸，支持 'small', 'medium', 'large'，'35px', '3em' 等 | N
style | String | - | HTML 原生属性。可用于设置图标颜色，如：style=\"color: red\" | N
tag | String | i | 图标 DOM 元素，可选值：i/span/div/... | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N