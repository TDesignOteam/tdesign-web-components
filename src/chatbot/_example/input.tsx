import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import classname from '../../_util/classname';
import { TdChatSenderParams } from '../../chat-sender';
import { TdAttachmentItem } from '../../filecard';

import styles from './style/chat-model.less';

const className = `t-chat__input`;
export default class ChatSender extends Component {
  static css = [styles];

  inputValue = signal('传入内容');

  loading = signal<boolean>(false);

  files = signal<TdAttachmentItem[]>([
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

  onAttachmentsRemove = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onAttachmentsRemove', e);
    this.files.value = e.detail;
  };

  onAttachmentsSelect = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onAttachmentsSelect', e);
    this.files.value = e.detail.concat(this.files.value);
  };

  onSend = (e: CustomEvent<TdChatSenderParams>) => {
    console.log('提交', e);
    this.inputValue.value = '';
    this.files.value = [];
    this.loading.value = true;
  };

  onStop = () => {
    console.log('停止');
    this.loading.value = false;
  };

  renderModel = () => (
    <div className={`${className}__model`} slot="footer-prefix">
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
      <t-chat-sender
        value={this.inputValue.value}
        placeholder="请输入内容"
        loading={this.loading.value}
        actions
        attachmentsProps={{
          items: this.files.value,
          overflow: 'scrollX',
        }}
        autosize={{ minRows: 2 }}
        uploadProps={{
          multiple: true,
          accept: 'image/*',
        }}
        onFileSelect={this.onAttachmentsSelect}
        onFileRemove={this.onAttachmentsRemove}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      >
        {this.renderModel()}
      </t-chat-sender>
    );
  }
}
