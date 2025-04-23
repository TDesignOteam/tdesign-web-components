import 'tdesign-icons-web-components/esm/components/clear';
import 'tdesign-web-components/chatbot';
import 'tdesign-web-components/tooltip';
import 'tdesign-web-components/button';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

import { convertToLightDomNode } from '../../_util/lightDom';
import { ChatStatus } from '../../chatbot/core/type';

export default class CustomExample extends Component {
  static css = [
    `
    .input::part(icon) {
      cursor: pointer;
      color: var(--t-chat-input-actions-item-color);
    }

    .panel {
      margin-bottom: 12px;
      height: 200px;
      width: 100%;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 20px;
    }
  `,
  ];

  inputValue = signal('输入内容');

  panel = signal(false);

  status = signal<ChatStatus>('idle');

  onChange = (e: CustomEvent) => {
    this.inputValue.value = e.detail;
  };

  onSend = () => {
    this.inputValue.value = '';
  };

  renderPanel = () => {
    if (!this.panel.value) {
      return null;
    }
    return (
      <div slot="header" className="panel">
        <div>自定义面板</div>
        <t-button
          onClick={() => {
            this.panel.value = false;
          }}
        >
          面板收起
        </t-button>
      </div>
    );
  };

  renderActions = (presets) => [
    ...presets,
    {
      name: 'clear',
      render: (
        <t-tooltip content="清空">
          <span
            onClick={() => {
              this.inputValue.value = '';
            }}
          >
            {convertToLightDomNode(<t-icon-clear part="icon" />)}
          </span>
        </t-tooltip>
      ),
    },
  ];

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'end', height: 300 }}>
        <t-chat-sender
          className="input"
          value={this.inputValue.value}
          placeholder="请输入内容"
          actions={this.renderActions}
          onChange={this.onChange}
          onSend={this.onSend}
        >
          {this.renderPanel()}
          <div slot="footer-left">
            <t-button
              onClick={() => {
                this.panel.value = true;
              }}
            >
              唤起面板
            </t-button>
          </div>
        </t-chat-sender>
      </div>
    );
  }
}
