import { Component, tag } from 'omi';

@tag('t-trigger')
export default class Trigger extends Component {
  render(props) {
    return props.children;
  }
}
