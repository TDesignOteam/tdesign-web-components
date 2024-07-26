import 'tdesign-web-components/swiper';

import { Component } from 'omi';

import { SwiperDemoCss } from './base';

export default class Demo extends Component {
  render() {
    return (
      <t-space direction="vertical" size="60px" style={{ width: '100%' }}>
        <t-swiper direction={'vertical'} navigation={{ showSlideBtn: 'never' }} height={280}>
          <t-swiper-item>
            <div className={SwiperDemoCss}>1</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>2</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>3</div>
          </t-swiper-item>
        </t-swiper>
      </t-space>
    );
  }
}
