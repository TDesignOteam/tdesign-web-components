import './style/index.js';

import _Menu from './Menu';
import _MenuItem from './MenuItem';

export type { MenuProps } from './Menu';
export type { MenuItemProps } from './MenuItem';
export * from './type';

export const Menu = _Menu;
export const MenuItem = _MenuItem;

export default Menu;
