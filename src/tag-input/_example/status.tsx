import 'tdesign-web-components/tag-input';

import { Component } from 'omi';

const style = { width: '500px' };

export default class TagInputStatus extends Component {
  tags1 = ['Vue', 'React', 'Miniprogram'];

  tags2 = ['Vue', 'React', 'Miniprogram'];

  tags3 = ['Vue', 'React', 'Miniprogram'];

  tags4 = ['Vue', 'React', 'Miniprogram'];

  tags5 = ['Vue', 'React', 'Miniprogram'];

  render() {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>禁用状态：</label>
          <t-tag-input
            style={style}
            value={this.tags1}
            disabled
            onChange={(e: CustomEvent) => {
              this.tags1 = e.detail.value;
              this.update();
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>只读状态：</label>
          <t-tag-input
            style={style}
            value={this.tags2}
            readonly
            onChange={(e: CustomEvent) => {
              this.tags2 = e.detail.value;
              this.update();
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>成功状态：</label>
          <t-tag-input
            style={style}
            value={this.tags3}
            status="success"
            tips="校验通过文本提示"
            clearable
            onChange={(e: CustomEvent) => {
              this.tags3 = e.detail.value;
              this.update();
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>告警状态：</label>
          <t-tag-input
            style={style}
            value={this.tags4}
            status="warning"
            tips="校验不通过文本提示"
            clearable
            onChange={(e: CustomEvent) => {
              this.tags4 = e.detail.value;
              this.update();
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>错误状态：</label>
          <t-tag-input
            style={style}
            value={this.tags5}
            status="error"
            tips="校验存在严重问题文本提示"
            clearable
            onChange={(e: CustomEvent) => {
              this.tags5 = e.detail.value;
              this.update();
            }}
          />
        </div>
      </div>
    );
  }
}
