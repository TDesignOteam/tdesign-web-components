import './style/index.js';

import _Breadcrumb from './breadcrumb';
import _BreadcrumbItem from './breadcrumb-item';
import type { TdBreadcrumbItemProps, TdBreadcrumbProps } from './type';

export type { TdBreadcrumbItemProps, TdBreadcrumbProps };
export const Breadcrumb = _Breadcrumb;
export const BreadcrumbItem = _BreadcrumbItem;
export default Breadcrumb;
