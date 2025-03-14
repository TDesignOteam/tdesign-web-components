import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import mdContent from '../mock/testMarkdown.md?raw';

const props = {
  variant: 'outline',
  placements: 'left',
  avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
  actions: true,
  message: {
    id: '123',
    content: [
      {
        type: 'thinking',
        status: 'complete',
        data: {
          title: '思考完成1111',
          text: 'mock',
        },
      },
      {
        type: 'markdown',
        data: mdContent,
      },
    ],
    status: 'complete',
    role: 'assistant',
  },
};

export default class MarkdownExample extends Component {
  render() {
    return <t-chat-item {...props} />;
  }
}
