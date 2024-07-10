import 'tdesign-web-components/card';
import 'tdesign-web-components/button';
import 'tdesign-web-components/comment';
import 'tdesign-web-components/col';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <t-card
        actions={
          <t-col flex="auto">
            {/* 此处由于缺少dropdown组件，暂时用button替代，不影响aciton测试 */}
            <t-button>action按钮</t-button>
          </t-col>
        }
        bordered
        theme="poster2"
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        footer={<t-comment></t-comment>}
      ></t-card>
    );
  }
}
