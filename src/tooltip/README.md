---
title: Tooltip 文字提示
description: 用于文字提示的气泡框。
isComponent: true
usage: { title: '', description: '' }
spline: data
---

### 基础用法

{{ base }}

### 带箭头的文字提示

带箭头的文字提示有较明确的指向性。常用于有多个需要提示的信息并列放置时，对某个具体信息进行提示。

{{ arrow }}

### 不带箭头的文字提示

不带箭头的文字提示没有明确指向性。常用于不需要针对性提示的场景中。 

{{ no-arrow }}

### 带主题色的文字提示

提供浅灰色、蓝色、绿色、红色、黄色主题的文字提示。

{{ theme }}

### 不同触发方式的文字提示

支持常见元素事件触发文字提示。

{{ trigger }}

### 定时消失

{{ duration }}


## API
### Tooltip Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
delay | Number | - | 【议案讨论中】延迟出现提示，用于异步加载提示信息需要延迟显示的业务场景下 | N
destroyOnClose | Boolean | true | 是否在关闭浮层时销毁浮层 | N
duration | Number | - | 用于设置提示默认显示多长时间之后消失，初始第一次有效，单位：毫秒 | N
placement | String | top | 浮层出现位置。TS 类型：`PopupPlacement`，[Popup API Documents](./popup?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/tooltip/type.ts) | N
showArrow | Boolean | true | 是否显示浮层箭头 | N
theme | String | default | 文字提示风格。可选项：default/primary/success/danger/warning/light | N
`PopupProps` | \- | - | 继承 `PopupProps` 中的全部 API | N