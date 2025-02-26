import 'tdesign-web-components/chatbot';

import { Component } from 'omi';

const mockData = [
  {
    // avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    key: '123',
    content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
    role: 'assistant',
  },
  {
    // avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    key: '223',
    content: '南极的自动提款机叫什么名字？',
    role: 'user',
  },
];

export default class BasicChat extends Component {
  onSubmit = () => {};

  render() {
    return <t-chatbot data={mockData} onSubmit={this.onSubmit}></t-chatbot>;
  }
}
