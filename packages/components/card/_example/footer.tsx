import '@tdesign/web-components-ui/card';
import '@tdesign/web-components-ui/tag';
import '@tdesign/web-components-ui/avatar';
import '@tdesign/web-components-ui/button';
import '@tdesign/web-components-ui/divider';
import '@tdesign/web-components-ui/grid';
import 'tdesign-icons-web-components/esm/components/user-1';
import 'tdesign-icons-web-components/esm/components/thumb-up-1';
import 'tdesign-icons-web-components/esm/components/chat';
import 'tdesign-icons-web-components/esm/components/share';

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
        avatar={<t-avatar size="56px" icon={<t-icon-user-1 />} style={{ marginTop: '0px' }} />}
        footer={
          <t-row style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon-thumb-up-1 />
              </t-button>
            </t-col>
            <t-divider layout="vertical"></t-divider>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon-chat />
              </t-button>
            </t-col>
            <t-divider layout="vertical"></t-divider>
            <t-col>
              <t-button theme="default" variant="text">
                <t-icon-share />
              </t-button>
            </t-col>
          </t-row>
        }
      ></t-card>
    );
  }
}
