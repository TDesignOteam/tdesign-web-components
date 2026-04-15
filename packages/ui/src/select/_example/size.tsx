import 'tdesign-web-components/select';

import { Component } from 'omi';

const OPTIONS = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];

export default class SelectSize extends Component {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3>小尺寸 (small)</h3>
          <t-select
            placeholder="请选择"
            size="small"
            options={OPTIONS}
            onChange={(value, context) => console.log('small change', value, context)}
          />
        </div>

        <div>
          <h3>中等尺寸 (medium) - 默认</h3>
          <t-select
            placeholder="请选择"
            size="medium"
            options={OPTIONS}
            onChange={(value, context) => console.log('medium change', value, context)}
          />
        </div>

        <div>
          <h3>大尺寸 (large)</h3>
          <t-select
            placeholder="请选择"
            size="large"
            options={OPTIONS}
            onChange={(value, context) => console.log('large change', value, context)}
          />
        </div>
      </div>
    );
  }
}
