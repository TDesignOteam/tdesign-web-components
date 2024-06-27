import { Component, render, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { canUseDocument } from '../_util/dom';
import { AttachNode, AttachNodeReturnValue, TNode } from '../common';

export interface PortalProps {
  /**
   * 指定挂载的 HTML 节点, false 为挂载在 body
   */
  attach?: AttachNode;
  /**
   * 触发元素
   */
  triggerNode?: HTMLElement;
  children: TNode;
}

export function getAttach(attach: PortalProps['attach'], triggerNode?: HTMLElement): AttachNodeReturnValue {
  if (!canUseDocument) return null;

  let el: AttachNodeReturnValue;
  if (typeof attach === 'string') {
    el = document.querySelector(attach);
  }
  if (typeof attach === 'function') {
    el = attach(triggerNode);
  }
  if (typeof attach === 'object' && (attach as any) instanceof window.HTMLElement) {
    el = attach;
  }

  // fix el in iframe
  if (el && el.nodeType === 1) return el;

  return document.body;
}

@tag('t-portal')
export default class Portal extends Component<PortalProps> {
  static css = [];

  static defaultProps = {
    attach: false,
  };

  parentElement: HTMLElement | null = null;

  container: HTMLElement = null;

  classPrefix = getClassPrefix();

  getContainer() {
    if (!canUseDocument) return null;
    const el = document.createElement('div');
    el.className = `${this.classPrefix}-portal-wrapper`;
    return el;
  }

  install(): void {
    this.container = this.getContainer();
    this.parentElement = getAttach(this.props.attach, this.props.triggerNode) as HTMLElement;
    this.parentElement?.appendChild?.(this.container);
  }

  render() {
    const { children } = this.props;
    return render(children, this.container);
  }
}
