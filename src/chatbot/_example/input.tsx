import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { TdChatInputSend } from 'tdesign-web-components/chatbot';

import classname from '../../_util/classname';
import { Attachment } from '../../filecard';
import { ChatStatus } from '../core/type';

import styles from './style/chat-model.less';

const className = `t-chat__input`;
export default class ChatInput extends Component {
  static css = [styles];

  inputValue = signal('传入内容');

  status = signal<ChatStatus>('idle');

  files = signal<Attachment[]>([
    {
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      name: 'word-file.docx',
      size: 222222,
    },
    {
      name: 'image-file.png',
      size: 333333,
    },
  ]);

  deepThinkActive = signal(false);

  modelValue = signal(''); // 新增模型值信号

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onAttachmentsRemove = (e: CustomEvent<Attachment[]>) => {
    console.log('onAttachmentsRemove', e);
    this.files.value = e.detail;
  };

  onAttachmentsSelect = (e: CustomEvent<Attachment[]>) => {
    console.log('onAttachmentsSelect', e);
    this.files.value = e.detail.concat(this.files.value);
  };

  onSend = (e: CustomEvent<TdChatInputSend>) => {
    console.log('提交', e);
    this.inputValue.value = '';
    this.files.value = [];
    this.status.value = 'pending';
  };

  onStop = () => {
    console.log('停止');
    this.status.value = 'idle';
  };

  renderModel = () => (
    <div className={`${className}__model`} slot="input-footer-left">
      <t-dropdown
        options={[
          { value: 'hunyuan', content: 'HunYuan' },
          { value: 'DeepSeek', content: 'DeepSeek' },
        ]}
        value="hunyuan"
        className={`${className}__model-dropdown`}
        onClick={(data: { value: string; content: string }) => {
          this.modelValue.value = data.content; // 更新选中值
          console.log('切换模型:', this.modelValue.value);
        }}
      >
        <t-button
          className={`${className}__model-dropdown-btn`}
          variant="text"
          shape="round"
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
          console.log('深度思考:', this.deepThinkActive.value);
        }}
      >
        <t-icon name="system-2" size="16" />
        深度思考
      </a>
    </div>
  );

  render() {
    return (
      <t-chat-input
        value={this.inputValue.value}
        placeholder="请输入内容"
        status={this.status.value}
        actions
        attachments={this.files.value}
        textareaProps={{
          autosize: { minRows: 2 },
        }}
        uploadProps={{
          multiple: true,
          accept: 'image/*',
        }}
        onAttachmentsSelect={this.onAttachmentsSelect}
        onAttachmentsRemove={this.onAttachmentsRemove}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      >
        {this.renderModel()}
      </t-chat-input>
    );
  }
}
