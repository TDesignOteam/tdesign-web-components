import 'tdesign-icons-web-components/esm/components/send';
import 'tdesign-icons-web-components/esm/components/stop';
import 'tdesign-icons-web-components/esm/components/image';
import 'tdesign-icons-web-components/esm/components/file-add';
import '../../attachments';
import '../../textarea';
import '../../button';
import '../../tooltip';
import '../../dropdown';

import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { Attachment } from '../../filecard';
import type { TdChatInputAction, TdChatInputProps } from '../type';

import styles from '../style/chat-input.less';

const className = `${getClassPrefix()}-chat__input`;
@tag('t-chat-input')
export default class ChatInput extends Component<TdChatInputProps> {
  static css = [styles];

  static propTypes = {
    placeholder: String,
    disabled: Boolean,
    value: String,
    actions: [Array, Function, Boolean],
    attachments: Array,
    defaultValue: String,
    status: String,
    allowStop: Boolean,
    attachmentsProps: Object,
    textareaProps: Object,
    uploadProps: Object,
  };

  static defaultProps: Partial<TdChatInputProps> = {
    status: 'idle',
    allowStop: true,
    attachmentsProps: {
      overflow: 'scrollX',
    },
    textareaProps: {
      autosize: { minRows: 2 },
    },
    uploadProps: {},
  };

  pValue: Omi.SignalValue<string | number> = signal('');

  pAttachments: Omi.SignalValue<Attachment[]> = signal([]);

  uploadRef = createRef<HTMLInputElement>();

  inputRef = createRef<HTMLTextAreaElement>();

  shiftDown = false;

  deepThinkActive = signal(false);

  modelValue = signal(''); // 新增模型值信号

  ready() {
    const { value, defaultValue, attachments } = this.props;

    this.pValue.value = value || defaultValue;
    attachments && (this.pAttachments.value = attachments);
  }

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue.value;
  }

  get attachmentsValue() {
    if (this.props.attachments !== undefined) return this.props.attachments;
    return this.pAttachments.value;
  }

  private handleAttachmentsRemove = (e: CustomEvent<Attachment>) => {
    const removed = e.detail;
    const rest = this.attachmentsValue.filter((item) => item !== removed);
    this.pAttachments.value = rest;
    this.fire('attachmentsRemove', rest, {
      composed: true,
    });
  };

  private handleFileSelected = () => {
    const files = Array.from(this.uploadRef.current?.files || []);
    if (!files.length) {
      return;
    }
    this.fire('attachmentsSelect', files, {
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
        {convertToLightDomNode(<t-icon-file-add />)}
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

  private presetActions: TdChatInputAction[] = [
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
            <div className={`${className}__model`}>
              <t-dropdown
                options={[
                  { value: 'hunyuan', content: 'HunYuan' },
                  { value: 'DeepSeek', content: 'DeepSeek' },
                ]}
                value="hunyuan"
                className={`${className}__model-dropdown`}
                onClick={(data: { value: string; content: string }) => {
                  this.fire('model-change', data.value, { composed: true });
                  this.modelValue.value = data.content; // 更新选中值
                }}
              >
                <t-button
                  className={`${className}__model-dropdown-btn`}
                  variant="text"
                  suffix={<t-icon name="chevron-down" size="16" />}
                >
                  {this.modelValue.value || '默认模型'}
                </t-button>
              </t-dropdown>
              <a
                className={classname([
                  `${className}__model-deepthink`,
                  {
                    [`${className}__model-deepthink--active`]: this.deepThinkActive.value,
                  },
                ])}
                onClick={() => {
                  this.deepThinkActive.value = !this.deepThinkActive.value;
                  this.fire('deep-think', null, { composed: true });
                }}
              >
                <t-icon name="system-2" size="16" />
                深度思考
              </a>
            </div>
            <div className={`${className}__footer__right`}>
              <div className={`${className}__actions`}>{this.renderActions()}</div>
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
