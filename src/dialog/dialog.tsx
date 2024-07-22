import 'tdesign-icons-web-components/esm/components/close';
import 'tdesign-icons-web-components/esm/components/info-circle';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/error-circle';
import 'omi-transition';

import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { bind, Component, createRef, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import type { ButtonProps } from '../button';
import { ClassName, StyledProps, Styles } from '../common';
import type { TdDialogProps } from './type';

export interface DialogProps extends TdDialogProps, StyledProps {}

function getCSSValue(v: string | number) {
  return isNaN(Number(v)) ? v : `${Number(v)}px`;
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
  };

  className = `${classPrefix}-dialog`;

  dialogRef = createRef();

  dialogPositionRef = createRef();

  instanceGlobal: Record<string, any> = {};

  animationEnd = signal(false);

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
    if (e.target !== this.dialogPositionRef) {
      return;
    }
    this.props.onOverlayClick?.({ e });
    // 根据closeOnClickOverlay判断点击蒙层时是否触发close事件
    //  this.global.closeOnOverlayClick
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

  // used in mixins of ActionMixin
  @bind
  cancelBtnAction(e: MouseEvent) {
    // emitEvent<Parameters<TdDialogProps['onCancel']>>(this, 'cancel', { e });
    this.props.onCancel?.({ e });
    this.emitCloseEvent({
      trigger: 'cancel',
      e,
    });
  }

  // used in mixins of ActionMixin
  @bind
  confirmBtnAction(e: MouseEvent) {
    this.props.onConfirm?.({ e });
  }

  // 打开弹窗动画结束时事件
  @bind
  afterEnter() {
    this.props.onOpened?.();
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
  }

  @bind
  emitCloseEvent(context) {
    this.props.onClose?.(context);
    // emitEvent<Parameters<TdDialogProps['onClose']>>(this, 'close', context);
    // // 默认关闭弹窗
    // this.$emit('update:visible', false);
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
    console.log('className', className);
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
  renderDialog() {
    // const { CloseIcon } = this.useGlobalIcon({
    //   CloseIcon: TdCloseIcon,
    // });
    // header 值为 true 显示空白头部
    const defaultHeader = <h5 className="title"></h5>;
    // const defaultCloseBtn = <CloseIcon />;
    // const body = renderContent(this, 'default', 'body');
    // this.getConfirmBtn is a function of ActionMixin
    // this.getCancelBtn is a function of ActionMixin

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

    const footerContent = this.getFooterContent(); // renderTNodeJSX(this, 'footer', defaultFooter);

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
                {/* {renderTNodeJSX(this, 'header', defaultHeader)} */}
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
              {/* {this.props.body} */}
            </div>
            {footer}
          </div>
        </div>
      </div>
    );
  }

  render(props: DialogProps) {
    const ctxStyle = {
      zIndex: props.zIndex,
    };

    console.log('visible', this.props.visible);

    const maskView = (this.isModal || this.isFullScreen) && <div key="mask" className={this.maskClass}></div>;
    const dialogView = this.renderDialog();
    const view = [maskView, dialogView];

    return (
      <div
        className={this.ctxClass}
        show={this.props.visible}
        style={ctxStyle}
        o-transition={{
          name: `${this.className}-zoom__vue`,
          afterEnter: this.afterEnter,
          afterLeave: this.afterLeave,
        }}
      >
        {view}
      </div>
    );
  }
}
