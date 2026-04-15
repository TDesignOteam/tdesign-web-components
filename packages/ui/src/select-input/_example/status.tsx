import 'tdesign-web-components/select-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

const classStyles = `
<style>
.tdesign-demo__select-empty-status {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}
.tdesign-demo-select-input-status > div {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tdesign-demo-select-input-status .t-select-input__wrap {
  width: 300px;
  height: 32px;
}
</style>
`;

export default class SelectInputStatus extends Component {
  selectValue = 'TDesign';

  installed(): void {
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }

  render() {
    return (
      <t-space direction="vertical" size={32}>
        <t-space>
          <span>禁用状态：</span>
          <t-select-input
            value={this.selectValue}
            disabled
            placeholder="Please Select"
            tips="这是禁用状态的文本"
            panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
          />
        </t-space>

        <t-space>
          <span>只读状态：</span>
          <t-select-input
            value={this.selectValue}
            readonly
            placeholder="Please Select"
            tips="这是只读状态的文本提示"
            panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
          />
        </t-space>

        <t-space>
          <span>成功状态：</span>
          <t-select-input
            value={this.selectValue}
            status="success"
            tips="校验通过文本提示"
            placeholder="Please Select"
            panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
          />
        </t-space>

        <t-space>
          <span>警告状态：</span>
          <t-select-input
            value={this.selectValue}
            status="warning"
            tips="校验不通过文本提示"
            placeholder="Please Select"
            panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
          />
        </t-space>

        <t-space>
          <span>错误状态：</span>
          <t-select-input
            value={this.selectValue}
            status="error"
            tips="校验存在严重问题文本提示"
            placeholder="Please Select"
            panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
          />
        </t-space>

        <t-space>
          <span>加载状态：</span>
          <t-select-input
            loading={true}
            tips="处于加载状态的文本提示"
            placeholder="Please Select"
            panel={<div className="tdesign-demo__select-empty-status">加载中...</div>}
          />
        </t-space>
      </t-space>
    );
  }
}
