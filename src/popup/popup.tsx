import 'omi-transition';
import './popupTrigger';
import '../common/portal';

import { createPopper, Instance } from '@popperjs/core';
import { debounce } from 'lodash-es';
import { cloneElement, Component, createRef, OmiProps, tag, VNode } from 'omi';

import { getIEVersion } from '../_common/js/utils/helper';
import classname from '../_util/classname';
import { getChildrenArray } from '../_util/component';
import { domContains } from '../_util/dom';
import { StyledProps, TNode } from '../common';
import { PopupVisibleChangeContext, TdPopupProps } from './type';
import { attachListeners, getPopperPlacement, triggers } from './utils';

export interface PopupProps extends TdPopupProps, StyledProps {
  expandAnimation?: boolean;
  updateScrollTop?: (content: HTMLElement) => void;
}

export const defaultProps = {
  attach: 'body',
  destroyOnClose: false,
  hideEmptyPopup: false,
  placement: 'top',
  showArrow: true,
  trigger: 'hover' as TdPopupProps['trigger'],
};

export const PopupTypes = {
  attach: [String, Function],
  content: [String, Number, Object, Function],
  delay: [Number, Array],
  destroyOnClose: Boolean,
  disabled: Boolean,
  hideEmptyPopup: Boolean,
  overlayClassName: String,
  overlayInnerClassName: String,
  overlayInnerStyle: [Object, Function],
  overlayStyle: [Object, Function],
  arrowStyle: [Object, Function],
  placement: String,
  popperOptions: Object,
  showArrow: Boolean,
  trigger: String,
  triggerElement: [String, Number, Object, Function],
  visible: Boolean,
  defaultVisible: Boolean,
  zIndex: Number,
  onScroll: Function,
  onScrollToBottom: Function,
  onVisibleChange: Function,
  expandAnimation: Boolean,
  updateScrollTop: Function,
};

@tag('t-popup')
export default class Popup extends Component<PopupProps> {
  static css = `
    t-trigger::part(pop-tag) {
      vertical-align: middle;
      -webkit-animation: t-fade-in .2s ease-in-out;
      animation: t-fade-in .2s ease-in-out;
      margin: 3px var(--td-comp-margin-xs) 3px 0;
    }
  `;

  static propTypes = PopupTypes;

  static defaultProps = defaultProps;

  triggerRef = createRef();

  popperRef = createRef();

  popper = null as any;

  timeout = null as any;

  contentClicked = false;

  hasDocumentEvent = false;

  visible = false;

  // 防止多次触发显隐
  leaveFlag = false;

  isPopoverInDomTree = false;

  popperInstance: Instance = null;

  triggerType = () =>
    triggers.reduce(
      (map, trigger) => ({
        ...map,
        [trigger]: this.props.trigger.includes(trigger),
      }),
      {} as any,
    );

  normalizedDelay = () => {
    const delay = [].concat(this.props.delay ?? [250, 150]);
    return {
      open: delay[0],
      close: delay[1] ?? delay[0],
    };
  };

  getVisible = () => {
    // controlled
    if (this.props.visible !== undefined) return this.props.visible;
    return this.visible;
  };

  handlePopVisible = (visible: boolean, context: PopupVisibleChangeContext) => {
    if (this.props.disabled || visible === !!this.visible) return;
    this.visible = visible;
    this.handleDocumentEvent(visible);
    if (typeof this.props.onVisibleChange === 'function') {
      this.props.onVisibleChange(visible, context);
    }
    if (this.visible) {
      this.isPopoverInDomTree = true;
    } else if (this.props.destroyOnClose) {
      this.isPopoverInDomTree = false;
    }
    this.update();
    if (this.visible) {
      this.addPopContentEvent();
    }
  };

  handleOpen = (context: Pick<PopupVisibleChangeContext, 'trigger'>) => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.handlePopVisible(true, context);
      },
      this.triggerType().click ? 0 : this.normalizedDelay().open,
    );
  };

  handleClose = (context: Pick<PopupVisibleChangeContext, 'trigger'>) => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.handlePopVisible(false, context);
      },
      this.triggerType().click ? 0 : this.normalizedDelay().close,
    );
  };

  handleDocumentClick = (ev?: MouseEvent) => {
    const target = ev.composedPath()[0];
    setTimeout(() => {
      if (this.contentClicked) {
        setTimeout(() => {
          this.contentClicked = false;
        });
        return;
      }

      const triggerEl = this.triggerRef.current as HTMLElement;
      if (domContains(triggerEl, target as HTMLElement)) return;
      const popperEl = this.popperRef.current as HTMLElement;
      if (domContains(popperEl, target as HTMLElement)) return;
      this.handlePopVisible(false, { trigger: 'document', e: ev });
    });
  };

  // when visible is changed
  handleDocumentEvent = (visible: boolean) => {
    if (visible) {
      if (!this.hasDocumentEvent) {
        document.addEventListener('mousedown', this.handleDocumentClick, true);
        this.hasDocumentEvent = true;
      }
    } else {
      document.removeEventListener('mousedown', this.handleDocumentClick, true);
      this.hasDocumentEvent = false;
    }
  };

  clickHandle = (e: MouseEvent) => {
    if (this.visible === true) {
      const triggerEl = this.triggerRef.current as HTMLElement;
      const target = e.composedPath()[0];
      if (domContains(triggerEl, target as HTMLElement)) {
        this.handlePopVisible(false, { trigger: 'trigger-element-click', e });
        return;
      }
    }

    this.handleOpen({ trigger: 'trigger-element-click' });
    if (getIEVersion() < 11) {
      this.handleDocumentClick(e);
    }
  };

  addTriggerEvent = () => {
    const triggerRef = this.triggerRef.current as HTMLElement;

    if (!triggerRef) return;

    const trigger = attachListeners(triggerRef);
    trigger.clean();
    const triggerType = this.triggerType();
    if (triggerType.hover) {
      trigger.add('mouseenter', () => {
        this.leaveFlag = false;
        this.handleOpen({ trigger: 'trigger-element-hover' });
      });
      trigger.add('mouseleave', () => {
        this.leaveFlag = false;
        this.handleClose({ trigger: 'trigger-element-hover' });
      });
    } else if (triggerType.focus) {
      trigger.add('focusin', () => this.handleOpen({ trigger: 'trigger-element-focus' }));
      trigger.add('focusout', () => this.handleClose({ trigger: 'trigger-element-blur' }));
    } else if (triggerType.click) {
      trigger.add('click', (e: MouseEvent) => {
        this.clickHandle(e);
      });
    } else if (triggerType['context-menu']) {
      trigger.add('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        e.button === 2 && this.handleToggle({ trigger: 'context-menu' });
      });
    }
  };

  addPopContentEvent() {
    const popperEl = this.popperRef.current as HTMLElement;
    if (!popperEl) return;
    const popper = attachListeners(popperEl);
    popper.clean();

    const triggerType = this.triggerType();
    if (triggerType.hover) {
      popper.add('mouseenter', () => {
        if (!this.leaveFlag) {
          clearTimeout(this.timeout);
          this.handleOpen({ trigger: 'trigger-element-hover' });
        }
      });

      popper.add('mouseleave', () => {
        this.leaveFlag = true;
        clearTimeout(this.timeout);
        this.handleClose({ trigger: 'trigger-element-hover' });
      });
    }
  }

  handleToggle = (context: PopupVisibleChangeContext) => {
    const visible = !this.visible;
    if (!visible) return;
    this.handlePopVisible(visible, context);
  };

  handleScroll(e: WheelEvent) {
    this.props.onScroll?.({ e });
    const debounceOnScrollBottom = debounce((e) => this.props.onScrollToBottom?.({ e }), 100);
    const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLDivElement;
    if (clientHeight + Math.floor(scrollTop) === scrollHeight) {
      debounceOnScrollBottom(e);
    }
  }

  getOverlayStyle(overlayStyle: PopupProps['overlayStyle']) {
    if (this.triggerRef.current && this.popperRef.current && typeof overlayStyle === 'function') {
      return { ...overlayStyle(this.triggerRef.current as HTMLElement, this.popperRef.current as HTMLElement) };
    }
    return { ...overlayStyle };
  }

  updatePopper = () => {
    this.popperInstance = createPopper(this.triggerRef.current as HTMLElement, this.popperRef.current as HTMLElement, {
      placement: getPopperPlacement(this.props.placement as PopupProps['placement']),
      ...(this.props?.popperOptions || {}),
    });
  };

  setVisible = (visible: boolean) => {
    const { handlePopVisible } = this;
    handlePopVisible(visible, { trigger: 'document' });
  };

  showPopupByControlled = () => {
    this.isPopoverInDomTree = true;
    this.update();
    this.addPopContentEvent();
  };

  install(): void {
    window.addEventListener('resize', this.updatePopper);
  }

  installed() {
    this.addTriggerEvent();

    this.visible = this.props.visible;

    // 初始化就显示时
    if (this.visible) {
      this.showPopupByControlled();
    }
  }

  ready(): void {
    this.updatePopper();
  }

  receiveProps(props, oldProps) {
    if (props.visible && oldProps.visible !== props.visible) {
      this.showPopupByControlled();
    }
  }

  uninstall(): void {
    window.removeEventListener('resize', this.updatePopper);
  }

  render(props: OmiProps<PopupProps>) {
    const componentName = 't-popup';
    const popperClasses = classname(componentName, props.innerClass, props.overlayClassName);
    const overlayClasses = classname(
      `${componentName}__content`,
      {
        [`${componentName}__content--arrow`]: props.showArrow,
        't-is-disabled': props.disabled,
      },
      props.overlayInnerClassName,
    );

    const trigger = getChildrenArray(props.triggerElement ? props.triggerElement : this.props.children);

    const children = trigger.map((child: TNode) => {
      // 对 t-button 做特殊处理
      if (typeof child === 'object' && (child as any).nodeName === 't-button') {
        const oldClick = (child as VNode).attributes?.onClick;
        return cloneElement(child as VNode, {
          onClick: (e) => {
            if (oldClick) oldClick(e);
            this.clickHandle(e.detail.e);
          },
        });
      }
      return child;
    });

    return (
      <>
        {children.length > 1 ? (
          <span className="t-trigger" ref={this.triggerRef}>
            <slot>{children}</slot>
          </span>
        ) : (
          cloneElement(children[0] as VNode, { ref: this.triggerRef })
        )}
        {this.isPopoverInDomTree ? (
          <t-portal
            attach={props.attach}
            onDOMReady={(h) => {
              this.popperRef.current = h;
              setTimeout(() => {
                this.updatePopper();
              });
            }}
          >
            <div
              show={this.getVisible()}
              o-transition={{
                name: props.expandAnimation ? `${componentName}--animation-expand` : `${componentName}--animation`,
              }}
              class={popperClasses}
              style={{ zIndex: props.zIndex, ...props.innerStyle, ...this.getOverlayStyle(props.overlayStyle) }}
              onMouseDown={() => (this.contentClicked = true)}
            >
              <div
                class={overlayClasses}
                style={{ ...this.getOverlayStyle(props.overlayInnerStyle) }}
                onScroll={this.handleScroll}
              >
                <slot name="content">{props.content}</slot>
                {props.showArrow ? (
                  <div class={`${componentName}__arrow`} style={{ ...this.getOverlayStyle(props.arrowStyle) }} />
                ) : null}
              </div>
            </div>
          </t-portal>
        ) : null}
      </>
    );
  }
}
