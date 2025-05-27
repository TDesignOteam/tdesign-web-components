import '../../collapse';
import '../auto-scroll';
import '../../chat-loading';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { Component, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { ChatMessageStatus, TdChatContentProps } from '../../chatbot';
import { CollapseValue } from '../../collapse';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatThinkContentProps = {
  content?: {
    text?: string;
    title?: string;
  };
  status?: ChatMessageStatus | ((currentStatus: ChatMessageStatus | undefined) => ChatMessageStatus);
} & TdChatContentProps['thinking'];

export interface IRenderThinking extends TdChatThinkContentProps {
  onChange?: (value: CollapseValue) => void;
}

// 纯函数渲染器（无shadow root）
export const renderThinking = ({
  content,
  status,
  maxHeight,
  animation = 'circle',
  collapsed = false,
  layout = 'block',
  onChange,
}: IRenderThinking) => {
  const defaultCollapsed = collapsed ? [] : [1];
  const renderThinkingStatus = (s: ChatMessageStatus) => {
    if (s === 'complete' || s === 'stop')
      return convertToLightDomNode(<t-icon-check-circle class={`${className}__think__status--complete`} />);
    if (s === 'error')
      return convertToLightDomNode(<t-icon-close-circle class={`${className}__think__status--error`} />);
    return <t-chat-loading animation={animation || 'circle'}></t-chat-loading>;
  };
  const { text, title } = content;
  const layoutClass = layout === 'border' ? `${className}__think-layout-border` : ``;

  // 通过是否传入onChange判断受控还是非受控
  return (
    <t-collapse
      // collapsed做key可在非受控更新时触发展开收起
      key={onChange ? undefined : collapsed}
      className={`${className}__think ${layoutClass}`}
      expandIconPlacement={'right'}
      value={onChange ? defaultCollapsed : undefined}
      defaultValue={onChange ? undefined : defaultCollapsed}
      onChange={onChange}
    >
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
          {status !== 'stop' && renderThinkingStatus(status as ChatMessageStatus)}
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
    animation: String,
    collapsed: Boolean,
    layout: String,
  };

  static defaultProps: Partial<TdChatThinkContentProps> = {
    animation: 'circle',
  };

  pCollapsed = signal(false);

  receiveProps(props: TdChatThinkContentProps | OmiProps<TdChatThinkContentProps, any>) {
    this.pCollapsed.value = props.collapsed || false;
  }

  onCollapsedChange = (v: CollapseValue) => {
    if (!v.length) {
      this.pCollapsed.value = true;
    } else {
      this.pCollapsed.value = false;
    }
  };

  render(props: TdChatThinkContentProps) {
    if (!props?.content) return;
    return renderThinking({ ...props, collapsed: this.pCollapsed.value, onChange: this.onCollapsedChange });
  }
}
