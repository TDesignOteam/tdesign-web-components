import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

import { LLMConfig } from '../core/type';

const mockData = [
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    id: '123',
    content: {
      main: { text: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。' },
    },
    role: 'assistant',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    id: '223',
    content: {
      main: { text: '南极的自动提款机叫什么名字？' },
    },
    role: 'user',
  },
];

const mockModels: LLMConfig[] = [
  {
    name: 'deepseek',
    endpoint: '/mock-api',
    stream: true,
    headers: {
      'X-Mock-Key': 'test123',
    },
  },
];

export default class BasicChat extends Component {
  onSubmit = () => {};

  render() {
    return <t-chatbot data={mockData} modelConfig={mockModels} onSubmit={this.onSubmit}></t-chatbot>;
  }
}
