import 'tdesign-web-components/select';

import { Component } from 'omi';

export default class SelectDisabled extends Component {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3>禁用状态 - 未选中</h3>
          <t-select
            placeholder="请选择（已禁用）"
            disabled
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
          />
        </div>

        <div>
          <h3>禁用状态 - 已选中</h3>
          <t-select
            value="2"
            disabled
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
          />
        </div>
      </div>
    );
  }
}
