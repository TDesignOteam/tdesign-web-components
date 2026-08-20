import './style/index';

import _Input from './input';
import _InputGroup from './input-group';
import type { InputFormatType, InputValue, TdInputGroupProps, TdInputProps } from './type';

export type { InputFormatType, InputValue, TdInputGroupProps, TdInputProps };

export type { InputProps, InputRef } from './input';
export type { InputGroupProps } from './input-group';
export const Input = _Input;
export const InputGroup = _InputGroup;
export default { Input, InputGroup };
