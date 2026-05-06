import 'tdesign-web-components/image';
import 'tdesign-web-components/space';
import 'tdesign-web-components/button';
import 'tdesign-icons-web-components/esm/components/image-error';
import 'tdesign-icons-web-components/esm/components/refresh';

import { Component } from 'omi';

export default class ImagePlaceholder extends Component {
  loadingCount = 0;

  errorCount = 0;

  handleReload = () => {
    this.loadingCount += 1;
    this.update();
  };

  handleReplayError = () => {
    this.errorCount += 1;
    this.update();
  };

  render() {
    // todo: loading

    return (
      <t-space size={24} direction="vertical">
        <div>
          <h3 style={{ marginBottom: 15 }}>加载中的图片</h3>
          <t-space>
            <t-space direction="vertical">
              默认占位
              <t-image
                src="https://tdesign.gtimg.com/demo/demo-image-1.png"
                key={this.loadingCount}
                style={{ width: 284, height: 160 }}
              />
              <t-button variant="outline" icon={<t-icon-refresh class="mr-[2px]" />} onClick={this.handleReload}>
                重演 loading
              </t-button>
            </t-space>
            <t-space direction="vertical">
              自定义占位
              <t-image
                key={this.loadingCount}
                src="https://tdesign.gtimg.com/demo/demo-image-1.png"
                style={{ width: 284, height: 160 }}
                loading={<t-icon-image-error size={24} />}
              />
            </t-space>
          </t-space>
        </div>
        <div>
          <h3 style={{ marginBottom: 15 }}>加载失败的图片</h3>
          <t-space>
            <t-space direction="vertical">
              默认错误
              <t-image
                src=""
                key={this.errorCount}
                style={{ width: 284, height: 160 }}
                onError={(e: any) => {
                  console.log(e);
                }}
              />
              <t-button variant="outline" icon={<t-icon-refresh class="mr-[2px]" />} onClick={this.handleReplayError}>
                重演 error
              </t-button>
            </t-space>
            <t-space direction="vertical">
              自定义错误
              <t-image
                src=""
                key={this.errorCount}
                style={{ width: 284, height: 160 }}
                error={<t-icon-image-error size={24} />}
              />
            </t-space>
          </t-space>
        </div>
      </t-space>
    );
  }
}
