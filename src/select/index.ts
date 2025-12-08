import './style/index.js';

import _Option from './Option';
import _Select from './Select';

export type { SelectValue } from './type';
export * from './type';

export const Select = _Select;
export const Option = _Option;

export default Select;
