import '../../collapse';
import '../auto-scroll';
import '../../chat-loading';
import 'tdesign-icons-web-components/esm/components/check-circle';
import 'tdesign-icons-web-components/esm/components/close-circle';

import { isNil } from 'lodash-es';
import { Component, signal } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { ChatMessageStatus } from '../../chat-engine';
import type { CollapseValue } from '../../collapse';
import styles from '../style/chat-item.less?inline';
import type { TdChatContentProps } from '../type';

const className = `${getClassPrefix()}-chat__item`;

// 基础思考内容属性
export type BaseThinkingProps = {
  key?: string;
  status?: ChatMessageStatus;
  maxHeight?: number;
  animation?: string;
  collapsed?: boolean;
  layout?: 'block' | 'border';
  onChange?: (e: CustomEvent<CollapseValue>) => void;
} & TdChatContentProps['thinking'];

// 渲染状态图标的公共函数
export const renderThinkingStatus = (status: ChatMessageStatus, animation = 'moving') => {
  if (status === 'complete' || status === 'stop')
    return convertToLightDomNode(<t-icon-check-circle class={`${className}__think__status--complete`} />);
  if (status === 'error')
    return convertToLightDomNode(<t-icon-close-circle class={`${className}__think__status--error`} />);
  return <t-chat-loading animation={animation || 'moving'}></t-chat-loading>;
};

// 基础思考容器渲染函数
export const renderBaseThinkingContainer = ({
  key,
  status,
  maxHeight,
  animation = 'moving',
  collapsed = false,
  layout = 'block',
  onChange,
  headerContent,
  bodyContent,
  className: customClassName = '',
}: BaseThinkingProps & {
  headerContent: any;
  bodyContent: any;
  className?: string;
}) => {
  const defaultCollapsed = collapsed ? [] : [1];
  const layoutClass = layout === 'border' ? `${className}__think-layout-border` : ``;

  // 通过是否传入onChange判断受控还是非受控
  return (
    <t-collapse
      // collapsed做key可在非受控更新时触发展开收起
      key={onChange ? key : `${collapsed}-${key}`}
      className={`${className}__think ${layoutClass} ${customClassName}`}
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
            <div className={`${className}__think__inner`}>{bodyContent}</div>
          </slot>
        </t-auto-scroll>
        <div slot="header" className={`${className}__think__header__content`}>
          {status !== 'stop' && renderThinkingStatus(status as ChatMessageStatus, animation)}
          {headerContent}
        </div>
      </t-collapse-panel>
    </t-collapse>
  );
};

// 基础思考组件类
export abstract class BaseThinkingComponent<T> extends Component<T> {
  static css = styles;

  pCollapsed = signal(false);

  get computedCollapsed() {
    if (!isNil((this.props as any).collapsed)) return (this.props as any).collapsed;
    return this.pCollapsed.value;
  }

  ready(): void {
    this.pCollapsed.value = (this.props as any).defaultCollapsed;
  }

  onCollapsedChange = (e: CustomEvent<CollapseValue>) => {
    if (!e.detail.length) {
      this.pCollapsed.value = true;
    } else {
      this.pCollapsed.value = false;
    }
    this.fire('collapsedChange', this.pCollapsed.value);
  };

  // 子类需要实现的抽象方法
  abstract renderContent(): any;

  abstract getHeaderContent(): any;

  abstract getClassName(): string;

  render(props: T) {
    return renderBaseThinkingContainer({
      ...(props as any),
      collapsed: this.computedCollapsed,
      onChange: this.onCollapsedChange,
      headerContent: this.getHeaderContent(),
      bodyContent: this.renderContent(),
      className: this.getClassName(),
    });
  }
}
