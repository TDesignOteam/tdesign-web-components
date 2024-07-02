import 'tdesign-web-components/collapse';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  checked = signal(true);

  @bind
  onChange(value) {
    console.log('onChange.value', value);
  }

  render() {
    return (
      <t-collapse onChange={this.onChange}>
        <t-collapse-panel>
          <div slot="header">这是一个折叠标题</div>
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </t-collapse-panel>
        <t-collapse-panel destroyOnCollapse={true}>
          <div slot="header">这是一个折叠标题</div>
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </t-collapse-panel>
      </t-collapse>
    );
  }
}
