// 临时tag

import { Component, tag } from 'omi';

@tag('t-tag')
export default class Input extends Component {
  render(props) {
    return <span {...props}></span>;
  }
}
