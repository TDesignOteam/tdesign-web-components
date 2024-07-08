import 'tdesign-web-components/input';

import { bind, classNames, Component, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { TdRangeInputProps } from './type';

export interface RangeInputProps extends TdRangeInputProps, StyledProps {}

@tag('t-range-input')
export default class RangeInput extends Component<RangeInputProps> {
  static defaultProps: TdRangeInputProps = {
    clearable: false,
    readonly: false,
    separator: '-',
    size: 'medium',
    status: 'default',
    defaultValue: [],
  };

  isFocused = signal(false);

  activeIndex = signal(0);

  @bind
  handleFocus() {}

  render() {
    const { className, disabled, status, size, separator, activeIndex } = {
      ...{
        activeIndex: this.activeIndex.value,
      },
      ...this.props,
    };

    const classPrefix = getClassPrefix();
    const name = `${classPrefix}-range-input`;

    return (
      <div
        className={classNames(name, className, {
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: this.isFocused.value,
          [`${classPrefix}-is-${status}`]: status,
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-s`]: size === 'small',
        })}
      >
        <div className={`${name}__inner`}>
          {convertToLightDomNode(
            <t-input
              className={`${name}__inner-left`}
              inputClass={classNames({
                [`${classPrefix}-is-focused`]: activeIndex === 0,
              })}
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
              onFocus={(e) => {
                console.log('----onFocus', e);
              }}
            />,
          )}
        </div>
      </div>
    );
  }
}
