import 'tdesign-web-components/button';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class ButtonStatusDemo extends Component {
  loading = signal(false);

  handleClick = () => {
    this.loading.value = true;

    setTimeout(() => {
      this.loading.value = false;
    }, 1000);
  };

  render() {
    return (
      <t-space>
        <t-button disabled>填充按钮</t-button>
        <t-button loading={this.loading.value} onClick={this.handleClick}>
          {this.loading.value ? '加载中' : '点击加载'}
        </t-button>
      </t-space>
    );
  }
}
