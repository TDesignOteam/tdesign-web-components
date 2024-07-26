import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputStatus extends Component {
  tags1 = ['Vue', 'React', 'Omi', 'Miniprogram'];

  tags2 = ['Vue', 'React', 'Omi', 'Miniprogram'];

  tags3 = ['Vue', 'React', 'Omi', 'Miniprogram'];

  tags4 = ['Vue', 'React', 'Omi', 'Miniprogram'];

  tags5 = ['Vue', 'React', 'Omi', 'Miniprogram'];

  render() {
    const style = { width: '500px', display: 'block' };
    const setTags1 = (value) => {
      this.tags1 = value;
      this.update();
    };
    const setTags2 = (value) => {
      this.tags2 = value;
      this.update();
    };
    const setTags3 = (value) => {
      console.log(value);
      this.tags3 = value;
      this.update();
    };
    const setTags4 = (value) => {
      this.tags4 = value;
      this.update();
    };
    const setTags5 = (value) => {
      this.tags5 = value;
      this.update();
    };

    return (
      <t-space direction="vertical" style={{ width: '100%' }} size="32px">
        <t-space>
          <label>禁用状态：</label>
          <t-tag-input style={style} value={this.tags1} onChange={setTags1} disabled />
        </t-space>

        <t-space>
          <label>只读状态：</label>
          <t-tag-input style={style} value={this.tags2} onChange={setTags2} tips="这是普通文本提示" readonly />
        </t-space>

        <t-space>
          <label>成功状态：</label>
          <t-tag-input
            style={style}
            value={this.tags3}
            onChange={setTags3}
            status="success"
            tips="校验通过文本提示"
            clearable
          />
        </t-space>

        <t-space>
          <label>告警状态：</label>
          <t-tag-input
            style={style}
            value={this.tags4}
            onChange={setTags4}
            status="warning"
            tips="校验不通过文本提示"
            clearable
          />
        </t-space>

        <t-space>
          <label>错误状态：</label>
          <t-tag-input
            style={style}
            value={this.tags5}
            onChange={setTags5}
            status="error"
            tips="校验存在严重问题文本提示"
            clearable
          />
        </t-space>
      </t-space>
    );
  }
}
