import 'tdesign-web-components/switch';
import 'tdesign-web-components/collapse';
import 'tdesign-web-components/space';

import { Component, signal } from 'omi';

export default class Demo extends Component {
  static css = `
.button-area {
  margin-left: 20px;
  margin-top: 10px;
}
.button-text {
  display: inline-block;
  width: 100px;
  font-size: 13px;
  margin-bottom: 2px;
}  
`;

  disabled = signal(false);

  expandIcon = signal(true);

  borderless = signal(false);

  render() {
    const { borderless, expandIcon, disabled } = this;
    return (
      <t-space direction={'vertical'} innerStyle={{ width: '100%' }}>
        <t-collapse borderless={borderless.value} disabled={disabled.value}>
          <t-collapse-panel
            expandIcon={expandIcon.value}
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            expandIcon={expandIcon.value}
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
        </t-collapse>
        <div class="button-area">
          <div>
            <span class="button-text">全部禁用</span>
            <t-switch size="small" onChange={() => (this.disabled.value = !this.disabled.value)} />
          </div>
          <div>
            <span class="button-text">无边框</span>
            <t-switch size="small" onChange={() => (this.borderless.value = !this.borderless.value)} />
          </div>
          <div>
            <span class="button-text">显示 Icon</span>
            <t-switch
              size="small"
              value={expandIcon.value}
              onChange={() => (this.expandIcon.value = !this.expandIcon.value)}
            />
          </div>
        </div>
      </t-space>
    );
  }
}
