import 'tdesign-web-components/swiper';

import { Component } from 'omi';

export const SwiperDemoCss = 'flex h-[280px] bg-[#4b5b76] text-white justify-center items-center font-medium text-lg';

export default class Demo extends Component {
  render() {
    return (
      <t-swiper duration={300} interval={2000}>
        <t-swiper-item>
          <div className={`${SwiperDemoCss}`}>1</div>
        </t-swiper-item>
        <t-swiper-item>
          <div className={`${SwiperDemoCss}`}>2</div>
        </t-swiper-item>
        <t-swiper-item>
          <div className={`${SwiperDemoCss}`}>3</div>
        </t-swiper-item>
      </t-swiper>
    );
  }
}
