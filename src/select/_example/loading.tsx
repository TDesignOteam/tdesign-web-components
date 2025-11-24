import 'tdesign-web-components/select';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class LoadingDemo extends Component {
  options = [];

  loading = false;

  value: string | undefined = undefined;

  handlePopupVisibleChange = (visible: boolean) => {
    if (visible) {
      this.loading = true;
      this.options = [];
      this.value = '';
      this.update();

      setTimeout(() => {
        this.loading = false;
        this.options = [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
          { label: '选项三', value: '3' },
        ];
        this.update();
      }, 1000);
    }
  };

  render() {
    return (
      <t-space>
        <t-select
          placeholder="请选择"
          loading={this.loading}
          options={this.options}
          value={this.value}
          onPopupVisibleChange={this.handlePopupVisibleChange}
          onChange={(value, context) => {
            this.value = value;
            console.log('change', value, context);
            this.update();
          }}
        />
      </t-space>
    );
  }
}
