import '../index';

import { Component } from 'omi';

export default class TagInputAuto extends Component {
  tags = ['Vue', 'React'];

  render() {
    const onChange = (val, context) => {
      this.tags = val;
      this.update();
      console.log('onChange', val, context);
    };

    return (
      <div style={{ width: '100%' }}>
        <t-tag-input value={this.tags} onChange={onChange} autoWidth clearable />
      </div>
    );
  }
}
