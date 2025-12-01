import 'omi-transition';
import './popupTrigger';
import '../common/portal';

import { createPopper, Instance } from '@popperjs/core';
import { debounce, throttle } from 'lodash-es';
import { cloneElement, Component, createRef, OmiProps, tag, VNode } from 'omi';

import { getIEVersion } from '../_common/js/utils/helper';
import classname from '../_util/classname';
import { getChildrenArray } from '../_util/component';
import { domContains, setExportparts } from '../_util/dom';
import { StyledProps, TNode } from '../common';
import { PopupVisibleChangeContext, TdPopupProps } from './type';
import { attachListeners, getPopperPlacement, triggers } from './utils';

export interface PopupProps extends TdPopupProps, StyledProps {
  expandAnimation?: boolean;
  updateScrollTop?: (content: HTMLElement) => void;
  /** 触发元素宽度变化时的回调 */
  onTriggerResize?: (width: number, height: number) => void;
  /** popup内容宽度变化时的回调 */
  onPopperResize?: (width: number, height: number) => void;
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
  onTriggerResize: Function,
  onPopperResize: Function,
};

@tag('t-popup')
export default class Popup extends Component<PopupProps> {
  static css = `
    .t-popup__wrapper {
      display: contents;
    }
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
      // 提供兜底处理，确保频繁触发window resize时panel的位置正确
      requestAnimationFrame(() => {
        this.updatePopper();
        this.update();
      });
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
    const path = ev && ev.composedPath ? ev.composedPath() : [];
    const target = path[0] || (ev && ev.target);
    setTimeout(() => {
      if (this.contentClicked) {
        setTimeout(() => {
          this.contentClicked = false;
        });
        return;
      }

      const triggerEl = this.triggerRef.current as HTMLElement;
      const popperEl = this.popperRef.current as HTMLElement;

      // 兼容 Shadow DOM，若事件路径包含触发元素或浮层，则视为内部点击
      if (path && path.includes && (path.includes(triggerEl) || path.includes(popperEl))) return;

      if (domContains(triggerEl, target as HTMLElement)) return;
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
    const path = e.composedPath ? e.composedPath() : [];
    const triggerEl = this.triggerRef.current as HTMLElement;

    // 使用受控可见性判断（兼容受控场景）
    if (this.getVisible() === true) {
      const target = path[0] || (e && e.target);
      if (domContains(triggerEl, target as HTMLElement) || (path && path.includes && path.includes(triggerEl))) {
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
    if (typeof overlayStyle === 'function') {
      const triggerElement = this.triggerRef.current as HTMLElement;
      const popupElement = this.popperRef.current as HTMLElement;
      const style = overlayStyle(triggerElement, popupElement);
      return style ? { ...style } : {};
    }
    if (overlayStyle && typeof overlayStyle === 'object') {
      return { ...overlayStyle };
    }
    return {};
  }

  triggerResizeObserver: ResizeObserver = null;

  popperResizeObserver: ResizeObserver = null;

  // 创建popper实例
  createPopperInstance = () => {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    if (this.triggerRef.current && this.popperRef.current) {
      this.popperInstance = createPopper(
        this.triggerRef.current as HTMLElement,
        this.popperRef.current as HTMLElement,
        {
          placement: getPopperPlacement(this.props.placement as PopupProps['placement']),
          ...(this.props?.popperOptions || {}),
        },
      );
    }
  };

  // 更新popper位置（以前updatePopper会每次都销毁重建，有可能导致panel位置变化更新不及时）
  updatePopper = () => {
    if (this.popperInstance) {
      this.popperInstance.update();
    } else {
      this.createPopperInstance();
    }
  };

  setVisible = (visible: boolean) => {
    const { handlePopVisible } = this;
    handlePopVisible(visible, { trigger: 'document' });
  };

  showPopupByControlled = () => {
    this.isPopoverInDomTree = true;
    this.update();
    this.addPopContentEvent();
    // 提供兜底处理，确保频繁触发window resize时panel的位置正确
    requestAnimationFrame(() => {
      this.updatePopper();
    });
  };

  // window resize时更新popper位置并重新计算样式
  handleWindowResize = throttle(() => {
    if (this.visible) {
      // 重新渲染，目的是更新overlayInnerStyle
      this.update();
      // 等浏览器完成渲染后，再用新的dom位置计算popper位置确保定位正确
      requestAnimationFrame(() => {
        this.updatePopper();
      });
    }
  }, 100); // 加个频繁window resize时的节流

  install(): void {
    window.addEventListener('resize', this.handleWindowResize);
  }

  setupTriggerResizeObserver = () => {
    if (this.triggerResizeObserver) {
      this.triggerResizeObserver.disconnect();
    }
    if (this.triggerRef.current) {
      this.triggerResizeObserver = new ResizeObserver((entries) => {
        if (this.visible) {
          // 重新渲染，目的是更新overlayInnerStyle
          this.update();
          // 等浏览器完成渲染后，再用新的dom位置计算popper位置确保定位正确
          requestAnimationFrame(() => {
            this.updatePopper();
          });
        }
        if (this.props.onTriggerResize && entries[0]) {
          const { width, height } = entries[0].contentRect;
          this.props.onTriggerResize(width, height);
        }
      });
      this.triggerResizeObserver.observe(this.triggerRef.current as HTMLElement);
    }
  };

  setupPopperResizeObserver = () => {
    if (this.popperResizeObserver) {
      this.popperResizeObserver.disconnect();
    }
    if (this.popperRef.current) {
      this.popperResizeObserver = new ResizeObserver((entries) => {
        if (this.props.onPopperResize && entries[0]) {
          const { width, height } = entries[0].contentRect;
          this.props.onPopperResize(width, height);
        }
      });
      this.popperResizeObserver.observe(this.popperRef.current as HTMLElement);
    }
  };

  installed() {
    this.addTriggerEvent();
    this.setupTriggerResizeObserver();

    this.visible = this.props.visible;

    // 初始化就显示时
    if (this.visible) {
      this.showPopupByControlled();
    }
  }

  ready(): void {
    this.createPopperInstance();
    setExportparts(this);
  }

  receiveProps(props, oldProps) {
    if (props.visible && oldProps.visible !== props.visible) {
      this.showPopupByControlled();
    }
    if (props.placement !== oldProps.placement) {
      this.createPopperInstance();
    }
  }

  uninstall(): void {
    window.removeEventListener('resize', this.handleWindowResize);
    if (this.triggerResizeObserver) {
      this.triggerResizeObserver.disconnect();
      this.triggerResizeObserver = null;
    }
    if (this.popperResizeObserver) {
      this.popperResizeObserver.disconnect();
      this.popperResizeObserver = null;
    }
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
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
      // Fragment作为根元素时，setExportparts调用getAttribute会报错
      <div class={`${componentName}__wrapper`}>
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
              // 首次挂载popup panel时，保证overlayInnerStyle样式计算生效
              this.update();
              setTimeout(() => {
                this.createPopperInstance();
                // 在 popper DOM 准备好后设置 ResizeObserver
                this.setupPopperResizeObserver();
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
      </div>
    );
  }
}
