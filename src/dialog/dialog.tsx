import 'tdesign-icons-web-components/esm/components/close';
import 'tdesign-icons-web-components/esm/components/info-circle';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/error-circle';
import 'omi-transition';
import '../common/portal';

import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { bind, Component, createRef, OmiProps, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import type { ButtonProps } from '../button';
import { ClassName, StyledProps, Styles } from '../common';
import stack from './stack';
import type { TdDialogProps } from './type';

export interface DialogProps extends TdDialogProps, StyledProps {}
let uid = 0;

function getCSSValue(v: string | number) {
  return isNaN(Number(v)) ? v : `${Number(v)}px`;
}
let mousePosition: { x: number; y: number } | null;
let bodyOverflow = '';

const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};

if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  document.documentElement.addEventListener('click', getClickPosition, true);
}

@tag('t-dialog')
export default class Dialog extends Component<DialogProps> {
  static defaultProps = {
    mode: 'modal',
    showInAttachedElement: false,
    zIndex: 2500,
    footer: true,
    header: true,
    placement: 'top',
    preventScrollThrough: true,
    showOverlay: true,
    theme: 'default',
    closeBtn: true,
    draggable: false,
    destroyOnClose: false,
    visible: false,
    closeOnOverlayClick: true,
    closeOnEscKeydown: true,
  };

  static propTypes = {
    mode: String,
    showInAttachedElement: Boolean,
    zIndex: Number,
    footer: Boolean,
    header: Boolean,
    placement: String,
    preventScrollThrough: Boolean,
    showOverlay: Boolean,
    theme: String,
    closeBtn: Boolean,
    draggable: Boolean,
    destroyOnClose: Boolean,
    onCancel: Function,
    onClose: Function,
    onCloseBtnClick: Function,
    onClosed: Function,
    onConfirm: Function,
    onEscKeydown: Function,
    onOpened: Function,
    onOverlayClick: Function,
    closeOnOverlayClick: Boolean,
    closeOnEscKeydown: Boolean,
  };

  static css = [
    `
.${classPrefix}-dialog-zoom__vue-enter-from .${classPrefix}-dialog {
  transform: scale(0);
  opacity: 0;
}
.${classPrefix}-dialog-zoom__vue-enter-from .${classPrefix}-dialog__mask {
  opacity: 0;
}
`,
  ];

  className = `${classPrefix}-dialog`;

  dialogRef = createRef();

  dialogPositionRef = createRef();

  instanceGlobal: Record<string, any> = {};

  animationEnd = signal(false);

  init = signal(false);

  uid = 0;

  // 是否模态形式的对话框
  get isModal() {
    return this.props.mode === 'modal';
  }

  // 是否非模态对话框
  get isModeLess() {
    return this.props.mode === 'modeless';
  }

  // 是否普通对话框，没有脱离文档流的对话框
  get isNormal() {
    return this.props.mode === 'normal';
  }

  get isFullScreen() {
    return this.props.mode === 'full-screen';
  }

  get ctxClass() {
    return classname(`${this.className}__ctx`, {
      [`${this.className}__ctx--fixed`]: this.isModal || this.isFullScreen,
      [`${this.className}__ctx--absolute`]: this.isModal && this.props.showInAttachedElement,
      [`${this.className}__ctx--modeless`]: this.isModeLess,
    });
  }

  get maskClass() {
    return classname(`${this.className}__mask`, !this.props.showOverlay && `${classPrefix}-is-hidden`);
  }

  get wrapClass() {
    return classname([!this.isNormal && `${this.className}__wrap`]);
  }

  get dialogClass() {
    const dialogClass = [
      `${this.className}`,
      `${this.className}__modal-${this.props.theme}`,
      this.isModeLess && this.draggable && `${this.className}--draggable`,
    ];
    if (this.isFullScreen) {
      dialogClass.push(`${this.className}__fullscreen`);
    } else {
      dialogClass.push(`${this.className}--default`);
    }
    return classname(dialogClass);
  }

  get positionClass() {
    if (this.isNormal) return '';
    if (this.isFullScreen) return classname([`${this.className}__position_fullscreen`]);
    const dialogClass = [
      `${this.className}__position`,
      !!this.props.top && `${this.className}--top`,
      `${this.props.placement && !this.props.top ? `${this.className}--${this.props.placement}` : ''}`,
    ];
    return classname(dialogClass);
  }

  get positionStyle(): Styles {
    if (this.isFullScreen) return {}; // 全屏模式，top属性不生效
    const topStyle = {} as Styles;
    if (this.props.top !== undefined) {
      // 判断是否时数字
      if (isNumber(this.props.top) && this.props.top < 0) {
        topStyle.paddingTop = `${this.props.top}px`;
      } else {
        topStyle.paddingTop = this.props.top;
      }
    }
    return topStyle;
  }

  get dialogStyle(): Styles {
    return !this.isFullScreen ? { width: getCSSValue(this.props.width) } : {}; // width全屏模式不生效;
  }

  @bind
  overlayAction(e: MouseEvent) {
    if (e.target !== this.dialogPositionRef.current) {
      return;
    }
    this.props.onOverlayClick?.({ e });
    if (this.props.showOverlay && this.props.closeOnOverlayClick) {
      this.emitCloseEvent({ e, trigger: 'overlay' });
    }
  }

  @bind
  closeBtnAction(e: MouseEvent) {
    this.props.onCloseBtnClick?.({ e });
    this.emitCloseEvent({
      trigger: 'close-btn',
      e,
    });
  }

  @bind
  cancelBtnAction(e: MouseEvent) {
    this.props.onCancel?.({ e });
    this.emitCloseEvent({
      trigger: 'cancel',
      e,
    });
  }

  @bind
  confirmBtnAction(e: MouseEvent) {
    this.props.onConfirm?.({ e });
  }

  // 打开弹窗动画结束时事件
  @bind
  afterEnter() {
    this.props.onOpened?.();
  }

  @bind
  addKeyboardEvent(status: boolean) {
    if (status) {
      document.addEventListener('keydown', this.keyboardEvent);
      this.props.confirmOnEnter && document.addEventListener('keydown', this.keyboardEnterEvent);
    } else {
      document.removeEventListener('keydown', this.keyboardEvent);
      this.props.confirmOnEnter && document.removeEventListener('keydown', this.keyboardEnterEvent);
    }
  }

  @bind
  storeUid(flag: boolean) {
    if (flag) {
      stack.push(this.uid);
    } else {
      stack.pop(this.uid);
    }
  }

  @bind
  keyboardEvent(e: KeyboardEvent) {
    if (e.code === 'Escape' && stack.top === this.uid) {
      this.props.onEscKeydown?.({ e });
      // 根据 closeOnEscKeydown 判断按下ESC时是否触发close事件
      if (this.props.closeOnEscKeydown) {
        this.emitCloseEvent({ e, trigger: 'esc' });
      }
    }
  }

  // 回车触发确认事件
  @bind
  keyboardEnterEvent(e: KeyboardEvent) {
    const { code } = e;
    if ((code === 'Enter' || code === 'NumpadEnter') && stack.top === this.uid) {
      this.props.onConfirm?.({ e });
    }
  }

  // 关闭弹窗动画结束时事件
  @bind
  afterLeave() {
    if (this.isModeLess && this.draggable) {
      const target = this.dialogRef as HTMLElement;
      if (!target) return;
      // 关闭弹窗 清空拖拽设置的相关css
      target.style.position = 'relative';
      target.style.left = 'unset';
      target.style.top = 'unset';
    }
    this.props.onClosed?.();
    this.animationEnd.value = true;
    document.body.style.overflow = bodyOverflow;
  }

  @bind
  emitCloseEvent(context) {
    this.props.onClose?.(context);
  }

  @bind
  onStopDown(e: MouseEvent) {
    if (this.isModeLess && this.draggable) e.stopPropagation();
  }

  @bind
  getIcon() {
    const icon = {
      info: <t-icon-info-circle class={`${classPrefix}-is-info`} />,
      warning: <t-icon-error-circle class={`${classPrefix}-is-warning`} />,
      danger: <t-icon-error-circle class={`${classPrefix}-is-error`} />,
      success: <t-icon-check-circle class={`${classPrefix}-is-success`} />,
    };
    return icon[this.props.theme];
  }

  @bind
  getButtonByProps(
    button: string | ButtonProps,
    params: {
      defaultButtonProps: ButtonProps;
      className?: ClassName;
      confirmLoading?: boolean;
    },
  ) {
    const { defaultButtonProps, className, confirmLoading } = params;
    let newOptions = defaultButtonProps;
    if (isString(button)) {
      newOptions.content = button;
    } else if (isObject(button)) {
      newOptions = { ...newOptions, ...button };
    }
    if (confirmLoading !== undefined) {
      newOptions.loading = confirmLoading;
    }
    return (
      <t-button className={className} {...newOptions}>
        {newOptions.content}
      </t-button>
    );
  }

  @bind
  getDefaultCancelBtnProps(): ButtonProps {
    const props: ButtonProps = {
      theme: 'default',
      content: '取消',
      onClick: (e) => {
        this.cancelBtnAction(e);
      },
    };

    return props;
  }

  @bind
  getDefaultConfirmBtnProps(): ButtonProps {
    const defaultTheme = 'primary';
    const props: ButtonProps = {
      theme: defaultTheme,
      content: '确定',
      onClick: (e) => {
        this.confirmBtnAction(e);
      },
    };

    return props;
  }

  @bind
  getCancelBtn() {
    const { cancelBtn } = this.props;
    const cancelClassName = `${this.className}__cancel ${this.className}__button`;

    if (cancelBtn === null) return null;
    const defaultButtonProps: ButtonProps = this.getDefaultCancelBtnProps();
    if (cancelBtn && ['string', 'object'].includes(typeof cancelBtn)) {
      return this.getButtonByProps(cancelBtn as string | ButtonProps, {
        defaultButtonProps,
        className: cancelClassName,
      });
    }
    if (cancelBtn) {
      return cancelBtn;
    }

    return (
      <t-button className={cancelClassName} theme="default" onClick={this.cancelBtnAction}>
        取消
      </t-button>
    );
  }

  @bind
  getConfirmBtn() {
    const { confirmBtn, confirmLoading } = this.props;
    const confirmClassName = `${this.className}__confirm ${this.className}__button`;

    if (confirmBtn === null) return null;

    const defaultButtonProps = this.getDefaultConfirmBtnProps();
    if (confirmBtn && ['string', 'object'].includes(typeof confirmBtn)) {
      return this.getButtonByProps(confirmBtn as string | ButtonProps, {
        defaultButtonProps,
        className: confirmClassName,
        confirmLoading,
      });
    }

    if (confirmBtn) {
      return confirmBtn;
    }

    return (
      <t-button
        className={confirmClassName}
        theme="primary"
        loading={this.props.confirmLoading}
        onClick={this.confirmBtnAction}
      >
        确定
      </t-button>
    );
  }

  @bind
  getFooterContent() {
    if (this.props.footer === false) return null;
    if (this.props.footer === true) {
      return (
        <div>
          {this.getCancelBtn()}
          {this.getConfirmBtn()}
        </div>
      );
    }

    return this.props.footer;
  }

  @bind
  getCloseBtn() {
    if (this.props.closeBtn === true) {
      return <t-icon-close />;
    }
    return this.props.closeBtn;
  }

  @bind
  beforeEnter() {
    const target = this.dialogRef.current as HTMLElement;

    if (target && mousePosition) {
      target.style.transformOrigin = `${mousePosition.x - target.offsetLeft}px ${mousePosition.y - target.offsetTop}px`;
    }

    if ((this.isModal || this.isFullScreen) && !this.props.showInAttachedElement) {
      bodyOverflow = document.body.style.overflow;
      setTimeout(() => {
        document.body.style.overflow = 'hidden';
      });
    }
  }

  @bind
  renderDialog() {
    const defaultHeader = <h5 className="title"></h5>;
    const headerClassName = this.isFullScreen
      ? [`${this.className}__header`, `${this.className}__header--fullscreen`]
      : `${this.className}__header`;
    const closeClassName = this.isFullScreen
      ? [`${this.className}__close`, `${this.className}__close--fullscreen`]
      : `${this.className}__close`;
    const bodyClassName =
      this.props.theme === 'default'
        ? [`${this.className}__body`]
        : [`${this.className}__body`, `${this.className}__body__icon`];

    const footerContent = this.getFooterContent();

    if (this.isFullScreen && footerContent) {
      bodyClassName.push(`${this.className}__body--fullscreen`);
    } else if (this.isFullScreen) {
      bodyClassName.push(`${this.className}__body--fullscreen--without-footer`);
    }
    const footerClassName = this.isFullScreen
      ? [`${this.className}__footer`, `${this.className}__footer--fullscreen`]
      : `${this.className}__footer`;

    const footer = this.props.footer ? (
      <div className={classname(footerClassName)} onmousedown={this.onStopDown}>
        {footerContent}
      </div>
    ) : null;

    // 此处获取定位方式 top 优先级较高 存在时 默认使用top定位
    return (
      // 非模态形态下draggable为true才允许拖拽
      <div className={this.wrapClass}>
        <div
          className={this.positionClass}
          style={this.positionStyle}
          onClick={this.overlayAction}
          ref={this.dialogPositionRef}
        >
          <div key="dialog" ref={this.dialogRef} className={this.dialogClass} style={this.dialogStyle}>
            <div className={classname(headerClassName)} onmousedown={this.onStopDown}>
              <div className={`${this.className}__header-content`}>
                {this.getIcon()}
                {this.props.header || defaultHeader}
              </div>
              {this.props.closeBtn ? (
                <span className={classname(closeClassName)} onClick={this.closeBtnAction}>
                  {/* {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)} */}
                  {this.getCloseBtn()}
                </span>
              ) : null}
            </div>

            <div className={classname(bodyClassName)} onmousedown={this.onStopDown}>
              <slot></slot>
            </div>
            {footer}
          </div>
        </div>
      </div>
    );
  }

  install() {
    uid += 1;
    this.uid = uid;
    this.addKeyboardEvent(true);
  }

  uninstall(): void {
    this.addKeyboardEvent(false);
  }

  receiveProps(props: DialogProps | OmiProps<DialogProps, any>, oldProps: DialogProps | OmiProps<DialogProps, any>) {
    if (props.visible !== oldProps.visible) {
      this.storeUid(props.visible);
    }

    if (props.visible) {
      this.init.value = true;
      this.animationEnd.value = true;
    }
  }

  render(props: DialogProps) {
    const ctxStyle = {
      zIndex: props.zIndex,
    };

    const maskView = (this.isModal || this.isFullScreen) && <div key="mask" className={this.maskClass}></div>;
    const dialogView = this.renderDialog();
    const view = [maskView, dialogView];

    if (!this.props.visible && !this.init.value) return null;
    if (this.props.destroyOnClose && !this.props.visible && this.animationEnd.value) return null;

    const content = (
      <div
        className={this.ctxClass}
        show={this.props.visible}
        style={ctxStyle}
        o-transition={{
          name: `${this.className}-zoom__vue`,
          afterEnter: this.afterEnter,
          afterLeave: this.afterLeave,
          beforeEnter: this.beforeEnter,
        }}
      >
        {view}
      </div>
    );

    if (props.attach) {
      let innerAttach;
      if (typeof props.attach === 'function') {
        innerAttach = props.attach();
      } else {
        innerAttach = props.attach;
      }
      return <t-portal attach={innerAttach}>{content}</t-portal>;
    }

    return content;
  }
}
