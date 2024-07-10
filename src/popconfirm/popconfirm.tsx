import 'tdesign-web-components/popup';
import './popcontent';

import { Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';

export type PopconfirmProps = TdPopconfirmProps;

@tag('t-popconfirm')
export default class Popconfirm extends Component<PopconfirmProps> {
  static propTypes = {
    cancelBtn: [String, Number, Object, Function],
    confirmBtn: [String, Number, Object, Function],
    content: [String, Number, Object, Function],
    destroyOnClose: Boolean,
    icon: Object,
    placement: Object,
    popupProps: Object,
    showArrow: Boolean,
    theme: String,
    triggerElement: [String, Number, Object, Function],
    visible: Boolean,
    defaultVisible: Boolean,
    onCancel: Function,
    onConfirm: Function,
    onVisibleChange: Function,
  };

  static defaultProps: TdPopconfirmProps = {
    destroyOnClose: true,
    placement: 'top',
    showArrow: true,
    theme: 'default',
  };

  private pVisible = false;

  className = `${getClassPrefix()}-popconfirm`;

  get visible() {
    // controlled
    if (this.props.visible !== undefined) return this.props.visible;
    return this.pVisible;
  }

  handlePopVisible = (visible: boolean, context?: PopconfirmVisibleChangeContext) => {
    this.pVisible = visible;

    this.props?.onVisibleChange?.(visible, context);
    this.update();
  };

  installed(): void {
    this.pVisible = this.props.visible;
  }

  render(props: OmiProps<PopconfirmProps>) {
    const { cancelBtn = '取消', confirmBtn = '确定' } = props;

    return (
      <t-popup
        {...props}
        visible={this.visible}
        trigger="click"
        onVisibleChange={(visible) => this.handlePopVisible(visible)}
        overlayClassName={this.className}
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
