import 'tdesign-icons-web-components/esm/components/send';
import 'tdesign-icons-web-components/esm/components/stop';
import '../../textarea';
import '../../button';

import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import type { TdChatInputProps } from '../type';

import styles from '../style/chat-input.less';

const className = `${getClassPrefix()}-chat__input`;
@tag('t-chat-input')
export default class ChatInput extends Component<TdChatInputProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: String,
    defaultValue: String,
    status: String,
    allowStop: Boolean,
    textareaProps: Object,
  };

  static defaultProps: Partial<TdChatInputProps> = {
    status: 'idle',
    allowStop: true,
    textareaProps: {
      autosize: { minRows: 2 },
    },
  };

  pValue: Omi.SignalValue<string | number> = signal('');

  inputRef = createRef<HTMLTextAreaElement>();

  shiftDown = false;

  install() {
    const { value, defaultValue } = this.props;

    this.pValue.value = value || defaultValue;
  }

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue.value;
  }

  renderButton = () => {
    const { status, allowStop, disabled } = this.props;
    const hasStop = allowStop && status !== 'complete' && status !== 'idle';

    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={classname([
          `${className}__button`,
          {
            [`${className}__button--focus`]: this.inputValue || hasStop,
          },
        ])}
        onClick={hasStop ? this.handleStop : this.handleSend}
        disabled={disabled}
      >
        {convertToLightDomNode(
          hasStop ? (
            <t-icon-stop className={classname(`${className}__button__icon`, `${className}__button__stop`)} />
          ) : (
            <t-icon-send className={`${className}__button__icon`} />
          ),
        )}
      </t-button>
    );
  };

  render(props: any) {
    return (
      <div className={`${className}`}>
        <div className={`${className}__header`}>附件区</div>
        <div className={`${className}__content`}>
          <t-textarea
            ref={this.inputRef}
            className={`${className}__textarea`}
            {...props.textareaProps}
            placeholder={props.placeholder}
            disabled={props.disabled}
            value={this.inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            onCompositionStart={this.handleCompositionStart}
            onCompositionEnd={this.handleCompositionEnd}
          ></t-textarea>
          <div className={`${className}__actions`}>
            {/* TODO: 功能实现 */}
            <div className={`${className}__model`}>模型功能区</div>
            {this.renderButton()}
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (e: CustomEvent) => {
    this.pValue.value = e.detail;
    this.fire('change', e.detail, {
      composed: true,
    });
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
      this.pValue.value = '';
    }
  };

  private handleStop = (e) => {
    if (this.props.allowStop) {
      this.fire('stop');
      this.props.onStop(this.inputValue as string, { e });
    }
  };
}
