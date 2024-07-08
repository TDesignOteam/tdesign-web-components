import 'omi-transition';

import { createPopper } from '@popperjs/core';
import debounce from 'lodash/debounce';
import { Component, createRef, OmiProps, tag } from 'omi';

import { getIEVersion } from '../_common/js/utils/helper';
import classname from '../_util/classname';
import { StyledProps } from '../common';
import { PopupVisibleChangeContext, TdPopupProps } from './type';
import { attachListeners, getPopperPlacement, triggers } from './utils';

export interface PopupProps extends TdPopupProps, StyledProps {
  expandAnimation?: boolean;
  updateScrollTop?: (content: HTMLElement) => void;
}

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

  static defaultProps = {
    attach: 'body',
    destroyOnClose: false,
    hideEmptyPopup: false,
    placement: 'top',
    showArrow: true,
    trigger: 'hover',
    strategy: 'fixed',
  };

  triggerRef = createRef();

  popperRef = createRef();

  popper = null as any;

  timeout = null as any;

  contentClicked = false;

  hasDocumentEvent = false;

  visible = false;
  //   watch visible TODO:

  hasTrigger = () =>
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
    this.update();
  };

  handleOpen = (context: Pick<PopupVisibleChangeContext, 'trigger'>) => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.handlePopVisible(true, context);
      },
      this.hasTrigger().click ? 0 : this.normalizedDelay().open,
    );
  };

  handleClose = (context: Pick<PopupVisibleChangeContext, 'trigger'>) => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.handlePopVisible(false, context);
      },
      this.hasTrigger().click ? 0 : this.normalizedDelay().close,
    );
  };

  handleDocumentClick = (ev?: MouseEvent) => {
    setTimeout(() => {
      if (this.contentClicked) {
        setTimeout(() => {
          this.contentClicked = false;
        });
        return;
      }
      const triggerEl = this.triggerRef.current as HTMLElement;
      if (triggerEl.contains(ev.target as Node)) return;
      const popperEl = this.popperRef.current as HTMLElement;
      if (popperEl?.contains(ev.target as Node)) return;
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

  updateTrigger = () => {
    const trigger = attachListeners(this.rootElement);
    trigger.clean();
    const hasTrigger = this.hasTrigger();
    if (hasTrigger.hover) {
      trigger.add('mouseenter', () => {
        this.handleOpen({ trigger: 'trigger-element-hover' });
      });
      trigger.add('mouseleave', () => {
        this.handleClose({ trigger: 'trigger-element-hover' });
      });
    } else if (hasTrigger.focus) {
      trigger.add('focusin', () => this.handleOpen({ trigger: 'trigger-element-focus' }));
      trigger.add('focusout', () => this.handleClose({ trigger: 'trigger-element-blur' }));
    } else if (hasTrigger.click) {
      trigger.add('click', (e: MouseEvent) => {
        this.handleOpen({ trigger: 'trigger-element-click' });
        if (getIEVersion() < 11) {
          this.handleDocumentClick(e);
        }
      });
    } else if (hasTrigger['context-menu']) {
      trigger.add('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        e.button === 2 && this.handleToggle({ trigger: 'context-menu' });
      });
    }
  };

  installed() {
    this.updatePopper();
    this.updateTrigger();
    this.visible = this.props.visible;
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
    this.popper = createPopper(this.triggerRef.current as HTMLElement, this.popperRef.current as HTMLElement, {
      placement: getPopperPlacement(this.props.placement as PopupProps['placement']),
      strategy: this.props.strategy,
    });
  };

  setVisible = (visible: boolean) => {
    const { handlePopVisible } = this;
    handlePopVisible(visible, { trigger: 'document' });
  };

  beforeUpdate() {
    // deal visible
    if (this.getVisible()) {
      if (this.popperRef.current) {
        const el = this.popperRef.current as HTMLElement;
        el.style.display = 'block';
      }
      this.updatePopper();
    } else if (this.popperRef.current) {
      const el = this.popperRef.current as HTMLElement;
      el.style.display = 'none';
    }
  }

  handleBeforeEnter = () => {
    this.updatePopper();
  };

  render(props: OmiProps<PopupProps>) {
    const componentName = 't-popup';
    const popperClasses = classname(componentName, props.overlayClassName);
    const overlayClasses = classname(
      `${componentName}__content`,
      {
        [`${componentName}__content--arrow`]: props.showArrow,
        't-is-disabled': props.disabled,
      },
      props.overlayInnerClassName,
    );

    return (
      <t-trigger-root>
        <t-trigger ref={this.triggerRef} part="trigger">
          {props.triggerElement ? props.triggerElement : <slot />}
        </t-trigger>
        {this.getVisible() || !props.destroyOnClose ? (
          <div
            show={this.getVisible()}
            o-transition={{
              name: props.expandAnimation ? `${componentName}--animation-expand` : `${componentName}--animation`,
              beforeEnter: this.handleBeforeEnter,
            }}
            class={popperClasses}
            style={{ zIndex: props.zIndex, ...this.getOverlayStyle(props.overlayStyle) }}
            ref={this.popperRef}
            onMouseDown={() => (this.contentClicked = true)}
          >
            {(this.getVisible() || this.popperRef.current) && (
              <div
                class={overlayClasses}
                style={{ ...this.getOverlayStyle(props.overlayInnerStyle) }}
                onScroll={this.handleScroll}
              >
                {props.content}
                {props.showArrow ? (
                  <div class={`${componentName}__arrow`} style={{ ...this.getOverlayStyle(props.arrowStyle) }} />
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </t-trigger-root>
    );
  }
}
