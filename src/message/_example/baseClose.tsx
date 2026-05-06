import 'tdesign-web-components/message';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class MessageRender extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-message duration={0} theme={'info'} closeBtn={true}>
          默认关闭按钮
        </t-message>
        <t-message duration={0} theme={'info'} closeBtn={'关闭'}>
          自定义关闭按钮（文字）
        </t-message>
        <t-message duration={0} theme={'info'} closeBtn={<div>x</div>}>
          自定义关闭按钮（ReactNode）
        </t-message>
        <t-message duration={0} theme={'info'} closeBtn={<div onClick={() => console.log('close')}>x</div>}>
          自定义关闭按钮（函数）
        </t-message>
      </t-space>
    );
  }
}
