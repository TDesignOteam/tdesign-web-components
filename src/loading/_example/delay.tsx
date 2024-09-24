import 'tdesign-web-components/loading';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

import { Component } from 'omi';

export default class LoadingDelay extends Component {
  data = '';

  loading = false;

  loadingData = (time?: number) => {
    this.loading = true;
    this.data = '';
    this.update();
    const timer = setTimeout(() => {
      this.loading = false;
      this.data = '数据加载完成，短时间的数据加载并未出现 loading';
      clearTimeout(timer);
      this.update();
    }, time || 100);
  };

  install() {
    this.loadingData();
  }

  render() {
    const { loading, data, loadingData } = this;
    return (
      <t-space direction="vertical">
        <div>
          <t-loading delay={500} size="small" loading={loading}></t-loading>
          {data ? <div>{`loading 作为独立元素：${data}`}</div> : null}
        </div>

        <div>
          <t-loading loading={loading} delay={500} size="small" showOverlay>
            {<div>{data ? `loading 作为包裹元素：${data}` : ''}</div>}
          </t-loading>
        </div>

        <t-space>
          <t-button onClick={loadingData} size="small">
            快速重新加载数据（无loading）
          </t-button>
          <t-button onClick={() => loadingData(1000)} size="small">
            慢速重新加载数据
          </t-button>
        </t-space>
      </t-space>
    );
  }
}
