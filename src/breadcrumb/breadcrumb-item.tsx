import 'tdesign-icons-web-components/esm/components/chevron-right';
import '../tooltip';

import { bind, Component, createRef, effect, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { isNodeOverflow } from '../_util/dom';
import { TNode } from '../common';
import { TdBreadcrumbItemProps } from './type';

interface LocalTBreadcrumb {
  separator: TNode | string;
  maxItemWidth: string;
}

const localTBreadcrumbOrigin: LocalTBreadcrumb = {
  separator: '',
  maxItemWidth: undefined,
};

@tag('t-breadcrumb-item')
export default class BreadcrumbItem extends Component<TdBreadcrumbItemProps> {
  static css = [];

  static isLightDOM = true;

  componentName = `${getClassPrefix()}-breadcrumb__item`;

  static defaultProps = {
    href: '',
    target: '_self',
    isLast: false,
  };

  inject = ['tBreadcrumb'];

  localTBreadcrumb = signal<LocalTBreadcrumb>(localTBreadcrumbOrigin);

  isCutOff = signal(false);

  breadcrumbText = createRef<HTMLElement>();

  install() {
    effect(() => {
      this.injection.tBreadcrumb && (this.localTBreadcrumb.value = this.injection.tBreadcrumb.value);
    });
  }

  installed(): void {
    this.isCutOff.value = isNodeOverflow(this.breadcrumbText.current);
  }

  beforeUpdate(): void {
    if (this.breadcrumbText.current) {
      this.isCutOff.value = isNodeOverflow(this.breadcrumbText.current);
    }
  }

  beforeRender(): void {
    this.firstChild && this.removeChild(this.firstChild);
  }

  @bind
  handleClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.props.disabled) {
      this.props.onClick?.(event);
    }
  }

  render() {
    const { children, className, disabled, href, target, content, maxWidth } = this.props;
    const { separator, maxItemWidth } = this.localTBreadcrumb.value;
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
        <span ref={this.breadcrumbText} class={`${classPrefix}-breadcrumb__inner-text`}>
          {children || content}
        </span>
      </span>
    );

    let itemContent = <span class={classname(textClass)}>{textContent}</span>;
    if (href && !disabled) {
      textClass.push(`${classPrefix}-link`);
      itemContent = (
        <a class={classname(textClass)} href={href} target={target}>
          {textContent}
        </a>
      );
    }

    return (
      <div className={classname(this.componentName, className)} onClick={this.handleClick}>
        {this.isCutOff.value ? <t-tooltip content={children || content}>{itemContent}</t-tooltip> : itemContent}
        <span class={`${classPrefix}-breadcrumb__separator`}>{separatorContent}</span>
      </div>
    );
  }
}
