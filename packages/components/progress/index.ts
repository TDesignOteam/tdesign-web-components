import './style/index.js';

import _Progress from './progress';
import type { StatusEnum, ThemeEnum } from './type';

export type { StatusEnum, ThemeEnum };

export type { ProgressProps } from './progress';
export const Progress = _Progress;
export default Progress;
