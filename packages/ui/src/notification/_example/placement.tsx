import 'tdesign-web-components/notification';
import 'tdesign-web-components/space';
import 'tdesign-web-components/input';
import 'tdesign-web-components/button';

import { Component } from 'omi';
import { InputValue } from 'tdesign-web-components/input';
import { NotificationInfoOptions, NotificationPlugin } from 'tdesign-web-components/notification';

export default class PlacementExample extends Component {
  offsetX: InputValue = '0';

  offsetY: InputValue = '0';

  openNotification = (placement: NotificationInfoOptions['placement']) => {
    NotificationPlugin.info({
      title: '标题名称',
      content: '这是一条可以自动关闭的消息通知',
      placement,
      duration: 3000,
      offset: [this.offsetX, this.offsetY],
      closeBtn: true,
    });
  };

  render() {
    return (
      <t-space direction="vertical">
        <t-space>
          <t-input
            placeholder="请输入横向偏移量"
            value={this.offsetX}
            onChange={(v) => {
              this.offsetX = v;
            }}
            style={{ width: '130px', display: 'inline-block', margin: '0 20px 36px 0' }}
          />
          <t-input
            placeholder="请输入纵向向偏移量"
            value={this.offsetY}
            onChange={(v) => {
              this.offsetY = v;
            }}
            style={{ width: '130px', display: 'inline-block', margin: '0 20px 36px 0' }}
          />
        </t-space>
        <t-space>
          <t-button onClick={() => this.openNotification('top-left')}>左上角</t-button>
          <t-button onClick={() => this.openNotification('top-right')}>右上角</t-button>
        </t-space>
        <t-space>
          <t-button onClick={() => this.openNotification('bottom-left')}>左下角</t-button>
          <t-button onClick={() => this.openNotification('bottom-right')}>右下角</t-button>
        </t-space>
      </t-space>
    );
  }
}
