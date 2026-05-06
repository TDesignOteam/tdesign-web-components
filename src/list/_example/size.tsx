import 'tdesign-web-components/list';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class ListBase extends Component {
  listData = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];

  render() {
    return (
      <t-space>
        <t-list split={true} size="large">
          {this.listData.map((item) => (
            <t-list-item key={item.id} content={item.content}></t-list-item>
          ))}
        </t-list>
        <t-list split={true} size="middle">
          {this.listData.map((item) => (
            <t-list-item key={item.id} content={item.content}></t-list-item>
          ))}
        </t-list>
        <t-list split={true} size="small">
          {this.listData.map((item) => (
            <t-list-item key={item.id} content={item.content}></t-list-item>
          ))}
        </t-list>
      </t-space>
    );
  }
}
