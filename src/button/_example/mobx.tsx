import 'tdesign-web-components/button';
import 'tdesign-web-components/space';
import 'tdesign-web-components/input';

import { autorun } from 'mobx';
import { Component } from 'omi';

import { myStore } from '../store';

export default class TestMobx extends Component {
  btnClick = () => {
    console.log('btn click');
    myStore.update({
      message: '修改后',
    });
  };

  inputChange = (v: string) => {
    console.log(v);
    myStore.update({
      message: v,
    });
  };

  // 使用autorun来响应状态变化
  installed() {
    console.log('installed');
    autorun(() => {
      this.update();
      console.log('触发autorun');
    });
  }

  render() {
    return (
      <t-space direction="vertical">
        <t-button theme="default" variant="text" onClick={this.btnClick}>
          修改message
        </t-button>
        <t-input value={myStore.message} onChange={this.inputChange} />
        {myStore.message}
      </t-space>
    );
  }
}
