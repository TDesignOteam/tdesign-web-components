import { Component, ComponentChildren, OmiDOMAttributes, tag } from 'omi';

import { StyledProps } from '../common';
import { classname, getClassPrefix } from '../utils';
import { DEFAULT_MENU_WIDTH } from './_util/constant';
import { menuDefaultProps } from './defaultProps';
import { TdMenuProps } from './type';

export interface MenuProps extends TdMenuProps, StyledProps, OmiDOMAttributes {}

/**
 * 将Component的children转换为数组
 * @param children ComponentChildren | undefined
 * @returns ComponentChildren[]
 */
export function getChildrenArray(children?: ComponentChildren) {
  if (!children) {
    return [];
  }
  if (Array.isArray(children)) {
    return children;
  }
  return [children];
}

/**
 * 判断是否某个name的slot
 * @param name string
 * @param children ComponentChildren | undefined
 * @returns boolean
 */
export function hasSlot(name: string, children?: ComponentChildren) {
  const childrenArray = getChildrenArray(children);

  return childrenArray.some((child) => {
    if (typeof child === 'object' && 'attributes' in child) {
      return child.attributes?.slot === name;
    }
    return false;
  });
}

@tag('t-menu')
export default class Menu extends Component<MenuProps> {
  static css = [];

  static defaultProps = {};

  render() {
    const { className, style, width, collapsed } = {
      ...menuDefaultProps,
      ...this.props,
    };

    const classPrefix = getClassPrefix();
    const menuWidthArr = Array.isArray(width) ? width : [width, DEFAULT_MENU_WIDTH[1]];

    const hasLogo = hasSlot('logo', this.props.children);
    const hasOperations = hasSlot('operations', this.props.children);

    const children = getChildrenArray(this.props.children).filter((item) => item.nodeName === 't-menu-item');

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
