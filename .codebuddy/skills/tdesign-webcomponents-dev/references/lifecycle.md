# 组件生命周期详解

## Omi 生命周期方法

| 生命周期 | 触发时机 | 典型用途 |
|---------|---------|---------|
| `install()` | 组件实例化时（render 前） | 初始化内部状态、设置默认值 |
| `installed()` | 首次 DOM 挂载后 | 启动定时器、添加全局事件监听 |
| `ready()` | DOM 准备就绪 | 设置 exportparts、初始化 Observer |
| `receiveProps(props, oldProps)` | props 变化时 | 同步受控状态、响应外部变化 |
| `beforeRender()` | 每次渲染前 | Light DOM 样式注入 |
| `rendered()` | 每次渲染后 | 更新 ResizeObserver |
| `uninstall()` | 组件卸载时 | 清理定时器、移除监听、断开 Observer |

---

## 完整生命周期示例

```typescript
@tag('t-xxx')
export default class Xxx extends Component<XxxProps> {
  private innerValue: string = '';
  private resizeObserver: ResizeObserver | null = null;
  private emit = createEmit(this);

  // 1. 初始化（render 前）
  install() {
    this.innerValue = this.props.value ?? this.props.defaultValue ?? '';
  }

  // 2. DOM 挂载后
  installed() {
    window.addEventListener('resize', this.handleResize);
  }

  // 3. DOM 准备就绪
  ready() {
    setExportparts(this);
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this);
  }

  // 4. Props 变化响应（关键：受控模式同步）
  receiveProps(props: XxxProps, oldProps: XxxProps) {
    if (props.value !== undefined && props.value !== oldProps.value) {
      this.innerValue = props.value;
    }
  }

  // 5. 渲染前（Light DOM 场景）
  beforeRender() {
    // Light DOM 样式注入逻辑
  }

  // 6. 渲染后
  rendered() {
    // 更新 Observer 等
  }

  // 7. 组件卸载清理
  uninstall() {
    window.removeEventListener('resize', this.handleResize);
    this.resizeObserver?.disconnect();
  }

  render(props: XxxProps) {
    const currentValue = props.value !== undefined ? props.value : this.innerValue;
    // ...
  }
}
```

---

## Omi vs 非 Omi 环境差异

| 场景 | Omi 环境 | 非 Omi 环境（React/Vue/原生） |
|------|---------|---------------------------|
| Props 传递 | 直接通过 JSX 属性 | 通过 DOM property/attribute |
| Props 变化 | `receiveProps` 自动触发 | 需要外部重新设置 property |
| 事件处理 | `this.props.onClick?.()` | 通过 `addEventListener` 监听 |
| 事件派发 | 无需额外处理 | 必须调用 `this.emit()` 派发原生事件 |
| 状态更新 | `this.update()` 触发重渲染 | 同左，但需确保事件已派发 |

---

## 关键注意事项

### 1. 非 Omi 环境的 receiveProps

在非 Omi 环境中，`receiveProps` **不会被自动调用**。这意味着：

- 受控模式下，外部通过 DOM property 设置 `value` 时，组件不会自动响应
- 需要依赖 `useControlled` 工具或手动处理

### 2. 受控模式实现要点

```typescript
// 判断是否受控
const isControlled = props.value !== undefined;

// 获取当前值
const currentValue = isControlled ? props.value : this.innerValue;

// 值变更时
handleChange = (newValue) => {
  if (!isControlled) {
    this.innerValue = newValue;
    this.update();
  }
  this.props.onChange?.(newValue);
  this.emit('change', { value: newValue });
};
```

### 3. 清理资源

`uninstall()` 中必须清理：
- 全局事件监听（window/document）
- 定时器（setTimeout/setInterval）
- Observer（ResizeObserver/MutationObserver/IntersectionObserver）
- 外部订阅
