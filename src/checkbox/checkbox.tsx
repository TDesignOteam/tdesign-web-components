import { clsx } from 'clsx';
import { Component, createRef, signal, tag } from 'omi';
import { StyledProps } from 'tdesign-web-components/common.ts';

import { getClassPrefix } from '../_util/classname';
import { TdCheckboxProps } from './type';

export const CheckboxContextKey = 'CheckboxContextKey';

export interface CheckboxProps extends TdCheckboxProps, StyledProps {}

@tag('t-checkbox')
export default class Checkbox extends Component<CheckboxProps> {
  static propTypes = {
    checkAll: Boolean,
    checked: Boolean,
    defaultChecked: Boolean,
    disabled: Boolean,
    indeterminate: Boolean,
    label: [String, Number, Object, Function],
    children: [String, Number, Object, Function],
    readonly: Boolean,
    value: [String, Number, Boolean],
    onChange: Function,
  };

  static defaultProps = {
    defaultChecked: undefined,
    checked: undefined,
    disabled: undefined,
    indeterminate: false,
    readonly: undefined,
  };

  inject = [CheckboxContextKey];

  labelRef = createRef<HTMLElement>();

  innerChecked = signal(false);

  get injectionProps() {
    return this.injection[CheckboxContextKey]?.();
  }

  get isControlled() {
    const { value } = this.props;
    return typeof value !== 'undefined';
  }

  get tChecked() {
    if (this.props.checkAll) return this.injectionProps?.isCheckAll;
    if (this.injectionProps?.checkedValues) return this.injectionProps?.checkedValues?.includes(this.props.value);
    return this.props.checked ?? this.innerChecked.value;
  }

  get tIndeterminate() {
    return this.props.checkAll ? this.injectionProps?.indeterminate : this.props.indeterminate;
  }

  get isDisabled() {
    if (!this.props.checkAll && !this.tChecked && this.injectionProps?.maxExceeded) {
      return true;
    }
    if (this.props.disabled) {
      return true;
    }
    if (this.injectionProps?.disabled) {
      return true;
    }
    return false;
  }

  get isReadonly() {
    if (this.props.readonly) {
      return true;
    }
    if (this.injectionProps?.readonly) {
      return true;
    }
    return false;
  }

  get showLabel() {
    return this.props.children || this.props.label;
  }

  setInnerChecked = (value: boolean, context: { e: Event }) => {
    this.innerChecked.value = value;
    this.props.onChange?.(value, context);
  };

  handleChange = (e: Event) => {
    if (this.isReadonly) return;
    const checked = !this.tChecked;
    this.setInnerChecked(checked, { e });
    if (this.injectionProps?.handleCheckboxChange) {
      this.injectionProps?.onCheckedChange({ checked, checkAll: this.props.checkAll, e, option: this.props });
    }
  };

  install() {
    const { checked, defaultChecked } = this.props;
    if (this.isControlled) {
      this.innerChecked.value = checked;
    } else if (typeof defaultChecked !== 'undefined') {
      this.innerChecked.value = defaultChecked;
    }
  }

  render() {
    const { className, value, label, children } = this.props;
    const classPrefix = getClassPrefix();

    const labelClassName = clsx(`${classPrefix}-checkbox`, className, {
      [`${classPrefix}-is-checked`]: this.tChecked,
      [`${classPrefix}-is-disabled`]: this.isDisabled,
      [`${classPrefix}-is-indeterminate`]: this.tIndeterminate,
    });

    return (
      <label ref={this.labelRef} class={labelClassName} tabindex={this.isDisabled ? undefined : '0'}>
        <input
          type="checkbox"
          class={`${classPrefix}-checkbox__former`}
          disabled={this.isDisabled}
          readonly={this.isReadonly}
          value={value as string}
          checked={this.tChecked}
          onChange={this.handleChange}
        />
        <span className={`${classPrefix}-checkbox__input`} />
        {this.showLabel && (
          <span key="label" className={`${classPrefix}-checkbox__label`}>
            {children || label}
          </span>
        )}
      </label>
    );
  }
}
