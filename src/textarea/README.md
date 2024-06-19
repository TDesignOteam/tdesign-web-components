---
title: Textarea 文本框
description: 通过鼠标或键盘输入多行内容。
isComponent: true
usage: { title: '', description: '' }
spline: base
---

### 基础使用

{{ base }}

### 自定义事件

{{ event }}

### 字数限制

{{ limit }}

### 自定义状态

{{ status }}




## API

### Textarea Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
allowInputOverMax | Boolean | false | 超出`maxlength`或`maxcharacter`之后是否还允许输入 | N
autofocus | Boolean | false | 自动聚焦，拉起键盘 | N
autosize | Boolean/Object | false | 高度自动撑开。Object属性：`minRows：number,maxRows：number`。autosize = true 表示组件高度自动撑开，同时，依旧允许手动拖高度。如果设置了 autosize.maxRows 或者 autosize.minRows 则不允许手动调整高度 | N
disabled | Boolean | false | 是否禁用文本框 | N
label | TNode | - | 左侧文本 | N
maxcharacter | Number | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度 | N
maxlength | Number | - | 用户最多可以输入的字符个数 | N
name | String | - | 名称 | N
placeholder | String | '' | 占位符 | N
readonly | Boolean | false | 只读状态 | N
status | String | - | 文本框状态。可选项：`default/success/warning/error` | N
tips | TNode | - | 输入框下方提示文本 | N
value | String | - | 文本框值 | N
defaultValue | String | - | 文本框值，非受控属性 | N
onBlur | Function |  | TS 类型：`(value: string, context: FocusEvent) => void`<br/>失去焦点时触发 | N
onFocus | Function |  | TS 类型：`(value: string, context: FocusEvent) => void`<br/>获得焦点时触发 | N
onKeydown | Function |  | TS 类型：`(value: string, context: KeyboardEvent) => void`<br/>键盘按下时触发 | N
onKeypress | Function |  | TS 类型：`(value: string, context: KeyboardEvent) => void`<br/>按下字符键时触发 | N
onKeyup | Function |  | TS 类型：`(value: string, context: KeyboardEvent) => void`<br/>释放键盘时触发 | N
