import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputDrag extends Component {
  tags1 = ['Vue', 'React', 'Omi'];

  tags2 = ['Vue', 'React', 'Omi', 'Angular'];

  render() {
    const onTagInputEnter = (val, context) => {
      this.tags1 = val;
      this.update();
      console.log(val, context);
    };

    const onChange = (val, context) => {
      this.tags1 = val;
      this.update();
      console.log(val, context);
    };

    const onDragSort = ({ currentIndex, targetIndex }) => {
      console.log(currentIndex, targetIndex, '测试');
      const temp = this.tags1[currentIndex];
      this.tags1[currentIndex] = this.tags1[targetIndex];
      this.tags1[targetIndex] = temp;
      this.update();
    };

    const onDragSort2 = ({ currentIndex, targetIndex }) => {
      console.log(currentIndex, targetIndex, '测试');
      const temp = this.tags2[currentIndex];
      this.tags2[currentIndex] = this.tags2[targetIndex];
      this.tags2[targetIndex] = temp;
      this.update();
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input
          value={this.tags1}
          onChange={onChange}
          dragSort
          onEnter={onTagInputEnter}
          onDragSort={onDragSort}
          placeholder="请输入"
        ></t-tag-input>
        <t-tag-input
          value={this.tags2}
          dragSort
          excessTagsDisplayType="break-line"
          label="Controlled: "
          onDragSort={onDragSort2}
          placeholder="请输入"
        />
      </t-space>
    );
  }
}
