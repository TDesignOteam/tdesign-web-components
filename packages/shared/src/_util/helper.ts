import { camelCase } from 'lodash-es';

// Re-export from @common to avoid duplication with submodule
export {
  omit,
  removeEmptyAttrs,
  getTabElementByValue,
  firstUpperCase,
  getBackgroundColor,
  pxCompat,
} from '@common/js/utils/helper';
export type { Gradients, FromTo, LinearGradient } from '@common/js/utils/helper';

// shared-only utility: keyboard-event => onKeyboardEvent
export function getPropsApiByEvent(eventName: string) {
  return camelCase(`on-${eventName}`);
}
