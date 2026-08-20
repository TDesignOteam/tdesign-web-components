import './style/index.js';

import _SelectInput from './SelectInput';
import type {
  SelectInputBlurContext,
  SelectInputChangeContext,
  SelectInputFocusContext,
  SelectInputKeys,
  SelectInputValue,
  SelectInputValueChangeContext,
} from './type';

export type { SelectInputProps } from './SelectInput';
export type {
  SelectInputBlurContext,
  SelectInputChangeContext,
  SelectInputFocusContext,
  SelectInputKeys,
  SelectInputValue,
  SelectInputValueChangeContext,
};

export const SelectInput = _SelectInput;
export default SelectInput;
