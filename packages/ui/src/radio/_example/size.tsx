import 'tdesign-web-components/radio';
import 'tdesign-web-components/space';

import { Component } from 'omi';

type GeneratorGender<T extends string, Num extends string> = `${T}${Num}`;
type Gender1 = 'bj' | 'sz' | 'gz' | 'sh';
type Gender2 = GeneratorGender<Gender1, '1'>;
type Gender3 = GeneratorGender<Gender1, '2'>;

export default class SizeExample extends Component {
  private gender1: Gender1 = 'bj';

  private gender2: Gender2 = 'sh1';

  private gender3: Gender3 = 'gz2';

  setGender1 = (v: Gender1) => {
    this.gender1 = v;
    this.update();
  };

  setGender2 = (v: Gender2) => {
    this.gender2 = v;
    this.update();
  };

  setGender3 = (v: Gender3) => {
    this.gender3 = v;
    this.update();
  };

  render() {
    return (
      <t-space>
        <t-space direction="vertical">
          <t-radio-group size="small" value={this.gender1} onChange={this.setGender1}>
            <t-radio-button value="bj" content="北京" />
            <t-radio-button value="sh" content="上海" />
            <t-radio-button value="gz" content="广州" />
            <t-radio-button value="sz" content="深圳" />
          </t-radio-group>

          <t-radio-group value={this.gender2} onChange={this.setGender2}>
            <t-radio-button value="bj1" content="北京" />
            <t-radio-button value="sh1" content="上海" />
            <t-radio-button value="gz1" content="广州" />
            <t-radio-button value="sz1" content="深圳" />
          </t-radio-group>

          <t-radio-group size="large" value={this.gender3} onChange={this.setGender3}>
            <t-radio-button value="bj2" content="北京" />
            <t-radio-button value="sh2" content="上海" />
            <t-radio-button value="gz2" content="广州" />
            <t-radio-button value="sz2" content="深圳" />
          </t-radio-group>
        </t-space>

        <t-space direction="vertical">
          <t-radio-group variant="default-filled" size="small" value={this.gender1} onChange={this.setGender1}>
            <t-radio-button value="bj" content="北京" />
            <t-radio-button value="sh" content="上海" />
            <t-radio-button value="gz" content="广州" />
            <t-radio-button value="sz" content="深圳" />
          </t-radio-group>

          <t-radio-group variant="default-filled" value={this.gender2} onChange={this.setGender2}>
            <t-radio-button value="bj1" content="北京" />
            <t-radio-button value="sh1" content="上海" />
            <t-radio-button value="gz1" content="广州" />
            <t-radio-button value="sz1" content="深圳" />
          </t-radio-group>

          <t-radio-group variant="default-filled" size="large" value={this.gender3} onChange={this.setGender3}>
            <t-radio-button value="bj2" content="北京" />
            <t-radio-button value="sh2" content="上海" />
            <t-radio-button value="gz2" content="广州" />
            <t-radio-button value="sz2" content="深圳" />
          </t-radio-group>
        </t-space>
      </t-space>
    );
  }
}
