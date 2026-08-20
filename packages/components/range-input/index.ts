import './style/index.js';

import _RangeInput from './RangeInput.jsx';
import _RangeInputPopup from './RangeInputPopup';
import type { RangeInputPosition, RangeInputValue, TdRangeInputPopupProps, TdRangeInputProps } from './type';

export type { RangeInputPosition, RangeInputValue, TdRangeInputPopupProps, TdRangeInputProps };

export type { RangeInputProps } from './RangeInput.jsx';
export const RangeInput = _RangeInput;
export const RangeInputPopup = _RangeInputPopup;
export default RangeInput;
