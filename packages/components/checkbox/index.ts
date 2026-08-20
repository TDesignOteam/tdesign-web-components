import './style/index';

import type { CheckboxProps } from './checkbox';
import _Checkbox from './checkbox';
import type { CheckboxGroupProps } from './checkbox-group';
import _Group from './checkbox-group';
import type { CheckboxGroupChangeContext, CheckboxGroupValue, CheckboxOption, CheckboxOptionObj } from './type';

export type { CheckboxGroupChangeContext, CheckboxGroupValue, CheckboxOption, CheckboxOptionObj };
export type { CheckboxGroupProps, CheckboxProps };

export const Checkbox = _Checkbox;
export const CheckboxGroup = _Group;
export default Checkbox;
