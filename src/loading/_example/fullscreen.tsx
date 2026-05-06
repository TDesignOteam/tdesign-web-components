import 'tdesign-web-components/loading';
import 'tdesign-web-components/switch';

import { Component } from 'omi';

export default class LoadingFullScreen extends Component {
  checked = false;

  loading = false;

  onChange = (value: boolean) => {
    this.checked = value;
    this.loading = value;

    if (value) {
      setTimeout(() => {
        this.checked = false;
        this.loading = false;
        this.update();
      }, 2000);
    }
    this.update();
  };

  render() {
    return (
      <>
        <t-loading loading={this.loading} fullscreen preventScrollThrough={true} text="加载中"></t-loading>
        Loading state: {this.checked}
        <t-switch value={this.checked} onChange={this.onChange} />
      </>
    );
  }
}
