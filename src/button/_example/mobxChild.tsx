import 'tdesign-web-components/button';
import 'tdesign-web-components/space';

import { autorun } from 'mobx';
import { Component, tag } from 'omi';

import { myStore } from '../store';

@tag('t-mobx-child')
export default class TestMobxChild extends Component {
  // 子组件的autorun可以注掉
  installed() {
    // 如果父子组件都调了autorun，会多次触发，看是否优化
    autorun(() => {
      this.update();
      console.log('子组件触发autorun');
    });
  }

  render() {
    return <t-space>mobx子组件：{myStore.message}</t-space>;
  }
}
