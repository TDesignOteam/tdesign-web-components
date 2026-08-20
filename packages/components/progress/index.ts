import './style/index.js';

import _Progress from './progress';
import type { StatusEnum, TdProgressProps, ThemeEnum } from './type';

export type { StatusEnum, TdProgressProps, ThemeEnum };

export type { ProgressProps } from './progress';
export const Progress = _Progress;
export default Progress;
