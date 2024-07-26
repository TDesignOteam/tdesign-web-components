import 'tdesign-web-components/swiper';

import { Component } from 'omi';

import { SwiperDemoCss } from './base';

export default class Demo extends Component {
  render() {
    return (
      <t-swiper navigation={{ type: 'fraction' }}>
        <t-swiper-item>
          <div className={`${SwiperDemoCss} w-[782px]`}>1</div>
        </t-swiper-item>
        <t-swiper-item>
          <div className={`${SwiperDemoCss} w-[782px]`}>2</div>
        </t-swiper-item>
        <t-swiper-item>
          <div className={`${SwiperDemoCss} w-[782px]`}>3</div>
        </t-swiper-item>
      </t-swiper>
    );
  }
}
