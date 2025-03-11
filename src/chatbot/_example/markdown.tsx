import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import mdContent from '../mock/testMarkdown.md?raw';

const props = {
  variant: 'outline',
  placements: 'left',
  avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
  message: {
    id: '123',
    main: {
      content: mdContent,
    },
    status: 'complete',
    actions: true,
    role: 'assistant',
    thinking: {
      type: 'text',
      title: '思考中...',
      status: 'complete',
      content: 'mock',
    },
  },
};

export default class MarkdownExample extends Component {
  render() {
    return <t-chat-item key={props.id} {...props} />;
  }
}
