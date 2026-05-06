import 'tdesign-web-components/select';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class LoadingDemo extends Component {
  options = signal([]);

  loading = signal(false);

  value = signal(undefined);

  handlePopupVisibleChange = (visible: boolean) => {
    if (visible) {
      this.loading.value = true;
      this.options.value = [];
      this.value.value = '';

      // 模拟异步请求延迟
      setTimeout(() => {
        this.loading.value = false;
        this.options.value = [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
          { label: '选项三', value: '3' },
        ];
      }, 1000);
    }
  };

  render() {
    return (
      <t-space>
        <t-select
          placeholder="请选择"
          loading={this.loading.value}
          options={this.options.value}
          value={this.value.value}
          onPopupVisibleChange={this.handlePopupVisibleChange}
          onChange={(value, context) => {
            this.value.value = value;
            console.log('change', value, context);
          }}
        />
      </t-space>
    );
  }
}
