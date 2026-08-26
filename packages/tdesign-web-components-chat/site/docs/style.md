---
title: 自定义样式
description: Chat 组件样式自定义指南
spline: explain
isGettingStarted: true
---

## 概述

TDesign Chat 组件基于 Web Components 技术构建，为 AI 对话场景（Chatbot、ChatSender、ChatMessage 等）提供开箱即用的能力。由于 Web Components 的 Shadow DOM 特性，外部 CSS 选择器无法直接穿透组件内部样式，因此我们提供了以下三种样式自定义方式：

1. **CSS 变量（Design Tokens）**：覆盖 `--td-chat-*` 系列变量，快速调整颜色、圆角、间距等主题风格。
2. **CSS Parts**：通过 `::part()` 伪元素选择器直接修改组件内部元素样式（[了解更多](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::part)）。
3. **宿主属性选择器**：结合组件属性（如 `disabled`、`loading`）实现特定状态下的样式定制。

## 方式一：CSS 变量（推荐）

Chat 组件通过一套 `--td-chat-*` 命名的 CSS 变量对外暴露关键样式点，覆盖这些变量即可完成大部分主题定制，且无需理解组件内部结构。变量作用域为 `:root`，在任意父级或全局样式中覆盖均可生效。

### ChatSender 常用变量示例

```css
:root {
  /* 输入框整体 */
  --td-chat-input-padding: 12px 16px;
  --td-chat-input-radius: 12px;
  --td-chat-input-background: #f7f8fa;
  --td-chat-input-hover-border: #0052d9;
  --td-chat-input-shadow: 0 0 0 2px rgba(0, 82, 217, 0.2);

  /* 文本输入区 */
  --td-chat-input-font-size: 14px;
  --td-chat-input-textarea-max-height: 200px;

  /* 底部操作区 */
  --td-chat-input-actions-gap: 8px;
  --td-chat-input-actions-item-wh: 32px;
  --td-chat-input-actions-item-radius: 16px;

  /* 发送按钮 */
  --td-chat-input-button-default-bg: #0052d9;
  --td-chat-input-button-default-color: #fff;
}
```

> **提示：** 完整的可覆盖变量列表可参考组件源码中的 `_var.less` 文件（如 `chat-sender/style/_var.less`），或在浏览器 DevTools 中查看 `<t-chat-sender>` 等元素上生效的 CSS 变量。

### 局部作用域覆盖

若只想影响某一处的 Chat 组件，可将变量定义在其父容器上：

```css
.my-chat-panel {
  --td-chat-input-radius: 4px;
  --td-chat-input-background: #fff;
}
```

```html
<div class="my-chat-panel">
  <t-chat-sender placeholder="请输入..." />
</div>
```

## 方式二：CSS Parts

当 CSS 变量无法满足需求时，可以使用 `::part()` 直接修改组件内部元素的样式。Chat 组件的样式实现中已经对内部元素（如富文本、按钮、上传触发器等）通过 `part` 属性做了暴露。

### 基础用法

以 ChatSender 为例，在 Chrome DevTools 中查看内部元素，找到带 `part` 属性的节点：

```html
<t-chat-sender>
  #shadow-root
    <div class="t-chat__input">
      <div class="t-chat__input__content">
        <t-textarea exportparts="t-textarea,t-textarea__inner">...</t-textarea>
        <div class="t-chat__input__footer">
          <t-button exportparts="t-button">发送</t-button>
        </div>
      </div>
    </div>
</t-chat-sender>
```

**使用 `::part()` 修改这些元素的样式：**

```css
/* 修改输入框内层的字号与内边距 */
t-chat-sender::part(t-textarea__inner) {
  font-size: 16px;
  padding: 8px 0;
}

/* 修改发送按钮的圆角 */
t-chat-sender::part(t-button) {
  border-radius: 8px;
}

/* 修改附件列表位置 */
t-chat-sender::part(t-attachment-list-wrap) {
  top: -8px;
}
```

### 配合伪类使用

`::part()` 可以与 CSS 伪类结合，处理 hover / focus 等交互状态：

```css
/* 输入框内层聚焦时高亮 */
t-chat-sender::part(t-textarea__inner):focus {
  outline: none;
  color: #0052d9;
}

/* 发送按钮 hover 状态 */
t-chat-sender::part(t-button):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.2);
}
```

## 方式三：宿主属性选择器 + CSS Parts

当需要针对组件的不同状态（如 `disabled`、`loading`）应用不同样式时，可以使用 **宿主属性选择器** 配合 `::part()` 实现精确控制。

> **注意：** 由于 CSS 规范限制，`::part()` 不能直接与 class 选择器组合（如 `::part(t-button).some-class` 的写法是无效的）。因此需要通过宿主元素的属性来区分。

### 基础用法

```css
/* 禁用状态下的输入框整体变灰 */
t-chat-sender[disabled]::part(t-textarea__inner) {
  color: #bbb;
  cursor: not-allowed;
}

/* loading 状态下的发送按钮样式 */
t-chat-sender[loading]::part(t-button) {
  background: #f0f0f0;
  color: #999;
}
```

### 配合伪类

```css
/* 非禁用状态下 hover 输入框 */
t-chat-sender:not([disabled])::part(t-textarea__inner):hover {
  background: #fafafa;
}
```

## 常见问题

### Q: 为什么我的 CSS 选择器不生效？
A: Chat 组件内部使用了 Shadow DOM，外部普通 CSS 无法直接穿透。请优先尝试覆盖 `--td-chat-*` CSS 变量，或使用 `::part()` 的方式修改。

### Q: 如何查看组件暴露了哪些 parts？
A: 在浏览器开发者工具中检查组件内部 DOM，查找带有 `part` 或 `exportparts` 属性的元素。也可以查阅各组件的 API 文档。

### Q: 为什么 `::part(t-button).some-class` 不生效？
A: 这是 CSS 规范的限制，`::part()` 伪元素不能与 class 选择器组合使用。请改用宿主属性选择器，如 `t-chat-sender[disabled]::part(t-button)` 这样的写法。

### Q: 宿主属性选择器支持哪些属性？
A: 以 ChatSender 为例，可用作宿主属性选择器的属性包括 `disabled`、`loading`、`placeholder` 等——它们会作为 HTML 属性存在于 `<t-chat-sender>` 上，可直接用 `[disabled]`、`[loading]` 等匹配。