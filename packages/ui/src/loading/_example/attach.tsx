import 'tdesign-web-components/loading';

import { Component } from 'omi';

export default class LoadingDelay extends Component {
  loading = true;

  attach = null;

  installed(): void {
    this.attach = this.shadowRoot.querySelector('#loading-service');
    this.update();
  }

  render() {
    const { loading } = this;
    return (
      <>
        <div
          id="loading-service"
          style={{ width: '100%', height: '60px', textAlign: 'center', lineHeight: '60px', position: 'relative' }}
        >
          我是attach的容器
        </div>
        <t-loading size="small" loading={loading} attach={this.attach}></t-loading>
      </>
    );
  }
}
