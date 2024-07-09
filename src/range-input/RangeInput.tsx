import 'tdesign-web-components/icon';
import 'tdesign-web-components/input';

import { bind, classNames, Component, signal, tag } from 'omi';
import { convertToLightDomNode } from 'tdesign-web-components/_util/lightDom';

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

  private isFocused = signal(false);

  private isHover = signal(false);

  private innerActiveIndex = signal(0);

  private innerValue = signal<RangeInputValue>([]);

  install(): void {
    this.innerValue.value = this.props.defaultValue || [];
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

  render() {
    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-range-input`;

    const {
      className,
      disabled,
      status,
      size,
      separator,
      activeIndex = this.innerActiveIndex.value,
      placeholder,
      readonly,
      format,
      clearable,
      value = this.innerValue.value,
    } = this.props;

    const [firstValue, secondValue] = value;

    const [firstPlaceholder = '请输入内容', secondPlaceholder = '请输入内容'] = calcArrayValue(placeholder);
    const [firstFormat, secondFormat] = calcArrayValue(format);

    const showClearIcon = clearable && value?.length && !disabled && this.isHover.value;
    const suffixIconContent = showClearIcon ? (
      <span className={`${classPrefix}-range-input__suffix ${classPrefix}-range-input__suffix-icon`}>
        {convertToLightDomNode(
          <t-icon name="close-circle-filled" className={`${name}__suffix-clear ${classPrefix}-icon`} />,
        )}
      </span>
    ) : null;

    return (
      <div
        className={classNames(name, className, {
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: this.isFocused.value,
          [`${classPrefix}-is-${status}`]: status,
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${name}--suffix`]: suffixIconContent,
        })}
      >
        <div className={`${name}__inner`}>
          <t-input
            className={`${name}__inner-left`}
            inputClass={classNames({
              [`${classPrefix}-is-focused`]: activeIndex === 0,
            })}
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
            onChange={() => {}}
          />

          <div className={`${name}__inner-separator`}>{separator}</div>

          <t-input
            className={`${name}__inner-right`}
            inputClass={classNames({
              [`${classPrefix}-is-focused`]: activeIndex === 1,
            })}
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
            onChange={() => {}}
          />

          {suffixIconContent}
        </div>
      </div>
    );
  }
}
