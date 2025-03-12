import 'tdesign-icons-web-components/esm/components/send';
import 'tdesign-icons-web-components/esm/components/stop';
import 'tdesign-icons-web-components/esm/components/image';
import 'tdesign-icons-web-components/esm/components/file-add';
import '../../attachments';
import '../../textarea';
import '../../button';
import '../../tooltip';

import { merge } from 'lodash-es';
import { Component, createRef, signal, tag } from 'omi';

import classname, { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { Attachment } from '../../attachments';
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
  };

  attachmentsProps = ChatInput.defaultProps.attachmentsProps;

  textareaProps = ChatInput.defaultProps.textareaProps;

  pValue: Omi.SignalValue<string | number> = signal('');

  pAttachments: Omi.SignalValue<Attachment[]> = signal([]);

  inputRef = createRef<HTMLTextAreaElement>();

  shiftDown = false;

  install() {
    const { value, defaultValue, attachments, attachmentsProps, textareaProps } = this.props;

    this.attachmentsProps = merge(this.attachmentsProps, attachmentsProps);
    this.textareaProps = merge(this.textareaProps, textareaProps);
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

  renderButton = () => {
    const { status, allowStop, disabled } = this.props;
    const hasStop = allowStop && status !== 'complete' && status !== 'stop' && status !== 'idle';

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

  private presetActions: TdChatInputAction[] = [
    {
      name: 'uploadImage',
      render: (
        <t-tooltip content="上传图片">
          <span
            // TODO: 上传附件
            onClick={() => {
              console.log('查看');
            }}
          >
            <t-icon-image />
          </span>
        </t-tooltip>
      ),
    },
    { name: 'uploadFile', render: <t-icon-file-add /> },
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
      <span
        key={item.name}
        class={`${className}__actions__item__wrapper`}
        onClick={() => this.handleAction(item.name, idx)}
      >
        {item.render}
      </span>
    ));
  };

  render(props: TdChatInputProps) {
    return (
      <div className={`${className}`}>
        <div className={`${className}__header`}>
          {this.attachmentsValue?.length ? (
            <t-attachments
              className={`${className}__attachments`}
              {...this.attachmentsProps}
              items={this.attachmentsValue}
              onRemove={this.handleAttachmentsRemove}
            />
          ) : null}
        </div>
        <div className={`${className}__content`}>
          <t-textarea
            ref={this.inputRef}
            className={`${className}__textarea`}
            {...this.textareaProps}
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
            {/* TODO: 功能实现 */}
            <div className={`${className}__model`}>模型功能区</div>
            <div className={`${className}__footer__right`}>
              <div className={`${className}__actions`}>{this.renderActions()}</div>
              {this.renderButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleAttachmentsChange = (attachments: Attachment[]) => {
    this.pAttachments.value = attachments;
    this.fire('attachmentsChange', attachments, {
      composed: true,
    });
  };

  private handleAttachmentsUpload = (e: CustomEvent<Attachment>) => {
    console.log(e);
  };

  private handleAttachmentsRemove = (e: CustomEvent<Attachment>) => {
    const removed = e.detail;
    const rest = this.pAttachments.value.filter((item) => item !== removed);
    this.handleAttachmentsChange(rest);
  };

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

  private handleAction = (action: string, index: number) => {
    this.fire('action', { action, index });
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
