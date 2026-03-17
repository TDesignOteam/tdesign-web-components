import 'tdesign-icons-web-components/esm/components/send-filled';
import 'tdesign-icons-web-components/esm/components/stop';
import 'tdesign-icons-web-components/esm/components/image';
import 'tdesign-icons-web-components/esm/components/file-attachment';
import '../attachments';
import '../textarea';
import '../button';
import '../tooltip';

import { isNil } from 'lodash-es';
import { Component, createRef, OmiProps, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import { convertToLightDomNode } from '../_util/lightDom';
import parseTNode from '../_util/parseTNode';
import { TdAttachmentItem } from '../filecard';
import { TdChatSenderAction, TdChatSenderActionName, TdChatSenderProps, UploadActionType } from './type';

import styles from './style/chat-sender.less';

const className = `${getClassPrefix()}-chat__input`;

@tag('t-chat-sender')
export default class ChatSender extends Component<TdChatSenderProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: String,
    actions: [Array, Function, Boolean],
    suffix: [String, Function, Object],
    defaultValue: String,
    loading: Boolean,
    autosize: Object,
    attachmentsProps: Object,
    textareaProps: Object,
    uploadProps: Object,
    sendBtnDisabled: [Boolean, Function],
    onFileSelect: Function,
    onFileRemove: Function,
    onSend: Function,
    onStop: Function,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  };

  static defaultProps: Partial<TdChatSenderProps> = {
    loading: false,
    attachmentsProps: {
      items: [],
      overflow: 'scrollX',
    },
    autosize: { minRows: 2 },
    textareaProps: {},
    actions: ['uploadImage', 'uploadAttachment', 'send'],
  };

  pValue: Omi.SignalValue<string> = signal('');

  pAttachments: Omi.SignalValue<TdAttachmentItem[]> = signal([]);

  uploadImageRef = createRef<HTMLInputElement>();

  uploadAttachmentRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  private shiftDown = false;

  /** 默认操作按钮列表 */
  get presetActions(): TdChatSenderAction[] {
    return [
      {
        name: 'uploadImage',
        render: this.renderUploadImage(),
      },
      {
        name: 'uploadAttachment',
        render: this.renderUploadAttachment(),
      },
    ];
  }

  ready() {
    const { value, defaultValue, attachmentsProps } = this.props;

    this.pValue.value = value || defaultValue;
    attachmentsProps?.items && (this.pAttachments.value = attachmentsProps.items);
    this.update();

    setExportparts(this);
  }

  get inputValue() {
    if (!isNil(this.props.value)) return this.props.value;
    return this.pValue.value;
  }

  get isControlled() {
    // 受控模式：用户传入了 attachmentsProps.items
    return this.props?.attachmentsProps?.items !== undefined;
  }

  get attachmentsValue() {
    if (this.isControlled) {
      return this.props.attachmentsProps.items;
    }
    return this.pAttachments.value;
  }

  private handleAttachmentsRemove = (e: CustomEvent<TdAttachmentItem>) => {
    const removed = e.detail;
    // 受控模式：只通知外部，不内部处理
    if (this.isControlled) {
      this.fire('fileRemove', [removed], { composed: true });
      return;
    }
    // 非受控模式：内部处理删除
    const index = this.attachmentsValue.findIndex((item) => item.name === removed.name && item.url === removed.url);
    if (index === -1) return;
    const rest = this.attachmentsValue.filter((_, i) => i !== index);
    this.pAttachments.value = rest;
    this.fire('fileRemove', [removed], { composed: true });
  };

  receiveProps(
    props: TdChatSenderProps | OmiProps<TdChatSenderProps, any>,
    oldProps: TdChatSenderProps | OmiProps<TdChatSenderProps, any>,
  ) {
    if (props.disabled !== oldProps.disabled) return true;
    if (props.value !== oldProps.value) return true;
    if (props.defaultValue !== oldProps.defaultValue) {
      this.pValue.value = props.defaultValue;
      return true;
    }
    if (props.attachmentsProps.items !== oldProps.attachmentsProps.items) return true;
    if (props.loading !== oldProps.loading) return true;
    if (props.sendBtnDisabled !== oldProps.sendBtnDisabled) return true;
    return false;
  }

  /** 获取焦点 */
  focus = (options?: FocusOptions) => {
    this.inputRef.current?.focus(options);
  };

  /** 取消焦点 */
  blur = () => {
    this.inputRef.current?.blur();
  };

  private handleFileSelected = (name: UploadActionType) => (e: Event) => {
    const ref = name === 'uploadImage' ? this.uploadImageRef : this.uploadAttachmentRef;
    const files = ref.current?.files;
    if (!files?.length) {
      return;
    }

    this.fire('fileSelect', { files, name, e }, { composed: true });
    ref.current.value = '';
  };

  /** 上传图片按钮 */
  private renderUploadImage = () => (
    <t-tooltip content="上传图片" className={`${className}__actions__tooltip`}>
      <span
        className={`${className}__actions__item`}
        onClick={() => {
          this.uploadImageRef.current?.click();
        }}
      >
        {convertToLightDomNode(<t-icon-image className={`${className}__actions__icon`} />)}
      </span>
    </t-tooltip>
  );

  /** 上传附件按钮 */
  private renderUploadAttachment = () => (
    <t-tooltip content="上传附件" className={`${className}__actions__tooltip`}>
      <span
        className={`${className}__actions__item`}
        onClick={() => {
          this.uploadAttachmentRef.current?.click();
        }}
      >
        {convertToLightDomNode(<t-icon-file-attachment className={`${className}__actions__icon`} />)}
      </span>
    </t-tooltip>
  );

  /** 根据 name 获取对应的渲染函数 */
  private getActionRender = (name: TdChatSenderActionName) => {
    if (name === 'uploadImage') return this.renderUploadImage();
    if (name === 'uploadAttachment') return this.renderUploadAttachment();
    if (name === 'send') return this.renderSendButton();
    return null;
  };

  /** 渲染发送按钮 */
  private renderSendButton = () => {
    const { disabled, loading } = this.props;

    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={classname([
          `${className}__button`,
          {
            [`${className}__button--focus`]: !this.isSendBtnDisabled || loading,
          },
        ])}
        onClick={this.clickSend}
        disabled={disabled}
      >
        {convertToLightDomNode(
          loading ? (
            <t-icon-stop className={classname(`${className}__button__icon`, `${className}__button__stop`)} />
          ) : (
            <t-icon-send-filled className={`${className}__button__icon`} />
          ),
        )}
      </t-button>
    );
  };

  /** 渲染操作按钮 */
  private renderActions = () => {
    const { actions } = this.props;
    let arrayActions: TdChatSenderAction[];

    if (actions === false) return null;

    if (Array.isArray(actions)) {
      const isStringArray = actions.every((item) => typeof item === 'string');
      if (isStringArray) {
        arrayActions = (actions as TdChatSenderActionName[]).map((name) => ({
          name,
          render: this.getActionRender(name),
        }));
      } else {
        arrayActions = actions as TdChatSenderAction[];
      }
    } else if (typeof actions === 'function') {
      arrayActions = actions(this.presetActions);
    } else {
      arrayActions = this.presetActions;
    }

    return arrayActions.map((item) => (
      <div key={item.name} class={`${className}__actions__item__wrapper`}>
        {item.render}
      </div>
    ));
  };

  get isSendBtnDisabled() {
    const { sendBtnDisabled } = this.props;
    if (typeof sendBtnDisabled === 'boolean') return sendBtnDisabled;
    if (typeof sendBtnDisabled === 'function') return sendBtnDisabled(this.inputValue);
    return !this.inputValue || this.inputValue.trim() === '';
  }

  /** 渲染右侧区域 */
  private renderSuffixArea = () => {
    const { suffix } = this.props;

    const hasSlotContent = this.querySelector('[slot="suffix"]');

    // 优先级：slot > suffix > actions
    if (hasSlotContent) {
      return <slot name="suffix"></slot>;
    }

    if (suffix) {
      const suffixContent = parseTNode(suffix);
      return suffixContent;
    }

    return this.renderActions();
  };

  render(props: TdChatSenderProps) {
    return (
      <div className={`${className}`}>
        <input
          accept="image/*"
          multiple
          ref={this.uploadImageRef}
          type="file"
          onChange={this.handleFileSelected('uploadImage')}
          hidden
          {...this.props.uploadProps}
        />
        <input
          ref={this.uploadAttachmentRef}
          type="file"
          onChange={this.handleFileSelected('uploadAttachment')}
          hidden
          {...this.props.uploadProps}
        />
        <slot name="header"></slot>
        <div className={`${className}__content`}>
          <slot name="inner-header"></slot>
          {this.attachmentsValue?.length ? (
            <t-attachments
              className={`${className}__attachments`}
              {...this.props.attachmentsProps}
              items={this.attachmentsValue}
              onRemove={this.handleAttachmentsRemove}
            />
          ) : null}
          <div className={`${className}__textarea__wrapper`}>
            <slot name="input-prefix"></slot>
            <slot name="textarea">
              <t-textarea
                ref={this.inputRef}
                className={`${className}__textarea`}
                {...this.props.textareaProps}
                placeholder={props.placeholder}
                disabled={props.disabled}
                autosize={props.autosize}
                value={this.inputValue}
                enterkeyhint="send"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                onCompositionStart={this.handleCompositionStart}
                onCompositionEnd={this.handleCompositionEnd}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
            </slot>
          </div>
          <div className={`${className}__footer`}>
            <div className={`${className}__footer__left`}>
              <slot name="footer-prefix"></slot>
            </div>
            <div className={`${className}__footer__right`}>{this.renderSuffixArea()}</div>
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (e: CustomEvent<{ value: string; e: Event }>) => {
    const { value, e: originalEvent } = e.detail;
    this.pValue.value = value;
    this.fire('change', { value, e: originalEvent }, { composed: true });
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = true;
    if (e.key === 'Enter' && !this.shiftDown) {
      e.preventDefault();
      const { loading } = this.props;
      if (loading) {
        this.handleStop(e as unknown as MouseEvent);
      } else {
        this.handleSend(e);
      }
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

  private handleFocus = (e: FocusEvent) => {
    this.fire('focus', { value: this.inputValue, e }, { composed: true });
  };

  private handleBlur = (e: FocusEvent) => {
    this.fire('blur', { value: this.inputValue, e }, { composed: true });
  };

  private handleSend = (e: MouseEvent | KeyboardEvent) => {
    if (this.props.disabled || this.isSendBtnDisabled) {
      return;
    }
    this.fire('send', { value: this.inputValue, attachments: this.attachmentsValue, e }, { composed: true });
    this.pValue.value = '';
    this.pAttachments.value = [];
  };

  private handleStop = (e: MouseEvent) => {
    this.fire('stop', { value: this.inputValue, e }, { composed: true });
  };

  private clickSend = (e: MouseEvent) => {
    const { loading } = this.props;
    return loading ? this.handleStop(e) : this.handleSend(e);
  };
}
