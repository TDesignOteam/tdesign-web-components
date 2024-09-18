import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

export default class Combination extends Component {
  theme = signal('normal');

  scrollPosition = signal('auto');

  panels = Array.from({ length: 20 }).map((item, index) => ({
    value: index + 1,
    label: `选项卡${index + 1}`,
  }));

  render() {
    return (
      <t-space direction="vertical" size="large" style={{ width: '100%' }}>
        <t-radio-group
          variant="default-filled"
          defaultValue="normal"
          onChange={(val) => {
            this.theme.value = val;
          }}
        >
          <t-radio-button value="normal" content="常规型" />
          <t-radio-button value="card" content="卡片型" />
        </t-radio-group>
        <t-radio-group
          variant="default-filled"
          defaultValue="auto"
          onChange={(val) => {
            this.scrollPosition.value = val;
          }}
        >
          <t-radio-button value="auto" content="Auto" />
          <t-radio-button value="start" content="Start" />
          <t-radio-button value="center" content="Center" />
          <t-radio-button value="end" content="End" />
        </t-radio-group>
        <t-tabs
          placement={'top'}
          size={'medium'}
          disabled={false}
          theme={this.theme.value}
          scrollPosition={this.scrollPosition.value}
          defaultValue={1}
        >
          {this.panels.map(({ value, label }) => (
            <t-tab-panel key={value} value={value} label={label}>
              <div className="tabs-content" style={{ margin: 20 }}>
                {label}内容区
              </div>
            </t-tab-panel>
          ))}
        </t-tabs>
      </t-space>
    );
  }
}
