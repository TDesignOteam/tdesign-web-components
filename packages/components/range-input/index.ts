import './style/index.js';

import _RangeInput from './RangeInput.jsx';
import _RangeInputPopup from './RangeInputPopup';
import type { RangeInputPosition, RangeInputValue } from './type';

export type { RangeInputPosition, RangeInputValue };

export type { RangeInputProps } from './RangeInput.jsx';
export type { RangeInputPopupProps } from './RangeInputPopup';
export const RangeInput = _RangeInput;
export const RangeInputPopup = _RangeInputPopup;
export default RangeInput;
