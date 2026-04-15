import 'tdesign-web-components/message';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-web-components/input';

import { Component, signal } from 'omi';
import { MessagePlugin } from 'tdesign-web-components';

export default class MessageRender extends Component {
  offsetX = signal('0');

  offsetY = signal('0');

  render() {
    return (
      <t-space direction="vertical">
        <t-space>
          <t-input
            style={{ width: 200 }}
            placeholder={'请输入横向偏移量'}
            value={this.offsetX.value}
            onChange={(value) => {
              this.offsetX.value = value;
            }}
          />
          <t-input
            style={{ width: 200 }}
            placeholder={'请输入纵向偏移量'}
            value={this.offsetY.value}
            onChange={(value) => {
              this.offsetY.value = value;
            }}
          />
        </t-space>
        <t-space size={80} direction="vertical">
          <t-space size={230}>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'top-left',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              top-left
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'top',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              top
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'top-right',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              top-right
            </t-button>
          </t-space>
          <t-space size={250}>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'left',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              left
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'center',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              center
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'right',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              right
            </t-button>
          </t-space>
          <t-space size={195}>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'bottom-left',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              bottom-left
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'bottom',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              bottom
            </t-button>
            <t-button
              onClick={() => {
                MessagePlugin.info({
                  content: '用户表示普通操作信息提示',
                  placement: 'bottom-right',
                  offset: [Number(this.offsetX.value), Number(this.offsetY.value)],
                });
              }}
            >
              bottom-right
            </t-button>
          </t-space>
        </t-space>
      </t-space>
    );
  }
}
