import { Component, tag } from 'omi';

import { StyledProps } from '../common';
import { TdMenuProps } from './type';

export interface MenuProps extends TdMenuProps, StyledProps {}

@tag('t-menu')
export default class Menu extends Component<MenuProps> {
  static css = [];

  static defaultProps = {};

  render() {
    return <div>menus</div>;
  }
}
