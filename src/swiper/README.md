---
title: Swiper 轮播框
description: 轮播视图容器。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 垂直布局

通过设置`direction`为`vertical`使轮播框在垂直方向上轮播，默认为`horizontal`。

{{ vertical }}

### 导航器位置

通过设置`navigation`中的`placement`属性值来控制导航器位置，可设置位于主体的内侧或是外侧。

{{ placement }}

### 分式导航器

通过设置`navigation`中的`type`属性值为`fraction`来控制导航器以分式的样式展示，默认为`bars`。

{{ fraction }}

### 渐隐模式

通过设置`animation`属性值为`fade`来控制轮播框以渐隐的样式展示，默认为`slide`。

{{ fade }}

### 卡片模式

通过设置`type`属性值为`card`来控制导航器以卡片的样式展示。

{{ card }}

### 手动跳转

通过设置`current`属性值来控制轮播框播放哪一项，`current`起始值为`0`。

{{ current }}

### 导航器的大小

通过设置`navigation`中的`size`属性值来控制轮播框导航器的大小。

{{ size }}

## API

### Swiper Props

| 名称           | 类型                     | 默认值     | 说明                                                                                                                                                                 | 必传 |
| -------------- | ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| animation      | String                   | slide      | 轮播切换动画效果类型：滑动、淡入淡出等。可选项：slide/fade                                                                                                           | N    |
| autoplay       | Boolean                  | true       | 是否自动播放                                                                                                                                                         | N    |
| current        | Number                   | 0          | 当前轮播在哪一项（下标）。支持语法糖 `v-model` 或 `v-model:current`                                                                                                  | N    |
| defaultCurrent | Number                   | 0          | 当前轮播在哪一项（下标）。非受控属性                                                                                                                                 | N    |
| direction      | String                   | horizontal | 轮播滑动方向，包括横向滑动和纵向滑动两个方向。可选项：horizontal/vertical                                                                                            | N    |
| duration       | Number                   | 300        | 滑动动画时长                                                                                                                                                         | N    |
| height         | Number                   | -          | 当使用垂直方向滚动时的高度                                                                                                                                           | N    |
| interval       | Number                   | 5000       | 轮播间隔时间                                                                                                                                                         | N    |
| loop           | Boolean                  | true       | 是否循环播放                                                                                                                                                         | N    |
| navigation     | Object / Slot / Function | -          | 导航器全部配置。TS 类型：`SwiperNavigation \| TNode`。                                                                                                               | N    |
| stopOnHover    | Boolean                  | true       | 是否悬浮时停止轮播                                                                                                                                                   | N    |
| theme          | String                   | light      | 深色模式和浅色模式。可选项：light/dark                                                                                                                               | N    |
| trigger        | String                   | hover      | 触发切换的方式：悬浮、点击等。可选项：hover/click                                                                                                                    | N    |
| type           | String                   | default    | 样式类型：默认样式、卡片样式。可选项：default/card                                                                                                                   | N    |
| onChange       | Function                 |            | TS 类型：`(current: number, context: source: SwiperChangeSource) => void`<br/>轮播切换时触发。<br/>`type SwiperChangeSource = 'autoplay' \| 'click' \| 'hover'`<br/> | N    |

### Swiper Events

| 名称   | 参数                                                     | 描述                                                                                   |
| ------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| change | `(current: number, context: source: SwiperChangeSource)` | 轮播切换时触发。<br/>`type SwiperChangeSource = 'autoplay' \| 'click' \| 'hover'`<br/> |

### SwiperNavigation

| 名称         | 类型   | 默认值 | 说明                                                                                                                                                                                 | 必传 |
| ------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| placement    | String | inside | 导航器位置，位于主体的内侧或是外侧。可选项：inside/outside                                                                                                                           | N    |
| showSlideBtn | String | always | 何时显示导航器的翻页按钮：始终显示、悬浮显示、永不显示。可选项：always/hover/never                                                                                                   | N    |
| size         | String | medium | 导航器尺寸。可选项：small/medium/large                                                                                                                                               | N    |
| type         | String | -      | 导航器类型，点状(dots)、点条状(dots-bar)、条状(bars)、分式(fraction)等。TS 类型：`SwiperNavigationType` `type SwiperNavigationType = 'dots' \| 'dots-bar' \| 'bars' \| 'fraction'`。 | N    |
