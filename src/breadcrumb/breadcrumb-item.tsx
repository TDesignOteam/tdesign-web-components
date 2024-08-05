import 'tdesign-icons-web-components/esm/components/chevron-right';
import '../tooltip';

import { bind, Component, OmiDOMAttributes, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { isNodeOverflow } from '../_util/dom';
import { TNode } from '../common';
import { TdBreadcrumbItemProps } from './type';

interface BreadcrumbItemProps extends TdBreadcrumbItemProps, OmiDOMAttributes {}

interface LocalTBreadcrumb {
  separator: TNode | string;
  maxItemWidth: string;
}

const localTBreadcrumbOrigin: LocalTBreadcrumb = {
  separator: '',
  maxItemWidth: undefined,
};

@tag('t-breadcrumb-item')
export default class BreadcrumbItem extends Component<BreadcrumbItemProps> {
  static css = [];

  static isLightDOM = true;

  className = `${getClassPrefix()}-breadcrumb__item`;

  static defaultProps = {
    href: '',
    target: '_self',
    isLast: false,
  };

  static propsType = {
    content: [String, Number, Object, Function],
    disabled: Boolean,
    href: String,
    maxWidth: String,
    target: String,
    onClick: Function,
  };

  inject = ['tBreadcrumb'];

  localTBreadcrumb = localTBreadcrumbOrigin;

  isCutOff = false;

  install() {
    this.injection.tBreadcrumb && (this.localTBreadcrumb = this.injection.tBreadcrumb);
  }

  adjustCutOff() {
    setTimeout(() => {
      const breadcrumbText = this.querySelector(`.${getClassPrefix()}-breadcrumb__inner-text`);

      if (breadcrumbText?.clientWidth) {
        const isCutOff = isNodeOverflow(breadcrumbText);
        if (this.isCutOff !== isCutOff) {
          this.isCutOff = isCutOff;
          this.update();
        }
      }
    });
  }

  ready(): void {
    this.adjustCutOff();
  }

  updated(): void {
    this.adjustCutOff();
  }

  @bind
  handleClick(event: MouseEvent): void {
    event.stopImmediatePropagation();
    if (!this.props.disabled) {
      this.props.onClick?.(event);
    }
  }

  render() {
    const { children, className, disabled, href, target, content, maxWidth } = this.props;
    const { separator, maxItemWidth } = this.localTBreadcrumb;
    const classPrefix = getClassPrefix();
    const textClass = [`${classPrefix}-breadcrumb--text-overflow`];
    if (disabled) {
      textClass.push(`${classPrefix}-is-disabled`);
    }
    const separatorContent = separator || <t-icon-chevron-right />;
    const innerMaxWidth = maxWidth || maxItemWidth || '120';
    const maxWithStyle = { 'max-width': `${innerMaxWidth}px` };

    const textContent = (
      <span class={`${classPrefix}-breadcrumb__inner`} style={maxWithStyle}>
        <span class={`${classPrefix}-breadcrumb__inner-text`}>{children || content}</span>
      </span>
    );

    let itemContent;
    if (href && !disabled) {
      textClass.push(`${classPrefix}-link`);
      itemContent = (
        <a class={classname(textClass)} href={href} target={target}>
          {textContent}
        </a>
      );
    } else {
      itemContent = <span class={classname(textClass)}>{textContent}</span>;
    }

    return (
      <div className={classname(this.className, className)} onClick={this.handleClick}>
        {this.isCutOff ? <t-tooltip content={children || content}>{itemContent}</t-tooltip> : itemContent}
        <span class={`${classPrefix}-breadcrumb__separator`}>{separatorContent}</span>
      </div>
    );
  }
}
