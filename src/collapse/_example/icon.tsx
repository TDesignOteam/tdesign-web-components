import 'tdesign-web-components/collapse';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  checked = signal(true);

  isLeftIcon = signal(true);

  expandOnRowClick = signal(true);

  @bind
  onChange(value) {
    console.log('onChange.value', value);
  }

  render() {
    return (
      <t-space direction={'vertical'} style={{ width: '100%' }}>
        <t-collapse
          onChange={this.onChange}
          expandIconPlacement={this.isLeftIcon.value ? 'left' : 'right'}
          expandOnRowClick={this.expandOnRowClick.value}
        >
          <t-collapse-panel
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            header="自定义图标"
            expandIcon={<t-icon name="user-checked"></t-icon>}
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            header="自定义图标"
            expandIcon={<t-icon name="add"></t-icon>}
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
        </t-collapse>
        <div class="button-area">
          <div>
            <span class="button-text">图标是否在左侧</span>
            <t-switch
              size="small"
              value={this.isLeftIcon.value}
              onChange={() => (this.isLeftIcon.value = !this.isLeftIcon.value)}
            />
          </div>
          <div>
            <span class="button-text">是否仅图标响应点击</span>
            <t-switch
              size="small"
              value={!this.expandOnRowClick.value}
              onChange={() => (this.expandOnRowClick.value = !this.expandOnRowClick.value)}
            />
          </div>
        </div>
      </t-space>
    );
  }
}
