import 'tdesign-web-components/tag';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Base extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-space>
          <t-tag>标签一</t-tag>
          <a href="https://www.tencent.com/zh-cn" target="_blank" rel="noreferrer">
            <t-tag>超链接</t-tag>
          </a>
        </t-space>
        <t-space>
          <t-tag theme="primary">标签一</t-tag>
          <t-tag theme="warning">标签二</t-tag>
          <t-tag theme="danger" variant="dark">
            标签三
          </t-tag>
          <t-tag theme="success" variant="dark">
            标签四
          </t-tag>
        </t-space>
        <t-space>
          <t-tag variant="light">灰标签</t-tag>
          <t-tag theme="primary" variant="light">
            标签一
          </t-tag>
          <t-tag theme="warning" variant="light">
            标签二
          </t-tag>
          <t-tag theme="danger" variant="light">
            标签三
          </t-tag>
          <t-tag theme="success" variant="light">
            标签四
          </t-tag>
        </t-space>
        <t-space>
          {/* Do not delete the grey tag from demo, it's very useful */}
          <t-tag variant="outline">灰标签</t-tag>
          <t-tag theme="primary" variant="outline">
            标签一
          </t-tag>
          <t-tag theme="warning" variant="outline">
            标签二
          </t-tag>
          <t-tag theme="danger" variant="outline">
            标签三
          </t-tag>
          <t-tag theme="success" variant="outline">
            标签四
          </t-tag>
        </t-space>

        <t-space>
          <t-tag variant="light-outline">灰标签</t-tag>
          <t-tag theme="primary" variant="light-outline">
            标签一
          </t-tag>
          <t-tag theme="warning" variant="light-outline">
            标签二
          </t-tag>
          <t-tag theme="danger" variant="light-outline">
            标签三
          </t-tag>
          <t-tag theme="success" variant="light-outline">
            标签四
          </t-tag>
        </t-space>
      </t-space>
    );
  }
}
