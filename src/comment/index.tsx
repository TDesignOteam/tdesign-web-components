// 临时comment

import { Component, tag } from 'omi';

@tag('t-comment')
export default class Input extends Component {
  render(props) {
    return <div {...props}>这是一条临时comment</div>;
  }
}
