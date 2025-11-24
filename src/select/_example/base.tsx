import 'tdesign-web-components/select';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class SelectBase extends Component {
  render() {
    return (
      <t-space style={{ maxWidth: '1000px' }}>
        <t-select
          placeholder="请选择"
          showArrow
          options={[
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '选项三', value: '3' },
          ]}
          onChange={(value, context) => console.log('change', value, context)}
        />
      </t-space>
    );
  }
}
