import 'tdesign-web-components/tabs';

import { Component, signal } from 'omi';

const tabs: Array<{ label: string; value: number }> = [];
for (let i = 1, max = 10; i <= max; ++i) {
  tabs.push({
    value: i,
    label: `选项卡 ${i}`,
  });
}

export default class Custom extends Component {
  panels = signal(tabs);

  value = signal(1);

  render() {
    return (
      <t-tabs
        placement={'top'}
        size={'medium'}
        disabled={false}
        theme={'card'}
        defaultValue={1}
        value={this.value.value}
        onChange={(v) => {
          this.value.value = v;
        }}
        addable
        onRemove={({ value }) => {
          const newPanels = this.panels.value.filter((panel) => panel.value !== value);
          this.panels.value = newPanels;
        }}
        onAdd={() => {
          const newValue = this.panels.value.length > 0 ? this.panels.value[this.panels.value.length - 1].value + 1 : 1;
          const newPanels = this.panels.value.concat({
            value: newValue,
            label: `选项卡${this.panels.value.length + 1}`,
          });
          this.value.value = newValue;
          this.panels.value = newPanels;
        }}
      >
        {this.panels.value.map(({ value, label }, index) => (
          <t-tab-panel
            key={value}
            value={value}
            label={label}
            removable={true}
            onRemove={() => {
              const newPanels = this.panels.value.filter((v, i) => i !== index);
              this.panels.value = newPanels;
            }}
          >
            <div className="tabs-content" style={{ margin: 20 }}>
              {label}内容区
            </div>
          </t-tab-panel>
        ))}
      </t-tabs>
    );
  }
}
