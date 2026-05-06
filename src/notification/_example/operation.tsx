import 'tdesign-web-components/notification';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class OperationExample extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-notification
          theme="info"
          title="超出的文本省略号显示"
          content="文案不限长度，但是展示最大显示三行折行的末尾显示折行末尾显示折行末尾显示折行末尾显示折行末尾显示折行折行末尾显示折行折行末尾显示折行末尾显示折行折行末尾"
          footer={
            <div>
              <t-button theme="primary" variant="text">
                查看详情
              </t-button>
            </div>
          }
        />
        <t-notification
          theme="info"
          title="自定义底部"
          content="使用 props function 自定义底部内容"
          footer={
            <div>
              <t-button theme="primary" variant="text">
                查看详情
              </t-button>
            </div>
          }
        />
        <t-notification
          theme="info"
          content="1. 使用 props function 自定义标题；2. 使用插槽自定义底部内容"
          title={
            <div>
              自定义标题 <small>我是副标题</small>
            </div>
          }
          footer={
            <div slot="footer">
              <t-button theme="default" variant="text">
                知道了
              </t-button>
            </div>
          }
        />
        <t-notification
          theme="info"
          content="1. 使用插槽自定义标题 2. 使用插槽自定义底部内容"
          title={
            <div>
              自定义标题 <small>我是副标题</small>
            </div>
          }
          footer={
            <div>
              <t-button theme="default" variant="text">
                重启
              </t-button>
              <t-button theme="primary" variant="text">
                稍后提醒我(10s)
              </t-button>
            </div>
          }
        />
        <t-notification
          theme="info"
          title="自定义内容"
          content="使用插槽自定义内容"
          footer={
            <div>
              <t-button theme="default" variant="text">
                重启
              </t-button>
              <t-button theme="primary" variant="text">
                更多
              </t-button>
            </div>
          }
        />
      </t-space>
    );
  }
}
