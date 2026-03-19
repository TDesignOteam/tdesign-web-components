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
import { TNode } from '../common';
import { TdAttachmentItem } from '../filecard';
import { TdChatSenderProps } from './type';

import styles from './style/chat-sender.less';

const className = `${getClassPrefix()}-chat__input`;

@tag('t-chat-sender')
export default class ChatSender extends Component<TdChatSenderProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: String,
    actions: [Array, Function, Boolean, Object],
    defaultValue: String,
    loading: Boolean,
    autosize: [Boolean, Object],
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
    autosize: { minRows: 2 },
    textareaProps: {},
    actions: ['send'],
  };

  pValue: Omi.SignalValue<string> = signal('');

  pAttachments: Omi.SignalValue<TdAttachmentItem[]> = signal([]);

  uploadRef = createRef<HTMLInputElement>();

  imageUploadRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  private shiftDown = false;

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

  get attachmentsValue() {
    if (this.props?.attachmentsProps?.items) return this.props.attachmentsProps.items;
    return this.pAttachments.value;
  }

  private handleAttachmentsRemove = (e: CustomEvent<TdAttachmentItem>) => {
    const removed = e.detail;
    const rest = this.attachmentsValue.filter((item) => item !== removed);

    this.fire('fileRemove', rest, {
      composed: true,
    });
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

  /** 选择文件 */
  selectFile = () => {
    this.uploadRef.current?.click();
  };

  /** 选择图片 */
  selectImage = () => {
    this.imageUploadRef.current?.click();
  };

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

  private handleImageSelected = () => {
    const files = Array.from(this.imageUploadRef.current?.files || []);
    if (!files.length) {
      return;
    }
    this.fire('fileSelect', files, {
      composed: true,
    });
    this.imageUploadRef.current.value = '';
  };

  /** 上传图片按钮 */
  private renderUploadImage = () => (
    <t-tooltip content="上传图片" className={`${className}__actions__tooltip`}>
      <span
        className={`${className}__actions__item`}
        onClick={() => {
          this.imageUploadRef.current?.click();
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
          this.uploadRef.current?.click();
        }}
      >
        {convertToLightDomNode(<t-icon-file-attachment className={`${className}__actions__icon`} />)}
      </span>
    </t-tooltip>
  );

  private renderButton = () => {
    const { disabled } = this.props;

    return (
      <t-button
        theme="default"
        size="small"
        variant="text"
        className={classname([
          `${className}__button`,
          {
            [`${className}__button--focus`]: !this.isSendBtnDisabled || this.props.loading,
          },
        ])}
        onClick={this.clickSend}
        disabled={disabled || (!this.props.loading && this.isSendBtnDisabled)}
      >
        {convertToLightDomNode(
          this.props.loading ? (
            <t-icon-stop className={classname(`${className}__button__icon`, `${className}__button__stop`)} />
          ) : (
            <t-icon-send-filled className={`${className}__button__icon`} />
          ),
        )}
      </t-button>
    );
  };

  get presetActions(): Array<{ name: string; render: TNode }> {
    return [
      {
        name: 'uploadImage',
        render: this.renderUploadImage(),
      },
      {
        name: 'uploadAttachment',
        render: this.renderUploadAttachment(),
      },
      {
        name: 'attachment',
        render: this.renderUploadAttachment(),
      },
      {
        name: 'send',
        render: this.renderButton(),
      },
    ];
  }

  get isSendBtnDisabled() {
    const { sendBtnDisabled } = this.props;
    const inputValue = this.inputValue || '';

    if (typeof sendBtnDisabled === 'boolean') return sendBtnDisabled;
    if (typeof sendBtnDisabled === 'function') return sendBtnDisabled(inputValue);
    // 输入为空时始终禁用发送
    if (inputValue.trim() === '') return true;

    return false;
  }

  private renderActions = () => {
    const { actions } = this.props;
    // false 或 undefined/null 时不显示
    if (!actions) {
      return null;
    }
    // true 时显示默认按钮
    if (actions === true) {
      return this.presetActions.slice(-1).map((item) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`} tabIndex={-1}>
          {item.render}
        </div>
      ));
    }
    // 数组类型：预设名称数组
    if (Array.isArray(actions)) {
      const arrayActions = (actions as string[]).map((name) => this.presetActions.find((item) => item.name === name));
      return arrayActions.map((item, idx) => (
        <div key={item?.name || idx} class={`${className}__actions__item__wrapper`} tabIndex={-1}>
          {item?.render}
        </div>
      ));
    }
    // 函数类型：(preset) => Array<{ name: string; render: TNode }>
    if (typeof actions === 'function') {
      const arrayActions = actions(this.presetActions) as Array<{ name: string; render: TNode }>;
      return arrayActions.map((item: { name: string; render: TNode }) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`} tabIndex={-1}>
          {item.render}
        </div>
      ));
    }
    // TNode 类型（Object）直接渲染
    return actions as TNode;
  };

  render(props: TdChatSenderProps) {
    // 文件上传配置优先级：fileUploadProps > uploadProps
    const fileUploadConfig = this.props.fileUploadProps || this.props.uploadProps || {};
    // 图片上传配置：imageUploadProps，默认 accept: 'image/*'
    const imageUploadConfig = {
      accept: 'image/*',
      ...this.props.imageUploadProps,
    };

    return (
      <div className={`${className}`}>
        <input {...fileUploadConfig} ref={this.uploadRef} type="file" onChange={this.handleFileSelected} hidden />
        <input
          {...imageUploadConfig}
          ref={this.imageUploadRef}
          type="file"
          onChange={this.handleImageSelected}
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
              <slot name="footer-prefix"></slot>
            </div>
            <div className={`${className}__footer__right`}>
              <div className={`${className}__actions`}>
                <slot name="actions">{this.renderActions()}</slot>
              </div>
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

  private handleFocus = () => {
    this.fire('focus', this.inputValue, {
      composed: true,
    });
  };

  private handleBlur = () => {
    this.fire('blur', this.inputValue, {
      composed: true,
    });
  };

  private handleSend = () => {
    if (this.props.disabled || this.isSendBtnDisabled) {
      return;
    }
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

    // 当非外部受控时，重置输入框和附件
    this.pValue.value = '';
    this.pAttachments.value = [];
  };

  private handleStop = () => {
    this.fire('stop', this.inputValue, {
      composed: true,
    });
  };

  private clickSend = () => (this.props.loading ? this.handleStop() : this.handleSend());
}
