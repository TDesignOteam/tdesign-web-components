import { Component, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';

export type BubbleProps = StyledProps & {
  key?: string | number;
  content: string;
  placement?: 'start' | 'end';
  header?: TNode;
  footer?: TNode;
  messageRender?: (content: string) => TNode;
};

const className = `${getClassPrefix()}-chat-bubble`;

@tag('t-chat-bubble')
export default class Bubble extends Component<BubbleProps> {
  static css = `
    .${className}-wrapper {
      --${className}-background: #eee;

      margin: 8px 0;
      display: flex;
      width: 100%;
    }
    .${className}-end {
      justify-content: flex-end;
    }
    .${className}-content-container {
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--${className}-background);
    }
  `;

  static propTypes = {
    key: [String, Number],
    content: String,
    header: [String, Number, Object, Function],
    footer: [String, Number, Object, Function],
    placement: String,
  };

  static defaultProps = {
    placement: 'start',
  };

  className = className;

  install(): void {
    console.log('查看bubble接收到的参数', this.props);
  }

  renderContent() {
    if (!this.props.messageRender) {
      return this.props.content;
    }
    return this.props.messageRender(this.props.content);
  }

  render(props: BubbleProps) {
    const { placement, header, footer } = props;

    return (
      <div
        className={classname(`${this.className}-wrapper`, {
          [`${this.className}-end`]: placement === 'end',
        })}
      >
        <div className={`${this.className}-main`}>
          {header ? <header className={`${this.className}-header`}>{header}</header> : null}
          <div className={`${this.className}-content-container`}>{this.renderContent()}</div>
          {footer ? <footer className={`${this.className}-footer`}>{footer}</footer> : null}
        </div>
      </div>
    );
  }
}
