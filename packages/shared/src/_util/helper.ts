import { camelCase } from 'lodash-es';

// Re-export from @common to avoid duplication with submodule
export type { FromTo, Gradients, LinearGradient } from '@common/js/utils/helper';
export {
  firstUpperCase,
  getBackgroundColor,
  getTabElementByValue,
  omit,
  pxCompat,
  removeEmptyAttrs,
} from '@common/js/utils/helper';

// shared-only utility: keyboard-event => onKeyboardEvent
export function getPropsApiByEvent(eventName: string) {
  return camelCase(`on-${eventName}`);
}
