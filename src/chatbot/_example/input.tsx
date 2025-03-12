import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { TdChatInputSend } from 'tdesign-web-components/chatbot';

import { Attachment } from '../../attachments';
import { ChatStatus } from '../core/type';

export default class ChatInput extends Component {
  inputValue = signal('传入内容');

  status = signal<ChatStatus>('idle');

  files = signal<Attachment[]>([
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      uid: '2',
      name: 'word-file.docx',
      size: 222222,
    },
    {
      uid: '3',
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
    this.files.value = this.files.value.concat(e.detail);
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
      />
    );
  }
}
