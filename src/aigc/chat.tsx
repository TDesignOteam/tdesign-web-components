import './sender';
import './bubble';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { BubbleProps } from './bubble';

export type ChatProps = StyledProps & {
  // message
  messages?: BubbleProps[] | string;
  onMessageChange?: (v: BubbleProps[]) => void;
  // input
  inputValue?: string;
  inputDefaultValue?: string;
  placeholder?: string;
  onInputChange?: (e: CustomEvent) => void;
  onSubmit?: (e: CustomEvent) => void;
};

const className = `${getClassPrefix()}-chat`;

@tag('t-chat')
export default class Chat extends Component<ChatProps> {
  static css = [];

  static propTypes = {
    messages: [Array, String],
    onMessageChange: Function,
    inputValue: String,
    inputDefaultValue: String,
    placeholder: String,
    onInputChange: Function,
    onSubmit: Function,
  };

  static defaultProps = {
    messages: [],
  };

  className = className;

  private renderMessage() {
    let msg = this.props.messages;
    if (typeof msg === 'string') {
      msg = JSON.parse(msg);
    }
    return (msg as BubbleProps[] | undefined)?.map((message) => (
      <t-chat-bubble key={message.key || message.content} {...message} />
    ));
  }

  installed(): void {
    console.log('查看chat接收到的参数', this.props);
  }

  render(props: ChatProps) {
    const { inputValue, inputDefaultValue, placeholder, onInputChange, onSubmit } = props;

    return (
      <div className={`${className}-wrapper`}>
        <header className={`${className}-header`}>
          <slot name="header" messageNum="测试作用域"></slot>
        </header>
        <main className={`${className}-main`}>
          <slot name="main-top"></slot>
          <div className={`${className}-main-content`}>{this.renderMessage()}</div>
          <slot name="main-bottom"></slot>
        </main>
        <footer className={`${className}-footer`}>
          <t-chat-sender
            value={inputValue}
            defaultValue={inputDefaultValue}
            placeholder={placeholder}
            onChange={onInputChange}
            onSubmit={onSubmit}
          >
            <slot name="input-header" slot="header-content"></slot>
            <slot name="input-options" slot="options"></slot>
          </t-chat-sender>
        </footer>
      </div>
    );
  }
}
