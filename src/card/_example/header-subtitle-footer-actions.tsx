import 'tdesign-web-components/card';
import 'tdesign-web-components/icon';
import 'tdesign-web-components/button';
import 'tdesign-web-components/divider';
import 'tdesign-web-components/row';
import 'tdesign-web-components/col';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <t-card
        title="标题"
        subtitle="副标题"
        actions={
          <t-col flex="auto">
            {/* 此处由于缺少dropdown组件，暂时用button替代，不影响aciton测试 */}
            <t-button>action按钮</t-button>
          </t-col>
        }
        bordered
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        footer={
          // 缺少row、col 组件，暂用临时组件替代
          <t-row style={{ display: 'flex', justifyContent: 'space-around' }} ignoreAttributes={['style']}>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon name="thumb-up-1"></t-icon>
              </t-button>
            </t-col>
            <t-divider layout="vertical"></t-divider>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon name="chat"></t-icon>
              </t-button>
            </t-col>
            <t-divider layout="vertical"></t-divider>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon name="share"></t-icon>
              </t-button>
            </t-col>
          </t-row>
        }
      ></t-card>
    );
  }
}
