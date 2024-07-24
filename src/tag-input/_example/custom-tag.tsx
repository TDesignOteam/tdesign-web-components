import 'tdesign-web-components/tag-input';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TagInputDiy extends Component {
  tags = ['StudentA', 'StudentB', 'StudentC'];

  render() {
    const setTags = (value) => {
      this.tags = value;
      this.update();
    };

    return (
      <t-space direction="vertical" style={{ width: '80%' }}>
        <t-tag-input
          value={this.tags}
          onChange={setTags}
          clearable
          minCollapsedNum={2}
          tag={({ value }) => (
            <div style={{ display: 'flex' }}>
              <img
                src="https://tdesign.gtimg.com/site/avatar.jpg"
                style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
              />
              {value}
            </div>
          )}
        ></t-tag-input>

        <t-tag-input
          value={this.tags}
          onChange={setTags}
          valueDisplay={({ value, onClose }) =>
            value.map((item, index) => (
              <t-tag key={item} closable style={{ marginRight: '4px' }} onClose={() => onClose(index)}>
                <div style={{ display: 'flex' }}>
                  <img
                    src="https://tdesign.gtimg.com/site/avatar.jpg"
                    style={{ maxWidth: '18px', maxHeight: '18px', borderRadius: '50%', verticalAlign: 'text-top' }}
                  />
                  {item}
                </div>
              </t-tag>
            ))
          }
          clearable
        ></t-tag-input>
      </t-space>
    );
  }
}
