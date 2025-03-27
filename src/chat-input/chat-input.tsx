import 'tdesign-icons-web-components/esm/components/send';
import 'tdesign-icons-web-components/esm/components/stop';
import 'tdesign-icons-web-components/esm/components/image';
import 'tdesign-icons-web-components/esm/components/file-attachment';
import '../attachments';
import '../textarea';
import '../button';
import '../tooltip';
import '../dropdown';

import { Component, createRef, OmiProps, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { Attachment } from '../filecard';
import { TdChatInputAction, TdChatInputProps } from './type';

import styles from './style/chat-input.less';

const className = `${getClassPrefix()}-chat__input`;
@tag('t-chat-input')
export default class ChatInput extends Component<TdChatInputProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: String,
    actions: [Array, Function, Boolean],
    defaultValue: String,
    status: String,
    allowStop: Boolean,
    attachmentsProps: Object,
    textareaProps: Object,
    uploadProps: Object,
    onFileSelect: Function,
    onFileRemove: Function,
    onSend: Function,
    onStop: Function,
    onChange: Function,
    onBlur: Function,
    onFocus: Function,
  };

  static defaultProps: Partial<TdChatInputProps> = {
    status: 'idle',
    allowStop: true,
    attachmentsProps: {
      items: [],
      overflow: 'scrollX',
    },
    textareaProps: {
      autosize: { minRows: 2 },
    },
  };

  pValue: Omi.SignalValue<string | number> = signal('');

  pAttachments: Omi.SignalValue<Attachment[]> = signal([]);

  uploadRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  shiftDown = false;

  deepThinkActive = signal(false);

  modelValue = signal(''); // 新增模型值信号

  ready() {
    const { value, defaultValue, attachmentsProps } = this.props;

    this.pValue.value = value || defaultValue;
    attachmentsProps?.items && (this.pAttachments.value = attachmentsProps.items);
    this.update();
  }

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue.value;
  }

  get attachmentsValue() {
    if (this.props?.attachmentsProps?.items) return this.props.attachmentsProps.items;
    return this.pAttachments.value;
  }

  private handleAttachmentsRemove = (e: CustomEvent<Attachment>) => {
    const removed = e.detail;
    const rest = this.attachmentsValue.filter((item) => item !== removed);
    this.pAttachments.value = rest;
    this.fire('fileRemove', rest, {
      composed: true,
    });
  };

  receiveProps(
    props: TdChatInputProps | OmiProps<TdChatInputProps, any>,
    oldProps: TdChatInputProps | OmiProps<TdChatInputProps, any>,
  ) {
    if (props.status !== oldProps.status) return true;
    if (props.allowStop !== oldProps.allowStop) return true;

    return false;
  }

  private handleFileSelected = () => {
    const files = Array.from(this.uploadRef.current?.files || []);
    if (!files.length) {
      return;
    }
    this.fire('fileSelect', files, {
      composed: true,
    });
    this.uploadRef.current.value = '';
  };

  get hasStop() {
    const { status, allowStop } = this.props;
    return allowStop && status !== 'complete' && status !== 'stop' && status !== 'idle';
  }

  /** 上传附件按钮 */
  renderUploadAttachment = () => (
    <t-tooltip content="上传附件" className={`${className}__actions__tooltip`}>
      <span
        className={`${className}__actions__item`}
        onClick={() => {
          this.uploadRef.current?.click();
        }}
      >
        {convertToLightDomNode(<t-icon-file-attachment />)}
      </span>
    </t-tooltip>
  );

  renderButton = () => {
    const { disabled } = this.props;

    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={classname([
          `${className}__button`,
          {
            [`${className}__button--focus`]: this.inputValue || this.hasStop,
          },
        ])}
        onClick={this.clickSend}
        disabled={disabled}
      >
        {convertToLightDomNode(
          this.hasStop ? (
            <t-icon-stop className={classname(`${className}__button__icon`, `${className}__button__stop`)} />
          ) : (
            <t-icon-send className={`${className}__button__icon`} />
          ),
        )}
      </t-button>
    );
  };

  presetActions: TdChatInputAction[] = [
    {
      name: 'uploadAttachment',
      render: this.renderUploadAttachment(),
    },
  ];

  renderActions = () => {
    const { actions } = this.props;
    if (!actions) {
      return null;
    }
    let arrayActions: TdChatInputAction[] = Array.isArray(actions) ? actions : this.presetActions;
    if (typeof actions === 'function') {
      arrayActions = actions(this.presetActions);
    }
    return arrayActions.map((item, idx) => (
      <div
        key={item.name}
        class={`${className}__actions__item__wrapper`}
        tabIndex={-1}
        onClick={() => this.handleAction(item.name, idx)}
      >
        {item.render}
      </div>
    ));
  };

  render(props: TdChatInputProps) {
    return (
      <div className={`${className}`}>
        <input {...this.props.uploadProps} ref={this.uploadRef} type="file" onChange={this.handleFileSelected} hidden />
        <div className={`${className}__header`}>
          <slot name="header"></slot>
          {this.attachmentsValue?.length ? (
            <t-attachments
              className={`${className}__attachments`}
              {...this.props.attachmentsProps}
              items={this.attachmentsValue}
              onRemove={this.handleAttachmentsRemove}
            />
          ) : null}
        </div>
        <div className={`${className}__content`}>
          <t-textarea
            ref={this.inputRef}
            className={`${className}__textarea`}
            {...this.props.textareaProps}
            placeholder={props.placeholder}
            disabled={props.disabled}
            value={this.inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            onCompositionStart={this.handleCompositionStart}
            onCompositionEnd={this.handleCompositionEnd}
          ></t-textarea>
          <div className={`${className}__footer`}>
            <div className={`${className}__footer__left`}>
              <slot name="footer-left"></slot>
            </div>
            <div className={`${className}__footer__right`}>
              <div className={`${className}__actions`}>
                <slot name="actions">{this.renderActions()}</slot>
              </div>
              {this.renderButton()}
            </div>
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
      this.clickSend();
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

  private handleAction = (action: string, index: number) => {
    this.fire(
      'action',
      { action, index },
      {
        composed: true,
      },
    );
  };

  private handleSend = () => {
    if (!this.props.disabled && this.inputValue) {
      this.fire(
        'send',
        {
          value: this.inputValue,
          attachments: this.attachmentsValue,
        },
        {
          composed: true,
        },
      );
      this.pValue.value = '';
    }
  };

  private handleStop = () => {
    if (this.props.allowStop) {
      this.fire('stop', this.inputValue, {
        composed: true,
      });
    }
  };

  private clickSend = () => (this.hasStop ? this.handleStop() : this.handleSend());
}
