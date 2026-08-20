import './style/index';

import type { TdWatermarkProps, WatermarkImage, WatermarkText } from './type';
import type { WatermarkProps } from './watermark';
import _Watermark from './watermark';

export type { TdWatermarkProps, WatermarkImage, WatermarkProps, WatermarkText };

export const Watermark = _Watermark;

export default Watermark;
