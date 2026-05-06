import 'tdesign-web-components/affix';
import 'tdesign-web-components/button';

import { bind, Component, signal } from 'omi';

export default class Affix extends Component {
  top = signal(150);

  @bind
  handleClick() {
    this.top.value += 10;
  }

  render() {
    return (
      <t-affix offsetTop={this.top.value} offsetBottom={10}>
        <t-button onClick={this.handleClick}>固钉</t-button>
      </t-affix>
    );
  }
}
