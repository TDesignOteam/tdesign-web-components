import { isBoolean, omit } from 'lodash';
import { classNames, Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { TdCheckboxProps } from '../checkbox/type';
import { StyledProps, TNode } from '../common';

export interface CheckProps extends TdCheckboxProps, StyledProps {
  type: 'radio' | 'radio-button' | 'checkbox';
  allowUncheck?: boolean;
  title?: string;
  content?: TNode;
  children?: TNode;
  stopLabelTrigger?: Boolean;
}

export const CheckContextKey = '_check';
export type CheckContextInjection = (props: CheckProps) => CheckProps;

@tag('t-check')
export default class Check extends Component<CheckProps> {
  static propTypes = {
    type: String,
    allowUncheck: Boolean,
    title: String,
    content: [String, Number, Object, Function],
    children: [String, Number, Object, Function],
    stopLabelTrigger: Boolean,
    checkAll: Boolean,
    checked: Boolean,
    defaultChecked: Boolean,
    disabled: Boolean,
    indeterminate: Boolean,
    label: [String, Number, Object, Function],
    name: String,
    readonly: Boolean,
    value: [String, Number, Boolean],
    onChange: Function,
    onClick: Function,
  };

  private pChecked;

  classPrefix = getClassPrefix();

  inject = [CheckContextKey];

  injectProps: CheckProps;

  get afterProps() {
    return this.injectProps ? this.injectProps : this.props;
  }

  get labelClassName() {
    return classNames(`${this.classPrefix}-${this.afterProps.type}`, this.afterProps.className, {
      [`${this.classPrefix}-is-checked`]: this.internalChecked,
      [`${this.classPrefix}-is-disabled`]: this.afterProps.disabled,
      [`${this.classPrefix}-is-indeterminate`]: this.afterProps.indeterminate,
    });
  }

  // Checkbox/ Radio 内容为空则不再渲染 span，不存在 0:Number 的情况
  get showLabel() {
    return !!(this.afterProps.content || this.afterProps.children || this.afterProps.label);
  }

  get internalChecked() {
    if (this.afterProps.checked !== undefined) return this.afterProps.checked;
    return this.pChecked;
  }

  install(): void {
    this.pChecked = this.afterProps.checked || this.afterProps.defaultChecked;
    this.injectProps = (this.injection[CheckContextKey] as CheckContextInjection | undefined)?.(this.props);
  }

  setInternalChecked = (checked: boolean, context?: { e: Event | MouseEvent }) => {
    this.pChecked = checked;

    this.afterProps?.onChange?.(checked, context);
    this.update();
  };

  handleLabelClick = (event: MouseEvent) => {
    // 在tree等组件中使用  阻止label触发checked 与expand冲突
    if (this.afterProps.stopLabelTrigger) {
      event.preventDefault();
    }
  };

  onInnerClick = (e: MouseEvent) => {
    this.afterProps.onClick?.({ e });
  };

  get input() {
    return (
      <input
        readOnly={this.afterProps.readonly}
        type={this.afterProps.type === 'radio-button' ? 'radio' : this.afterProps.type}
        className={`${this.classPrefix}-${this.afterProps.type}__former`}
        checked={this.internalChecked}
        disabled={this.afterProps.disabled}
        name={this.afterProps.name}
        tabIndex={-1}
        value={isBoolean(this.afterProps.value) ? Number(this.afterProps.value) : this.afterProps.value}
        data-value={typeof this.afterProps.value === 'string' ? `'${this.afterProps.value}'` : this.afterProps.value}
        data-allow-uncheck={this.afterProps.allowUncheck || undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (
            (this.afterProps.type === 'radio-button' || this.afterProps.type === 'radio') &&
            this.afterProps.allowUncheck &&
            this.internalChecked
          ) {
            this.setInternalChecked(!(e.currentTarget as HTMLInputElement).checked, { e });
          }
        }}
        onChange={(e) => this.setInternalChecked((e.currentTarget as HTMLInputElement).checked, { e })}
      />
    );
  }

  render() {
    const { type, value, label, content, children, disabled, title, style, ...rest } = this.afterProps;

    return (
      <label
        tabIndex={disabled ? undefined : 0}
        className={this.labelClassName}
        title={title}
        style={style}
        value={isBoolean(value) ? String(value) : value}
        {...omit(rest, ['checkAll', 'stopLabelTrigger', 'onChange'])}
        onClick={this.onInnerClick}
      >
        {this.input}
        <span className={`${this.classPrefix}-${type}__input`} />
        {this.showLabel && (
          <span key="label" className={`${this.classPrefix}-${type}__label`} onClick={this.handleLabelClick}>
            {content || children || label}
          </span>
        )}
      </label>
    );
  }
}
