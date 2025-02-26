import '../../textarea';
import '../../button';

import { Component, createRef, tag } from 'omi';

import type { TdChatInputProps } from '../type';

@tag('t-chat-input')
export default class ChatInput extends Component<TdChatInputProps> {
  static css = [];

  static propTypes = {
    stopDisabled: Boolean,
    placeholder: String,
    disabled: Boolean,
    autofocus: Boolean,
    autosize: [Boolean, Object],
    value: String,
  };

  private pValue = '';

  inputRef = createRef<HTMLTextAreaElement>();

  shiftDown = false;

  install() {
    // observe(this, 'value', () => this.update());
  }

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue;
  }

  render(props: any) {
    const textareaStyle = {
      minHeight: '40px',
      maxHeight: '120px',
      ...(typeof props.autosize === 'object' ? props.autosize : {}),
    };

    return (
      <div class="t-chat-input flex gap-2 p-2 bg-white border rounded-lg">
        <t-textarea
          ref={this.inputRef}
          class="flex-1 resize-none outline-none"
          style={textareaStyle}
          placeholder={props.placeholder}
          disabled={props.disabled}
          autofocus={props.autofocus}
          value={props.value}
          onChange={this.handleChange}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
        ></t-textarea>
        <div class="t-chat-input-actions flex gap-2">
          <t-button onClick={this.handleSend} disabled={false}>
            发送
          </t-button>
          {props.stopDisabled && (
            <t-button onClick={this.handleStop}>
              <stop-icon />
            </t-button>
          )}
        </div>
      </div>
    );
  }

  private handleChange = (v: string) => {
    this.pValue = v;
    this.update();
    this.fire('change', v, {
      composed: true,
    });
  };

  private handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    this.fire('change', target.value);
    this.resizeTextarea();
  };

  private resizeTextarea = () => {
    const textarea = this.inputRef.current;
    if (textarea && this.props.autosize) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = true;
    if (e.key === 'Enter' && !this.shiftDown) {
      e.preventDefault();
      this.handleSend(e);
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = false;
  };

  private handleCompositionStart = () => {
    this.shiftDown = true;
  };

  private handleCompositionEnd = () => {
    this.shiftDown = false;
  };

  private handleSend = (e: KeyboardEvent | MouseEvent) => {
    if (!this.props.disabled && this.inputValue) {
      this.props.onSend(this.inputValue as string, { e });
      this.pValue = '';
      this.update();
    }
  };

  private handleStop = () => {
    this.fire('stop');
  };
}
