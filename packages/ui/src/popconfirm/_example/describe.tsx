import 'tdesign-web-components/popconfirm';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

const css = `
  .title {
    font-weight: 500;
    font-size: 14px;
  }
  .describe {
    margin-top: 8px;
    font-size: 12px;
    color: var(--td-text-color-secondary);
  }
`;

export default class DescribeExample extends Component {
  content = (
    <>
      <p class="title">带描述的气泡确认框文字按钮</p>
      <p class="describe">带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p>
    </>
  );

  render() {
    return (
      <t-space>
        <t-popconfirm css={css} theme={'default'} content={this.content}>
          <t-button theme="primary">自定义浮层内容</t-button>
        </t-popconfirm>
        <t-popconfirm css={css} theme={'warning'} content={this.content}>
          <t-button theme="warning">自定义浮层内容</t-button>
        </t-popconfirm>
      </t-space>
    );
  }
}
