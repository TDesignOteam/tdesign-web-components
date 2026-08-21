import './style/index.js';

import _Option from './Option';
import _Select from './Select';
import type {
  SelectContext,
  SelectKeysType,
  SelectOption,
  SelectOptionGroup,
  SelectRemoveContext,
  SelectValue,
  SelectValueChangeTrigger,
  TdOptionGroupProps,
} from './type';

export type {
  SelectContext,
  SelectKeysType,
  SelectOption,
  SelectOptionGroup,
  SelectRemoveContext,
  SelectValue,
  SelectValueChangeTrigger,
  TdOptionGroupProps,
};
export type { OptionProps } from './Option';
export type { SelectProps } from './Select';
export const Select = _Select;
export const Option = _Option;

export default Select;
