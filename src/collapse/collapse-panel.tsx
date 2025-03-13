import '../common/fake-arrow';
import 'omi-transition';

import { bind, Component, computed, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { getCollapseAnimation } from './collapse-animation';
import type { TdCollapsePanelProps } from './type';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {}

const { beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave } = getCollapseAnimation();

const className = `${classPrefix}-collapse-panel`;
@tag('t-collapse-panel')
export default class CollapsePanel extends Component<TdCollapsePanelProps> {
  static css = [
    `
    .${classPrefix}-slide-down-enter-active,
    .${classPrefix}-slide-down-leave-active {
      transition: height 0.2s, padding 0.2s;
    }
    `,
  ];

  static defaultProps = {
    expandIcon: true,
  };

  static propTypes = {
    destroyOnCollapse: Boolean,
    disabled: Boolean,
    value: [String, Number],
    expandIcon: Boolean,
    header: String,
    content: String,
    headerRightContent: String,
  };

  innerValue = signal(0);

  isDisabled = signal(false);

  afterLeaved: Omi.SignalValue<null | boolean> = signal(null);

  install(): void {
    const { getUniqId, updateCollapseValue, defaultExpandAll } = this.injection;

    const { value } = this.props;

    this.innerValue = computed(() => value ?? getUniqId());

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

  injection: { [key: string]: any } = {};

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
    if (this.afterLeaved.value) return;
    afterLeave(dom);
    this.afterLeaved.value = true;
  }

  @bind
  beforeEnter(dom) {
    if (this.afterLeaved.value === false) return;
    beforeEnter(dom);
    this.afterLeaved.value = false;
  }

  renderIcon() {
    const { expandIconPlacement, collapseValue } = this.injection;
    const isActive = collapseValue.value.includes(this.innerValue.value);
    if (this.props.expandIcon === false) {
      return null;
    }
    return (
      <div
        className={classname(`${className}__icon`, [`${className}__icon--${expandIconPlacement.value}`], {
          [`${className}__icon--active`]: isActive,
        })}
        part={`${className}__icon`}
        onClick={this.handleClick}
      >
        {typeof this.props.expandIcon !== 'boolean' ? (
          this.props.expandIcon
        ) : (
          <t-fake-arrow isActive={isActive} disabled={this.isDisabled.value} />
        )}
      </div>
    );
  }

  renderHeader() {
    const { expandIconPlacement, expandOnRowClick } = this.injection;
    return (
      <div
        className={classname(`${className}__header`, {
          [`${classPrefix}-is-clickable`]: expandOnRowClick?.value && !this.isDisabled.value,
        })}
        onClick={(e) => this.handleClick(e, true)}
      >
        <div className={`${className}__header-left`}>{expandIconPlacement?.value === 'left' && this.renderIcon()}</div>

        <div className={`${className}__header-content`} part={`${className}__header-content`}>
          {this.props.header}
        </div>
        <div className={`${className}__header--blank`} part={`${className}__header--blank`}></div>
        <div className={`${className}__header-right`} part={`${className}__header-right`}>
          <div
            className={`${className}__header-right-content`}
            part={`${className}__header-right-content`}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            {this.props.headerRightContent}
          </div>
          {expandIconPlacement?.value === 'right' && this.renderIcon()}
        </div>
      </div>
    );
  }

  renderBody() {
    const isActive = this.injection.collapseValue?.value.includes(this.innerValue.value);
    const { destroyOnCollapse } = this.props;
    if (this.afterLeaved.value === null && !isActive) {
      return null;
    }

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
        className={`${className}__body`}
        show={isActive}
      >
        <div className={`${className}__content`}>
          <slot>{this.props.content}</slot>
        </div>
      </div>
    );
  }

  render(props: CollapsePanelProps): TNode {
    const { innerClass, innerStyle } = props;
    return (
      <div
        className={classname(
          `${className}`,
          {
            [`${classPrefix}-is-disabled`]: this.isDisabled.value,
          },
          innerClass,
        )}
        part={`${className}`}
      >
        <div
          className={classname(`${className}__wrapper`, {
            [`${classPrefix}--borderless`]: this.injection?.borderless?.value,
          })}
          style={innerStyle}
          part={`${className}__wrapper`}
        >
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      </div>
    );
  }
}
