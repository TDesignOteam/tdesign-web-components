import 'tdesign-web-components/skeleton';

import { Component } from 'omi';

const animations = [
  { label: '渐变加载动画', value: 'gradient' },
  { label: '闪烁加载动画', value: 'flashed' },
];

export default class SkeletonAnimation extends Component {
  static css = 't-skeleton{}';

  render() {
    return (
      <div class="t-skeleton-demo">
        {animations.map((animation, index) => (
          <div class="t-skeleton-demo-card" key={`animation-${index}`}>
            <div style={{ lineHeight: '24px', margin: '24px 0 12px 0' }} class="header">
              {animation.label}
            </div>
            <div class="content">
              <t-skeleton animation={animation.value}></t-skeleton>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
