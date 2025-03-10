import { Component, createRef, signal } from 'omi';
import { getFileUrlByFileRaw } from 'tdesign-web-components/_common/js/upload/utils';
import Button from 'tdesign-web-components/button';
import Space from 'tdesign-web-components/space';
import type { UploadFile, UploadProps } from 'tdesign-web-components/upload';
import Upload from 'tdesign-web-components/upload';

export default class UploadExample extends Component {
  uploadRef1 = createRef<InstanceType<typeof Upload>>();

  uploadRef2 = createRef<InstanceType<typeof Upload>>();

  uploadRef3 = createRef<InstanceType<typeof Upload>>();

  files1 = signal<UploadFile[]>([]);

  files2 = signal<UploadFile[]>([
    {
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'default.jpeg',
      status: 'success',
    },
  ]);

  files3 = signal<UploadFile[]>([]);

  disabled = signal(false);

  uploadInOneRequest = signal(false);

  autoUpload = signal(true);

  setFormattedUrlFiles = (files: UploadFile[]) => {
    const list = files.map(
      (file) =>
        new Promise((resolve) => {
          getFileUrlByFileRaw(file.raw).then((url) => {
            resolve({ ...file, url });
          });
        }),
    );
    Promise.all(list).then((files) => {
      this.files3.value = files;
    });
  };

  // 因上传请求始终返回固定的 url，为了让预览效果更加真实，故而将图片转为 base64 进行预览
  onSuccess: UploadProps['onSuccess'] = ({ currentFiles }) => {
    const files = this.autoUpload.value ? this.files3.value.concat(currentFiles) : currentFiles;
    this.setFormattedUrlFiles(files);
  };

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  onValidate: UploadProps['onValidate'] = (params) => {
    const { files, type } = params;
    console.log('onValidate', params);
    if (type === 'FILE_OVER_SIZE_LIMIT') {
      files.map((t) => t.name).join('、');
      console.warn(`${files.map((t) => t.name).join('、')} 等图片大小超出限制，已自动过滤`, 5000);
    } else if (type === 'FILES_OVER_LENGTH_LIMIT') {
      console.warn('文件数量超出限制，仅上传未超出数量的文件');
    } else if (type === 'FILTER_FILE_SAME_NAME') {
      // 如果希望支持上传同名图片，请设置 allowUploadDuplicateFile={true}
      console.warn('不允许上传同名图片');
    }
  };

  uploadFiles = () => {
    this.uploadRef1.current.uploadFiles([]);
    this.uploadRef2.current.uploadFiles([]);
  };

  onPreview: UploadProps['onPreview'] = (params) => {
    console.log('点击图片预览时触发', params);
  };

  formatResponse = () => ({ name: 'FileName', error: '网络异常，图片上传失败' });

  setAutoUpload = (val: boolean) => {
    this.autoUpload.value = val;
  };

  setDisabled = (val: boolean) => {
    this.disabled.value = val;
  };

  setUploadInOneRequest = (val: boolean) => {
    this.uploadInOneRequest.value = val;
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
          <Checkbox checked={this.disabled.value} onChange={this.setDisabled}>
            禁用状态
          </Checkbox>
          {/* <Checkbox checked={this.uploadInOneRequest.value} onChange={this.setUploadInOneRequest}>
            多个文件一个请求上传
          </Checkbox> */}
          <Checkbox checked={this.autoUpload.value} onChange={this.setAutoUpload}>
            自动上传
          </Checkbox>
          {!this.autoUpload.value && (
            <Button variant="base" theme="default" size="small" style={{ height: '22px' }} onClick={this.uploadFiles}>
              点击上传
            </Button>
          )}
        </Space>

        <br />
        <Space direction="vertical">
          <Space>
            <Upload
              ref={this.uploadRef1}
              files={this.files1.value}
              onChange={(files) => (this.files1.value = files)}
              action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              theme="image"
              tips="请选择单张图片文件上传（上传成功状态演示）"
              accept="image/*"
              disabled={this.disabled.value}
              locale={{
                triggerUploadText: {
                  image: '请选择图片',
                },
              }}
              autoUpload={this.autoUpload.value}
              formatResponse={() => ({
                url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              })}
            />

            <Upload
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              theme="image"
              tips="单张图片文件上传（上传失败状态演示）"
              accept="image/*"
              formatResponse={this.formatResponse}
            />
          </Space>

          <Upload
            ref={this.uploadRef2}
            files={this.files2.value}
            onChange={(files) => (this.files2.value = files)}
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image"
            accept="image/*"
            disabled={this.disabled.value}
            autoUpload={this.autoUpload.value}
            // custom UI example
            // fileListDisplay={UploadUI}
          />

          {/* <Upload
            ref={uploadRef3}
            files={files3}
            onChange={setFiles3}
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image"
            tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
            accept="image/*"
            multiple
            max={3}
            disabled={disabled}
            sizeLimit={{ size: 2, unit: 'MB' }}
            autoUpload={autoUpload}
            abridgeName={[6, 6]}
            uploadAllFilesInOneRequest={uploadInOneRequest}
            onSuccess={onSuccess}
            onValidate={onValidate}
            onPreview={onPreview}
          /> */}
        </Space>
      </Space>
    );
  }
}
