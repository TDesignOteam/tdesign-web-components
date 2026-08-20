import './style/index';

import _Checkbox from './checkbox';
import _Group from './checkbox-group';
import type {
  CheckboxGroupChangeContext,
  CheckboxGroupValue,
  CheckboxOption,
  CheckboxOptionObj,
  TdCheckboxGroupProps,
  TdCheckboxProps,
} from './type';

export type {
  CheckboxGroupChangeContext,
  CheckboxGroupValue,
  CheckboxOption,
  CheckboxOptionObj,
  TdCheckboxGroupProps,
  TdCheckboxProps,
};
export type CheckboxProps = TdCheckboxProps;
export type CheckboxGroupProps = TdCheckboxGroupProps;

export const Checkbox = _Checkbox;
export const CheckboxGroup = _Group;
export default Checkbox;
