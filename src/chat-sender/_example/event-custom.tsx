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

  onChange = (e: CustomEvent<{ value: string; context: { e: InputEvent } }>) => {
    console.log('onChange:', e.detail);
    this.inputValue.value = e.detail.value;
    this.addLog('onChange', e.detail);
  };

  onSend = (
    e: CustomEvent<{ value: string; context: { e?: MouseEvent | KeyboardEvent }; attachments?: TdAttachmentItem[] }>,
  ) => {
    console.log('onSend:', e.detail);
    // 发送后手动清空输入框和附件
    this.inputValue.value = '';
    this.attachments.value = [];
    this.loading.value = true;

    this.addLog('onSend', e.detail);
  };

  onStop = (e: CustomEvent<{ value: string; context: { e?: MouseEvent } }>) => {
    console.log('onStop:', e.detail);
    this.loading.value = false;
    this.addLog('onStop', e.detail);
  };

  onFocus = (e: CustomEvent<{ value: string; context: { e: FocusEvent } }>) => {
    console.log('onFocus:', e.detail);
    this.addLog('onFocus', e.detail);
  };

  onBlur = (e: CustomEvent<{ value: string; context: { e: FocusEvent } }>) => {
    console.log('onBlur:', e.detail);
    this.addLog('onBlur', e.detail);
  };

  onFileSelect = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onFileSelect:', e.detail);
    // ✅ 组件会自动处理文件添加，这里可以选择：
    // 1. 什么都不做（组件自己管理）
    // 2. 同步到外部状态（用于其他业务逻辑）
    this.attachments.value = [...e.detail, ...this.attachments.value];
    this.addLog('onFileSelect', { fileCount: e.detail.length });
  };

  onFileRemove = (e: CustomEvent<{ item: TdAttachmentItem; index: number }>) => {
    console.log('onFileRemove:', e.detail);
    // 受控模式：需要手动删除文件
    const { index } = e.detail;
    this.attachments.value = this.attachments.value.filter((_, i) => i !== index);
    this.addLog('onFileRemove', e.detail);
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
