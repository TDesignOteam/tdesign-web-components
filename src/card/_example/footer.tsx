import 'tdesign-web-components/card';
import 'tdesign-web-components/tag';
import 'tdesign-web-components/icon';
import 'tdesign-web-components/avatar';
import 'tdesign-web-components/button';
import 'tdesign-web-components/divider';
import 'tdesign-web-components/row';
import 'tdesign-web-components/col';

import { Component } from 'omi';

export default class Button extends Component {
  render() {
    return (
      <t-card
        actions={<t-tag theme="success">默认标签</t-tag>}
        bordered
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        headerBordered
        avatar={<t-avatar size="56px" icon={<t-icon name="user-1"></t-icon>} style={{ marginTop: '0px' }} />}
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
