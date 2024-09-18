/**
 * @desc message 关闭按钮组件
 */

import 'tdesign-icons-web-components/esm/components/close';

import Omi, { classNames, Component, tag } from 'omi';
import { StyledProps } from 'tdesign-web-components';
import { parseContentTNode } from 'tdesign-web-components/_util/parseTNode.ts';

import { tdMessageClassGenerator } from './const.tsx';
import { TdMessageProps } from './type';

export interface TdMessageCloseProps extends TdMessageProps, StyledProps {}

@tag('t-message-close')
export default class MessageClose extends Component<TdMessageProps> {
  render(props: Omi.OmiProps<TdMessageProps> | TdMessageCloseProps) {
    const { closeBtn, onCloseBtnClick, className } = props;
    if (!closeBtn) {
      return null;
    }
    // console.log(typeof closeBtn);
    if (['string', 'number', 'boolean'].includes(typeof closeBtn)) {
      if (['string', 'number'].includes(typeof closeBtn)) {
        return (
          <span className={tdMessageClassGenerator('close')} onClick={(e) => onCloseBtnClick?.({ e })}>
            {closeBtn}
          </span>
        );
      }
      return (
        <t-icon-close
          className={classNames(className, tdMessageClassGenerator('close'))}
          onClick={(e) => onCloseBtnClick?.({ e })}
        />
      );
    }
    const cloneEle = parseContentTNode(closeBtn, props);
    if (cloneEle) {
      return (
        <span
          className={classNames(className, tdMessageClassGenerator('close'))}
          onClick={(e) => onCloseBtnClick?.({ e })}
        >
          {parseContentTNode(closeBtn, props)}
        </span>
      );
    }
  }
}
