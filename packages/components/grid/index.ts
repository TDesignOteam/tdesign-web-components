import './style/index.js';

import _Col from './col';
import _Row from './row';
import type { BaseColProps, GutterObject } from './type';

export type { BaseColProps, GutterObject };

export type { ColProps } from './col';
export type { RowProps } from './row';
export const Row = _Row;
export const Col = _Col;
