import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputBase extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  tags2 = ['Vue', 'React'];

  tags3 = ['Vue', 'React'];

  render() {
    const onTagInputEnter = (val, context) => {
      console.log('TagEnter', val, context);
    };

    const onChange = (val, context) => {
      this.tags1 = val;
      this.update();
      console.log('onChange', val, context);
    };

    const onClick = (val) => {
      console.log('Click', val);
    };

    const onRemove = (val) => {
      console.log('Remove', val);
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input
          value={this.tags1}
          onChange={onChange}
          clearable
          onEnter={onTagInputEnter}
          onClick={onClick}
          onRemove={onRemove}
          placeholder="请输入"
        ></t-tag-input>
        <t-tag-input value={this.tags2} label="Controlled: " placeholder="请输入" clearable />
        <t-tag-input defaultValue={this.tags3} label="UnControlled: " placeholder="请输入" clearable />
      </t-space>
    );
  }
}
