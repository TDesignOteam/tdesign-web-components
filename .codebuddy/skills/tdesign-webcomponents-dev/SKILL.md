---
name: TDesign Web Components 开发助手
description: |
  辅助 TDesign Web Components 组件库的开发和维护。该组件库基于 Omi 框架开发，API 规范和组件实现需参考 TDesign-React。
  此 skill 应在以下场景使用：
  - 开发新的 TDesign Web Components 组件
  - 维护或修复现有组件
  - 需要确保组件在 Omi 和非 Omi 环境（如 React）中行为一致
  - 需要了解组件的 API 设计规范、类型定义、样式规范
  - 使用 omi-reactify 包装器适配 React 环境
---

# TDesign Web Components 开发助手

## 概述

TDesign Web Components 是腾讯 TDesign 设计系统的 Web Components 实现版本，基于 Omi 框架开发。

**核心要求**：
1. API 设计、Props 命名、类型定义需与 TDesign-React 保持一致
2. 组件在 Omi 和非 Omi 环境（React/Vue/原生 JS）中行为、样式一致
3. 使用 omi-reactify 为非 Omi 环境提供一致的调用方式

---

## 组件目录结构

```
src/[component-name]/
├── [component-name].tsx    # 组件主实现
├── index.ts                # 导出入口
├── type.ts                 # TypeScript 类型定义
├── style/index.js          # 样式导入
└── _example/               # 示例代码
```

---

## 组件实现模板

```tsx
import { Component, tag } from 'omi';
import classname, { getClassPrefix } from '../_util/classname';
import { createEmit } from '../_util/emit';
import { setExportparts } from '../_util/component';
import { TdXxxProps } from './type';
import { StyledProps } from '../common';

export interface XxxProps extends TdXxxProps, StyledProps {}

@tag('t-xxx')
export default class Xxx extends Component<XxxProps> {
  static css = [];
  static propTypes = { theme: String, size: String, disabled: Boolean };
  static defaultProps: Partial<XxxProps> = { size: 'medium', disabled: false };

  private innerValue = '';
  private emit = createEmit(this);

  install() {
    this.innerValue = this.props.value ?? this.props.defaultValue ?? '';
  }

  ready() {
    setExportparts(this);
  }

  receiveProps(props: XxxProps, oldProps: XxxProps) {
    if (props.value !== undefined && props.value !== oldProps.value) {
      this.innerValue = props.value;
    }
  }

  handleClick = (e: MouseEvent) => {
    if (this.props.disabled) return;
    this.props.onClick?.(e);      // Omi 环境
    this.emit('click', { e });     // 非 Omi 环境
  };

  render(props: XxxProps) {
    const classPrefix = getClassPrefix();
    const value = props.value !== undefined ? props.value : this.innerValue;

    return (
      <div
        className={classname(props.className, `${classPrefix}-xxx`, {
          [`${classPrefix}-is-disabled`]: props.disabled,
        })}
        style={props.style}
        onClick={this.handleClick}
      >
        <slot>{props.children}</slot>
      </div>
    );
  }
}
```

---

## 生命周期

| 生命周期 | 触发时机 | 用途 |
|---------|---------|------|
| `install()` | 实例化时（render 前） | 初始化内部状态 |
| `installed()` | 首次 DOM 挂载后 | 添加全局事件监听 |
| `ready()` | DOM 准备就绪 | setExportparts、初始化 Observer |
| `receiveProps(props, old)` | props 变化时 | 同步受控状态 |
| `beforeRender()` | 每次渲染前 | Light DOM 样式注入 |
| `uninstall()` | 组件卸载时 | 清理资源 |

**关键差异**：非 Omi 环境中 `receiveProps` 不会自动调用，受控模式需特别处理。

详见 [references/lifecycle.md](references/lifecycle.md)

---

## 核心工具函数

| 工具 | 用途 | 示例 |
|------|------|------|
| `useControlled` | 受控/非受控模式 | `const [val, onChange] = useControlled(props, 'value', handler, { activeComponent: this })` |
| `parseTNode` | 解析 TNode（函数/组件/字符串） | `parseTNode(props.icon, { size: 'small' })` |
| `hasSlot` / `getSlotNodes` | Slot 检测与获取 | `hasSlot('icon', this.props.children)` |
| `convertToLightDomNode` | Light DOM 模式（插件组件） | `render(convertToLightDomNode(<t-message />), container)` |
| `classname` | 类名生成 | `classname(className, 't-btn', { 't-is-disabled': disabled })` |
| `createEmit` | 事件派发（基于 `fire` 封装） | `this.emit('change', { value, e })` |

详见 [references/utils.md](references/utils.md)

---

## 事件处理

组件需同时支持 Omi 和非 Omi 环境，使用双重派发模式（见组件模板）。

---

## API 设计规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| Props | 小驼峰 | `disabled`, `defaultValue` |
| 事件 | on + 动词 | `onClick`, `onChange` |
| CSS | BEM | `t-button`, `t-is-disabled` |
| 标签 | t- 前缀 | `<t-button>` |

### 受控/非受控

| 受控 | 非受控 | 回调 |
|-----|-------|------|
| `value` | `defaultValue` | `onChange` |
| `visible` | `defaultVisible` | `onVisibleChange` |

---

## 样式规范

样式来自 `_common` 子仓库（tdesign-common）：

```javascript
// style/index.js
import { css, globalCSS } from 'omi';
import styles from '../../_common/style/web/components/xxx/_index.less';
export const styleSheet = css`${styles}`;
globalCSS(styleSheet);
```

CSS 类名规范：`t-{component}`, `t-{component}--{modifier}`, `t-is-{state}`

---

## 跨环境一致性

### omi-reactify 包装器

```tsx
import reactify from 'omi-reactify';
const TButton = reactify<ButtonProps>('t-button');

// React 中使用
<TButton theme="primary" onClick={handleClick}>按钮</TButton>
```

### Slot 声明

有自定义 slot 时需声明 `slotProps`：

```typescript
@tag('t-select')
export default class Select extends Component<SelectProps> {
  static slotProps = ['prefixIcon', 'suffixIcon', 'panel'];
}
```

详见 [references/omi-reactify.md](references/omi-reactify.md)

---

## 参考资料

- [生命周期详解](references/lifecycle.md) - Omi vs 非 Omi 环境差异
- [工具函数详解](references/utils.md) - useControlled、parseTNode、lightDom 等
- [omi-reactify 参考](references/omi-reactify.md) - React 环境适配
- [TDesign-React 模式](references/tdesign-react-patterns.md) - API 对照参考

---

## 开发检查清单

- [ ] Props/类型与 TDesign-React 一致
- [ ] 支持受控/非受控模式
- [ ] 双重事件派发（Props 回调 + emit）
- [ ] 声明 slotProps（如有自定义 slot）
- [ ] ready() 中调用 setExportparts
- [ ] 样式效果与 React 版本一致
