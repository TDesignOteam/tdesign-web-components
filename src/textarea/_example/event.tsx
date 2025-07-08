import 'tdesign-web-components/textarea';

import { LightDOMComponent } from '../../_util/light-dom-component';

export default class Textarea extends LightDOMComponent {
  private inputValue = '';

  onBlur = (value, context) => {
    console.log('onBlur: ', value, context);
  };

  onFocus = (value, context) => {
    console.log('onFocus: ', value, context);
  };

  onKeyup = (value, context) => {
    console.log('onKeyup', value, context);
  };

  onKeypress = (value, context) => {
    console.log('onKeypress', value, context);
  };

  onKeydown = (value, context) => {
    console.log('onKeydown', value, context);
  };

  onChange = (e: CustomEvent) => {
    console.log('onChange', e.detail);
    if (!e.detail) return;
    this.inputValue = e.detail;
  };

  render() {
    return (
      <t-textarea
        placeholder="请输入"
        value={this.inputValue}
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
