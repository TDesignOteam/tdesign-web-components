import '../content/markdown-content';

import mdContent from '@tdesign/web-components-chat/common/testMarkdown.md?raw';
import { Component, signal } from 'omi';

export default class BasicExample extends Component {
  displayText = signal('');

  isTyping = true;

  currentIndex = 0;

  timer = null;

  typeEffect = () => {
    if (!this.isTyping) return;

    if (this.currentIndex < mdContent.length) {
      const char = mdContent[this.currentIndex];
      this.currentIndex += 1;
      this.displayText.value += char;
      this.timer = setTimeout(this.typeEffect, 20);
    } else {
      // 输入完成时自动停止
      this.isTyping = false;
    }
  };

  ready(): void {
    this.typeEffect();
  }

  render() {
    return <t-chat-md-content content={this.displayText.value} />;
  }
}
