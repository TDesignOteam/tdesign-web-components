import 'tdesign-web-components/loading';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class WrapLoading extends Component {
  loading = true;

  setLoading(loading) {
    this.loading = loading;
    this.update();
  }

  render() {
    return (
      <t-space direction="vertical">
        <div style={{ width: 170 }}>
          <t-loading size="small" loading={this.loading} showOverlay>
            <div>this is loading component</div>
            <div>this is loading component</div>
            <div>this is loading component</div>
            <div>this is loading component</div>
            <div>this is loading component</div>
          </t-loading>
        </div>
        <t-space>
          <t-button size="small" onClick={() => this.setLoading(true)}>
            加载中
          </t-button>
          <t-button size="small" onClick={() => this.setLoading(false)}>
            加载完成
          </t-button>
        </t-space>
      </t-space>
    );
  }
}
