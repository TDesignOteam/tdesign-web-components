import { clsx } from 'clsx';
import { Component, createRef, signal, tag } from 'omi';
import { StyledProps } from 'tdesign-web-components/common.ts';

import { getClassPrefix } from '../_util/classname';
import { TdCheckboxProps } from './type';

export interface CheckboxProps extends TdCheckboxProps, StyledProps {}

@tag('t-checkbox')
export default class Checkbox extends Component<CheckboxProps> {
  static defaultProps = {
    defaultChecked: undefined,
    checked: undefined,
    disabled: undefined,
    indeterminate: false,
    readonly: undefined,
  };

  inject = [
    'name',
    'isCheckAll',
    'checkedValues',
    'maxExceeded',
    'disabled',
    'readonly',
    'indeterminate',
    'handleCheckboxChange',
    'onCheckedChange',
  ];

  labelRef = createRef<HTMLElement>();

  innerChecked = signal(false);

  get isControlled() {
    const { value } = this.props;
    return typeof value !== 'undefined';
  }

  get tChecked() {
    return this.props.checked ?? this.innerChecked.value;
  }

  get tIndeterminate() {
    return this.props.checkAll ? this.injection.indeterminate : this.props.indeterminate;
  }

  get isDisabled() {
    if (!this.props.checkAll && !this.tChecked && this.injection.maxExceeded) {
      return true;
    }
    if (this.props.disabled) {
      return true;
    }
    if (this.injection.disabled?.value) {
      console.log(this.injection.disabled);
      return true;
    }
    return false;
  }

  get isReadonly() {
    if (this.props.readonly) {
      return true;
    }
    if (this.injection.readonly) {
      return true;
    }
    return false;
  }

  setInnerChecked = (value: boolean, context: { e: Event }) => {
    this.innerChecked.value = value;
    this.props.onChange?.(value, context);
  };

  handleChange = (e: Event) => {
    if (this.isReadonly) return;
    const checked = !this.tChecked;
    this.setInnerChecked(checked, { e });
    if (this.injection.handleCheckboxChange) {
      this.injection.handleCheckboxChange({ checked, checkAll: this.props.checkAll, e, option: this.props });
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
    const { className, value, label } = this.props;
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
        {label && (
          <span key="label" className={`${classPrefix}-checkbox__label`}>
            {label}
          </span>
        )}
      </label>
    );
  }
}
