import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

const defaultList = [
  { label: '选项卡一', value: 1, panel: <p style={{ padding: 25 }}>这是选项卡一的内容，使用 Tabs 渲染</p> },
  { label: '选项卡二', value: 2, panel: <p style={{ padding: 25 }}>这是选项卡二的内容，使用 Tabs 渲染</p> },
  { label: '选项卡三', value: 3, panel: <p style={{ padding: 25 }}>这是选项卡三的内容，使用 Tabs 渲染</p> },
];

export default class DragSortTabs extends Component {
  tabList1 = signal([...defaultList]);

  tabList2 = signal([...defaultList]);

  onDragSort1 = ({ currentIndex, targetIndex }) => {
    const temp = this.tabList1.value[currentIndex];
    this.tabList1.value[currentIndex] = this.tabList1.value[targetIndex];
    this.tabList1.value[targetIndex] = temp;
    this.tabList1.value = [...this.tabList1.value];
  };

  onDragSort2 = ({ currentIndex, targetIndex }) => {
    const temp = this.tabList2.value[currentIndex];
    this.tabList2.value[currentIndex] = this.tabList2.value[targetIndex];
    this.tabList2.value[targetIndex] = temp;
    this.tabList2.value = [...this.tabList2.value];
  };

  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-tabs defaultValue={1} list={this.tabList1.value} dragSort onDragSort={this.onDragSort1} />
        <t-tabs dragSort onDragSort={this.onDragSort2} placement={'top'} size={'medium'} defaultValue={1}>
          {this.tabList2.value.map(({ label, value, panel }) => (
            <t-tab-panel key={value} value={value} label={label}>
              {panel}
            </t-tab-panel>
          ))}
        </t-tabs>
      </t-space>
    );
  }
}
