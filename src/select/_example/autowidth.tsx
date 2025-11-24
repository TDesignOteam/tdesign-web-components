import 'tdesign-web-components/select';

import { Component } from 'omi';

export default class SelectAutowidth extends Component {
  render() {
    return (
      <div>
        <t-select
          placeholder="请选择"
          autoWidth
          showArrow
          options={[
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '非常长的选项三非常长的选项三', value: '3' },
          ]}
          onChange={(value, context) => console.log('change', value, context)}
        />
      </div>
    );
  }
}
