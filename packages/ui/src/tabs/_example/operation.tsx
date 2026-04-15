import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

let index = 2;

export default class Operation extends Component {
  panels = signal([
    {
      value: 1,
      label: '选项卡1',
    },
  ]);

  render() {
    return (
      <t-tabs
        placement={'top'}
        size={'medium'}
        disabled={false}
        theme={'card'}
        defaultValue={1}
        addable
        onRemove={({ value }) => {
          const newPanels = this.panels.value.filter((panel) => panel.value !== value);
          this.panels.value = newPanels;
        }}
        onAdd={() => {
          const newPanels = this.panels.value.concat({
            value: index,
            label: `选项卡${index}`,
          });
          index += 1;
          this.panels.value = newPanels;
        }}
      >
        {this.panels.value.map(({ value, label }) => (
          <t-tab-panel removable={this.panels.value.length > 1} key={value} value={value} label={label}>
            <div style={{ margin: 20 }}>{label}</div>
          </t-tab-panel>
        ))}
      </t-tabs>
    );
  }
}
