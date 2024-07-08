import { bind, Component, OmiDOMAttributes, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { getChildrenArray, hasSlot } from '../_util/component';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { DEFAULT_MENU_WIDTH } from './_util/constant';
import { MenuValue, TdMenuProps } from './type';

export interface MenuProps extends TdMenuProps, StyledProps, OmiDOMAttributes {}

@tag('t-menu')
export default class Menu extends Component<MenuProps> {
  static css = [];

  static defaultProps: TdMenuProps = {
    collapsed: false,
    width: '232px',
  };

  static propTypes = {
    collapsed: Boolean,
    value: [String, Number],
    width: [String, Number, Array],
    onChange: Function,
  };

  active = signal<MenuValue>('');

  provide = {
    active: this.active,
    onChange: this.handleChange,
  };

  @bind
  handleChange(value: MenuValue) {
    this.fire('change', value);
  }

  render() {
    const { className, style, width, collapsed, value } = this.props;

    this.active.value = value;

    const classPrefix = getClassPrefix();
    const menuWidthArr = Array.isArray(width) ? width : [width, DEFAULT_MENU_WIDTH[1]];

    const hasLogo = hasSlot('logo', this.props.children);
    const hasOperations = hasSlot('operations', this.props.children);

    const children = getChildrenArray(this.props.children)
      .filter((item) => item.nodeName === 't-menu-item')
      .map(convertToLightDomNode);

    return (
      <div
        className={classname(`${classPrefix}-default-menu`, className, {
          [`${classPrefix}-is-collapsed`]: collapsed,
        })}
        style={{ width: collapsed ? menuWidthArr[1] : menuWidthArr[0], ...style }}
      >
        <div className={`${classPrefix}-default-menu__inner`}>
          {hasLogo && (
            <div className={`${classPrefix}-menu__logo`}>
              <span>
                <slot name="logo" />
              </span>
            </div>
          )}

          <ul className={classname(`${classPrefix}-menu`, `${classPrefix}-menu--scroll`)}>{children}</ul>

          {hasOperations && (
            <div className={`${classPrefix}-menu__operations`}>
              <slot name="operations" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
