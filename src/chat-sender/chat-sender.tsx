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
    value: String,
    actions: [Array, Function, Object, Boolean, String],
    defaultValue: String,
    loading: Boolean,
    autosize: Object,
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

  uploadImageRef = createRef<HTMLInputElement>();

  uploadAttachmentRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  private shiftDown = false;

  /** 预设操作按钮列表，供函数形式使用 */
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
      {
        name: 'send',
        render: this.renderSendButton(),
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

  get attachmentsValue() {
    // 始终返回内部状态（删除操作直接生效）
    return this.pAttachments.value;
  }

  private handleAttachmentsRemove = (e: CustomEvent<{ item: TdAttachmentItem; index: number }>) => {
    const { item, index } = e.detail;
    if (index < 0 || index >= this.attachmentsValue.length) return;

    // 删除操作直接生效：更新内部状态
    const rest = this.attachmentsValue.filter((_, i) => i !== index);
    this.pAttachments.value = rest;

    // 触发事件通知外部（外部可选择同步自己的状态）
    this.fire('fileRemove', item, { composed: true });
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
      this.pValue.value = props.defaultValue;
      shouldUpdate = true;
    }

    // 双向绑定：外部 items 变化时同步到内部状态
    const newItems = props.attachmentsProps?.items;
    const oldItems = oldProps.attachmentsProps?.items;
    // 引用比较或长度比较（处理内联对象场景）
    if (newItems !== oldItems || newItems?.length !== oldItems?.length) {
      if (newItems !== undefined) {
        this.pAttachments.value = newItems;
      }
      shouldUpdate = true;
    }

    if (props.loading !== oldProps.loading) {
      shouldUpdate = true;
    }

    if (props.sendBtnDisabled !== oldProps.sendBtnDisabled) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }

  /** 获取焦点 */
  focus = (options?: FocusOptions) => {
    this.inputRef.current?.focus(options);
  };

  /** 取消焦点 */
  blur = () => {
    this.inputRef.current?.blur();
  };

  /** 触发图片选择 */
  selectImage = () => {
    this.uploadImageRef.current?.click();
  };

  /** 触发文件选择 */
  selectFile = () => {
    this.uploadAttachmentRef.current?.click();
  };

  private handleFileSelected = (name: UploadActionType) => () => {
    const ref = name === 'uploadImage' ? this.uploadImageRef : this.uploadAttachmentRef;
    const files = ref.current?.files;
    if (!files?.length) {
      return;
    }

    // 将 File[] 转换为 TdAttachmentItem[]
    const attachmentItems: TdAttachmentItem[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file,
    }));

    this.pAttachments.value = [...this.pAttachments.value, ...attachmentItems];

    this.fire('fileSelect', attachmentItems, { composed: true });
    ref.current.value = '';
  };

  /** 获取图片上传属性（优先级：imageUploadProps > uploadProps） */
  private getImageUploadProps = (): TdChatSenderUploadProps => {
    const { imageUploadProps, uploadProps } = this.props;
    return {
      accept: 'image/*',
      ...uploadProps,
      ...imageUploadProps,
    };
  };

  /** 获取文件上传属性（优先级：fileUploadProps > uploadProps） */
  private getFileUploadProps = (): TdChatSenderUploadProps => {
    const { fileUploadProps, uploadProps } = this.props;
    return {
      ...uploadProps,
      ...fileUploadProps,
    };
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
        disabled={disabled || this.isSendBtnDisabled}
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

  /** 渲染预设按钮 */
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

    // 有文字或有附件都可以发送
    const hasContent = !!this.inputValue;
    const hasAttachments = this.attachmentsValue?.length > 0;
    return !loading && !hasContent && !hasAttachments;
  }

  /** 渲染右侧区域 */
  private renderActionsArea = () => {
    const { actions } = this.props;

    // 优先级：slot > actions
    const hasSlotContent = this.querySelector('[slot="actions"]');
    if (hasSlotContent) {
      return <slot name="actions"></slot>;
    }

    // false 表示不显示
    if (actions === false) {
      return null;
    }

    // true 表示使用默认按钮
    if (actions === true) {
      return this.renderPresetActions(['send']);
    }

    // 函数形式：基于预设修改
    if (typeof actions === 'function') {
      const result = actions(this.presetActions);
      return result.map((item) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`}>
          {item.render}
        </div>
      ));
    }

    // 数组形式
    if (Array.isArray(actions)) {
      // 判断是字符串数组还是对象数组
      const isStringArray = actions.every((item) => typeof item === 'string');
      if (isStringArray) {
        // TdChatSenderActionName[]: 预设按钮名称数组
        return this.renderPresetActions(actions as TdChatSenderActionName[]);
      }
      // TdChatSenderAction[]: 完整对象数组
      return (actions as TdChatSenderAction[]).map((item) => (
        <div key={item.name} class={`${className}__actions__item__wrapper`}>
          {item.render}
        </div>
      ));
    }

    // TNode 形式：自定义渲染
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
              <slot name="footer-prefix"></slot>
            </div>
            <div className={`${className}__footer__right`}>{this.renderActionsArea()}</div>
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (e: CustomEvent<{ value: string; e: Event }>) => {
    const { value } = e.detail;
    this.pValue.value = value;
    this.fire('change', value, { composed: true });
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') this.shiftDown = true;
    if (e.key === 'Enter' && !this.shiftDown) {
      e.preventDefault();
      const { loading } = this.props;
      if (loading) {
        this.handleStop();
      } else {
        this.handleSend();
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

  private handleFocus = () => {
    this.fire('focus', this.inputValue, { composed: true });
  };

  private handleBlur = () => {
    this.fire('blur', this.inputValue, { composed: true });
  };

  private handleSend = () => {
    if (this.props.disabled || this.isSendBtnDisabled) {
      return;
    }
    this.fire('send', { value: this.inputValue, attachments: this.attachmentsValue }, { composed: true });

    // 发送后不自动清空文本和附件，由外部决定是否清空
  };

  private handleStop = () => {
    this.fire('stop', this.inputValue, { composed: true });
  };

  private clickSend = () => {
    const { loading } = this.props;
    return loading ? this.handleStop() : this.handleSend();
  };
}
