import '../content/suggestion-content';

import { Component } from 'omi';

export default class BasicExample extends Component {
  render() {
    return (
      <t-chat-suggestion-content
        content={[
          {
            title: '《六姊妹》中有哪些观众喜欢的剧情点？',
            prompt: '《六姊妹》中有哪些观众喜欢的剧情点？',
          },
          {
            title: '两部剧在演员表现上有什么不同？',
            prompt: '两部剧在演员表现上有什么不同？',
          },
          {
            title: '《六姊妹》有哪些负面的评价？',
            prompt: '《六姊妹》有哪些负面的评价？',
          },
        ]}
        handlePromptClick={({ content }) => {
          console.log('点击', content);
        }}
      ></t-chat-suggestion-content>
    );
  }
}
