import 'tdesign-web-components/button';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Button extends Component {
  btnClick = () => {
    console.log('btn click');
  };

  render() {
    return (
      <t-space>
        <t-button theme="default" variant="base" onClick={this.btnClick}>
          填充按钮
        </t-button>
        <t-button theme="default" variant="outline">
          描边按钮
        </t-button>
        <t-button theme="default" variant="dashed">
          虚框按钮
        </t-button>
        <t-button theme="default" variant="text">
          文字按钮
        </t-button>
      </t-space>
    );
  }
}
