import 'tdesign-web-components/card';

import { bind, Component } from 'omi';

export default class Button extends Component {
  @bind
  clickHandler() {
    // 缺少Message全局提示组件，暂用alert代替
    console.log('操作');
  }

  render() {
    return (
      <t-card
        title="标题"
        actions={
          <a href={null} onClick={this.clickHandler} style={{ cursor: 'pointer' }}>
            操作
          </a>
        }
        bordered
        headerBordered
        style={{ width: '400px' }}
      >
        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
      </t-card>
    );
  }
}
