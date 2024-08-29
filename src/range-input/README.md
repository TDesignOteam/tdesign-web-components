---
title: RangeInput 范围输入框
description: 用于输入范围文本。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础范围输入框

{{ base }}

### 不同尺寸的标签输入框

提供大、中（默认）、小三种不同尺寸的的标签输入框。

{{ size }}

### 不同状态的标签输入框

标签输入框状态可分为：正常、只读、禁用、成功、告警、错误等，其中 成功、告警、错误 等状态一般用于表单验证。此特性继承至 Input 输入框组件。

{{ status }}

## API
### RangeInput Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
activeIndex | Number | - | 输入框高亮状态序号 | N
clearable | Boolean | false | 是否可清空 | N
disabled | Boolean | - | 是否禁用范围输入框 | N
format | Array / Function | - | 指定输入框展示值的格式。TS 类型：`InputFormatType \| Array<InputFormatType>` | N
placeholder | String / Array | - | 占位符，示例：'请输入' 或者 ['开始日期', '结束日期']。TS 类型：`string \| Array<string>` | N
readonly | Boolean | false | 只读状态 | N
separator | TNode | '-' | 范围分隔符。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
size | String | medium | 输入框尺寸。可选项：small/medium/large | N
status | String | default | 输入框状态。可选项：default/success/warning/error | N
value | Array | [] | 范围输入框的值。TS 类型：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
defaultValue | Array | [] | 范围输入框的值。非受控属性。TS 类型：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
onBlur | Function |  | TS 类型：`(ev: CustomEvent<{value: RangeInputValue, context?: { e?: FocusEvent; position?: RangeInputPosition }}>) => void`<br/>范围输入框失去焦点时触发 | N
onChange | Function |  | TS 类型：`(ev: CustomEvent<{value: RangeInputValue, context?: { e?: InputEvent \| MouseEvent \| CompositionEvent; position?: RangeInputPosition; trigger?: 'input' \| 'initial' \| 'clear' }}>) => void`<br/>范围输入框值发生变化时触发。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts)。<br/>`type RangeInputPosition = 'first' \| 'second' \| 'all'`<br/> | N
onFocus | Function |  | TS 类型：`(ev: CustomEvent<{value: RangeInputValue, context?: { e?: FocusEvent; position?: RangeInputPosition }}>) => void`<br/>范围输入框获得焦点时触发 | N
onMouseenter | Function |  | TS 类型：`(ev: CustomEvent<{context: { e: MouseEvent }}>) => void`<br/>进入输入框时触发 | N
onMouseleave | Function |  | TS 类型：`(ev: CustomEvent<context: { e: MouseEvent }>) => void`<br/>离开输入框时触发 | N
