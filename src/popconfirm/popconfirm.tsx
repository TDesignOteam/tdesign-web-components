import 'tdesign-web-components/popup';
import './popcontent';

import { Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';

export type PopconfirmProps = TdPopconfirmProps;

@tag('t-popconfirm')
export default class Popconfirm extends Component<PopconfirmProps> {
  static css = ``;

  static defaultProps: TdPopconfirmProps = {
    destroyOnClose: true,
    placement: 'top',
    showArrow: true,
    theme: 'default',
  };

  componentName = `${getClassPrefix()}-popconfirm`;

  visible = false;

  handlePopVisible = (visible: boolean, context?: PopconfirmVisibleChangeContext) => {
    if (visible === !!this.visible) return;
    this.visible = visible;

    if (typeof this.props.onVisibleChange === 'function') {
      this.props.onVisibleChange(visible, context);
    }
    this.update();
  };

  installed(): void {
    this.visible = this.props.visible;
  }

  render(props: OmiProps<PopconfirmProps>) {
    const { cancelBtn = '取消', confirmBtn = '确定' } = props;

    return (
      <t-popup
        {...props}
        visible={this.visible}
        trigger="click"
        onVisibleChange={(visible) => this.handlePopVisible(visible)}
        overlayClassName={this.componentName}
        content={
          <t-popcontent
            cancelBtn={cancelBtn}
            confirmBtn={confirmBtn}
            {...props}
            onClose={(context: PopconfirmVisibleChangeContext) => this.handlePopVisible(false, context)}
          />
        }
        {...props.popupProps}
      />
    );
  }
}
