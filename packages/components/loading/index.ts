import './style/index.js';

import _Loading from './loading';
import { LoadingPlugin as _LoadingPlugin } from './plugin';

export type { LoadingProps } from './loading';
export * from './type';

export const Loading = _Loading;
export const loading = _LoadingPlugin;
export const LoadingPlugin = _LoadingPlugin;

export default Loading;
