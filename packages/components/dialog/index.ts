import './style/index.js';

import _Dialog from './dialog';
import { DialogPlugin as _DialogPlugin } from './plugin';
import type {
  DialogAlertMethod,
  DialogCloseContext,
  DialogConfirmMethod,
  DialogEventSource,
  DialogInstance,
  DialogMethod,
  DialogOptions,
  TdDialogCardProps,
  TdDialogProps,
} from './type';

export type {
  DialogAlertMethod,
  DialogCloseContext,
  DialogConfirmMethod,
  DialogEventSource,
  DialogInstance,
  DialogMethod,
  DialogOptions,
  TdDialogCardProps,
  TdDialogProps,
};

export type { DialogProps } from './dialog';
export const Dialog = _Dialog;
export const dialog = _DialogPlugin;
export const DialogPlugin = _DialogPlugin;

export default Dialog;
