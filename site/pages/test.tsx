// 测试omi相关特性
/* eslint-disable max-classes-per-file */
import { Component, tag } from 'omi';

@tag('test-component')
export class Test extends Component {
  // static isLightDOM = true;

  render() {
    return (
      <div class="slot">
        <slot></slot>
      </div>
    );
  }
}

@tag('test-parent-component')
export class TestParent extends Component {
  static isLightDom = false;

  render() {
    return (
      <div>
        <test-component>isLightDom</test-component>
      </div>
    );
  }
}
