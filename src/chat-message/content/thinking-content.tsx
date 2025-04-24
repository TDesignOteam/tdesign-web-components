import '../../collapse';
import '../auto-scroll';
import '../../chat-loading';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { MessageStatus, TdChatContentProps } from '../../chatbot';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatThinkContentProps = {
  content?: {
    text?: string;
    title?: string;
  };
  status?: MessageStatus | ((currentStatus: MessageStatus | undefined) => MessageStatus);
} & TdChatContentProps['thinking'];

// 纯函数渲染器（无shadow root）
export const renderThinking = ({
  content,
  status,
  maxHeight,
  animation = 'circle',
  collapsed = false,
}: TdChatThinkContentProps) => {
  const renderThinkingStatus = (s: MessageStatus) => {
    if (s === 'complete' || s === 'stop')
      return convertToLightDomNode(<t-icon-check-circle class={`${className}__think__status--complete`} />);
    if (s === 'error')
      return convertToLightDomNode(<t-icon-close-circle class={`${className}__think__status--error`} />);
    return <t-chat-loading animation={animation}></t-chat-loading>;
  };
  const { text, title } = content;

  return (
    <t-collapse className={`${className}__think`} expandIconPlacement="right" value={collapsed ? [0] : [1]}>
      <t-collapse-panel className={`${className}__think__content`}>
        {text && (
          <t-auto-scroll maxHeight={maxHeight}>
            <div className={`${className}__think__inner`}>
              {text
                .split('\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </t-auto-scroll>
        )}
        <div slot="header" className={`${className}__think__header__content`}>
          {status !== 'stop' && renderThinkingStatus(status as MessageStatus)}
          {status === 'stop' ? '思考已终止' : title}
        </div>
      </t-collapse-panel>
    </t-collapse>
  );
};

// 独立组件（供外部使用）
@tag('t-chat-thinking-content')
export default class ThinkingContentComponent extends Component<TdChatThinkContentProps> {
  static css = styles;

  static propTypes = {
    content: Object,
    status: String,
    maxHeight: Number,
  };

  render(props: TdChatThinkContentProps) {
    if (!props?.content) return;
    return renderThinking(props);
  }
}
