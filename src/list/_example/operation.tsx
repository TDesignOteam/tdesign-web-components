import 'tdesign-web-components/list';
import 'tdesign-web-components/space';
import 'tdesign-web-components/link';
import 'tdesign-icons-web-components';

import { Component } from 'omi';

const avatarUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';
export default class ListBase extends Component {
  listData = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];

  render() {
    return (
      <t-space direction="vertical" style={{ width: '100%' }}>
        <t-list>
          {this.listData.map((item) => (
            <t-list-item
              key={item.id}
              content={item.content}
              action={
                <t-space>
                  <t-link theme="primary" hover="color">
                    操作1
                  </t-link>
                  <t-link theme="primary" hover="color">
                    操作2
                  </t-link>
                  <t-link theme="primary" hover="color">
                    操作3
                  </t-link>
                </t-space>
              }
            ></t-list-item>
          ))}
        </t-list>
        <t-list>
          {this.listData.map((item) => (
            <t-list-item
              key={item.id}
              content={
                <t-list-item-meta image={avatarUrl} title="列表主内容" description={item.content}></t-list-item-meta>
              }
              action={
                <t-space>
                  <t-icon name="delete"></t-icon>
                  <t-icon name="download"></t-icon>
                </t-space>
              }
            ></t-list-item>
          ))}
        </t-list>
      </t-space>
    );
  }
}
