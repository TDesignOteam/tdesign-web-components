import './style/index.js';

import _Notification from './Notification';
import { NotificationPlugin as _NotificationPlugin } from './NotificationPlugin';
import type {
  NotificationCloseAllMethod,
  NotificationCloseMethod,
  NotificationConfigMethod,
  NotificationErrorMethod,
  NotificationInfoMethod,
  NotificationInfoOptions,
  NotificationInstance,
  NotificationMethod,
  NotificationOptions,
  NotificationPlacementList,
  NotificationSuccessMethod,
  NotificationThemeList,
  NotificationWarningMethod,
} from './type';

export type {
  NotificationCloseAllMethod,
  NotificationCloseMethod,
  NotificationConfigMethod,
  NotificationErrorMethod,
  NotificationInfoMethod,
  NotificationInfoOptions,
  NotificationInstance,
  NotificationMethod,
  NotificationOptions,
  NotificationPlacementList,
  NotificationSuccessMethod,
  NotificationThemeList,
  NotificationWarningMethod,
};
export type { NotificationProps } from './Notification';
export const Notification = _Notification;
export const notification = _NotificationPlugin;
export const NotificationPlugin = _NotificationPlugin;

export default Notification;
