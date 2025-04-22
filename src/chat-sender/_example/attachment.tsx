import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ChatStatus } from '../../chatbot/core/type';
import { Attachment } from '../../filecard';
import { TDChatInputSend } from '../type';

export default class AttachmentExample extends Component {
  inputValue = signal('输入内容');

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
    // 这里处理自己业务的上传逻辑
    this.files.value = e.detail.concat(this.files.value);
  };

  onSend = (e: CustomEvent<TDChatInputSend>) => {
    console.log('提交', e);
    this.inputValue.value = '';
    this.files.value = [];
    this.status.value = 'pending';
  };

  onStop = () => {
    console.log('停止');
    this.status.value = 'idle';
  };

  render() {
    return (
      <t-chat-input
        value={this.inputValue.value}
        placeholder="请输入内容"
        status={this.status.value}
        actions
        uploadProps={{
          multiple: true,
          accept: 'image/*',
        }}
        attachmentsProps={{
          items: this.files.value,
          overflow: 'scrollX',
        }}
        onFileSelect={this.onAttachmentsSelect}
        onFileRemove={this.onAttachmentsRemove}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      ></t-chat-input>
    );
  }
}
