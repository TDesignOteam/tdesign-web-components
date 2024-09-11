import './breadcrumb-item';

import { Component, OmiDOMAttributes, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { getChildrenArray } from '../_util/component';
import { TdBreadcrumbProps } from './type';

interface BreadcrumbProps extends TdBreadcrumbProps, OmiDOMAttributes {}

@tag('t-breadcrumb')
export default class Breadcrumb extends Component<BreadcrumbProps> {
  className = `${getClassPrefix()}-breadcrumb`;

  static propTypes = {
    maxItemWidth: String,
    options: Object,
    separator: [String, Number, Object, Function],
  };

  get contentNodes() {
    const { children, options } = this.props;
    const childrenArray = getChildrenArray(children);
    let content = childrenArray
      .filter((child) => child.attributes?.slot !== 'separator' && child.nodeName === 't-breadcrumb-item')
      .map((item) => item);

    if (options && options.length) {
      content = options.map((option) => <t-breadcrumb-item {...option}></t-breadcrumb-item>);
    }
    return content;
  }

  provide = {
    tBreadcrumb: {
      separator: '',
      maxItemWidth: '',
    },
  };

  beforeRender(): void {
    const { separator, maxItemWidth, children } = this.props;
    const separatorSlot = getChildrenArray(children).find((child) => child.attributes?.slot === 'separator');
    this.provide.tBreadcrumb.separator = separator || separatorSlot;
    this.provide.tBreadcrumb.maxItemWidth = maxItemWidth;
  }

  render() {
    const { className } = this.props;
    return <div class={classname(this.className, className)}>{this.contentNodes}</div>;
  }
}
