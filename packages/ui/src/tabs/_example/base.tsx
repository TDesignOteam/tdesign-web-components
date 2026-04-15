import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

import { Component } from 'omi';

const tabList = [
  { label: '选项卡一', value: 1, panel: <p style={{ padding: 25 }}>这是选项卡一的内容，使用 Tabs 渲染</p> },
  { label: '选项卡二', value: 2, panel: <p style={{ padding: 25 }}>这是选项卡二的内容，使用 Tabs 渲染</p> },
  { label: '选项卡三', value: 3, panel: <p style={{ padding: 25 }}>这是选项卡三的内容，使用 Tabs 渲染</p> },
];

export default class Tabs extends Component {
  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-tabs placement={'top'} size={'medium'} defaultValue={1}>
          <t-tab-panel value={1} label="选项卡1">
            <p style={{ padding: 25 }}>选项卡1的内容，使用 TabPanel 渲染</p>
          </t-tab-panel>
          <t-tab-panel value={2} label="选项卡2">
            <p style={{ padding: 25 }}>选项卡2的内容，使用 TabPanel 渲染</p>
          </t-tab-panel>
          <t-tab-panel value={3} label="选项卡3">
            <p style={{ padding: 25 }}>选项卡3的内容，使用 TabPanel 渲染</p>
          </t-tab-panel>
        </t-tabs>

        <t-tabs defaultValue={1} list={tabList} />
      </t-space>
    );
  }
}
