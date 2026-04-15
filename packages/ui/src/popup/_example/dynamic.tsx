import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';

import { Component, signal } from 'omi';

export default class PopupDynamic extends Component {
  visible = true;

  content = signal('这是popup内容');

  spanVisible = false;

  btnClicks = 0;

  toggleContent = (e) => {
    e.stopPropagation();
    this.btnClicks += 1;
    const showMore = this.btnClicks % 2 !== 0;
    this.content.value = `这是popup内容${showMore ? '，又多出来好多好多好多好多....' : ''}`;
    this.spanVisible = true;
    this.update();
  };

  render() {
    return (
      <t-popup content={this.content.value} placement="top" visible={this.visible}>
        <t-button onClick={this.toggleContent}>点击改变内容</t-button>
      </t-popup>
    );
  }
}
