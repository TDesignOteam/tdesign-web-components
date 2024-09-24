import 'tdesign-web-components/input-number';
import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

type AlignType = 'hide' | 'align-left' | 'align-input';

export default class Inpu1tNumberCenterDemo extends Component {
  type = signal<AlignType>('align-input');

  render() {
    return (
      <t-space direction="vertical">
        <t-radio-group
          value={this.type.value}
          onChange={(val: AlignType) => (this.type.value = val)}
          variant="default-filled"
        >
          <t-radio-button value="hide">隐藏文本提示</t-radio-button>
          <t-radio-button value="align-left">文本提示左对齐</t-radio-button>
          <t-radio-button value="align-input">文本提示对齐输入框</t-radio-button>
        </t-radio-group>

        {this.type.value === 'hide' && (
          <t-space direction="vertical">
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>禁用</span>
              <t-input-number style={{ width: 300 }} disabled />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>只读</span>
              <t-input-number style={{ width: 300 }} readonly />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>正常</span>
              <t-input-number style={{ width: 300 }} />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>成功</span>
              <t-input-number style={{ width: 300 }} status="success" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>警告</span>
              <t-input-number style={{ width: 300 }} status="warning" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>错误</span>
              <t-input-number style={{ width: 300 }} status="error" />
            </t-space>
          </t-space>
        )}

        {this.type.value === 'align-left' && (
          <t-space direction="vertical">
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>正常提示</span>
              <t-input-number style={{ width: 300 }} tips="这是普通文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>成功提示</span>
              <t-input-number style={{ width: 300 }} status="success" tips="校验通过文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>警告提示</span>
              <t-input-number style={{ width: 300 }} status="warning" tips="校验不通过文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>错误提示</span>
              <t-input-number style={{ width: 300 }} status="error" tips="校验存在严重问题文本提示" />
            </t-space>
          </t-space>
        )}

        {this.type.value === 'align-input' && (
          <t-space direction="vertical">
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>正常提示</span>
              <t-input-number style={{ width: 300 }} tips="这是普通文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>成功提示</span>
              <t-input-number style={{ width: 300 }} status="success" tips="校验通过文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>警告提示</span>
              <t-input-number style={{ width: 300 }} status="warning" tips="校验不通过文本提示" />
            </t-space>
            <t-space>
              <span style={{ display: 'inline-flex', height: '100%', alignItems: 'center' }}>错误提示</span>
              <t-input-number style={{ width: 300 }} status="error" tips="校验存在严重问题文本提示" />
            </t-space>
          </t-space>
        )}
      </t-space>
    );
  }
}
