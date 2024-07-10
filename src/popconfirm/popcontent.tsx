import 'tdesign-icons-web-components';

import isString from 'lodash/isString';
import { cloneElement, Component, OmiProps, tag, VNode } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { parseContentTNode } from '../_util/parseTNode';
import { ButtonProps } from '../button';
import { PopconfirmProps } from './popconfirm';
import { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';

interface PopcontentProps {
  onClose?: (context: PopconfirmVisibleChangeContext) => any;
}

@tag('t-popcontent')
export default class Popconfirm extends Component<PopcontentProps & PopconfirmProps> {
  componentName = `${getClassPrefix()}-popconfirm`;

  get hideCancel() {
    return this.props.cancelBtn === null || this.props.cancelBtn === undefined;
  }

  get hideConfirm() {
    return this.props.confirmBtn === null || this.props.confirmBtn === undefined;
  }

  renderIcon() {
    let color = '#0052D9';
    // theme 为 default 时不展示图标，否则根据 theme 的值设置图标颜色样式
    const defaultIcon = <t-icon name="info-circle-filled" className="mr-[2px]" />;
    switch (this.props.theme) {
      case 'warning': // 黄色
        color = '#FFAA00';
        break;
      case 'danger':
        color = '#FF3E00'; // 红色
        break;
    }

    let iconComponent = null;
    const parseNode = parseContentTNode(this.props.icon, {
      style: { color },
    });

    // icon 是自定义组件实例，优先级最高
    if (parseNode) {
      iconComponent = parseNode;
    } else if (defaultIcon) {
      iconComponent = cloneElement(defaultIcon, {
        style: { color },
      });
    }
    return iconComponent;
  }

  renderCancel() {
    if (this.hideCancel) {
      return null;
    }

    const parseNode = parseContentTNode(this.props.cancelBtn, {
      onClick: (e) => {
        this.props.onClose({ e, trigger: 'cancel' });
        if (typeof this.props.cancelBtn === 'object') {
          (this.props.cancelBtn as VNode).attributes?.onClick?.(e);
        }
      },
    });
    if (parseNode && typeof parseNode === 'object') {
      return parseNode;
    }

    return (
      <t-button
        size="small"
        theme="default"
        variant="base"
        onClick={(e) => {
          this.props.onClose({ e, trigger: 'cancel' });
          this.props.onCancel?.({ e });
        }}
        {...(typeof this.props.cancelBtn === 'object' ? { ...(this.props.cancelBtn as ButtonProps) } : {})}
      >
        {isString(this.props.cancelBtn) && this.props.cancelBtn}
      </t-button>
    );
  }

  renderConfirm() {
    if (this.hideConfirm) {
      return null;
    }

    const parseNode = parseContentTNode(this.props.confirmBtn, {
      onClick: (e) => {
        this.props.onClose({ e, trigger: 'confirm' });
        if (typeof this.props.confirmBtn === 'object') {
          (this.props.confirmBtn as VNode).attributes?.onClick?.(e);
        }
      },
    });
    if (parseNode && typeof parseNode === 'object') {
      return parseNode;
    }

    return (
      <t-button
        size="small"
        theme="primary"
        onClick={(e) => {
          this.props.onClose({ e, trigger: 'confirm' });
          this.props.onConfirm?.({ e });
        }}
        {...(typeof this.props.confirmBtn === 'object' ? { ...(this.props.confirmBtn as ButtonProps) } : {})}
      >
        {isString(this.props.confirmBtn) && this.props.confirmBtn}
      </t-button>
    );
  }

  render(props: (PopcontentProps & TdPopconfirmProps) | OmiProps<PopcontentProps & TdPopconfirmProps, any>) {
    const { className, style, content } = props;
    return (
      <div class={classname(`${this.componentName}__content`, className)} style={style}>
        <div class={`${this.componentName}__body`}>
          {this.renderIcon()}
          <div class={`${this.componentName}__inner`}>{content}</div>
        </div>
        <div className={`${this.componentName}__buttons`}>
          <span className={`${this.componentName}__cancel`}>{this.renderCancel()}</span>
          <span className={`${this.componentName}__confirm`}>{this.renderConfirm()}</span>
        </div>
      </div>
    );
  }
}
