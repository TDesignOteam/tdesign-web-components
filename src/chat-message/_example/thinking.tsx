import '../content/thinking-content';

import { Component, signal } from 'omi';

export default class BasicExample extends Component {
  collapse = signal(false);

  collapsedChangeHandle = (e: CustomEvent<boolean>) => {
    console.log(e);
    this.collapse.value = e.detail;
  };

  ready(): void {
    setTimeout(() => {
      this.collapse.value = true;
    }, 1000);
  }

  render() {
    return (
      <div>
        <t-chat-thinking-content
          status="streaming"
          content={{
            title: '正在思考中...',
            text: '好的，我现在需要回答用户关于近三年当代偶像爱情剧创作中需要规避的因素的问题。首先，我需要确定用户的问题类型，使用answer_framework_search查询对应的回答框架',
          }}
          maxHeight={50}
          animation="moving"
          collapsed={this.collapse.value}
          onCollapsedChange={this.collapsedChangeHandle}
        />
        <t-chat-thinking-content
          content={{
            title: '正在思考中...',
          }}
          status="streaming"
          animation="moving"
        >
          <div slot="content">自定义content</div>
        </t-chat-thinking-content>
      </div>
    );
  }
}
