// 临时col

import { Component, tag } from 'omi';

@tag('t-col')
export default class Input extends Component {
  render(props) {
    return <span {...props}></span>;
  }
}
