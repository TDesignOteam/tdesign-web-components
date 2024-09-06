---
title: Skeleton 骨架屏
description: 当网络较慢时，在页面真实数据加载之前，给用户展示出页面的大致结构。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础骨架屏

最简单的骨架屏效果。

{{ base }}

### 带动画效果的骨架屏

提供渐变和闪烁两种动画效果。

{{ animation }}

### 带延迟效果的骨架屏

延迟显示加载效果，用于防止请求速度过快引起的加载闪烁，即骨架屏加载状态至少显示设置的最短延迟响应时间delay。

{{ delay }}

### 不同主题的骨架屏

可以通过 `theme` 属性快速定义不同主题风格的骨架屏。

{{ theme }}

### 组合用法

包含图片、文字、按钮、输入框、头像、标签等多种元素组合在一起的占位效果。

{{ advance }}


## API
### Skeleton Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
animation | String | none | 动画效果，有「渐变加载动画」和「闪烁加载动画」两种。值为 'none' 则表示没有动画。可选项：gradient/flashed/none | N
delay | Number | 0 | 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒 | N
loading | Boolean | true | 是否为加载状态，如果是则显示骨架图，如果不是则显示加载完成的内容 | N
rowCol | Array | - | 高级设置，用于自定义行列数量、宽度高度、间距等。【示例一】，`[1, 1, 2]` 表示输出三行骨架图，第一行一列，第二行一列，第三行两列。【示例二】，`[1, 1, { width: '100px' }]` 表示自定义第三行的宽度为 `100px`。【示例三】，`[1, 2, [{ width, height }, { width, height, marginLeft }]]` 表示第三行有两列，且自定义宽度、高度、尺寸（圆形或方形使用）、间距、内容等。TS 类型：`SkeletonRowCol` `type SkeletonRowCol = Array<Number \| SkeletonRowColObj \| Array<SkeletonRowColObj>>` `interface SkeletonRowColObj { width?: string; height?: string; size?: string; marginRight?: string; marginLeft?: string; margin?: string; content?: string \| TNode; type?: 'rect' \| 'circle' \| 'text' }`。[通用类型定义](https://github.com/Tencent/omi/blob/master/tdesign/desktop/src/common.ts)。[详细类型定义](https://github.com/Tencent/omi/blob/master/tdesign/desktop/src/skeleton/type.ts) | N
theme | String | text | 快捷定义骨架图风格，有基础、头像组合等，具体参看代码示例。可选项：text/avatar/paragraph/avatar-text/tab/article | N