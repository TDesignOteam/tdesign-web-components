import '../../collapse';
import '../auto-scroll';
import '../../chat-loading';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { isNil } from 'lodash-es';
import { Component, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { ChatMessageStatus } from '../../chat-engine';
import type { TdChatContentProps } from '../../chatbot';
import { CollapseValue } from '../../collapse';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

type TdChatThinkBaseProps = {
  key?: string;
  content?: {
    text?: string;
    title?: string;
  };
  status?: ChatMessageStatus | ((currentStatus: ChatMessageStatus | undefined) => ChatMessageStatus);
} & TdChatContentProps['thinking'];

export type TdChatThinkContentProps = {
  defaultCollapsed?: boolean;
  onCollapsedChange?: (e: CustomEvent<boolean>) => void;
} & TdChatThinkBaseProps;

export interface IRenderThinking extends TdChatThinkBaseProps {
  onChange?: (e: CustomEvent<CollapseValue>) => void;
}

// 纯函数渲染器（无shadow root）
export const renderThinking = ({
  key,
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
      key={onChange ? key : `${collapsed}-${key}`}
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
    defaultCollapsed: Boolean,
    layout: String,
    onCollapsedChange: Function,
  };

  static defaultProps: Partial<TdChatThinkContentProps> = {
    animation: 'circle',
    defaultCollapsed: false,
  };

  pCollapsed = signal(false);

  get computedCollapsed() {
    if (!isNil(this.props.collapsed)) return this.props.collapsed;
    return this.pCollapsed.value;
  }

  ready(): void {
    this.pCollapsed.value = this.props.defaultCollapsed;
  }

  onCollapsedChange = (e: CustomEvent<CollapseValue>) => {
    if (!e.detail.length) {
      this.pCollapsed.value = true;
    } else {
      this.pCollapsed.value = false;
    }
    this.fire('collapsedChange', this.pCollapsed.value);
  };

  render(props: TdChatThinkContentProps) {
    if (!props?.content) return;
    return renderThinking({ ...props, collapsed: this.computedCollapsed, onChange: this.onCollapsedChange });
  }
}
