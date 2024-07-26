import 'tdesign-web-components/swiper';
import 'tdesign-web-components/swiper/swiper-item';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export const SwiperDemoCss = 'flex  h-[280px] bg-[#4b5b76] text-white justify-center items-center font-medium text-lg';

export default class Demo extends Component {
  render() {
    return (
      <t-space direction="vertical" size="60px" style={{ width: '100%' }}>
        <t-swiper duration={300} interval={2000}>
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
      </t-space>
    );
  }
}
