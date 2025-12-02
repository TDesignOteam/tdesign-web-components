import '../../collapse';
import '../auto-scroll';
import '../../chat-loading';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { isNil } from 'lodash-es';
import { Component, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { AIMessageContent, ChatMessageStatus } from '../../chat-engine';
import { isTextContent } from '../../chat-engine';
import { CollapseValue } from '../../collapse';
import type { TdChatContentProps } from '../type';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

type TdChatReasoningBaseProps = {
  key?: string;
  content?: AIMessageContent[];
  status?: ChatMessageStatus;
} & TdChatContentProps['reasoning'];

export type TdChatReasoningProps = {
  defaultCollapsed?: boolean;
  onCollapsedChange?: (e: CustomEvent<boolean>) => void;
} & TdChatReasoningBaseProps;

export interface IRenderReasoning extends TdChatReasoningBaseProps {
  onChange?: (e: CustomEvent<CollapseValue>) => void;
}

// 渲染单个内容项
const renderContentItem = (content: AIMessageContent, index: number) => {
  const key = `reasoning-content-${index}`;

  if (isTextContent(content)) {
    return (
      <div key={key} className={`${className}__reasoning__text`}>
        {content.data
          ?.split('\n')
          .filter(Boolean)
          .map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}
      </div>
    );
  }
  // 自定义内容类型的插槽
  return (
    <div key={key} className={`${className}__reasoning__custom`}>
      <slot name={`reasoning-${content.type}-${index}`}></slot>
    </div>
  );
};

// 纯函数渲染器（无shadow root）
export const renderReasoning = ({
  key,
  content = [],
  status,
  maxHeight,
  animation = 'circle',
  collapsed = false,
  layout = 'border',
  onChange,
}: IRenderReasoning) => {
  const defaultCollapsed = collapsed ? [] : [1];
  const renderReasoningStatus = (s: ChatMessageStatus) => {
    if (s === 'complete' || s === 'stop')
      return convertToLightDomNode(<t-icon-check-circle class={`${className}__think__status--complete`} />);
    if (s === 'error')
      return convertToLightDomNode(<t-icon-close-circle class={`${className}__think__status--error`} />);
    return <t-chat-loading animation={animation || 'circle'}></t-chat-loading>;
  };

  const layoutClass = layout === 'border' ? `${className}__think-layout-border` : ``;

  let headerContent: string;
  if (status === 'stop') {
    headerContent = '思考已终止';
  } else if (status === 'complete') {
    headerContent = '思考完成';
  } else if (status === 'error') {
    headerContent = '思考过程出错';
  } else {
    headerContent = '思考中';
  }
  // 通过是否传入onChange判断受控还是非受控
  return (
    <t-collapse
      // collapsed做key可在非受控更新时触发展开收起
      key={onChange ? key : `${collapsed}-${key}`}
      className={`${className}__think ${className}__reasoning ${layoutClass}`}
      expandIconPlacement={'right'}
      expandIconDirection={'up'}
      expandIconActiveDirection={'down'}
      value={onChange ? defaultCollapsed : undefined}
      defaultValue={onChange ? undefined : defaultCollapsed}
      onChange={onChange}
    >
      <t-collapse-panel className={`${className}__think__content`}>
        <t-auto-scroll maxHeight={maxHeight}>
          <slot name="content">
            <div className={`${className}__think__inner`}>
              {content.map((item, index) => renderContentItem(item, index))}
            </div>
          </slot>
        </t-auto-scroll>
        <div slot="header" className={`${className}__think__header__content`}>
          {status !== 'stop' && renderReasoningStatus(status as ChatMessageStatus)}
          {headerContent}
        </div>
      </t-collapse-panel>
    </t-collapse>
  );
};

// 独立组件（供外部使用）
@tag('t-chat-reasoning-content')
export default class ReasoningContentComponent extends Component<TdChatReasoningProps> {
  static css = styles;

  static propTypes = {
    content: Array,
    status: String,
    maxHeight: Number,
    animation: String,
    collapsed: Boolean,
    defaultCollapsed: Boolean,
    layout: String,
    onCollapsedChange: Function,
  };

  static defaultProps: Partial<TdChatReasoningProps> = {
    animation: 'circle',
    defaultCollapsed: false,
    content: [],
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

  render(props: TdChatReasoningProps) {
    return renderReasoning({
      ...props,
      collapsed: this.computedCollapsed,
      onChange: this.onCollapsedChange,
    });
  }
}
