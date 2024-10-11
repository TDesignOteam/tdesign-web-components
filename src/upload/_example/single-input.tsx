import { Component, createRef, signal } from 'omi';
import { Button, Space, Upload } from 'tdesign-web-components';
import { MessagePlugin } from 'tdesign-web-components/message/message';
import type { UploadProps } from 'tdesign-web-components/upload';

export default class UploadSingleInput extends Component {
  uploadRef = createRef<InstanceType<typeof Upload>>();

  files = signal([]);

  autoUpload = signal(true);

  disabled = signal(false);

  handleFail: UploadProps['onFail'] = ({ file }) => {
    console.error(`${file.name} 上传失败`);
  };

  onSuccess: UploadProps['onSuccess'] = () => {
    MessagePlugin.info('上传成功');
  };

  // 非自动上传文件，需要在父组件单独执行上传
  uploadFiles = () => {
    this.uploadRef.current.uploadFiles([]);
  };

  setAutoUpload = (val: boolean) => {
    this.autoUpload.value = val;
  };

  setDisabled = (val: boolean) => {
    this.disabled.value = val;
  };

  render() {
    const Checkbox = ({ checked, onChange, children }) => {
      const handleChange = (event) => {
        if (onChange) {
          onChange(event.target.checked);
        }
      };

      return (
        <label className="checkbox">
          <input type="checkbox" checked={checked} onClick={handleChange} />
          <span className="checkbox-label">{children}</span>
        </label>
      );
    };

    return (
      <Space direction="vertical">
        <Space>
          <Checkbox checked={this.autoUpload.value} onChange={this.setAutoUpload}>
            自动上传
          </Checkbox>
          <Checkbox checked={this.disabled.value} onChange={this.setDisabled}>
            禁用状态
          </Checkbox>
          {!this.autoUpload.value && (
            <Button variant="base" theme="default" size="small" style={{ height: '22px' }} onClick={this.uploadFiles}>
              点击上传
            </Button>
          )}
        </Space>
        <br />
        <Upload
          ref={this.uploadRef}
          style={{ width: '350px', display: 'block' }}
          files={this.files.value}
          onChange={(files) => (this.files.value = files)}
          abridgeName={[8, 6]}
          action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          theme="file-input"
          placeholder="请选择文件"
          autoUpload={this.autoUpload.value}
          disabled={this.disabled.value}
          onFail={this.handleFail}
          onSuccess={this.onSuccess}
        ></Upload>
      </Space>
    );
  }
}
