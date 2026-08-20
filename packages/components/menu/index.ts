import './style/index.js';

import _Menu from './Menu';
import _MenuItem from './MenuItem';
import type { MenuValue } from './type';

export type { MenuValue };

export type { MenuProps } from './Menu';
export type { MenuItemProps } from './MenuItem';
export const Menu = _Menu;
export const MenuItem = _MenuItem;

export default Menu;
