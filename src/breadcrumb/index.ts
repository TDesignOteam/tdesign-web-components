import './style/index.js';

import _Breadcrumb from './breadcrumb';
import _BreadcrumbItem from './breadcrumb-item';

export * from './type';

export type { TdBreadcrumbProps, TdBreadcrumbItemProps } from './type.ts';
export const Breadcrumb = _Breadcrumb;
export const BreadcrumbItem = _BreadcrumbItem;
export default Breadcrumb;
