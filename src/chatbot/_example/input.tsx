import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';

import { ModelStatus } from '../core/type';

export default class ChatInput extends Component {
  inputValue = signal('传入内容');

  status = signal<ModelStatus>('idle');

  files = signal([
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
    {
      uid: '4',
      name: 'pdf-file.pdf',
      size: 444444,
    },
    {
      uid: '5',
      name: 'ppt-file.pptx',
      size: 555555,
    },
    {
      uid: '6',
      name: 'video-file.mp4',
      size: 666666,
    },
    {
      uid: '7',
      name: 'audio-file.mp3',
      size: 777777,
    },
    {
      uid: '8',
      name: 'zip-file.zip',
      size: 888888,
    },
  ]);

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  onSend = () => {
    console.log('提交', this.inputValue);
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
        attachments={this.files.value}
        textareaProps={{
          autosize: { minRows: 2 },
        }}
        onChange={this.onChange}
        onSend={this.onSend}
        onStop={this.onStop}
      />
    );
  }
}
