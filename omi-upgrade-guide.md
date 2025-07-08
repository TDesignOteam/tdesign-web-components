# Omi 组件架构升级指南

## 版本对比总结

### 旧版本 (component_old.ts)
- **单一组件类**: 只有一个 `Component` 类
- **渲染模式**: 通过 `static isLightDOM: boolean` 控制
- **样式处理**: 仅支持 Shadow DOM 的 adoptedStyleSheets
- **Slot 支持**: 仅支持原生 `<slot>` 元素

### 新版本 (component.ts)
- **多层次架构**: 
  - `BaseComponent` - 抽象基类
  - `LightDOMComponent` - Light DOM 专用类
  - `ShadowDOMComponent` - Shadow DOM 专用类
  - `Component` - 兼容性类（支持自动模式）
- **渲染模式**: 更精细的控制选项
- **样式处理**: 支持多种样式注入模式
- **Slot 支持**: Light DOM 模式下提供 `renderSlot()` 替代方案

## 核心架构变化

### 1. 类继承结构

**旧版本:**
```typescript
export class Component<State = any> extends HTMLElement {
  static isLightDOM: boolean
  // 所有功能都在一个类中
}
```

**新版本:**
```typescript
// 抽象基类 - 包含所有公共功能
export abstract class BaseComponent<State = any> extends HTMLElement {
  abstract createRenderRoot(): ShadowRoot | BaseComponent
  abstract applyStyles(): void
}

// Light DOM 专用类
export class LightDOMComponent<State = any> extends BaseComponent<State> {
  static styleMode: 'styleTag' | 'none' = 'styleTag'
  protected renderSlot(slotName?: string, fallback?: VNode | VNode[]): VNode | VNode[]
}

// Shadow DOM 专用类
export class ShadowDOMComponent<State = any> extends BaseComponent<State> {
  // 使用原生 slot 和 adoptedStyleSheets
}

// 兼容性类
class Component<State = any> extends BaseComponent<State> {
  static renderMode: 'shadow' | 'light' | 'auto' = 'auto'
  static styleMode: 'adoptedStyleSheets' | 'styleTag' | 'none' = 'adoptedStyleSheets'
  static isLightDOM: boolean // 向后兼容
}
```

### 2. 渲染模式控制

**旧版本:**
```typescript
class MyComponent extends Component {
  static isLightDOM = true // 简单的布尔值控制
}
```

**新版本:**
```typescript
// 方式1: 使用专用类（推荐）
class MyComponent extends LightDOMComponent {
  static styleMode = 'styleTag' // 可选：样式注入模式
}

// 方式2: 使用兼容性类
class MyComponent extends Component {
  static renderMode = 'light' // 'shadow' | 'light' | 'auto'
  static styleMode = 'styleTag' // 'adoptedStyleSheets' | 'styleTag' | 'none'
}
```

### 3. 样式处理方式

**旧版本:**
```typescript
class MyComponent extends Component {
  static css = `
    :host { display: block; }
    .content { color: red; }
  `
  static isLightDOM = true // Light DOM 模式下样式不生效
}
```

**新版本:**
```typescript
class MyComponent extends LightDOMComponent {
  static css = `
    :host { display: block; }
    .content { color: red; }
  `
  static styleMode = 'styleTag' // 自动转换为作用域样式
}
```

### 4. Slot 处理方式

**旧版本:**
```typescript
class MyComponent extends Component {
  static isLightDOM = true
  
  render() {
    return (
      <div>
        <slot name="header"></slot> {/* Light DOM 模式下不工作 */}
        <slot></slot>
      </div>
    )
  }
}
```

**新版本:**
```typescript
class MyComponent extends LightDOMComponent {
  render() {
    return (
      <div>
        {this.renderSlot('header')} {/* 使用 renderSlot 方法 */}
        {this.renderSlot()}
      </div>
    )
  }
}
```

## 升级步骤

### 步骤1: 选择合适的基类

根据组件需求选择合适的基类：

1. **需要样式隔离** → 使用 `ShadowDOMComponent`
2. **需要样式穿透** → 使用 `LightDOMComponent`
3. **需要向后兼容** → 使用 `Component`

### 步骤2: 更新导入语句

**旧版本:**
```typescript
import { Component, tag } from '@omi'
```

**新版本:**
```typescript
// 根据需要选择
import { LightDOMComponent, tag } from '@omi'
// 或
import { ShadowDOMComponent, tag } from '@omi'
// 或
import { Component, tag } from '@omi'
```

### 步骤3: 更新类定义

**旧版本:**
```typescript
@tag('my-component')
export default class MyComponent extends Component {
  static isLightDOM = true
  static css = `/* 样式 */`
}
```

**新版本:**
```typescript
@tag('my-component')
export default class MyComponent extends LightDOMComponent {
  static styleMode = 'styleTag' // 可选
  static css = `/* 样式 */`
}
```

### 步骤4: 更新 Slot 使用

**旧版本:**
```typescript
render() {
  return (
    <div>
      <slot name="icon"></slot>
      <slot></slot>
    </div>
  )
}
```

**新版本:**
```typescript
render() {
  return (
    <div>
      {this.renderSlot('icon')}
      {this.renderSlot()}
    </div>
  )
}
```

### 步骤5: 更新样式作用域

**旧版本:**
```css
/* 在 Light DOM 模式下无效 */
:host {
  display: block;
}
.content {
  color: red;
}
```

**新版本:**
```css
/* 自动转换为作用域样式 */
:host {
  display: block;
}
.content {
  color: red;
}
```

转换后的实际CSS：
```css
my-component {
  display: block;
}
my-component .content {
  color: red;
}
```

## 实际升级示例

### Button 组件升级

**旧版本:**
```typescript
import { Component, tag } from '@omi'

@tag('t-button')
export default class Button extends Component {
  static isLightDOM = true
  static css = [] // 样式在 Light DOM 模式下不生效
  
  render(props) {
    return (
      <button className="t-button">
        <slot name="icon"></slot> {/* 不工作 */}
        <span className="t-button__text">
          <slot></slot> {/* 不工作 */}
        </span>
      </button>
    )
  }
}
```

**新版本:**
```typescript
import { LightDOMComponent, tag } from '@omi'

@tag('t-button')
export default class Button extends LightDOMComponent {
  static styleMode = 'styleTag' // 样式自动作用域化
  static css = [] // 现在可以正常工作
  
  render(props) {
    return (
      <button className="t-button">
        {this.renderSlot('icon')} {/* 工作正常 */}
        <span className="t-button__text">
          {this.renderSlot()} {/* 工作正常 */}
        </span>
      </button>
    )
  }
}
```

### 复杂组件升级

**旧版本:**
```typescript
@tag('complex-component')
export default class ComplexComponent extends Component {
  static isLightDOM = true
  static css = `
    :host { display: block; }
    .header { background: blue; }
    .content { padding: 16px; }
  `
  
  render() {
    return (
      <div>
        <div className="header">
          <slot name="title">默认标题</slot>
        </div>
        <div className="content">
          <slot></slot>
        </div>
        <div className="footer">
          <slot name="actions"></slot>
        </div>
      </div>
    )
  }
}
```

**新版本:**
```typescript
@tag('complex-component')
export default class ComplexComponent extends LightDOMComponent {
  static styleMode = 'styleTag'
  static css = `
    :host { display: block; }
    .header { background: blue; }
    .content { padding: 16px; }
  `
  
  render() {
    return (
      <div>
        <div className="header">
          {this.renderSlot('title', '默认标题')}
        </div>
        <div className="content">
          {this.renderSlot()}
        </div>
        <div className="footer">
          {this.renderSlot('actions')}
        </div>
      </div>
    )
  }
}
```

## 使用建议

### 1. 选择合适的基类
- **UI 组件库**: 推荐使用 `LightDOMComponent`，便于样式定制
- **独立组件**: 根据是否需要样式隔离选择
- **向后兼容**: 使用 `Component` 类

### 2. 样式策略
- **styleTag 模式**: 适合大多数场景，自动作用域化
- **none 模式**: 适合纯逻辑组件或使用外部样式

### 3. Slot 使用
- 使用 `renderSlot()` 方法替代 `<slot>` 元素
- 支持回退内容：`this.renderSlot('name', fallbackContent)`
- 默认 slot：`this.renderSlot()`

### 4. 渐进式升级
- 先升级简单组件验证
- 逐步升级复杂组件
- 保持向后兼容性

## 注意事项

1. **类型安全**: 新版本提供更好的 TypeScript 支持
2. **性能优化**: Light DOM 模式下减少了 Shadow DOM 开销
3. **样式隔离**: 自动作用域化避免样式冲突
4. **调试友好**: Light DOM 模式下更容易调试和检查元素

通过这些升级步骤，可以充分利用新版本 Omi 的优势，实现更好的组件开发体验。 