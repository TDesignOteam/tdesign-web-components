---
title: Tabs 选项卡
description: 用于承载同一层级下不同页面或类别的组件，方便用户在同一个页面框架下进行快速切换。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础选项卡

使用选项卡切换内容模块，操作后不会进行页面跳转。

{{ base }}

### 带图标的选项卡

在基础选项卡基础上，在每个标签前添加图标，方便用户快速理解。

{{ icon }}

### 增删选项卡

用户可添加、删除选项卡，满足自定义场景。

{{ custom }}

### 不同尺寸的选项卡

提供 大、中（默认）两种尺寸。

{{ size }}

### 不同风格的选项卡

提供 默认 和 卡片 两种风格。
{{ theme }}

### 不同位置的选项卡

提供 上、右、下、左 不同位置的选项卡。
{{ position }}

### 可滑动的选项卡

当选项卡数量超出最大宽度，可通过滑动展示选项卡。
{{ combination }}

### 带禁用状态的选项卡

提供了选项卡的禁用状态。
{{ ban }}

### 可拖拽的选项卡

提供了可拖拽的选项卡。
{{ drag-sort }}

### 懒加载

通过设置 lazy，可以实现懒加载，只在选中tab时才进行渲染。
{{ lazy }}

## API

### Tabs Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
action | TNode | - | 选项卡右侧的操作区域。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
addable | Boolean | false | 选项卡是否可增加 | N
disabled | Boolean | false | 是否禁用选项卡 | N
dragSort | Boolean | false | 是否开启拖拽调整顺序 | N
list | Array | - | 选项卡列表。TS 类型：`Array<TdTabPanelProps>` | N
placement | String | top | 选项卡位置。可选项：left/top/bottom/right | N
scrollPosition | String | auto | Tab较多的时候，选中滑块滚动最终停留的位置。可选项：auto/start/center/end | N
size | String | medium | 组件尺寸。可选项：medium/large | N
theme | String | normal | 选项卡风格，包含 默认风格 和 卡片风格两种。可选项：normal/card | N
value | String / Number | - | 激活的选项卡值。TS 类型：`TabValue` `type TabValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts) | N
defaultValue | String / Number | - | 激活的选项卡值。非受控属性。TS 类型：`TabValue` `type TabValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts) | N
onAdd | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>添加选项卡时触发 | N
onChange | Function |  | TS 类型：`(value: TabValue) => void`<br/>激活的选项卡发生变化时触发 | N
onDragSort | Function |  | TS 类型：`(context: TabsDragSortContext) => void`<br/>拖拽排序时触发。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts)。<br/>`interface TabsDragSortContext { currentIndex: number; current: TabValue; targetIndex: number; target: TabValue }`<br/> | N
onRemove | Function |  | TS 类型：`(options: { value: TabValue; index: number; e: MouseEvent }) => void`<br/>删除选项卡时触发 | N


### TabPanel Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
destroyOnHide | Boolean | true | 选项卡内容隐藏时是否销毁 | N
disabled | Boolean | false | 是否禁用当前选项卡 | N
draggable | Boolean | true | 选项卡组件开启允许拖动排序时，当前选项卡是否允许拖动 | N
label | TNode | - | 选项卡名称，可自定义选项卡导航内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
lazy | Boolean | false | 是否启用选项卡懒加载 | N
panel | TNode | - | 用于自定义选项卡面板内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
removable | Boolean | false | 当前选项卡是否允许移除 | N
value | String / Number | - | 选项卡的值，唯一标识。TS 类型：`TabValue` | N
onRemove | Function |  | TS 类型：`(options: { value: TabValue; e: MouseEvent }) => void`<br/>点击删除按钮时触发 | N
