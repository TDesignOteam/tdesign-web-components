import 'tdesign-web-components/chat-sender';

import { Component, signal } from 'omi';

import { TdAttachmentItem } from '../../filecard';

export default class ChatSenderEventCustom extends Component {
  inputValue = signal('');

  loading = signal(false);

  logs = signal<string[]>([]);

  attachments = signal<TdAttachmentItem[]>([]);

  addLog = (eventName: string, detail: any) => {
    const log = `[${new Date().toLocaleTimeString()}] ${eventName}: ${JSON.stringify(detail)}`;
    this.logs.value = [log, ...this.logs.value.slice(0, 9)];
  };

  onChange = (e: CustomEvent<string>) => {
    console.log('onChange:', e.detail);
    this.inputValue.value = e.detail;
    this.addLog('onChange', e.detail);
  };

  onSend = (e: CustomEvent<{ value: string; attachments?: TdAttachmentItem[] }>) => {
    console.log('onSend:', e.detail);
    this.inputValue.value = '';
    this.loading.value = true;
    this.addLog('onSend', e.detail);
  };

  onStop = (e: CustomEvent<string>) => {
    console.log('onStop:', e.detail);
    this.loading.value = false;
    this.addLog('onStop', e.detail);
  };

  onFocus = (e: CustomEvent<string>) => {
    console.log('onFocus:', e.detail);
    this.addLog('onFocus', e.detail);
  };

  onBlur = (e: CustomEvent<string>) => {
    console.log('onBlur:', e.detail);
    this.addLog('onBlur', e.detail);
  };

  onFileSelect = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onFileSelect:', e.detail);
    this.attachments.value = [...e.detail, ...this.attachments.value];
    this.addLog('onFileSelect', { fileCount: e.detail.length });
  };

  onFileRemove = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onFileRemove:', e.detail);
    // 非受控模式：组件内部已处理删除，这里可获取删除后的剩余列表
    this.addLog('onFileRemove', { remainingCount: e.detail.length, items: e.detail });
  };

  clearLogs = () => {
    this.logs.value = [];
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h3>CustomEvent 格式事件测试</h3>
        <t-chat-sender
          value={this.inputValue.value}
          placeholder="请输入内容测试事件"
          loading={this.loading.value}
          autosize={{ minRows: 2 }}
          actions={['uploadImage', 'uploadAttachment', 'send']}
          attachmentsProps={{ items: this.attachments.value }}
          onChange={this.onChange}
          onSend={this.onSend}
          onStop={this.onStop}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onFileSelect={this.onFileSelect}
          onFileRemove={this.onFileRemove}
          style={{ marginBottom: '20px' }}
        />
        <div style={{ marginBottom: '10px' }}>
          <button onClick={this.clearLogs}>清空日志</button>
        </div>
        <div
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            minHeight: '200px',
            maxHeight: '300px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          {this.logs.value.length === 0 ? (
            <div style={{ color: '#999' }}>暂无事件触发日志</div>
          ) : (
            this.logs.value.map((log, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}
