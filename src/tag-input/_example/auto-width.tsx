import '../index';

import { Component } from 'omi';

export default class TagInputAuto extends Component {
  tags = ['Vue', 'React'];

  render() {
    const onChange = (val) => {
      this.tags = val;
      this.update();
    };

    return (
      <div style={{ width: '100%' }}>
        <t-tag-input value={this.tags} onChange={onChange} autoWidth clearable />
      </div>
    );
  }
}
