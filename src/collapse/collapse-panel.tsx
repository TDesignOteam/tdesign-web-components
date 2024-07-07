import '../common/fake-arrow';

import { bind, Component, computed, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import type { TdCollapsePanelProps } from './type';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {}

@tag('t-collapse-panel')
export default class CollapsePanel extends Component<TdCollapsePanelProps> {
  static isLightDom = true;

  innerValue = signal(0);

  className = `${classPrefix}-collapse-panel`;

  isDisabled = signal(false);

  install(): void {
    const { getUniqId, updateCollapseValue, defaultExpandAll } = this.injection;

    const { value } = this.props;

    this.innerValue = computed(() => (value === undefined ? getUniqId() : value));

    if (defaultExpandAll.value) {
      updateCollapseValue(this.innerValue.value);
    }

    this.isDisabled = computed(() => this.props.disabled || this.injection.disabled.value);
  }

  inject = [
    'getUniqId',
    'collapseValue',
    'updateCollapseValue',
    'borderless',
    'defaultExpandAll',
    'disabled',
    'collapseProps',
    'expandIconPlacement',
    'expandOnRowClick',
  ];

  @bind
  getChild(name) {
    const children = this.props.children || [];

    if (!Array.isArray(children)) {
      return;
    }
    const child = children.find((item) => item?.attributes?.slot === name);
    return child;
  }

  @bind
  getDefaultSlot() {
    const children = this.props.children || [];
    if (!Array.isArray(children)) {
      return children;
    }
    return children.find((item) => !item?.attributes?.slot);
  }

  @bind
  handleClick(event, fromHeader = false) {
    if (this.isDisabled.value) {
      return;
    }
    if (fromHeader && !this.injection.expandOnRowClick.value) {
      return;
    }
    this.injection.updateCollapseValue(this.innerValue.value);
    event.stopPropagation();
  }

  renderIcon() {
    const { expandIconPlacement, collapseValue } = this.injection;
    const isActive = collapseValue.value.includes(this.innerValue.value);

    return (
      <div
        className={classname(`${this.className}__icon`, [`${this.className}__icon--${expandIconPlacement.value}`], {
          [`${this.className}__icon--active`]: isActive,
        })}
      >
        {this.getChild('expandIcon') || (
          <t-fake-arrow isActive={isActive} disabled={this.isDisabled} onClick={this.handleClick} />
        )}
      </div>
    );
  }

  renderHeader() {
    const { expandIconPlacement, expandOnRowClick } = this.injection;
    return (
      <div
        className={classname(`${this.className}__header`, {
          [`${classPrefix}-is-clickable`]: expandOnRowClick.value && !this.isDisabled.value,
        })}
        onClick={(e) => this.handleClick(e, true)}
      >
        <div className={`${this.className}__header-left`}>
          {expandIconPlacement.value === 'left' && this.renderIcon()}
        </div>

        <div className={`${this.className}__header-content`}>{this.getChild('header')}</div>
        <div className={`${this.className}__header--blank`}></div>
        <div className={`${this.className}__header-right`}>
          <div className={`${this.className}__header-right-content`} onClick={(e: MouseEvent) => e.stopPropagation()}>
            {this.getChild('headerRightContent')}
          </div>
          {expandIconPlacement.value === 'right' && this.renderIcon()}
        </div>
      </div>
    );
  }

  renderBody() {
    const isActive = this.injection.collapseValue.value.includes(this.innerValue.value);

    const { destroyOnCollapse, children } = this.props;

    return destroyOnCollapse && !isActive ? null : (
      <div style={!destroyOnCollapse && !isActive ? 'display: none;' : ''} className={`${this.className}__body`}>
        <div className={`${this.className}__content`}>
          {this.getDefaultSlot()}
          {children}
        </div>
      </div>
    );
  }

  render(props: TdCollapsePanelProps): TNode {
    const { className } = props;

    return (
      <div
        className={classname(`${this.className}`, className, {
          [`${classPrefix}-is-disabled`]: this.isDisabled.value,
        })}
      >
        <div
          className={classname(`${this.className}__wrapper`, {
            [`${this.className}__wrapper--border-less`]: this.injection.borderless.value,
          })}
        >
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      </div>
    );
  }
}
