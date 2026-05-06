import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

import type { TabsProps } from '../index';

type ITabsTheme = TabsProps['placement'];

export default class Tabs extends Component {
  position = signal('top');

  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-radio-group
          variant="default-filled"
          defaultValue="top"
          onChange={(val: ITabsTheme) => {
            this.position.value = val;
          }}
        >
          <t-radio-button value="top" content="top" />
          <t-radio-button value="right" content="right" />
          <t-radio-button value="bottom" content="bottom" />
          <t-radio-button value="left" content="left" />
        </t-radio-group>
        <t-tabs placement={this.position.value} defaultValue={'1'} theme={'normal'} disabled={false}>
          <t-tab-panel value={'1'} label="选项卡1">
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡1内容区
            </div>
          </t-tab-panel>
          <t-tab-panel value={'2'} label="选项卡2">
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡2内容区
            </div>
          </t-tab-panel>
          <t-tab-panel value={'3'} label="选项卡3">
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡3内容区
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-space>
    );
  }
}
