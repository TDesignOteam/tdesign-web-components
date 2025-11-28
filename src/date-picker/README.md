---
title: DatePicker 日期选择器
description: 用于选择某一具体日期或某一段日期区间。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础示例

{{ base }}

### 周选择器

{{ week }}

### 月份选择器

用于月份的选择。用户仅需输入月份信息时使用。

{{ month }}

### 年份选择器

用于年份的选择。用户仅需输入年份信息时使用，常用于如年账单等按年记录数据的查询场景。

{{ year }}

### 季度选择器

用于季度的选择。用户仅需输入季度信息时使用。

{{ quarter }}

### 带快捷标签的日期选择器 

具有可提前设置的时间标签。当日期信息具有规律性，需要点击标签快捷输入时。

{{ presets }}

### 可禁用日期的选择器

可将不支持用户选择的日期禁止点击。

{{ limit }}

### 可输入日期的选择器

可输入指定的日期，会自动判断日期是否合法。

{{ input }}


## API

### DatePicker Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
value | String / Number / Date | - | 选中值。TS 类型：`DateValue`。`type DateValue = string \| number \| Date` | N
defaultValue | String / Number / Date | - | 选中值，非受控属性。TS 类型：`DateValue` | N
format | String | 'YYYY-MM-DD' | 用于格式化日期显示的格式 | N
valueType | String | - | 用于格式化日期值的类型，对比 format 只用于展示 | N
mode | String | 'date' | 选择器模式。可选项：date/month/year/week/quarter | N
firstDayOfWeek | Number | 1 | 一周的起始天（0-6） | N
disableDate | Object / Array / Function | - | 禁用日期。TS 类型：`DisableDate`。`type DisableDate = DateValue[] \| DisableDateObject \| ((date: DateValue) => boolean)` | N
minDate | String / Number / Date | - | 最小可选日期 | N
maxDate | String / Number / Date | - | 最大可选日期 | N
presets | Object | - | 预设快捷日期选择。TS 类型：`PresetDate`。`interface PresetDate { [name: string]: DateValue \| (() => DateValue) }` | N
presetsPlacement | String | 'bottom' | 预设面板展示区域。可选项：left/top/right/bottom | N
placeholder | String | - | 占位符 | N
tips | TNode | - | 输入框下方提示 | N
status | String | 'default' | 输入框状态。可选项：default/success/warning/error | N
borderless | Boolean | false | 是否无边框 | N
disabled | Boolean | false | 是否禁用组件 | N
clearable | Boolean | false | 是否显示清除按钮 | N
allowInput | Boolean | false | 是否允许输入日期 | N
label | TNode | - | 左侧文本内容 | N
prefixIcon | TNode | - | 自定义前缀图标 | N
suffixIcon | TNode | - | 自定义后缀图标 | N
popupVisible | Boolean | - | 设置面板是否可见（受控） | N
defaultPopupVisible | Boolean | false | 默认面板显示状态（非受控） | N
inputProps | Object | - | 透传给输入框组件的属性 | N
popupProps | Object | - | 透传给 popup 组件的参数 | N
onChange | Function | - | 选中值变化时触发。`(value: DateValue, context?: any) => void` | N
onVisibleChange | Function | - | 面板显示/隐藏切换时触发。`(visible: boolean, context?: any) => void` | N
onPick | Function | - | 用户选择日期时触发。`(value: Date, context?: any) => void` | N
onPresetClick | Function | - | 点击预设按钮后触发。`(context?: any) => void` | N
onClear | Function | - | 点击清除按钮时触发。`(context?: any) => void` | N

### DateRangePicker Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式 | N
value | Array | - | 选中值。TS 类型：`DateRangeValue`。`type DateRangeValue = Array<DateValue>` | N
defaultValue | Array | - | 选中值，非受控属性。TS 类型：`DateRangeValue` | N
format | String | 'YYYY-MM-DD' | 用于格式化日期显示的格式 | N
valueType | String | - | 用于格式化日期值的类型，对比 format 只用于展示 | N
mode | String | 'date' | 选择器模式。可选项：date/month/year/week/quarter | N
firstDayOfWeek | Number | 1 | 一周的起始天（0-6） | N
disableDate | Object / Array / Function | - | 禁用日期。TS 类型：`DisableDate` | N
cancelRangeSelectLimit | Boolean | false | 是否允许取消选中范围选择限制，设置为 true 将不再限制结束日期必须大于开始日期 | N
panelPreselection | Boolean | true | 是否在选中日期时预选高亮 | N
presets | Object | - | 预设快捷日期选择。TS 类型：`PresetRange`。`interface PresetRange { [name: string]: DateRangeValue \| (() => DateRangeValue) }` | N
presetsPlacement | String | 'bottom' | 预设面板展示区域。可选项：left/top/right/bottom | N
placeholder | String / Array | - | 占位符。TS 类型：`string \| string[]` | N
tips | TNode | - | 输入框下方提示 | N
status | String | 'default' | 输入框状态。可选项：default/success/warning/error | N
disabled | Boolean | false | 是否禁用组件 | N
clearable | Boolean | false | 是否显示清除按钮 | N
allowInput | Boolean | false | 是否允许输入日期 | N
label | TNode | - | 左侧文本内容 | N
separator | TNode | '-' | 范围分隔符 | N
prefixIcon | TNode | - | 自定义前缀图标 | N
suffixIcon | TNode | - | 自定义后缀图标 | N
popupVisible | Boolean | - | 设置面板是否可见（受控） | N
defaultPopupVisible | Boolean | false | 默认面板显示状态（非受控） | N
rangeInputProps | Object | - | 透传给输入框组件的属性 | N
popupProps | Object | - | 透传给 popup 组件的参数 | N
onChange | Function | - | 选中值变化时触发。`(value: DateRangeValue, context?: any) => void` | N
onVisibleChange | Function | - | 面板显示/隐藏切换时触发。`(visible: boolean, context?: any) => void` | N
onPick | Function | - | 用户选择日期时触发。`(value: Date, context?: any) => void` | N
onPresetClick | Function | - | 点击预设按钮后触发。`(context?: any) => void` | N
onClear | Function | - | 点击清除按钮时触发。`(context?: any) => void` | N