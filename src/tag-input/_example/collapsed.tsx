import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';
import 'tdesign-web-components/popup';

import { Component } from 'omi';

export default class TagInputCollapse extends Component {
  tags = ['Vue', 'React', 'Omi', 'Miniprogram', 'Angular', 'Flutter'];

  render() {
    const setTags = (value) => {
      this.tags = value;
      this.update();
    };

    const renderCollapsedItems = ({ collapsedTags }) => {
      console.log(collapsedTags);
      return (
        <t-popup
          key={'tags'}
          content={collapsedTags.map((item) => (
            <t-tag key={item} style={{ marginRight: '4px' }}>
              {item}
            </t-tag>
          ))}
        >
          <t-tag part="pop-tag">More({collapsedTags?.length})</t-tag>
        </t-popup>
      );
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input value={this.tags} onChange={setTags} minCollapsedNum={1} />
        <t-tag-input value={this.tags} onChange={setTags} minCollapsedNum={3} collapsedItems={renderCollapsedItems} />
      </t-space>
    );
  }
}
