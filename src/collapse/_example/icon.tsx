import 'tdesign-web-components/collapse';
import 'tdesign-web-components/space';
import 'tdesign-web-components/icon';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  checked = signal(true);

  @bind
  onChange(value) {
    console.log('onChange.value', value);
  }

  render() {
    return (
      <t-space direction={'vertical'}>
        <t-collapse onChange={this.onChange} expand-icon-placement="left">
          <t-collapse-panel className={'ccc'} header="这是一个折叠标题">
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </t-collapse-panel>
          <t-collapse-panel header="自定义图标">
            <t-icon name="user-checked" slot="expandIcon"></t-icon>
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </t-collapse-panel>
          <t-collapse-panel header="自定义图标">
            <t-icon name="add" slot="expandIcon"></t-icon>
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </t-collapse-panel>
        </t-collapse>
      </t-space>
    );
  }
}
