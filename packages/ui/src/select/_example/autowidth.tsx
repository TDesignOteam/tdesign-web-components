import 'tdesign-web-components/select';

import { Component } from 'omi';

export default class SelectAutowidth extends Component {
  render() {
    return (
      <div>
        <t-select
          placeholder="请选择"
          autoWidth
          options={[
            { label: '选项一', value: '1' },
            { label: '选项二', value: '2' },
            { label: '非常长的选项三非常长的选项三', value: '3' },
          ]}
          // 提供popupProps下的onTriggerResize和onPopperResize，可监听输入框和下拉弹窗的宽度和高度变化
          popupProps={{
            onTriggerResize: (width: number) => {
              console.log('input宽度: ', width);
            },
            onPopperResize: (width: number) => {
              console.log('panel宽度: ', width);
            },
          }}
        />
      </div>
    );
  }
}
