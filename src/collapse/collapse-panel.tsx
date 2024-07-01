import '../common/fake-arrow';
import 'omi-transition';

import { bind, Component, computed, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { getCollapseAnimation } from './collapse-animation';
import type { TdCollapsePanelProps } from './type';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {}

const { beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave } = getCollapseAnimation();

@tag('t-collapse-panel')
export default class CollapsePanel extends Component<TdCollapsePanelProps> {
  static isLightDom = true;

  // static css = `
  //   .t-slide-down-leave-to,
  //   .t-slide-down-enter-from {
  //     height: 0;
  //   }

  //   .t-slide-down-leave-from,
  //   .t-slide-down-enter-to {
  //     height: 100%;
  //   }

  //   .t-slide-down-leave-active,
  //   .t-slide-down-enter-active {
  //     // transition: all 500ms ease-in;
  //   }`

  innerValue = signal(0);

  className = `${classPrefix}-collapse-panel`;

  isDisabled = signal(false);

  afterLeaved = signal(false);

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

  @bind
  afterLeave(dom) {
    afterLeave(dom);
    this.afterLeaved.value = true;
  }

  @bind
  beforeEnter(dom) {
    beforeEnter(dom);
    this.afterLeaved.value = false;
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
    const { destroyOnCollapse } = this.props;

    return destroyOnCollapse && !isActive && this.afterLeaved.value ? null : (
      <div
        o-transition={{
          name: `${classPrefix}-slide-down`,
          beforeEnter: this.beforeEnter,
          enter,
          afterEnter,
          beforeLeave,
          leave,
          afterLeave: this.afterLeave,
        }}
        className={`${this.className}__body`}
        show={isActive}
      >
        <div className={`${this.className}__content`}>{this.getDefaultSlot()}</div>
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
