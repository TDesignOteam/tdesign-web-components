import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class TypeExample extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-space direction="vertical">
          <h5>普通单选按钮</h5>
          <t-radio-group defaultValue="gz">
            <t-radio value="bj" content="选项一" />
            <t-radio value="sh" content="选项二" />
            <t-radio value="gz" content="选项三" />
            <t-radio value="sz" content="选项四" />
          </t-radio-group>
        </t-space>
        <t-space direction="vertical">
          <h5>边框型单选按钮</h5>
          <t-radio-group defaultValue="1">
            <t-radio-button value="1" content="选项一" />
            <t-radio-button value="2" content="选项二" />
            <t-radio-button value="3" content="选项三" />
            <t-radio-button value="1" content="选中禁用态" disabled />
            <t-radio-button value="2" content="未选中禁用态" disabled />
          </t-radio-group>
        </t-space>
        <t-space direction="vertical">
          <h5>填充型单选按钮</h5>

          <t-radio-group variant="default-filled" defaultValue="gz">
            <t-radio-button value="bj" content="选项一" />
            <t-radio-button value="gz" content="选项二" />
            <t-radio-button value="sz" content="选项三" />
            <t-radio-button value="fj" content="选项四" />
            <t-radio-button value="cd" content="选项五" />
          </t-radio-group>

          <t-radio-group variant="primary-filled" defaultValue="gz">
            <t-radio-button value="bj" content="选项一" />
            <t-radio-button value="gz" content="选项二" />
            <t-radio-button value="sz" content="选项三" />
            <t-radio-button value="fj" content="选项四" />
            <t-radio-button value="cd" content="选项五" />
          </t-radio-group>

          <t-radio-group variant="default-filled" defaultValue="bj">
            <t-radio-button value="fj" content="选项一" disabled />
            <t-radio-button value="cd" content="选项二" disabled />
            <t-radio-button value="sz" content="选项三" disabled />
            <t-radio-button value="bj" content="选中禁用态" disabled />
            <t-radio-button value="gz" content="未选中禁用态" disabled />
          </t-radio-group>

          <t-radio-group variant="primary-filled" defaultValue="bj">
            <t-radio-button value="fj" content="选项一" disabled />
            <t-radio-button value="cd" content="选项二" disabled />
            <t-radio-button value="sz" content="选项三" disabled />
            <t-radio-button value="bj" content="选中禁用态" disabled />
            <t-radio-button value="gz" content="未选中禁用态" disabled />
          </t-radio-group>
        </t-space>
      </t-space>
    );
  }
}
