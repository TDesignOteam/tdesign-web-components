import './style/index';

import _Input from './input';
import _InputGroup from './input-group';

export type { InputProps, InputRef } from './input';
export type { InputGroupProps } from './input-group';
export * from './type';

export const Input = _Input;
export const InputGroup = _InputGroup;
export default { Input, InputGroup };
