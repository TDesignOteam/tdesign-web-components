import { Component, tag } from 'omi';

import { StyledProps } from '../common';
import { TdMenuItemProps } from './type';

export interface MenuItemProps extends TdMenuItemProps, StyledProps {}

@tag('t-menu-item')
export default class Menu extends Component<MenuItemProps> {
  static css = [];

  static defaultProps = {};

  render() {
    return <div>menu item</div>;
  }
}
