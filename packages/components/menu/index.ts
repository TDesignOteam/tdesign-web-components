import './style/index.js';

import _Menu from './Menu';
import _MenuItem from './MenuItem';
import type { MenuValue, TdMenuItemProps, TdMenuProps } from './type';

export type { MenuValue, TdMenuItemProps, TdMenuProps };

export type { MenuProps } from './Menu';
export type { MenuItemProps } from './MenuItem';
export const Menu = _Menu;
export const MenuItem = _MenuItem;

export default Menu;
