import '../content/search-content';

import { Component } from 'omi';

export default class BasicExample extends Component {
  render() {
    return (
      <t-chat-search-content
        status="complete"
        content={{
          title: '搜索到10篇相关内容',
          references: [
            {
              title: '10本高口碑悬疑推理小说,情节高能刺激,看得让人汗毛直立!',
              url: '',
            },
            {
              title: '悬疑小说下载:免费畅读最新悬疑大作!',
              url: '',
            },
          ],
        }}
        expandable={true}
      ></t-chat-search-content>
    );
  }
}
