---
title: 自定义样式
description: 样式自定义指南
spline: explain
isGettingStarted: true
---

## 概述

TDesign Web Components 组件底层基于 Web Components 技术构建，提供了灵活的样式自定义方案。由于 Web Components 的 Shadow DOM 特性，传统的 CSS 选择器无法直接穿透组件内部样式，因此我们提供了以下两种样式自定义方式：

1. **CSS Parts**：通过 `::part()` 伪元素选择器直接修改组件内部元素样式（[了解更多](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::part)）。
2. **宿主属性选择器**：结合组件属性实现特定条件下的样式定制。

## 方式一：CSS Parts

CSS Parts 允许你直接选择和修改 Web Components 内部的特定元素。组件通过 `exportparts` 属性暴露内部元素（[了解更多](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts)），**因此，你可以使用 `::part()` 伪元素选择器来修改这些元素的样式。**

### 基础用法

以 Button 组件为例，先在 Chrome DevTools 中查看内部元素，**查看元素顶层的 `exportparts` 属性：**

```html
<t-button exportparts="t-button,t-button__text,t-button__suffix">
  #shadow-root
    <button class="t-button" part="t-button">
      <slot name="icon">...</slot>
      <span class="t-button__text" part="t-button__text"><slot>...</slot></span>
    </button>
</t-button>
```

可见，Button 组件暴露了以下 parts：
1. `t-button`：按钮根元素
2. `t-button__text`：按钮文字区域
3. `t-button__suffix`：按钮后缀区域

**我们可以使用 `::part()` 包裹元素提供的 parts 来修改样式：**

```css
/* 修改按钮的圆角 */
t-button::part(t-button) {
  border-radius: 100%;
}

/* 修改按钮文字样式 */
t-button::part(t-button__text) {
  font-weight: bold;
  letter-spacing: 2px;
}
```

### 配合伪类使用

`::part()` 如何与 CSS 伪类结合使用：

```css
/* hover 状态 */
t-button::part(t-button):hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* focus 状态 */
t-button::part(t-button):focus-visible {
  outline: 2px solid #0052d9;
  outline-offset: 2px;
}
```

## 方式二：宿主属性选择器 + CSS Parts

当需要根据组件的不同属性（如 `variant`、`theme`、`size` 等）应用不同样式时，可以使用 **宿主属性选择器** 配合 `::part()` 实现精确控制。

> **注意：** 由于 CSS 规范限制，`::part()` 不能直接与 class 选择器组合（如 `::part(t-button).some-class` 的写法是无效的）。因此需要通过宿主元素的属性来区分。

### 基础用法

```css
/* 只选中 variant="outline" 的按钮 */
t-button[variant="outline"]::part(t-button) {
  border-radius: 100%;
}
```

### 配合状态属性和伪类

```css
/* outline + danger 主题 + focus-visible */
t-button[variant="outline"][theme="danger"]:focus-visible::part(t-button) {
  outline-color: #e34d59;
}
```

## 常见问题

### Q: 为什么我的 CSS 选择器不生效？
A: 组件内部使用了 Shadow DOM，外部 CSS 无法直接穿透。请使用 CSS Parts 的方式修改。

### Q: 为什么 `::part(t-button).some-class` 不生效？
A: 这是 CSS 规范的限制，`::part()` 伪元素不能与 class 选择器组合使用。请改用宿主属性选择器，如 `t-button[variant="outline"]::part(t-button)` 这样的写法。

### Q: 如何查看组件暴露了哪些 parts？
A: 在浏览器开发者工具中检查组件的顶层 DOM，查找带有 `exportpart` 属性的元素。也可以查阅各组件的 API 文档。

### Q: 宿主属性选择器支持哪些属性？
A: 以 Button 组件为例，宿主属性如 `variant` 、 `theme` 、 `disabled` 、 `loading` 等需要作为 HTML 属性存在于 `<t-button>` 上。
