import 'tdesign-web-components/tooltip';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class Placements extends Component {
  timer: NodeJS.Timeout;

  reset = true;

  count = 5;

  duration = 5000;

  setTimer = () => {
    this.timer = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.timer);
        this.reset = true;
        this.duration = 0;
      }
      this.update();
    }, 1000);
  };

  onResetClick = () => {
    this.reset = false;
    this.count = 5;
    this.duration = 5000;

    this.update();

    clearInterval(this.timer);
    this.setTimer();
  };

  install() {
    this.setTimer();
  }

  uninstall() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <>
        <t-tooltip content={`提示在${this.count}秒后消失`} duration={this.duration}>
          <t-button variant="text">定时消失</t-button>
        </t-tooltip>
        {this.reset && (
          <t-button variant="outline" onClick={this.onResetClick}>
            点击再次查看
          </t-button>
        )}
      </>
    );
  }
}
