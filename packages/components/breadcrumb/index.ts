import './style/index.js';

import _Breadcrumb from './breadcrumb';
import _BreadcrumbItem from './breadcrumb-item';

export type { TdBreadcrumbItemProps, TdBreadcrumbProps } from './type';
export * from './type';
export const Breadcrumb = _Breadcrumb;
export const BreadcrumbItem = _BreadcrumbItem;
export default Breadcrumb;
