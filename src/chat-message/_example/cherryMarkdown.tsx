import '../content/cherry-markdown-content';

import { Component } from 'omi';

import mdContent from '../../chatbot/mock/testMarkdown.md?raw';

export default class BasicExample extends Component {
  render() {
    return <t-chat-cherry-md-content content={mdContent}></t-chat-cherry-md-content>;
  }
}
