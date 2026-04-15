import 'tdesign-web-components/collapse';

import { bind, Component, signal } from 'omi';

export default class Demo extends Component {
  collapseValue = signal([1]);

  @bind
  onChange(e) {
    this.collapseValue.value = e.detail;
  }

  render() {
    return (
      <t-collapse onChange={this.onChange} value={this.collapseValue.value}>
        <t-collapse-panel
          header="这是一个折叠标题"
          content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
        />
        <t-collapse-panel
          destroyOnCollapse={true}
          header="这是一个折叠标题"
          content="这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。"
        />
        <t-collapse-panel
          header="嵌套折叠面板"
          content={
            <t-collapse default-expand-all>
              <t-collapse-panel header="子面板1" content="这是子面板1" />
              <t-collapse-panel header="子面板1" content="这是子面板2" />
              <t-collapse-panel header="子面板1" content="这是子面板3" />
              <t-collapse-panel header="子面板1" content="这是子面板4" />
            </t-collapse>
          }
        />
      </t-collapse>
    );
  }
}
