import 'tdesign-web-components/card';
import 'tdesign-web-components/tag';
import 'tdesign-web-components/icon';
import 'tdesign-web-components/avatar';
import 'tdesign-web-components/button';
import 'tdesign-web-components/divider';
import 'tdesign-web-components/row';
import 'tdesign-web-components/col';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <>
        <t-space direction="vertical">
          <t-card
            bordered
            theme="poster2"
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
          <t-card
            bordered
            theme="poster2"
            cover="https://tdesign.gtimg.com/site/source/card-demo.png"
            style={{ width: '400px' }}
            actions={
              <t-col flex="auto">
                {/* 此处由于缺少dropdown组件，暂时用button替代，不影响aciton测试 */}
                <t-button>action按钮</t-button>
              </t-col>
            }
            footer={
              // 缺少row、col 组件，暂用临时组件替代
              <t-row style={{ flex: 'auto' }} ignoreAttributes={['style']}>
                <t-col>
                  <t-button theme="default" variant="text">
                    <t-icon name="heart"></t-icon>
                  </t-button>
                </t-col>
                <t-col>
                  <t-button theme="default" variant="text">
                    <t-icon name="share"></t-icon>
                  </t-button>
                </t-col>
              </t-row>
            }
          ></t-card>
          <t-card
            bordered
            theme="poster2"
            cover="https://tdesign.gtimg.com/site/source/card-demo.png"
            style={{ width: '400px' }}
            actions={
              <t-col flex="auto">
                {/* 此处由于缺少dropdown组件，暂时用button替代，不影响aciton测试 */}
                <t-button>action按钮</t-button>
              </t-col>
            }
            footer={
              <t-avatar-group max={2}>
                <t-avatar icon={<t-icon name="user-1"></t-icon>}></t-avatar>
                <t-avatar>Z</t-avatar>
                <t-avatar>Y</t-avatar>
                <t-avatar>Y</t-avatar>
              </t-avatar-group>
            }
          ></t-card>
        </t-space>
      </>
    );
  }
}
