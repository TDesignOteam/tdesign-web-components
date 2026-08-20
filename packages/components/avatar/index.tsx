import './style/index.js';

import _Avatar from './avatar';
import _AvatarGroup from './avatar-group';
import type { CascadingValue, ShapeEnum } from './type';

export type { AvatarProps } from './avatar';
export type { AvatarGroupProps } from './avatar-group';
export type { CascadingValue, ShapeEnum };
export const Avatar = _Avatar;
export const AvatarGroup = _AvatarGroup;

export default Avatar;
