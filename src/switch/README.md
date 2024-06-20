---
title: Switch 开关
description: 用于两个互斥选项，用来打开或关闭选项的选择控件。
isComponent: true
usage: { title: '', description: '' }
spline: form
---

### 基础开关

不带描述，最基础的开关。

{{ base }}

### 带描述的开关

开关内部带有文字或图标等描述，含义对应开关当前状态，切换时文字同步切换。视觉上更加醒目，用于需要描述当前开关对应状态及含义，更直观且方便用户理解。

{{ describe }}

### 不同状态的开关

提供 normal、loading 和 disabled 3种状态的开关。根据不同场景设置对应状态。

{{ status }}


### 不同大小的开关

提供 大、中（默认）、小 3种开关。

{{ size }}


## API
### Switch Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`Styles` | N
customValue | Array | - | 用于自定义开关的值，[打开时的值，关闭时的值]。默认为 [true, false]。示例：[1, 0]、['open', 'close']。TS 类型：`Array<SwitchValue>` | N
disabled | Boolean | - | 是否禁用组件，默认为 false | N
label | TNode | [] | 开关内容，[开启时内容，关闭时内容]。示例：['开', '关'] 或 (value) => value ? '开' : '关'。TS 类型：`Array<string \| TNode> \| TNode<{ value: SwitchValue }>`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loading | Boolean | false | 是否处于加载中状态 | N
size | String | medium | 开关尺寸。可选项：small/medium/large | N
value | String / Number / Boolean | - | 开关值。TS 类型：`T` `type SwitchValue = string \| number \| boolean`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/switch/type.ts) | N
defaultValue | String / Number / Boolean | - | 开关值。非受控属性。TS 类型：`T` `type SwitchValue = string \| number \| boolean`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/switch/type.ts) | N
onChange | Function |  | TS 类型：`(value: T, context: { e: MouseEvent }) => void`<br/>数据发生变化时触发 | N
