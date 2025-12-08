---
title: Select 选择器
description: 用于弹出一个下拉菜单给用户选择操作，展示收起的隐含选项。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础选择器

{{ base }}

### 宽度自适应

{{ autoWidth }}

### 禁用态

{{ disabled }}

### 预设尺寸

{{ size }}

### 加载状态

{{ loading }}

## API

### Select Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
autoWidth | Boolean | false | 宽度随内容自适应 | N
borderless | Boolean | false | 无边框模式 | N
clearable | Boolean | false | 是否可以清空选项 | N
disabled | Boolean | - | 是否禁用组件 | N
loading | Boolean | false | 是否为加载状态 | N
multiple | Boolean | false | 是否允许多选 | N
options | Array | - | 数据化配置选项内容。TS 类型：`Array<SelectOption>`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/select/type.ts) | N
placeholder | String | undefined | 占位符 | N
popupVisible | Boolean | - | 是否显示下拉框 | N
defaultPopupVisible | Boolean | - | 是否显示下拉框，非受控属性 | N
showArrow | Boolean | true | 是否显示右侧箭头，默认显示 | N
size | String | medium | 组件尺寸。可选项：`small/medium/large`。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
suffixIcon | TElement | - | 组件后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
value | String / Number / Boolean / Object / Array | undefined | 选中值。单选时为单个值，多选时为数组。TS 类型：`SelectValue` `type SelectValue<T extends SelectOption = SelectOption> = string \| number \| boolean \| T \| Array<SelectValue<T>>`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/select/type.ts) | N
defaultValue | String / Number / Boolean / Object / Array | undefined | 选中值，非受控属性。TS 类型同 `value` | N
onChange | Function |  | TS 类型：`(value: SelectValue, context: { option?: T; selectedOptions: T[]; trigger: SelectValueChangeTrigger; e?: MouseEvent \| KeyboardEvent }) => void`<br/>选中值变化时触发。`context.trigger` 表示触发变化的来源；`context.selectedOptions` 为选中值的完整对象数组；`context.option` 为当前操作的选项（不一定存在） | N
onClear | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击清除按钮时触发 | N
onPopupVisibleChange | Function |  | TS 类型：`(visible: boolean, context: PopupVisibleChangeContext) => void`<br/>下拉框显示或隐藏时触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/popup/type.ts) | N

### Option Props（TdOptionProps）

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
checkAll | Boolean | false | 当前选项是否为“全选”。点击时会选中（或取消）禁用态除外的全部选项，即使是分组选择器也会选中全部选项 | N
children | TNode | - | 用于定义复杂的选项内容，同 `content`。TS 类型：`TNode` | N
content | TNode | - | 用于定义复杂的选项内容。一般用于自定义选项展示 | N
disabled | Boolean | false | 是否禁用该选项 | N
label | String | '' | 选项名称 | N
title | String | '' | 选项标题，在选项过长时 hover 选项展示 | N
value | String / Number | - | 选项值 | N

### 相关类型

- `SelectOption`：Select 组件使用的选项类型，当前实现仅支持普通选项，TS 类型：`TdOptionProps \| PlainObject`  
- `SelectValue`：选中值类型，支持基础类型、对象以及嵌套数组，详见上表说明  
- `SelectValueChangeTrigger`：值变更触发来源枚举，TS 类型：`'clear' \| 'tag-remove' \| 'backspace' \| 'check' \| 'uncheck' \| 'default'`  
- `SelectContext<T>`：值变更回调上下文，包含 `option`、`selectedOptions`、`trigger`、事件对象等  
- `SelectRemoveContext<T>`：多选移除回调上下文，包含被移除的值和对应数据项  

[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/select/type.ts)
