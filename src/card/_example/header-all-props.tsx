import 'tdesign-web-components/card';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <t-card
        title="标题"
        subtitle="副标题"
        description="描述"
        actions="操作"
        bordered
        hoverShadow
        style={{ width: '400px' }}
      >
        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
      </t-card>
    );
  }
}
