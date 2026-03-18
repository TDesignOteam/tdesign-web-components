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
import {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
} from './type';

import styles from './style/chat-sender.less';

const className = `${getClassPrefix()}-chat__input`;

@tag('t-chat-sender')
export default class ChatSender extends Component<TdChatSenderProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: [String, Number],
    defaultValue: [String, Number],
    loading: Boolean,
    autosize: Object,
    actions: [Array, Function, Object, Boolean, String],
    suffix: [String, Function, Object],
    footerPrefix: [String, Function, Object],
    attachmentsProps: Object,
    textareaProps: Object,
    uploadProps: Object,
    imageUploadProps: Object,
    fileUploadProps: Object,
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
    autosize: { minRows: 2, maxRows: 5 },
    textareaProps: {},
    actions: ['send'],
  };

  pValue: Omi.SignalValue<string> = signal('');

  uploadImageRef = createRef<HTMLInputElement>();

  uploadAttachmentRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  private shiftDown = false;

  private isComposing = false;

  private getPresetActions = (): TdChatSenderAction[] => [
    {
      name: 'uploadImage',
      render: this.renderUploadImage(),
    },
    {
      name: 'uploadAttachment',
      render: this.renderUploadAttachment(),
    },
    {
      name: 'send',
      render: this.renderSendButton(),
    },
  ];

  ready() {
    const { value, defaultValue } = this.props;

    this.pValue.value = String(value ?? defaultValue ?? '');
    this.update();

    setExportparts(this);
  }

  get isControlled() {
    return !isNil(this.props.value);
  }

  get inputValue() {
    if (this.isControlled) return String(this.props.value ?? '');
    return this.pValue.value;
  }

  get attachmentsValue() {
    return this.props.attachmentsProps?.items || [];
  }

  private handleAttachmentsRemove = (e: CustomEvent<{ item: TdAttachmentItem; index: number }>) => {
    const { item, index } = e.detail;
    this.fire('fileRemove', { item, index }, { composed: true });
  };

  receiveProps(
    props: TdChatSenderProps | OmiProps<TdChatSenderProps, any>,
    oldProps: TdChatSenderProps | OmiProps<TdChatSenderProps, any>,
  ) {
    let shouldUpdate = false;

    if (props.disabled !== oldProps.disabled) {
      shouldUpdate = true;
    }

    if (props.value !== oldProps.value) {
      shouldUpdate = true;
    }

    if (props.defaultValue !== oldProps.defaultValue) {
      this.pValue.value = String(props.defaultValue ?? '');
      shouldUpdate = true;
    }

    if (props.loading !== oldProps.loading) {
      shouldUpdate = true;
    }

    if (props.sendBtnDisabled !== oldProps.sendBtnDisabled) {
      shouldUpdate = true;
    }

    if (props.suffix !== oldProps.suffix) {
      shouldUpdate = true;
    }

    if (props.footerPrefix !== oldProps.footerPrefix) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }

  focus = (options?: FocusOptions) => {
    this.inputRef.current?.focus(options);
  };

  blur = () => {
    this.inputRef.current?.blur();
  };

  selectImage = () => {
    this.uploadImageRef.current?.click();
  };

  selectFile = () => {
    this.uploadAttachmentRef.current?.click();
  };

  private handleFileSelected = (name: UploadActionType) => () => {
    const ref = name === 'uploadImage' ? this.uploadImageRef : this.uploadAttachmentRef;
    const files = ref.current?.files;
    if (!files?.length) {
      return;
    }

    const attachmentItems: TdAttachmentItem[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file,
    }));

    this.fire('fileSelect', attachmentItems, { composed: true });
    ref.current.value = '';
  };

  private getImageUploadProps = (): TdChatSenderUploadProps => {
    const { imageUploadProps, uploadProps } = this.props;
    return {
      accept: 'image/*',
      ...uploadProps,
      ...imageUploadProps,
    };
  };

  private getFileUploadProps = (): TdChatSenderUploadProps => {
    const { fileUploadProps, uploadProps } = this.props;
    return {
      ...uploadProps,
      ...fileUploadProps,
    };
  };

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

  private getActionRender = (name: TdChatSenderActionName) => {
    if (name === 'uploadImage') return this.renderUploadImage();
    if (name === 'uploadAttachment') return this.renderUploadAttachment();
    if (name === 'send') return this.renderSendButton();
    return null;
  };

  private renderSendButton = () => {
    const { disabled } = this.props;

    if (this.showStopBtn) {
      return (
        <t-button
          theme="default"
          size="small"
          variant="text"
          className={classname(`${className}__button`)}
          onClick={this.handleStop}
        >
          {convertToLightDomNode(
            <t-icon-stop className={classname(`${className}__button__icon`, `${className}__button__stop`)} />,
          )}
        </t-button>
      );
    }

    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={classname([
          `${className}__button`,
          {
            [`${className}__button--focus`]: !this.isSendBtnDisabled,
          },
        ])}
        onClick={this.clickSend}
        disabled={disabled || this.isSendBtnDisabled}
      >
        {convertToLightDomNode(<t-icon-send-filled className={`${className}__button__icon`} />)}
      </t-button>
    );
  };

  private renderPresetActions = (names: TdChatSenderActionName[]) =>
    names.map((name) => (
      <div key={name} class={`${className}__actions__item__wrapper`}>
        {this.getActionRender(name)}
      </div>
    ));

  get isSendBtnDisabled() {
    const { sendBtnDisabled, loading } = this.props;
    if (typeof sendBtnDisabled === 'boolean') return sendBtnDisabled;
    if (typeof sendBtnDisabled === 'function') return sendBtnDisabled(this.inputValue);

    const hasContent = !!this.inputValue;
    const hasAttachments = this.attachmentsValue?.length > 0;
    return !loading && !hasContent && !hasAttachments;
  }

  get showStopBtn() {
    return this.props.loading;
  }

  private renderActionsArea = () => {
    const { actions, suffix } = this.props;

    const hasSlotContent = this.querySelector('[slot="actions"]');
    if (hasSlotContent) {
      return <slot name="actions"></slot>;
    }

    if (suffix) {
      return parseTNode(suffix, { renderPresets: () => this.renderActionsByConfig(actions) });
    }

    return this.renderActionsByConfig(actions);
  };

  private renderActionsByConfig = (actions: TdChatSenderProps['actions']) => {
    if (actions === false) {
      return null;
    }

    if (actions === true) {
      return this.renderPresetActions(['send']);
    }

    if (typeof actions === 'function') {
      const result = actions(this.getPresetActions());
      return result.map((item) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`}>
          {item.render}
        </div>
      ));
    }

    if (Array.isArray(actions)) {
      const isStringArray = actions.every((item) => typeof item === 'string');
      if (isStringArray) {
        return this.renderPresetActions(actions as TdChatSenderActionName[]);
      }
      return (actions as TdChatSenderAction[]).map((item) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`}>
          {item.render}
        </div>
      ));
    }

    if (actions) {
      return parseTNode(actions);
    }

    return null;
  };

  render(props: TdChatSenderProps) {
    const imageUploadProps = this.getImageUploadProps();
    const fileUploadProps = this.getFileUploadProps();

    return (
      <div className={`${className}`}>
        <input
          accept={imageUploadProps.accept}
          multiple={imageUploadProps.multiple}
          ref={this.uploadImageRef}
          type="file"
          onChange={this.handleFileSelected('uploadImage')}
          hidden
        />
        <input
          accept={fileUploadProps.accept}
          multiple={fileUploadProps.multiple}
          ref={this.uploadAttachmentRef}
          type="file"
          onChange={this.handleFileSelected('uploadAttachment')}
          hidden
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
              <slot name="footer-prefix">{parseTNode(this.props.footerPrefix)}</slot>
            </div>
            <div className={`${className}__footer__right`}>{this.renderActionsArea()}</div>
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (e: CustomEvent<{ value: string; e: Event }>) => {
    const { value, e: inputEvent } = e.detail;
    if (!this.isControlled) {
      this.pValue.value = value;
    }
    this.fire('change', { value, context: { e: inputEvent } }, { composed: true });
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = true;
    if (e.key === 'Enter' && !this.shiftDown) {
      if (this.isComposing || e.isComposing) {
        return;
      }
      e.preventDefault();
      const { loading } = this.props;
      if (loading) {
        this.handleStop();
      } else {
        this.handleSend(e);
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = false;
  };

  private handleCompositionStart = () => {
    this.isComposing = true;
  };

  private handleCompositionEnd = () => {
    this.isComposing = false;
  };

  private handleFocus = (e: FocusEvent) => {
    this.fire('focus', { value: this.inputValue, context: { e } }, { composed: true });
  };

  private handleBlur = (e: FocusEvent) => {
    this.fire('blur', { value: this.inputValue, context: { e } }, { composed: true });
  };

  private handleSend = (e?: MouseEvent | KeyboardEvent) => {
    if (this.props.disabled || this.isSendBtnDisabled) {
      return;
    }
    this.fire(
      'send',
      { value: this.inputValue, context: { e }, attachments: this.attachmentsValue },
      { composed: true },
    );
  };

  private handleStop = (e?: MouseEvent) => {
    this.fire('stop', { value: this.inputValue, context: { e } }, { composed: true });
  };

  private clickSend = (e?: MouseEvent) => {
    this.handleSend(e);
  };
}
