import 'tdesign-web-components/collapse';
import 'tdesign-web-components/space';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  currentItem = signal('[]');

  @bind
  onChange(e) {
    this.currentItem.value = e.detail.valueOf();
    console.log('currentItem', this.currentItem);
  }

  render() {
    return (
      <t-space direction={'vertical'} innerStyle={{ width: '100%' }}>
        <t-collapse expand-mutex onChange={this.onChange}>
          <t-collapse-panel
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
          <t-collapse-panel
            header="这是一个折叠标题"
            content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
          />
        </t-collapse>
        <div style="margin-top: 10px">当前展开项：{this.currentItem.value}</div>
      </t-space>
    );
  }
}
