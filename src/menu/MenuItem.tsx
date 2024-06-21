import { Component, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { TdMenuItemProps } from './type';

export interface MenuItemProps extends TdMenuItemProps, StyledProps {}

@tag('t-menu-item')
export default class Menu extends Component<MenuItemProps> {
  static isLightDOM = true;

  render() {
    const { label, icon, className, disabled, href, target } = this.props;

    const classPrefix = getClassPrefix();

    this.className = classname(`${classPrefix}-menu__item`, className, {
      [`${classPrefix}-is-disabled`]: disabled,
      // [`${classPrefix}-is-active`]: value === active,
      [`${classPrefix}-menu__item--plain`]: !icon,
    });

    return (
      <>
        {icon}
        {href ? (
          <a href={href} target={target} className={classname(`${classPrefix}-menu__item-link`)}>
            <span className={`${classPrefix}-menu__content`}>{label}</span>
          </a>
        ) : (
          <span className={`${classPrefix}-menu__content`}>{label}</span>
        )}
      </>
    );
  }
}
