---
title: Popup 弹出层
description: 弹出层组件是其他弹窗类组件如气泡确认框实现的基础，当这些组件提供的能力不能满足定制需求时，可以在弹出层组件基础上封装。
isComponent: true
usage: { title: '', description: '' }
spline: message
---

### 基础弹出层

由是让浮层内容和触发元素组成，两者均可自定义。使用 `content` 自定义浮层内容。

{{ base }}

### 触发元素

可以使用 `triggerElement` 自定义触发元素。

{{ trigger-element }}

### 不同触发方式的弹出层

提供悬浮时触发（默认）、点击时触发、获取焦点时触发、右击时触发等方式。

{{ trigger }}

### 位置方向

使用 `placement` 控制浮层方向，如果需要浮层箭头，设置 `showArrow=true` 即可。

{{ placement }}

### 浮层样式

浮层样式可以使用 overlayClassName、 overlayStyle、 overlayInnerStyle 控制。

- `overlayClassName` 用于定义浮层样式类名。
- `overlayStyle` 用于定义浮层样式，比如浮层宽度。浮层宽度默认根据内容宽度呈现，可自由设置宽度和最大宽度。
- `overlayInnerStyle` 用于定义浮层内容部分样式，比如内容最大高度以及是否出滚动条。值为类型为函数时，可以实现浮层内容宽度和触发元素同宽。

{{ style }}

### 可控制显示的弹出层

可以通过 `visible` 自由控制弹出层的显示或隐藏。

{{ visible }}

### 可隐藏时销毁的弹出层

`destroyOnClose` 用于控制浮层隐藏时是否销毁浮层内容。

{{ destroy }}

### 禁用状态的弹出层

组件禁用后，不再显示弹出层。

{{ disabled }}

### 动态自适应

当trigger或popup显示内容动态变化时，自适应调整位置

{{ dynamic }}

## API

### Popup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
children | TNode | - | 触发元素，同 triggerElement。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
content | TNode | - | 浮层里面的内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
delay | Number / Array | - | 延时显示或隐藏浮层，[延迟显示的时间，延迟隐藏的时间]，单位：毫秒。如果只有一个时间，则表示显示和隐藏的延迟时间相同。示例 `'300'` 或者 `[200, 200]`。默认为：[250, 150]。TS 类型：`number \| Array<number>` | N
destroyOnClose | Boolean | false | 是否在关闭浮层时销毁浮层 | N
disabled | Boolean | - | 是否禁用组件 | N
hideEmptyPopup | Boolean | false | 浮层是否隐藏空内容，默认不隐藏 | N
overlayClassName | String / Object / Array | - | 浮层类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]`。TS 类型：`ClassName`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
overlayInnerClassName | String / Object / Array | - | 浮层内容部分类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]`。TS 类型：`ClassName`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
overlayInnerStyle | Boolean / Object / Function | - | 浮层内容部分样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点。TS 类型：`Styles \| ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles)`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
overlayStyle | Boolean / Object / Function | - | 浮层样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点。TS 类型：`Styles \| ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles)`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
placement | String | top | 浮层出现位置。TS 类型：`PopupPlacement` `type PopupPlacement = 'top'\|'left'\|'right'\|'bottom'\|'top-left'\|'top-right'\|'bottom-left'\|'bottom-right'\|'left-top'\|'left-bottom'\|'right-top'\|'right-bottom'`。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/popup/type.ts) | N
showArrow | Boolean | false | 是否显示浮层箭头 | N
trigger | String | hover | 触发浮层出现的方式。可选项：hover/click/focus/mousedown/context-menu | N
triggerElement | TNode | - | 触发元素。值类型为字符串表示元素选择器。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/common.ts) | N
visible | Boolean | - | 是否显示浮层。TS 类型：`boolean` | N
zIndex | Number | - | 组件层级，Web 侧样式默认为 5500，移动端和小程序样式默认为 1500 | N
onScroll | Function |  | TS 类型：`(context: { e: WheelEvent }) => void`<br/>下拉选项滚动事件 | N
onScrollToBottom | Function |  | TS 类型：`(context: { e: WheelEvent }) => void`<br/>下拉滚动触底事件，常用于滚动到底执行具体业务逻辑 | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean, context: PopupVisibleChangeContext) => void`<br/>当浮层隐藏或显示时触发，`trigger=document` 表示点击非浮层元素触发；`trigger=context-menu` 表示右击触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/tree/main/src/popup/type.ts)。<br/>`interface PopupVisibleChangeContext { e?: PopupTriggerEvent; trigger?: PopupTriggerSource }`<br/><br/>`type PopupTriggerEvent = MouseEvent \| FocusEvent \| KeyboardEvent`<br/><br/>`type PopupTriggerSource = 'document' \| 'trigger-element-click' \| 'trigger-element-hover' \| 'trigger-element-blur' \| 'trigger-element-focus' \| 'trigger-element-mousedown' \| 'context-menu' \| 'keydown-esc'`<br/> | N
