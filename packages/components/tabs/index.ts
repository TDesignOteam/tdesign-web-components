import './style/index.js';

import _Tabs from './tabs';
import type { TabsDragSortContext, TabValue, TdTabPanelProps, TdTabsProps } from './type';

export type { TabsDragSortContext, TabValue, TdTabPanelProps, TdTabsProps };

export type { TabPanelProps } from './tabPanel';
export type { TabsProps } from './tabs';

export const Tabs = _Tabs;
export default Tabs;
