import './style/index';

import _Checkbox from './checkbox';
import _Group from './checkbox-group';
import type { TdCheckboxGroupProps, TdCheckboxProps } from './type';

export type CheckboxProps = TdCheckboxProps;
export type CheckboxGroupProps = TdCheckboxGroupProps;

export const Checkbox = _Checkbox;
export const CheckboxGroup = _Group;

export * from './type';

export default Checkbox;
