import 'tdesign-web-components/input';

import { Component } from 'omi';

export default class InputAutowidth extends Component {
  inputValue = 'Hello TDesign';

  render() {
    return (
      <div>
        <t-input
          autoWidth
          defaultValue="宽度自适应"
          onChange={(value) => {
            this.inputValue = value;
            this.update();
          }}
        />
      </div>
    );
  }
}
