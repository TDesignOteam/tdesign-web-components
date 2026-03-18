import 'tdesign-web-components/chat-sender';

import { Component, signal } from 'omi';

import { TdAttachmentItem } from '../../filecard';

/**
 * 受控模式示例：展示发送失败时保留内容的场景
 */
export default class ChatSenderControlledMode extends Component {
  inputValue = signal('');

  loading = signal(false);

  attachments = signal<TdAttachmentItem[]>([]);

  errorMessage = signal('');

  onSend = async (e: CustomEvent<{ value: string; attachments?: TdAttachmentItem[] }>) => {
    console.log('onSend:', e.detail);

    // 清空错误信息
    this.errorMessage.value = '';

    // 设置加载状态
    this.loading.value = true;

    try {
      // 模拟发送请求
      await this.sendMessage(e.detail.value, e.detail.attachments);

      // ✅ 发送成功：清空内容
      this.inputValue.value = '';
      this.attachments.value = [];
      this.loading.value = false;
    } catch (error) {
      // ❌ 发送失败：保留内容，显示错误信息
      this.loading.value = false;
      this.errorMessage.value = '发送失败，请重试';
      console.error('Send failed:', error);
    }
  };

  // 模拟发送消息
  private sendMessage = async (value: string, attachments?: TdAttachmentItem[]) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟 30% 失败率
        if (Math.random() < 0.3) {
          reject(new Error('Network error'));
        } else {
          // 实际场景中会使用 value 和 attachments 发送到服务器
          console.log('Sending:', { value, attachments });
          resolve({ success: true });
        }
      }, 1500);
    });

  onChange = (e: CustomEvent<string>) => {
    this.inputValue.value = e.detail;
    // 输入时清空错误信息
    if (this.errorMessage.value) {
      this.errorMessage.value = '';
    }
  };

  onFileSelect = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onFileSelect', e.detail);
  };

  onFileRemove = (e: CustomEvent<TdAttachmentItem>) => {
    console.log('onFileRemove', e.detail);
  };

  onStop = () => {
    this.loading.value = false;
    this.errorMessage.value = '已取消发送';
  };

  onFocus = () => {
    // 聚焦时清空错误信息
    if (this.errorMessage.value) {
      this.errorMessage.value = '';
    }
  };

  render() {
    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>受控模式示例 - 发送失败保留内容</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          此示例展示受控模式的优势：发送失败时自动保留输入内容和附件，用户无需重新输入
        </p>

        {/* 错误提示 */}
        {this.errorMessage.value && (
          <div
            style={{
              padding: '8px 12px',
              marginBottom: '12px',
              background: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px',
              color: '#cf1322',
              fontSize: '14px',
            }}
          >
            ⚠️ {this.errorMessage.value}
          </div>
        )}

        <t-chat-sender
          value={this.inputValue.value}
          placeholder="输入内容后点击发送（有 30% 概率失败）"
          loading={this.loading.value}
          autosize={{ minRows: 2 }}
          actions={['uploadImage', 'uploadAttachment', 'send']}
          attachmentsProps={{ items: this.attachments.value }}
          onChange={this.onChange}
          onSend={this.onSend}
          onStop={this.onStop}
          onFocus={this.onFocus}
          onFileSelect={this.onFileSelect}
          onFileRemove={this.onFileRemove}
        />

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
          <div>当前输入值：{this.inputValue.value || '(空)'}</div>
          <div>附件数量：{this.attachments.value.length}</div>
        </div>
      </div>
    );
  }
}
