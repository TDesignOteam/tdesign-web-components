import 'tdesign-web-components/select';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

import type { SelectContext, TdOptionProps } from '../type';

export default class SelectBase extends Component {
  value = signal('');

  options = signal<TdOptionProps | null>(null);

  handleChange = (value: string, context: SelectContext) => {
    this.value.value = value;
    this.options.value = context.selectedOptions?.[0] || null;
    console.log('选中的值:', value, '选中的完整选项:', context.selectedOptions?.[0]);
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-select
          placeholder="请选择"
          options={[
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '选项三', value: '3' },
          ]}
          onChange={this.handleChange}
        />

        <span style={{ marginTop: '16px', color: '#666' }}>
          当前选中值: <strong>{this.options.value ? this.value.value : '空'}</strong>
        </span>
      </t-space>
    );
  }
}
