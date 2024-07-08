import 'tdesign-web-components/icon';
import 'tdesign-web-components/input';

import { bind, classNames, Component, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { TdRangeInputProps } from './type';

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

  isFocused = signal(false);

  isHover = signal(false);

  activeIndex = signal(0);

  @bind
  handleFocus() {}

  render() {
    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-range-input`;

    const {
      className,
      disabled,
      status,
      size,
      separator,
      activeIndex = this.activeIndex.value,
      placeholder,
      readonly,
      format,
      clearable,
      value = this.props.defaultValue,
    } = this.props;

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
          {convertToLightDomNode(
            <t-input
              className={`${name}__inner-left`}
              inputClass={classNames({
                [`${classPrefix}-is-focused`]: activeIndex === 0,
              })}
              placeholder={firstPlaceholder}
              disabled={disabled}
              readonly={readonly}
              format={firstFormat}
              onFocus={(e) => {
                console.log('----onFocus', e);
              }}
            />,
          )}

          <div className={`${name}__inner-separator`}>{separator}</div>

          {convertToLightDomNode(
            <t-input
              className={`${name}__inner-right`}
              inputClass={classNames({
                [`${classPrefix}-is-focused`]: activeIndex === 1,
              })}
              placeholder={secondPlaceholder}
              disabled={disabled}
              readonly={readonly}
              format={secondFormat}
              onFocus={(e) => {
                console.log('----onFocus', e);
              }}
            />,
          )}

          {suffixIconContent}
        </div>
      </div>
    );
  }
}
