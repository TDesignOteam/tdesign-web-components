import './breadcrumb-item';

import { Component, OmiDOMAttributes, signal, tag } from 'omi';
import { getChildrenArray } from 'tdesign-web-components/_util/component';

import classname, { getClassPrefix } from '../_util/classname';
import { TNode } from '../common';
import { TdBreadcrumbProps } from './type';

interface BreadcrumbProps extends TdBreadcrumbProps, OmiDOMAttributes {}

@tag('t-breadcrumb')
export default class Breadcrumb extends Component<BreadcrumbProps> {
  componentName = `${getClassPrefix()}-breadcrumb`;

  static propTypes = {
    maxItemWidth: String,
    options: Object,
    separator: [String, Object],
  };

  get contentNodes() {
    const { children, options } = this.props;
    const childrenArray = getChildrenArray(children);
    let content = childrenArray.filter((child) => child.attributes?.slot !== 'separator');

    if (options && options.length) {
      content = options.map((option) => <t-breadcrumb-item {...option}></t-breadcrumb-item>);
    }
    return content;
  }

  tBreacrumb = signal({
    separator: '' as string | TNode,
    maxItemWidth: '',
  });

  provide = {
    tBreadcrumb: this.tBreacrumb,
  };

  render() {
    const { className } = this.props;
    const { separator, maxItemWidth, children } = this.props;
    const separatorSlot = getChildrenArray(children).find((child) => child.attributes?.slot === 'separator');
    this.tBreacrumb.value = {
      separator: separator || separatorSlot,
      maxItemWidth,
    };
    return <div class={classname(this.componentName, className)}>{this.contentNodes}</div>;
  }
}
