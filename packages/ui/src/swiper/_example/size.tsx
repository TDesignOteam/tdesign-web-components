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
            <div className={SwiperDemoCss}>1</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>2</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>3</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>4</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>5</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>6</div>
          </t-swiper-item>
        </t-swiper>
        <h3 className="text-xl">small</h3>
        <t-swiper navigation={{ size: 'small' }}>
          <t-swiper-item>
            <div className={SwiperDemoCss}>1</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>2</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>3</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>4</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>5</div>
          </t-swiper-item>
          <t-swiper-item>
            <div className={SwiperDemoCss}>6</div>
          </t-swiper-item>
        </t-swiper>
      </>
    );
  }
}
