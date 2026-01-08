# omi-reactify 包装器参考

## 概述

`omi-reactify` 是一个将 Web Components 包装为 React 组件的工具，确保 TDesign Web Components 在 React 环境中能够正常工作。

## 核心功能

### 1. 事件处理

将 React 的 `onXxx` 事件转换为 Web Component 的原生事件监听：

```typescript
// React 中使用
<TButton onClick={(e) => console.log(e)}>按钮</TButton>

// 内部转换
// onClick -> 监听 'click' 事件
// onValueChange -> 监听 'valueChange' 事件
```

**转换规则：**
- `onXxx` -> 监听 `xxx` 事件（首字母小写）
- 事件名保持驼峰命名

### 2. Slot 处理

将 React 组件渲染到 Web Component 的 `<slot>` 中：

```typescript
// React 中使用
<TSelect prefixIcon={<Icon />} />

// 内部处理
// 1. 检测 prefixIcon 是 React 元素
// 2. 创建 <div slot="prefix-icon"> 容器
// 3. 使用 createRoot 将 React 组件渲染到容器中
```

**Slot 检测逻辑：**
1. 组件类上声明的 `slotProps`
2. prop 名以 `Slot` 结尾
3. shadow DOM 中存在对应的 `<slot name="xxx">`

### 3. Props 传递

根据 prop 类型选择不同的传递方式：

| 类型 | 传递方式 |
|------|---------|
| string/number/boolean | HTML attribute |
| object/array | DOM property |
| function（非事件） | DOM property |
| style 对象 | 转换为字符串后设置 attribute |

### 4. Ref 转发

支持 React ref 获取底层 Web Component 元素：

```typescript
const buttonRef = useRef<HTMLElement>(null);
<TButton ref={buttonRef}>按钮</TButton>

// buttonRef.current 指向 <t-button> 元素
```

## 源码关键实现

### reactify 函数签名

```typescript
const reactify = <T extends AnyProps = AnyProps>(
  WC: string  // Web Component 标签名
): React.ForwardRefExoticComponent<...>
```

### 事件处理实现

```typescript
// 检测事件处理器
if (typeof val === 'function' && prop.match(/^on[A-Za-z]/)) {
  const eventName = prop.slice(2);  // 去掉 'on'
  const omiEventName = eventName[0].toLowerCase() + eventName.slice(1);
  this.setEvent(omiEventName, val as EventListener);
  return;
}
```

### Slot 渲染实现

```typescript
renderReactNodeToSlot(reactNode: React.ReactNode, slotName: string) {
  // 1. 获取或创建 slot 容器
  let container = webComponent.querySelector(`[slot="${slotName}"]`);
  if (!container) {
    container = document.createElement('div');
    container.style.display = 'contents';
    container.setAttribute('slot', slotName);
    webComponent.appendChild(container);
  }

  // 2. 使用 React 18 的 createRoot 渲染
  const root = createRoot(container);
  root.render(reactNode);
}
```

### 样式对象转换

```typescript
const styleObjectToString = (style: any) => {
  if (typeof style === 'string') return style;
  return Object.keys(style)
    .reduce((acc, key) => {
      const cssKey = key.replace(/\B([A-Z])/g, '-$1').toLowerCase();
      return acc.concat(`${cssKey}:${style[key]}`);
    }, [])
    .join(';');
};
```

## 组件开发注意事项

### 1. 声明 slotProps

如果组件有自定义 slot，需要在组件类上声明：

```typescript
@tag('t-select')
export default class Select extends Component<SelectProps> {
  // 声明哪些 props 应该作为 slot 处理
  static slotProps = ['prefixIcon', 'suffixIcon', 'panel', 'empty'];
}
```

### 2. 事件命名一致性

确保组件派发的事件名与 React 约定一致：

```typescript
// 组件内部
this.emit('change', { value });  // 派发 'change' 事件

// React 中使用
<TInput onChange={(detail) => console.log(detail.value)} />
```

### 3. 函数类型 Slot

支持函数类型的 slot（用于动态内容）：

```typescript
// React 中使用
<TSelect 
  panelContent={(options) => (
    <div>{options.map(opt => <div key={opt.value}>{opt.label}</div>)}</div>
  )} 
/>

// 组件内部处理
if (typeof val === 'function') {
  webComponent[prop] = (params) => {
    const reactNode = val(params);
    return this.renderReactNodeToSlot(reactNode, prop);
  };
}
```

### 4. React 19 兼容性

omi-reactify 检测 React 版本并适配：

```typescript
const isReact19Plus = () => {
  const version = React.version.split('.')[0];
  return parseInt(version, 10) >= 19;
};

// React 19+ 某些属性可以直接通过 attribute 传递
if (!isReact19Plus()) {
  (this.ref.current as any)[prop] = val;
}
```

## 使用示例

### 基础使用

```tsx
import reactify from 'omi-reactify';
import 'tdesign-web-components/lib/button';

const TButton = reactify<ButtonProps>('t-button');

function App() {
  return (
    <TButton 
      theme="primary" 
      size="large"
      onClick={() => console.log('clicked')}
    >
      按钮
    </TButton>
  );
}
```

### 带 Slot 的组件

```tsx
import reactify from 'omi-reactify';
import 'tdesign-web-components/lib/input';

const TInput = reactify<InputProps>('t-input');

function App() {
  return (
    <TInput 
      placeholder="请输入"
      prefixIcon={<SearchIcon />}
      suffixIcon={<ClearIcon />}
      onChange={(detail) => console.log(detail.value)}
    />
  );
}
```

### 受控组件

```tsx
import { useState } from 'react';
import reactify from 'omi-reactify';

const TInput = reactify<InputProps>('t-input');

function App() {
  const [value, setValue] = useState('');

  return (
    <TInput 
      value={value}
      onChange={(detail) => setValue(detail.value)}
    />
  );
}
```

## 调试技巧

### 1. 检查 Slot 是否正确挂载

```javascript
const el = document.querySelector('t-select');
console.log(el.querySelectorAll('[slot]'));  // 查看所有 slot 容器
```

### 2. 检查事件监听

```javascript
const el = document.querySelector('t-button');
// 使用 Chrome DevTools 的 Event Listeners 面板查看
```

### 3. 检查 Props 传递

```javascript
const el = document.querySelector('t-input');
console.log({
  value: el.value,
  disabled: el.disabled,
  // 检查 DOM property 而非 attribute
});
```
