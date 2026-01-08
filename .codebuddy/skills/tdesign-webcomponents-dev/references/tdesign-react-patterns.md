# TDesign-React 组件模式参考

## 概述

TDesign Web Components 的 API 设计和组件实现需要参考 TDesign-React。本文档总结了 React 版本的关键模式，供开发时对照。

## 组件基本模式

### React 版本标准结构

```tsx
import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdButtonProps } from './type';
import { buttonDefaultProps } from './defaultProps';

export interface ButtonProps
  extends TdButtonProps,
    Omit<React.AllHTMLAttributes<HTMLElement>, 'content' | 'type'> {}

const Button = forwardRef((originProps: ButtonProps, ref) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);
  const { classPrefix } = useConfig();
  const { theme, variant, disabled, children, className, ...rest } = props;

  const buttonClass = classNames(
    className,
    `${classPrefix}-button`,
    `${classPrefix}-button--theme-${theme}`,
    { [`${classPrefix}-is-disabled`]: disabled }
  );

  return (
    <button ref={ref} className={buttonClass} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

### Web Components 对应实现

```tsx
import { Component, tag } from 'omi';
import classname, { getClassPrefix } from '../_util/classname';
import { TdButtonProps } from './type';
import { StyledProps } from '../common';

export interface ButtonProps extends TdButtonProps, StyledProps {}

@tag('t-button')
export default class Button extends Component<ButtonProps> {
  static propTypes = {
    theme: String,
    variant: String,
    disabled: Boolean,
  };

  static defaultProps: Partial<ButtonProps> = {
    variant: 'base',
    size: 'medium',
    disabled: false,
  };

  render(props: ButtonProps) {
    const classPrefix = getClassPrefix();
    const { theme, variant, disabled, children, className } = props;

    const buttonClass = classname(
      className,
      `${classPrefix}-button`,
      `${classPrefix}-button--theme-${theme}`,
      { [`${classPrefix}-is-disabled`]: disabled }
    );

    return (
      <button className={buttonClass}>
        <slot>{children}</slot>
      </button>
    );
  }
}
```

## 受控/非受控模式

### React 版本：useControlled Hook

```typescript
// React 版本使用 useControlled hook
const [value, onChange] = useControlled(props, 'value', props.onChange);

// useControlled 实现
const useControlled = (props, valueKey, onChange, defaultOptions = {}) => {
  const controlled = Reflect.has(props, valueKey);
  const value = props[valueKey];
  const defaultValue = props[`default${upperFirst(valueKey)}`];
  
  const [internalValue, setInternalValue] = useState(defaultValue);

  if (controlled) return [value, onChange || noop];

  return [
    internalValue,
    (newValue, ...args) => {
      setInternalValue(newValue);
      onChange?.(newValue, ...args);
    },
  ];
};
```

### Web Components 对应实现

```typescript
@tag('t-input')
export default class Input extends Component<InputProps> {
  // 内部状态
  private internalValue: string = '';
  
  // 判断是否受控
  private get isControlled() {
    return this.props.value !== undefined;
  }
  
  // 获取当前值
  private get currentValue() {
    return this.isControlled ? this.props.value : this.internalValue;
  }

  install() {
    // 初始化内部值
    this.internalValue = this.props.defaultValue ?? '';
  }

  handleChange = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    
    // 非受控模式：更新内部状态
    if (!this.isControlled) {
      this.internalValue = newValue;
      this.update();
    }
    
    // 触发回调
    this.props.onChange?.(newValue, { e });
    this.emit('change', { value: newValue, e });
  };

  render() {
    return <input value={this.currentValue} onInput={this.handleChange} />;
  }
}
```

## 复合组件模式

### React 版本：forwardRefWithStatics

```tsx
// React 版本
import forwardRefWithStatics from '../_util/forwardRefWithStatics';

const Select = forwardRefWithStatics(
  (props: SelectProps, ref) => {
    // 组件实现
  },
  { Option, OptionGroup }  // 静态属性
);

// 使用
<Select.Option value="1">选项1</Select.Option>
```

### Web Components 对应实现

```typescript
// 主组件
@tag('t-select')
export default class Select extends Component<SelectProps> {
  // ...
}

// 子组件
@tag('t-option')
export class Option extends Component<OptionProps> {
  // ...
}

@tag('t-option-group')
export class OptionGroup extends Component<OptionGroupProps> {
  // ...
}

// 导出
export { Select, Option, OptionGroup };
export default Select;

// 使用
<t-select>
  <t-option value="1">选项1</t-option>
</t-select>
```

## 通用类型定义

### common.ts 对照

```typescript
// React 版本
export type TNode<T = undefined> = T extends undefined 
  ? ReactNode 
  : ReactNode | ((props: T) => ReactNode);

export type TElement<T = undefined> = T extends undefined 
  ? ReactElement 
  : (props: T) => ReactElement;

// Web Components 版本
import { VNode, WeElement } from 'omi';

export type TNode<T = any> = VNode<T> | ((props: T) => VNode) | object | string | number | boolean | null;

export type TElement<T = undefined> = T extends undefined 
  ? WeElement 
  : (props: T) => WeElement;
```

### 尺寸和状态枚举

```typescript
// 两个版本保持一致
export type SizeEnum = 'small' | 'medium' | 'large';

export interface StyledProps {
  className?: string;
  style?: CSSProperties | string;
}
```

## Hooks 对应实现

### useConfig -> getClassPrefix

```typescript
// React
const { classPrefix } = useConfig();

// Web Components
import { getClassPrefix } from '../_util/classname';
const classPrefix = getClassPrefix();  // 't'
```

### useGlobalIcon -> 直接使用 Icon 组件

```typescript
// React
const { CloseIcon } = useGlobalIcon({ CloseIcon: TdCloseIcon });

// Web Components
import 'tdesign-icons-web-components/esm/components/close';
// 直接使用 <t-icon-close />
```

### useRipple -> CSS 实现

```typescript
// React 使用 JS 实现波纹效果
useRipple(ref?.current);

// Web Components 通过 CSS 实现
// 样式已包含在 _common/style 中
```

## 事件回调签名

### 保持一致的签名

```typescript
// 简单事件
onClick?: (e: MouseEvent) => void;

// 带值变更
onChange?: (value: T, context: { e: Event }) => void;

// 复杂上下文
onChange?: (
  value: SelectValue,
  context: {
    option?: T;
    selectedOptions: T[];
    trigger: SelectValueChangeTrigger;
    e?: MouseEvent | KeyboardEvent;
  }
) => void;
```

## 类名生成对照

### React 版本

```typescript
import classNames from 'classnames';

const buttonClass = classNames(
  className,
  `${classPrefix}-button`,
  `${classPrefix}-button--theme-${theme}`,
  {
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-loading`]: loading,
  }
);
```

### Web Components 版本

```typescript
import classname from '../_util/classname';

const buttonClass = classname(
  className,
  `${classPrefix}-button`,
  `${classPrefix}-button--theme-${theme}`,
  {
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-loading`]: loading,
  }
);
```

## 插件模式（命令式调用）

### React 版本

```typescript
// DialogPlugin
const dialog = DialogPlugin.confirm({
  header: '标题',
  body: '内容',
  onConfirm: () => {},
});

dialog.show();
dialog.hide();
dialog.destroy();
```

### Web Components 版本

```typescript
// 通过 JS API 实现
import { DialogPlugin } from 'tdesign-web-components';

const dialog = DialogPlugin.confirm({
  header: '标题',
  body: '内容',
  onConfirm: () => {},
});
```

## 开发检查清单

开发新组件时，对照 React 版本检查：

### Props 一致性
- [ ] Props 名称相同
- [ ] Props 类型相同
- [ ] 默认值相同
- [ ] 必填/可选一致

### 事件一致性
- [ ] 事件名称相同
- [ ] 回调签名相同
- [ ] context 参数一致

### 功能一致性
- [ ] 受控/非受控模式
- [ ] 键盘交互
- [ ] 无障碍支持

### 样式一致性
- [ ] 类名生成逻辑相同
- [ ] 状态类名相同
- [ ] 视觉效果一致
