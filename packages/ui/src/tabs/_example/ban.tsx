import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

import type { TabsProps } from '../index';

type ITabsTheme = TabsProps['theme'];

export default class Tabs extends Component {
  theme = signal('normal');

  render() {
    return (
      <t-space direction="vertical" size="large" style={{ width: '100%' }}>
        <t-radio-group
          variant="default-filled"
          defaultValue="normal"
          onChange={(val: ITabsTheme) => {
            this.theme.value = val;
          }}
        >
          <t-radio-button value="normal" content="常规型" />
          <t-radio-button value="card" content="卡片型" />
        </t-radio-group>
        <t-tabs placement={'top'} defaultValue={1} theme={this.theme.value} size={'medium'} disabled={false}>
          <t-tab-panel value={1} label={'选项卡1'}>
            <div style={{ margin: 20 }}>选项卡1内容区</div>
          </t-tab-panel>
          <t-tab-panel value={2} label={'选项卡2'} disabled>
            <div style={{ margin: 20 }}>选项卡2内容区</div>
          </t-tab-panel>
          <t-tab-panel value={3} label={'选项卡3'}>
            <div style={{ margin: 20 }}>选项卡3内容区</div>
          </t-tab-panel>
        </t-tabs>
      </t-space>
    );
  }
}
