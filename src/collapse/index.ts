import './style/index.js';

import _Collapse from './collapse';

export * from './type';
export type { CollapseProps } from './collapse';
export { default as CollapsePanel, type CollapsePanelProps } from './collapse-panel';

export const Collapse = _Collapse;
export default Collapse;
