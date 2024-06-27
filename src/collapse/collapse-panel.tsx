import './fake-arrow';

import { bind, Component, computed, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { TNode } from '../common';
import type { TdCollapsePanelProps } from './type';

const styleString = `
.t-collapse-panel__wrapper--border-less .t-collapse-panel__header {
  border-bottom: none;
}

.t-collapse-panel__wrapper--border-less .t-collapse-panel__body {
  background: var(--td-bg-color-container);
  border: none;
}

.t-collapse-panel.t-is-disabled .t-collapse-panel__header {
  cursor: not-allowed;
  color: var(--td-text-color-disabled);
}

.t-collapse-panel.t-is-disabled .t-collapse-panel__body {
  background: var(--td-bg-color-component-disabled);
}

.t-collapse-panel.t-is-disabled .t-collapse-panel__content {
    color: var(--td-text-color-disabled);
}
`;

@tag('t-collapse-panel')
export default class CollapsePanel extends Component<TdCollapsePanelProps> {
  static css?: string | CSSStyleSheet | (string | CSSStyleSheet)[] | undefined = [styleString];

  constructor() {
    super();
    this.props = {
      ...this.props,
    };
  }

  innerValue = signal(0);

  componentName = `${classPrefix}-collapse-panel`;

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
        className={classname(
          `${this.componentName}__icon`,
          [`${this.componentName}__icon--${expandIconPlacement.value}`],
          {
            [`${this.componentName}__icon--active`]: isActive,
          },
        )}
      >
        <slot name="expandIcon">
          <fake-arrow isActive={isActive} disabled={this.isDisabled} onClick={this.handleClick} />
        </slot>
      </div>
    );
  }

  renderHeader() {
    const { header } = this.props;
    const { expandIconPlacement, expandOnRowClick } = this.injection;
    return (
      <div
        className={classname(`${this.componentName}__header`, {
          [`${classPrefix}-is-clickable`]: expandOnRowClick.value && !this.isDisabled.value,
        })}
        onClick={(e) => this.handleClick(e, true)}
      >
        <div className={`${this.componentName}__header-left`}>
          {expandIconPlacement.value === 'left' && this.renderIcon()}
        </div>

        <div className={`${this.componentName}__header-content`}>
          <slot name="header">{header}</slot>
        </div>
        <div className={`${this.componentName}__header--blank`}></div>
        <div className={`${this.componentName}__header-right`}>
          <div
            className={`${this.componentName}__header-right-content`}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <slot name="headerRightContent"></slot>
          </div>
          {expandIconPlacement.value === 'right' && this.renderIcon()}
        </div>
      </div>
    );
  }

  renderBody() {
    const isActive = this.injection.collapseValue.value.includes(this.innerValue.value);

    const { destroyOnCollapse } = this.props;

    return destroyOnCollapse && !isActive ? null : (
      <div style={!destroyOnCollapse && !isActive ? 'display: none;' : ''} className={`${this.componentName}__body`}>
        <div className={`${this.componentName}__content`}>
          <slot></slot>
        </div>
      </div>
    );
  }

  render(props): TNode {
    const { className } = props;
    console.log(
      'collapseProps',
      this.isDisabled.value,
      this.injection.collapseProps.value,
      this.injection.disabled,
      this.injection.disabled.value,
    );

    return (
      <div
        className={classname(`${this.componentName}`, className, {
          [`${classPrefix}-is-disabled`]: this.isDisabled.value,
        })}
      >
        <div
          className={classname(`${this.componentName}__wrapper`, {
            [`${this.componentName}__wrapper--border-less`]: this.injection.borderless.value,
          })}
        >
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      </div>
    );
  }
}
