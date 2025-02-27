import 'tdesign-icons-web-components/esm/components/send';
import 'tdesign-icons-web-components/esm/components/stop-circle';
import '../../textarea';
import '../../button';

import { Component, createRef, css, globalCSS, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { TdChatInputProps } from '../type';

import styles from '../style/chat-input.less';

globalCSS(css`
  ${styles}
`);

const className = `${getClassPrefix()}-chat`;
@tag('t-chat-input')
export default class ChatInput extends Component<TdChatInputProps> {
  static css = `
    :host {
      width: 100%;
    }
  `;

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

  renderSender() {
    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={`${className}__footer__button`}
        innerClass={classname([
          `${className}__footer__button__default`,
          {
            [`${className}__footer__button--focus`]: this.inputValue,
          },
        ])}
        onClick={this.handleSend}
        disabled={this.props.disabled}
      >
        {convertToLightDomNode(<t-icon-send className={`${className}__footer__button__icon`} />)}
      </t-button>
    );
  }

  render(props: any) {
    // const textareaStyle = {
    //   ...(typeof props.autosize === 'object' ? props.autosize : {}),
    // };

    return (
      <div className={`${className}__footer__content`}>
        <t-textarea
          ref={this.inputRef}
          class={`${className}__footer__textarea`}
          innerClass={`${className}__footer__textarea__outer`}
          // style={textareaStyle}
          placeholder={props.placeholder}
          disabled={props.disabled}
          autosize={props.autosize}
          autofocus={props.autofocus}
          value={props.value}
          onChange={this.handleChange}
          onInput={this.handleInput}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
        ></t-textarea>
        {this.renderSender()}
        {/* TODO: 控制逻辑 */}
        {props.stopDisabled && (
          <t-button onClick={this.handleStop}>
            {convertToLightDomNode(<t-icon-send className={`${className}__footer__button__icon`} />)}
          </t-button>
        )}
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
