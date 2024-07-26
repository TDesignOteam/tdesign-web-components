import 'tdesign-web-components/swiper';

import { Component } from 'omi';

import { SwiperDemoCss } from './base';

export default class Demo extends Component {
  render() {
    return (
      <>
        <h3 className="text-xl">large</h3>
        <t-swiper navigation={{ size: 'large' }}>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>1</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>2</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>3</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>4</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>5</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>6</div>
          </t-swiper-item>
        </t-swiper>
        <h3 className="text-xl">small</h3>
        <t-swiper navigation={{ size: 'small' }}>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>1</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>2</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>3</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>4</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>5</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={`${SwiperDemoCss} w-[782px]`}>6</div>
          </t-swiper-item>
        </t-swiper>
      </>
    );
  }
}
