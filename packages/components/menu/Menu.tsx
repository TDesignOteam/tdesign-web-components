import classname, { getClassPrefix } from '@tdesign/web-components-shared/_util/classname';
import { getChildrenArray, hasSlot } from '@tdesign/web-components-shared/_util/component';
import { convertToLightDomNode } from '@tdesign/web-components-shared/_util/lightDom';
import { StyledProps } from '@tdesign/web-components-shared/common';
import { bind, Component, OmiDOMAttributes, signal, tag } from 'omi';

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

  private active = signal<MenuValue>('');

  // 这里不能声明 collapsed 会被外部覆盖
  private menuCollapsed = signal(true);

  provide = {
    collapsed: this.menuCollapsed,
    active: this.active,
    onChange: this.handleChange,
  };

  @bind
  handleChange(value: MenuValue) {
    this.fire('change', value);
  }

  render() {
    const { innerClass, innerStyle, width, value, collapsed } = this.props;

    this.active.value = value;
    this.menuCollapsed.value = collapsed;

    const classPrefix = getClassPrefix();
    const menuWidthArr = Array.isArray(width) ? width : [width, DEFAULT_MENU_WIDTH[1]];

    const hasLogo = hasSlot('logo', this.props.children);
    const hasOperations = hasSlot('operations', this.props.children);

    const children = getChildrenArray(this.props.children)
      .filter((item) => item.nodeName === 't-menu-item')
      .map(convertToLightDomNode);

    return (
      <div
        className={classname(
          `${classPrefix}-default-menu`,
          {
            [`${classPrefix}-is-collapsed`]: collapsed,
          },
          innerClass,
        )}
        style={{ width: collapsed ? menuWidthArr[1] : menuWidthArr[0], ...innerStyle }}
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
