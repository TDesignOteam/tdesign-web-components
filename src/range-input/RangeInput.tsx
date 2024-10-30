import 'tdesign-icons-web-components';
import '../input';
import './RangeInputInner';

import { bind, classNames, Component, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { RangeInputPosition, RangeInputValue, TdRangeInputProps } from './type';

export interface RangeInputProps extends TdRangeInputProps, StyledProps {}

function calcArrayValue<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value, value];
}

@tag('t-range-input')
export default class RangeInput extends Component<RangeInputProps> {
  static css = `
    .${getClassPrefix()}-range-input__inner-left,
    .${getClassPrefix()}-range-input__inner-right {
      width: 100%;
      height: 100%;
      border-radius: var(--td-radius-small);
    }

    .${getClassPrefix()}-range-input__suffix-clear.${getClassPrefix()}-icon {
      display: flex;
    }
  `;

  static defaultProps: TdRangeInputProps = {
    clearable: false,
    readonly: false,
    separator: '-',
    size: 'medium',
    status: 'default',
    defaultValue: [],
  };

  static propTypes = {
    activeIndex: Number,
    clearable: Boolean,
    disabled: Boolean,
    format: [Function, Array],
    placeholder: [String, Array],
    readonly: Boolean,
    separator: Object,
    size: String,
    status: String,
    value: Array,
    defaultValue: Array,
    onBlur: Function,
    onChange: Function,
    onFocus: Function,
    onMouseenter: Function,
    onMouseleave: Function,
  };

  private isFocused = signal(false);

  private isHover = signal(false);

  private innerValue: RangeInputValue = [];

  install(): void {
    this.innerValue = this.props.defaultValue || [];

    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
  }

  uninstalled() {
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  @bind
  handleFocus(rangeValue: RangeInputValue, context: { e?: FocusEvent; position?: RangeInputPosition }) {
    this.fire('focus', {
      value: rangeValue,
      context,
    });
    this.isFocused.value = true;
  }

  @bind
  handleBlur(rangeValue: RangeInputValue, context: { e?: FocusEvent; position?: RangeInputPosition }) {
    this.fire('blur', {
      value: rangeValue,
      context,
    });
    this.isFocused.value = false;
  }

  @bind
  handleMouseEnter(e: MouseEvent) {
    if (!(e instanceof MouseEvent)) {
      // 防止死循环 下面还会 fire('mouseenter') 又触发了当前函数的执行
      return;
    }
    e.stopImmediatePropagation();
    this.isHover.value = true;
    this.fire('mouseenter', { context: { e } });
  }

  @bind
  handleMouseLeave(e: MouseEvent) {
    if (!(e instanceof MouseEvent)) {
      // 防止死循环 下面还会 fire('mouseleave') 又触发了当前函数的执行
      return;
    }
    e.stopImmediatePropagation();
    this.isHover.value = false;
    this.fire('mouseleave', { context: { e } });
  }

  @bind
  handleChange(position: 'first' | 'second' | undefined, trigger: 'input' | 'clear', value: string) {
    if (position === 'first') {
      this.innerValue = [value, this.innerValue[1]];
    } else if (position === 'second') {
      this.innerValue = [this.innerValue[0], value];
    } else {
      this.innerValue = ['', ''];
    }

    this.update();

    this.fire('change', {
      value: this.innerValue,
      context: {
        position,
        trigger,
      },
    });
  }

  render() {
    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-range-input`;

    const {
      disabled,
      status,
      size,
      separator,
      activeIndex,
      placeholder,
      readonly,
      format,
      clearable,
      innerClass,
      innerStyle,
      value = this.innerValue,
    } = this.props;

    const [firstValue, secondValue] = value;

    const [firstPlaceholder = '请输入内容', secondPlaceholder = '请输入内容'] = calcArrayValue(placeholder);
    const [firstFormat, secondFormat] = calcArrayValue(format);

    const showClearIcon = clearable && value?.length && !disabled && this.isHover.value;
    const suffixIconContent = showClearIcon ? (
      <span
        className={`${classPrefix}-range-input__suffix ${classPrefix}-range-input__suffix-icon`}
        onClick={() => {
          this.handleChange(undefined, 'clear', '');
        }}
      >
        <t-icon name="close-circle-filled" className={`${name}__suffix-clear ${classPrefix}-icon`} />
      </span>
    ) : null;

    return (
      <div
        className={classNames(
          name,
          {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-focused`]: this.isFocused.value,
            [`${classPrefix}-is-${status}`]: status,
            [`${classPrefix}-size-l`]: size === 'large',
            [`${classPrefix}-size-s`]: size === 'small',
            [`${name}--suffix`]: suffixIconContent,
          },
          innerClass,
        )}
        style={innerStyle}
      >
        <div className={`${name}__inner`}>
          <t-range-input-inner
            className={classNames(`${name}__inner-left`, {
              [`${classPrefix}-size-l`]: size === 'large',
              [`${classPrefix}-is-focused`]: activeIndex === 0,
            })}
            focus={activeIndex === 0}
            value={firstValue}
            placeholder={firstPlaceholder}
            disabled={disabled}
            readonly={readonly}
            format={firstFormat}
            onFocus={(e) => {
              this.handleFocus([firstValue, secondValue], { e, position: 'first' });
            }}
            onBlur={(e) => {
              this.handleBlur([firstValue, secondValue], { e, position: 'first' });
            }}
            onChange={this.handleChange.bind(this, 'first', 'input')}
          />

          <div className={`${name}__inner-separator`}>{separator}</div>

          <t-range-input-inner
            className={classNames(`${name}__inner-right`, {
              [`${classPrefix}-size-l`]: size === 'large',
              [`${classPrefix}-is-focused`]: activeIndex === 1,
            })}
            focus={activeIndex === 1}
            value={secondValue}
            placeholder={secondPlaceholder}
            disabled={disabled}
            readonly={readonly}
            format={secondFormat}
            onFocus={(e) => {
              this.handleFocus([firstValue, secondValue], { e, position: 'second' });
            }}
            onBlur={(e) => {
              this.handleBlur([firstValue, secondValue], { e, position: 'second' });
            }}
            onChange={this.handleChange.bind(this, 'second', 'input')}
          />

          {suffixIconContent}
        </div>
      </div>
    );
  }
}
