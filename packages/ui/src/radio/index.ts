import './style/index.js';

import _Radio from './radio';
import _RadioButton from './radioButton.jsx';
import _RadioGroup from './radioGroup.jsx';

export * from './type';
export type { RadioProps } from './radio';
export type { RadioGroupProps } from './radioGroup';

export const Radio = _Radio;
export const RadioButton = _RadioButton;
export const RadioGroup = _RadioGroup;

export default Radio;
