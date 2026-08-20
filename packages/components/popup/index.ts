import './style/index.js';

import _Popup from './popup';
import type {
  PopupPlacement,
  PopupTriggerEvent,
  PopupTriggerSource,
  PopupVisibleChangeContext,
  TdPopupProps,
} from './type';

export type { PopupPlacement, PopupTriggerEvent, PopupTriggerSource, PopupVisibleChangeContext, TdPopupProps };

export type { PopupProps } from './popup';
export const Popup = _Popup;
export default Popup;
