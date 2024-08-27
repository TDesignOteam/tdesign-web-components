import 'tdesign-web-components/breadcrumb';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class Breadcrumb extends Component {
  count = signal(0);

  // 点击事件
  onClickItem = () => {
    this.count.value += 1;
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-breadcrumb>
          <t-breadcrumb-item href="http://tdesign.tencent.com/" target="_blank">
            页面1
          </t-breadcrumb-item>
          <t-breadcrumb-item href="http://tdesign.tencent.com">页面2</t-breadcrumb-item>
          <t-breadcrumb-item href="https://tdesign.tencent.com" disabled>
            页面3
          </t-breadcrumb-item>
          <t-breadcrumb-item onClick={this.onClickItem}>自定义点击</t-breadcrumb-item>
        </t-breadcrumb>
        <div>点击次数: {this.count.value}</div>
      </t-space>
    );
  }
}
