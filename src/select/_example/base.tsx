import 'tdesign-web-components/select';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

import type { SelectContext, TdOptionProps } from '../type';

const currentValue = signal('');
const currentOption = signal<TdOptionProps | null>(null);

export default class SelectBase extends Component {
  options = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ];

  handleChange = (value: string, context: SelectContext) => {
    currentValue.value = value;
    currentOption.value = context.selectedOptions?.[0] || null;
    console.log('选中的值:', value, '选中的完整选项:', context.selectedOptions?.[0]);
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-select placeholder="请选择" options={this.options} onChange={this.handleChange} />

        <span style={{ marginTop: '16px', color: '#666' }}>
          当前选中值: <strong>{currentOption.value ? currentValue.value : '空'}</strong>
        </span>
      </t-space>
    );
  }
}
