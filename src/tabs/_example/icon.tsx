import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';
import 'tdesign-web-components/tabs';
import 'tdesign-icons-web-components/esm/components/discount';
import 'tdesign-icons-web-components/esm/components/tools';
import 'tdesign-icons-web-components/esm/components/tips';

import { Component, signal } from 'omi';

export default class Icon extends Component {
  theme = signal('normal');

  render() {
    return (
      <t-space direction="vertical" size="large" style={{ width: '100%' }}>
        <t-radio-group
          variant="default-filled"
          defaultValue="normal"
          onChange={(val) => {
            this.theme.value = val;
          }}
        >
          <t-radio-button value="normal" content="常规" />
          <t-radio-button value="card" content="卡片" />
        </t-radio-group>
        <t-tabs placement={'top'} defaultValue={'a'} theme={this.theme.value}>
          <t-tab-panel
            value="a"
            label={
              <>
                <t-icon-discount />
                选项卡1
              </>
            }
          >
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡1内容区
            </div>
          </t-tab-panel>
          <t-tab-panel
            value="b"
            label={
              <>
                <t-icon-tools />
                选项卡2
              </>
            }
          >
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡2内容区
            </div>
          </t-tab-panel>
          <t-tab-panel
            value="c"
            label={
              <>
                <t-icon-tips />
                选项卡3
              </>
            }
          >
            <div className="tabs-content" style={{ margin: 20 }}>
              选项卡3内容区
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-space>
    );
  }
}
