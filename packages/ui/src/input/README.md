---
title: Input 输入框
description: 用于承载用户信息录入的文本框，常用于表单、对话框等场景，对不同内容的信息录入，可拓展形成多种信息录入形式。
isComponent: true
usage: { title: "", description: "" }
spline: form
---

### 基础输入框

最基础的单行输入框，按状态可分为正常、禁用、错误、带额外提示。通常在需要输入少量内容（20 个字以内）的场景下使用。

{{ base }}

### 前后置标签输入框

在输入框前后加入一些特定的纯展示标签，通常在需要提高辨识效率时使用。

{{ addon }}

### 组合输入框

多个输入框相组合，或与其他控件（如下拉）相组合，以方便识别。用于一些固定组合或者固定格式输入的场景，如输入电话号码。

{{ group }}

### 可清空内容输入框

带清空操作的输入框，可快捷清空输入过的内容。

{{ clearable }}

### 密码输入框

由符号代替输入内容的输入框，并可通过操作展示原文信息。用于强安全信息输入的场景。

{{ password }}

### 不同状态的输入框

输入框状态可分为：正常、禁用、异常（带提示）、带额外内容提示、带状态图标提示。

{{ status }}

### 不同尺寸的输入框

有大中小三种不同高度、宽度的输入框，以适应不同尺寸布局。设置 `size = large | medium | small` 实现不同的尺寸。

{{ size }}

### 不同对齐方式的输入框

输入框共有三种对齐方式：左对齐、局中对齐和右对齐。设置 `align = left | center | right` 实现不同的对齐方式。

{{ align }}

### 自适应宽度的输入框

输入框支持宽度随输入内容变化而变化，设置属性 `autoWidth` 即可。

{{ auto-width }}

### 带长度限制的输入框

- 使用 `maxlength` 设置输入框的长度限度，一个中文等于一个计数长度。
- 使用 `maxcharacter` 设置输入框的长度限度，一个中文汉字表示两个字符长度。
- 使用 `allowInputOverMax` 设置是否允许在输入内容已经超出限制时继续输入。
- 使用 `showLimitNumber` 设置是否显示输入框右侧的字数统计。

{{ max-length-count }}

### 可格式化数据的输入框

可以使用 `format` 设置输入框在失焦和聚焦时的不同内容呈现。

{{ format }}

### 无边框模式的输入框

可以使用 `borderless` 来开启无边框模式。

{{ borderless }}

## API

### Input Props

#### 基础属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **value** | `string` | `''` | 输入框的值（受控模式） |
| **defaultValue** | `string` | `''` | 输入框的默认值（非受控模式） |
| **placeholder** | `string` | `'请输入'` | 占位符 |
| **type** | `'text' \| 'number' \| 'url' \| 'tel' \| 'password' \| 'search' \| 'submit' \| 'hidden'` | `'text'` | 输入框类型 |
| **disabled** | `boolean` | - | 是否禁用输入框 |
| **readonly** | `boolean` | `false` | 只读状态 |
| **autofocus** | `boolean` | `false` | 自动聚焦 |
| **autocomplete** | `string` | - | 是否开启自动填充功能，HTML5 原生属性 |

#### 样式属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **size** | `'small' \| 'medium' \| 'large'` | `'medium'` | 输入框尺寸 |
| **align** | `'left' \| 'center' \| 'right'` | `'left'` | 文本内容位置，居左/居中/居右 |
| **status** | `'default' \| 'success' \| 'warning' \| 'error'` | - | 输入框状态 |
| **borderless** | `boolean` | `false` | 无边框模式 |
| **autoWidth** | `boolean` | `false` | 宽度随内容自适应 |
| **inputClass** | `string \| string[] \| object` | - | t-input 同级类名 |

#### 内容属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **label** | `TNode` | - | 左侧文本 |
| **suffix** | `TNode` | - | 后置图标前的后置内容 |
| **prefixIcon** | `TElement` | - | 组件前置图标 |
| **suffixIcon** | `TElement` | - | 组件后置图标 |
| **tips** | `TNode` | - | 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式 |

#### 清空与长度限制

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **clearable** | `boolean` | `false` | 是否可清空 |
| **showClearIconOnEmpty** | `boolean` | `false` | 输入框内容为空时，悬浮状态是否显示清空按钮 |
| **maxlength** | `number` | - | 用户最多可以输入的文本长度，一个中文等于一个计数长度 |
| **maxcharacter** | `number` | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度 |
| **allowInputOverMax** | `boolean` | `false` | 超出 `maxlength` 或 `maxcharacter` 之后是否允许继续输入 |
| **showLimitNumber** | `boolean` | `false` | 是否在输入框右侧显示字数统计 |

#### 格式化

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **format** | `(value: string) => string` | - | 指定输入框展示值的格式，失焦时生效 |

### 事件回调

| 事件名 | 参数类型 | 说明 |
|--------|----------|------|
| **onChange** | `(value: string, context?: { e?: MouseEvent }) => void` | 输入框值发生变化时触发 |
| **onFocus** | `(value: string, context: { e: FocusEvent }) => void` | 获得焦点时触发 |
| **onBlur** | `(value: string, context: { e: FocusEvent }) => void` | 失去焦点时触发 |
| **onClear** | `(context: { e: MouseEvent }) => void` | 清空按钮点击时触发 |
| **onEnter** | `(value: string, context: { e: KeyboardEvent }) => void` | 回车键按下时触发 |
| **onKeydown** | `(value: string, context: { e: KeyboardEvent }) => void` | 键盘按下时触发 |
| **onKeyup** | `(value: string, context: { e: KeyboardEvent }) => void` | 释放键盘时触发 |
| **onKeypress** | `(value: string, context: { e: KeyboardEvent }) => void` | 按下字符键时触发 |
| **onCompositionstart** | `(value: string, context: { e: CompositionEvent }) => void` | 中文输入开始时触发 |
| **onCompositionend** | `(value: string, context: { e: CompositionEvent }) => void` | 中文输入结束时触发 |
| **onMouseenter** | `(context: { e: MouseEvent }) => void` | 进入输入框时触发 |
| **onMouseleave** | `(context: { e: MouseEvent }) => void` | 离开输入框时触发 |
| **onValidate** | `(context: { error?: 'exceed-maximum' \| 'below-minimum' }) => void` | 字数超出限制时触发 |

### InputGroup Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| **separate** | `boolean` | `false` | 多个输入框之间是否需要间隔 |
