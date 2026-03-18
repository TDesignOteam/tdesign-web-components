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

  onChange = (e: CustomEvent<{ value: string; context: { e: Event } }>) => {
    console.log('onChange', e.detail);
    this.inputValue.value = e.detail.value;
  };

  onAttachmentsRemove = (e: CustomEvent<{ item: TdAttachmentItem; index: number }>) => {
    console.log('onAttachmentsRemove', e.detail);
    // 受控模式：需要手动删除文件
    const { index } = e.detail;
    this.files.value = this.files.value.filter((_, i) => i !== index);
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

  onStop = (e: CustomEvent<{ value: string; e?: MouseEvent }>) => {
    console.log('停止', e.detail);
    this.loading.value = false;
  };

  render() {
    return (
      <t-chat-sender
        value={this.inputValue.value}
        placeholder="请输入内容"
        loading={this.loading.value}
        actions={['uploadAttachment', 'send']}
        imageUploadProps={{
          multiple: true,
          accept: 'image/*',
        }}
        fileUploadProps={{
          multiple: false,
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
