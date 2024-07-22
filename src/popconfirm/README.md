---
title: Popconfirm 气泡确认框
description: 气泡确认框通常用于不会造成严重后果的二次确认场景，其会在点击元素上弹出浮层进行提示确认。气泡确认框没有蒙层，点击确认框以外的区域即可关闭。
isComponent: true
usage: { title: '', description: '' }
spline: message
---

### 基础气泡确认框

使用说明文字及操作按钮对较简单的操作进行二次确认。

{{ base }}

### 不同图标的气泡确认框

在说明文字之前增加图标，如普通、警示及告警等图标，增强表达以更好的引起用户注意。

{{ icon }}

### 带描述的气泡确认框

提供悬浮时触发（默认）、点击时触发、获取焦点时触发、右击时触发等方式。

{{ describe }}

### 自定义气泡确认框按钮

通过 `confirmBtn` 和 `cancelBtn` 属性来自定义确认和取消按钮，支持传入 Button 组件属性或使用 slot 方式。

{{ button }}

### 控制气泡确认框位置

通过 `popupProps` 可以透传弹窗底层依赖的 Popup 组件所有已支持的属性，比如控制弹窗出现的位置。

{{ inherit }}

## API
### Popconfirm Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
cancelBtn | TNode | - | 取消按钮，可自定义。值为 null 则不显示取消按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制取消事件。TS 类型：`string \| ButtonProps \| TNode`，[Button API Documents](https://tdesign.tencent.com/react/components/button?tab=api)。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/popconfirm/type.ts) | N
children | TNode | - | 触发元素，同 triggerElement。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
confirmBtn | TNode | - | 确认按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制确认事件。TS 类型：`string \| ButtonProps \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 确认框内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
destroyOnClose | Boolean | true | 是否在关闭浮层时销毁浮层 | N
icon | TElement | - | 确认框图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
placement | String | top | 浮层出现位置。可选项：top/left/right/bottom/top-left/top-right/bottom-left/bottom-right/left-top/left-bottom/right-top/right-bottom | N
popupProps | Object | - | 透传 Popup 组件属性。TS 类型：PopupProps，[Popup API Documents](https://tdesign.tencent.com/react/components/popup?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/popconfirm/type.ts) | N
showArrow | Boolean | true | 是否显示浮层箭头 | N
theme | String | default | 文字提示风格。可选项：default/warning/danger | N
triggerElement | TNode | - | 触发元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
visible | Boolean | - | 是否显示气泡确认框 | N
defaultVisible | Boolean | - | 是否显示气泡确认框。非受控属性 | N
onCancel | Function |  | TS 类型：`(options: { e: MouseEvent }) => void`<br/>点击取消按钮时触发 | N
onConfirm | Function |  | TS 类型：`(options: { e: MouseEvent }) => void`<br/>点击确认按钮时触发 | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean, context: PopconfirmVisibleChangeContext) => void`<br/>确认框显示或隐藏时触发。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/popconfirm/type.ts)。<br/>`interface PopconfirmVisibleChangeContext { trigger?: TriggerSource; e?: MouseEvent }`<br/><br/>`type TriggerSource = 'cancel' \| 'confirm' \| 'document' \| 'trigger-element-click'` | N
