import 'tdesign-web-components/skeleton';
import 'tdesign-web-components/switch';

import { Component } from 'omi';

const style = {
  'mb-20': {
    marginBottom: '20px',
  },
  't-skeleton-demo-paragraph': {
    lineHeight: '25px',
  },
};

export default class SkeletonDelay extends Component {
  checked = false;

  onChangeChecked = (check: boolean) => {
    this.checked = check;
    this.update();
  };

  render() {
    return (
      <div>
        <div>
          <t-switch style={style['mb-20']} value={this.checked} onChange={this.onChangeChecked}></t-switch>
        </div>
        <div>
          <t-skeleton loading={this.checked} delay={3000} animation="flashed">
            <div style={style['t-skeleton-demo-paragraph']}>
              <p>设置最短延迟响应时间，低于响应时间的操作不显示加载状态。</p>
            </div>
          </t-skeleton>
        </div>
      </div>
    );
  }
}
