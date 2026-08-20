import './style/index';

import _Checkbox from './checkbox';
import _Group from './checkbox-group';

export type { CheckboxProps } from './checkbox';
export type { CheckboxGroupProps } from './checkbox-group';
export type { CheckboxGroupChangeContext, CheckboxGroupValue, CheckboxOption, CheckboxOptionObj } from './type';

export const Checkbox = _Checkbox;
export const CheckboxGroup = _Group;
export default Checkbox;
