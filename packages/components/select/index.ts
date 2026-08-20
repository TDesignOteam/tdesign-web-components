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
  TdOptionProps,
  TdSelectProps,
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
  TdOptionProps,
  TdSelectProps,
};
export const Select = _Select;
export const Option = _Option;

export default Select;
