import 'tdesign-web-components/textarea';

import { Component, signal } from 'omi';

export default class Textarea extends Component {
  inputValue = signal('');

  onBlur = (value, { e }) => {
    console.log('onBlur: ', value, e);
  };

  onFocus = (value, { e }) => {
    console.log('onFocus: ', value, e);
  };

  onKeyup = (value, { e }) => {
    console.log('onKeyup', value, e);
  };

  onKeypress = (value, { e }) => {
    console.log('onKeypress', value, e);
  };

  onKeydown = (value, { e }) => {
    console.log('onKeydown', value, e);
  };

  onChange = (e: CustomEvent) => {
    console.log('onChange', e);
    this.inputValue.value = e.detail;
  };

  render() {
    return (
      <t-textarea
        placeholder="请输入"
        value={this.inputValue.value}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeypress={this.onKeypress}
        onKeydown={this.onKeydown}
        onKeyup={this.onKeyup}
        onChange={this.onChange}
      ></t-textarea>
    );
  }
}
