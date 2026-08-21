import './style/index.js';

import _TagInput from './tag-input.jsx';
import type {
  InputValueChangeContext,
  TagInputChangeContext,
  TagInputDragSortContext,
  TagInputRemoveContext,
  TagInputRemoveTrigger,
  TagInputTriggerSource,
  TagInputValue,
} from './type';

export type {
  InputValueChangeContext,
  TagInputChangeContext,
  TagInputDragSortContext,
  TagInputRemoveContext,
  TagInputRemoveTrigger,
  TagInputTriggerSource,
  TagInputValue,
};

export type { TagInputProps } from './tag-input.jsx';
export const TagInput = _TagInput;
export default TagInput;
