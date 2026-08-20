import './style/index.js';

import _Loading from './loading';
import { LoadingPlugin as _LoadingPlugin } from './plugin';
import type { LoadingInstance, LoadingMethod, TdLoadingProps } from './type';

export type { LoadingInstance, LoadingMethod, TdLoadingProps };

export type { LoadingProps } from './loading';
export const Loading = _Loading;
export const loading = _LoadingPlugin;
export const LoadingPlugin = _LoadingPlugin;

export default Loading;
