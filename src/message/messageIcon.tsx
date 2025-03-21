import 'tdesign-icons-web-components/esm/components/check-circle-filled';
import 'tdesign-icons-web-components/esm/components/info-circle-filled';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/help-circle-filled';
import '../loading';

import { Component, tag } from 'omi';

import { convertToLightDomNode } from '../_util/lightDom';
import { classPrefix } from './const';
import { TdMessageProps } from './type';

import style from './style/messageIcon.less';

const iconClassName = `${classPrefix}-icon`;

@tag('t-message-icon')
export default class MessageIcon extends Component<TdMessageProps> {
  static css = [style];

  static propTypes = {
    theme: String,
    onCloseBtnClick: Function,
  };

  // theme 和 icon 的映射表
  iconMap = {
    success: convertToLightDomNode(
      <t-icon-check-circle-filled className={iconClassName} onClick={(e) => this.props.onCloseBtnClick?.({ e })} />,
    ),
    warning: convertToLightDomNode(
      <t-icon-check-circle-filled className={iconClassName} onClick={(e) => this.props.onCloseBtnClick?.({ e })} />,
    ),
    info: convertToLightDomNode(
      <t-icon-info-circle-filled className={iconClassName} onClick={(e) => this.props.onCloseBtnClick?.({ e })} />,
    ),
    error: convertToLightDomNode(
      <t-icon-error-circle-filled className={iconClassName} onClick={(e) => this.props.onCloseBtnClick?.({ e })} />,
    ),
    question: convertToLightDomNode(
      <t-icon-help-circle-filled className={iconClassName} onClick={(e) => this.props.onCloseBtnClick?.({ e })} />,
    ),
    loading: <t-loading className={`${classPrefix}-loading`} loading={true} size={'small'} />,
  };

  render(props: TdMessageProps) {
    const Icon = this.iconMap[props.theme];
    return Icon ? Icon : null;
  }
}
