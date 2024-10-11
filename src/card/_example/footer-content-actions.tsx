import 'tdesign-web-components/card';
import 'tdesign-web-components/button';
import 'tdesign-web-components/comment';
import 'tdesign-web-components/grid';

import { Component } from 'omi';
import { MessagePlugin } from 'tdesign-web-components/message/message';

interface Option {
  content: string;
  value: number;
}
type ClickHandler = (data: Option) => void;

export default class Button extends Component {
  options: Option[] = [
    {
      content: '操作一',
      value: 1,
    },
    {
      content: '操作二',
      value: 2,
    },
  ];

  clickHandler: ClickHandler = (data) => {
    MessagePlugin.info(`选中【${data.value}】`);
  };

  render() {
    return (
      <t-card
        actions={
          <t-col flex="auto" align="middle">
            <t-dropdown options={this.options} onClick={this.clickHandler}>
              <t-button variant="text" shape="square">
                <t-icon-more />
              </t-button>
            </t-dropdown>
          </t-col>
        }
        bordered
        theme="poster2"
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        footer={<t-comment></t-comment>}
      ></t-card>
    );
  }
}
