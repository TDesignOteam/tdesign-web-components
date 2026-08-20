import './style/index.js';

import _Collapse from './collapse';

export type { CollapseProps } from './collapse';
export { default as CollapsePanel, type CollapsePanelProps } from './collapse-panel';
export type { CollapsePanelValue, CollapseValue } from './type';
export const Collapse = _Collapse;
export default Collapse;
