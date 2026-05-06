import 'tdesign-web-components/message';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';
import { MessagePlugin } from 'tdesign-web-components';

export default class MessageRender extends Component {
  render() {
    const list = [];
    let message = null;
    return (
      <t-space>
        <t-button
          onClick={() => {
            message = MessagePlugin.info('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
            message = MessagePlugin.error('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
            message = MessagePlugin.warning('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
            message = MessagePlugin.success('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
            message = MessagePlugin.question('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
            message = MessagePlugin.loading('I am duration 20s Message', 20 * 1000);
            list.unshift(message);
          }}
        >
          I am duration 20s Message
        </t-button>
        <t-button
          onClick={() => {
            if (list.length !== 0) {
              MessagePlugin.close(list.shift());
            }
          }}
        >
          close latest duration 20s Message
        </t-button>
        <t-button
          onClick={() => {
            MessagePlugin.closeAll();
          }}
        >
          close all Message
        </t-button>
      </t-space>
    );
  }
}
