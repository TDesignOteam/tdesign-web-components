---
title: Icon 图标
description: Icon 作为UI构成中重要的元素，一定程度上影响UI界面整体呈现出的风格。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 全部Icon

{{ base }}

## API

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
url | String / Array | - | 图标地址，地址内容参考[组件内部默认加载图标](https://tdesign.gtimg.com/icon/web/index.css)。也可以在 index.html 中引入图标地址。TS 类型：`string \| Array<string>` | N
onClick | Function | - | TS 类型：`(e:MouseEvent) => void` 点击时触发 | N
