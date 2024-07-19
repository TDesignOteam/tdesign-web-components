import { Component, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { pxCompat, removeEmptyAttrs } from '../_util/helper';
import { StyledProps, TNode } from '../common';
import { dropdownItemDefaultProps } from './defaultProps';
import { DropdownItemTheme, DropdownOption, TdDropdownProps } from './type';

type DropdownItemProps = Pick<DropdownOption, 'value'> &
  Pick<TdDropdownProps, 'maxColumnWidth' | 'minColumnWidth'> &
  StyledProps & {
    cls?: string;
    active?: boolean;
    disabled?: boolean;
    children?: TNode;
    theme?: DropdownItemTheme;
    prefixIcon?: TNode;
    onClick?: (value: DropdownOption['value'], e: unknown) => void;
    isSubmenu?: boolean;
    divider?: boolean;
  };

@tag('t-dropdown-item')
export default class DropdownItem extends Component<DropdownItemProps> {
  static isLightDOM = true;

  static defaultProps = dropdownItemDefaultProps;

  classPrefix = getClassPrefix();

  handleItemClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    const { disabled, value, onClick } = this.props;
    if (disabled) return false;

    onClick?.(value, e);
  };

  render(props: DropdownItemProps) {
    const { children, cls, active, disabled, theme, prefixIcon, maxColumnWidth, minColumnWidth, style } = {
      ...dropdownItemDefaultProps,
      ...removeEmptyAttrs(props),
    };
    return (
      <li
        className={classNames(cls, `${this.classPrefix}-dropdown__item--theme-${theme}`, {
          [`${this.classPrefix}-dropdown__item--active`]: active,
          [`${this.classPrefix}-dropdown__item--disabled`]: disabled,
        })}
        onClick={this.handleItemClick}
        style={{
          maxWidth: pxCompat(maxColumnWidth),
          minWidth: pxCompat(minColumnWidth),
          ...style,
        }}
      >
        {prefixIcon ? <div className={`${this.classPrefix}-dropdown__item-icon`}>{prefixIcon}</div> : null}
        {children}
      </li>
    );
  }
}
