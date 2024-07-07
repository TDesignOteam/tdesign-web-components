// 临时input

import { Component, tag } from 'omi';

@tag('t-input')
export default class Input extends Component {
  render(props) {
    return <input type="text" style={{ border: '1px solid' }} {...props} />;
  }
}
