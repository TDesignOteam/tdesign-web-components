# 核心工具函数详解

## useControlled - 受控/非受控模式

处理组件的受控/非受控双模式，自动判断并维护状态。

### 基本用法

```typescript
import useControlled from '../_util/useControlled';

@tag('t-input')
export default class Input extends Component<InputProps> {
  render(props: InputProps) {
    const [value, onChange] = useControlled(props, 'value', this.handleChange, {
      defaultValue: props.defaultValue,
      activeComponent: this,  // 传入组件实例以支持响应式
    });

    return <input value={value} onInput={(e) => onChange(e.target.value, { e })} />;
  }

  handleChange = (value: string, context: { e: Event }) => {
    this.props.onChange?.(value, context);
    this.emit('change', { value, e: context.e });
  };
}
```

### 工作原理

1. 通过 `Reflect.has(props, valueKey)` 判断是否受控
2. **受控模式**：直接返回 `props.value`
3. **非受控模式**：使用 `signal` 维护内部状态，初始值为 `defaultValue`

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `props` | object | 组件 props |
| `valueKey` | string | 受控属性名（如 'value'） |
| `onChange` | function | 值变更回调 |
| `options.defaultValue` | any | 默认值 |
| `options.activeComponent` | Component | 组件实例（用于触发更新） |

---

## parseTNode - TNode 解析

解析 TNode 类型（函数/组件/字符串），统一处理自定义内容渲染。

### 基本用法

```typescript
import parseTNode, { parseContentTNode } from '../_util/parseTNode';

// 基础解析：处理函数类型的 TNode
const node = parseTNode(props.icon, { size: 'small' });

// 带 props 注入的解析：支持组件类型
const content = parseContentTNode(props.content, { disabled: true });
```

### 支持的类型

| 类型 | 示例 | 处理方式 |
|------|------|---------|
| 函数 | `content={(props) => <Icon {...props} />}` | 调用函数获取节点 |
| 组件 | `content={<Button>click</Button>}` | 使用 `cloneElement` 注入 props |
| 基础类型 | 字符串、数字、布尔值 | 直接返回 |

### parseTNode vs parseContentTNode

- `parseTNode`：仅处理函数类型，传入参数调用
- `parseContentTNode`：额外支持组件类型，会注入 props

---

## component 工具 - Slot 处理

处理 Web Components 的 slot 相关操作。

### hasSlot - 检测 slot 是否存在

```typescript
import { hasSlot } from '../_util/component';

if (hasSlot('icon', this.props.children)) {
  // 渲染带 icon 的布局
}
```

### getSlotNodes - 获取所有 slot 节点

```typescript
import { getSlotNodes } from '../_util/component';

const slotNodes = getSlotNodes(this.props.children);
// 返回 { default: [...], icon: [...], ... }
```

### convertNodeListToVNodes - DOM 转 VNode

```typescript
import { convertNodeListToVNodes } from '../_util/component';

// 将 DOM NodeList 转换为 VNode（带缓存优化）
const vnodes = convertNodeListToVNodes(element.childNodes);
```

### getChildrenArray - children 转数组

```typescript
import { getChildrenArray } from '../_util/component';

const childrenArray = getChildrenArray(this.props.children);
```

### setExportparts - 导出 Shadow DOM parts

```typescript
import { setExportparts } from '../_util/component';

ready() {
  setExportparts(this);  // 允许外部样式穿透 Shadow DOM
}
```

---

## convertToLightDomNode - Light DOM 支持

将 Shadow DOM 组件转换为 Light DOM 模式，用于需要样式穿透的场景。

### 基本用法

```typescript
import { convertToLightDomNode } from '../_util/lightDom';

// 典型场景：Message、Notification 等需要挂载到 body 的组件
render(
  convertToLightDomNode(
    <t-message theme="success">操作成功</t-message>
  ),
  container
);
```

### 工作原理

1. 继承原组件构建 `isLightDOM = true` 的新组件
2. 在 `beforeRender` 中将样式表合并到父级 ShadowRoot 或 document
3. 注册为 `{tagName}-light-dom` 的新组件

### 使用场景

- 插件式组件（DialogPlugin、MessagePlugin、NotificationPlugin）
- 需要脱离当前 Shadow DOM 渲染的场景
- Portal 类组件

---

## classname - 类名生成

```typescript
import classname, { getClassPrefix } from '../_util/classname';

const classPrefix = getClassPrefix();  // 't'
const cls = classname(
  className,                              // 外部传入的 className
  `${classPrefix}-button`,                // 基础类名
  `${classPrefix}-button--theme-${theme}`, // 修饰符
  {
    [`${classPrefix}-is-disabled`]: disabled,  // 条件类名
    [`${classPrefix}-is-loading`]: loading,
  }
);
```

---

## createEmit - 事件派发（fire 的封装）

`emit` 是 Omi 原生 `fire` 的封装，自动检测环境：Omi 环境跳过派发，非 Omi 环境调用 `fire()`。

```typescript
private emit = createEmit(this);

handleChange = (e: Event) => {
  this.props.onChange?.(value, { e });  // Omi 环境
  this.emit('change', { value, e });     // 非 Omi 环境
};
```

**不要同时使用 `emit` 和 `fire`**。
