import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import mdContent from '../mock/testMarkdown.md?raw';

const props = {
  theme: 'default',
  variant: 'base',
  placements: 'left',
  avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
  id: '123',
  main: {
    content: mdContent,
  },
  role: 'assistant',
  thinking: {
    type: 'text',
    title: '思考中...',
    status: 'sent',
    content: 'mock',
  },
};

export default class MarkdownExample extends Component {
  render() {
    return <t-chat-item key={props.id} {...props} />;
  }
}
