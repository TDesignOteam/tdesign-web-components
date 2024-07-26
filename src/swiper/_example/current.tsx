import 'tdesign-web-components/swiper';
import 'tdesign-web-components/button';

import { Component } from 'omi';

import { SwiperDemoCss } from './base';

export default class Demo extends Component {
  current = 0;

  click = () => {
    this.current = this.current + 2 > 6 ? 0 : this.current + 1;
    this.update();
  };

  render() {
    return (
      <div className="flex flex-col gap-4">
        <t-swiper current={this.current} navigation={{ showSlideBtn: 'never' }}>
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
        <button class="t-button t-button--variant-outline t-button--theme-default" onClick={this.click}>
          跳转到第 {this.current + 2 >= 7 ? 1 : this.current + 2} 项
        </button>
      </div>
    );
  }
}
