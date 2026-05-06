import './style/index.js';

import _Dialog from './dialog';
import { DialogPlugin as _DialogPlugin } from './plugin';

export type { DialogProps } from './dialog';
export * from './type';

export const Dialog = _Dialog;
export const dialog = _DialogPlugin;
export const DialogPlugin = _DialogPlugin;

export default Dialog;
