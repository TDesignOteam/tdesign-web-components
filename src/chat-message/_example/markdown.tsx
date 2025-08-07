import '../content/markdown-content';

import { Component } from 'omi';

import mdContent from '../../chatbot/mock/testMarkdown.md?raw';

export default class BasicExample extends Component {
  render() {
    return <t-chat-md-content content={mdContent}></t-chat-md-content>;
  }
}
