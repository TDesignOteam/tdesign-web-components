import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { TdAttachmentItem } from '../../filecard';
import { TdChatSenderParams } from '../type';

export default class AttachmentExample extends Component {
  inputValue = signal('输入内容');

  loading = signal<Boolean>(false);

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
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
      size: 333333,
    },
  ]);

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
    // 这里处理自己业务的上传逻辑
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

  render() {
    return (
      <t-chat-sender
        value={this.inputValue.value}
        placeholder="请输入内容"
        loading={this.loading.value}
        actions={['attachment', 'send']}
        uploadProps={{
          multiple: false,
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
      ></t-chat-sender>
    );
  }
}
