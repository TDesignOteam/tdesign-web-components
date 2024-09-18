import 'tdesign-icons-web-components/esm/components/close';

import { Component, computed, createRef, signal } from 'omi';
import Button from 'tdesign-web-components/button';
import { MessagePlugin } from 'tdesign-web-components/message/message.tsx';
import Space from 'tdesign-web-components/space';
import type { UploadFile, UploadProps } from 'tdesign-web-components/upload';
import Upload from 'tdesign-web-components/upload';

export default class Base extends Component {
  uploadRef1 = createRef<InstanceType<typeof Upload>>();

  uploadRef2 = createRef<InstanceType<typeof Upload>>();

  uploadRef3 = createRef<InstanceType<typeof Upload>>();

  files1 = signal<UploadFile[]>([]);

  files2 = signal<UploadFile[]>([
    {
      name: '这是一个默认文件',
      status: 'success',
      url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
      size: 1000,
    },
  ]);

  multiple = signal(false);

  files3 = computed<UploadFile[]>(() =>
    this.multiple.value
      ? [
          {
            name: '这是一个上传成功的文件',
            status: 'success',
            url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            size: 1000,
          },
          {
            name: '这是一个上传中的文件',
            status: 'progress',
            percent: 30,
            url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            size: 1000,
          },
          {
            name: '这是一个上传失败的文件',
            status: 'fail',
            url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            size: 1000,
          },
          {
            name: '这是一个等待上传的文件',
            status: 'waiting',
            url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            size: 1000,
          },
        ]
      : [],
  );

  uploadInOneRequest = signal(false);

  autoUpload = signal(true);

  isBatchUpload = signal(false);

  disabled = signal(false);

  handleFail: UploadProps['onFail'] = ({ file }) => {
    console.error(`文件 ${file.name} 上传失败`);
  };

  handleSelectChange: UploadProps['onSelectChange'] = (files) => {
    console.log('onSelectChange', files);
  };

  handleSuccess: UploadProps['onSuccess'] = (params) => {
    console.log(params);
    console.log('上传成功');
    MessagePlugin.info('上传成功');
  };

  // 多文件上传，一个文件一个请求场景，每个文件也会单独触发上传成功的事件
  // const onOneFileSuccess: UploadProps['onOneFileSuccess'] = (params) => {
  //   console.log('onOneFileSuccess', params);
  // };

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  onValidate: UploadProps['onValidate'] = (params) => {
    const { files, type } = params;
    console.log('onValidate', type, files);
    const messageMap = {
      FILE_OVER_SIZE_LIMIT: '文件大小超出限制，已自动过滤',
      FILES_OVER_LENGTH_LIMIT: '文件数量超出限制，仅上传未超出数量的文件',
      // if you need same name files, setting allowUploadDuplicateFile={true} please
      FILTER_FILE_SAME_NAME: '不允许上传同名文件',
      BEFORE_ALL_FILES_UPLOAD: 'beforeAllFilesUpload 方法拦截了文件',
      CUSTOM_BEFORE_UPLOAD: 'beforeUpload 方法拦截了文件',
    };
    // you can also set Upload.tips and Upload.status to show warning message.
    messageMap[type] && console.warn(messageMap[type]);
  };

  // 仅自定义文件列表所需
  outsideRemove = (index: number) => {
    this.files3.value = this.files3.value.splice(index, 1);
  };

  setAutoUpload = (val: boolean) => {
    this.autoUpload.value = val;
  };

  setDisabled = (val: boolean) => {
    this.disabled.value = val;
  };

  render(): JSX.Element {
    const fileListDisplay = () => (
      <div>
        {this.files3.value.map((file, index) => (
          <div key={file.name} className="t-upload__single-display-text t-upload__display-text--margin">
            {file.name}（{file.size} B）
            <t-icon-close className="t-upload__icon-delete" onClick={() => this.outsideRemove(index)} />
          </div>
        ))}
      </div>
    );

    // 非自动上传文件，需要在父组件单独执行上传请求
    const uploadFiles = () => {
      this.uploadRef1.current.uploadFiles([]);
      this.uploadRef2.current.uploadFiles([]);
      this.uploadRef3.current.uploadFiles([]);
    };

    // 非自动上传文件，需保存待上传文件列表

    // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
    const formatResponse: UploadProps['formatResponse'] = (res) => ({
      ...res,
      error: '上传失败，请重试',
      url: res?.url,
    });

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
          <Checkbox checked={this.autoUpload.value} onChange={this.setAutoUpload}>
            自动上传
          </Checkbox>
          {!this.autoUpload.value && (
            <Button variant="base" theme="default" style={{ height: '22px' }} onClick={uploadFiles}>
              点击手动上传
            </Button>
          )}
        </Space>

        <br></br>
        {/* <!-- 1. formatRequest 用于修改或新增上传请求数据，示例：:formatRequest="(obj) => ({ ...obj, other: 123 })" --> */}
        <Space>
          <Upload
            ref={this.uploadRef1}
            files={this.files1.value}
            onChange={(val, ctx) => {
              console.log(val, ctx);
              this.files1.value = val;
            }}
            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            placeholder={this.multiple.value ? '文件数量不超过 5 个' : '要求文件大小在 1M 以内'}
            multiple={this.multiple.value}
            autoUpload={this.autoUpload.value}
            uploadAllFilesInOneRequest={this.uploadInOneRequest.value}
            isBatchUpload={this.isBatchUpload.value}
            sizeLimit={{ size: 1, unit: 'MB' }}
            max={5}
            disabled={this.disabled.value}
            allowUploadDuplicateFile={true}
            fileListDisplay={fileListDisplay}
            // formatRequest={(obj) => ({ ...obj, other: 123 })}
            onSelectChange={this.handleSelectChange}
            onFail={this.handleFail}
            onSuccess={this.handleSuccess}
            onValidate={this.onValidate}
          />

          <Upload
            ref={this.uploadRef2}
            files={this.files2.value}
            onChange={(val) => {
              this.files2.value = val;
            }}
            multiple={this.multiple.value}
            disabled={this.disabled.value}
            autoUpload={this.autoUpload.value}
            uploadAllFilesInOneRequest={this.uploadInOneRequest.value}
            isBatchUpload={this.isBatchUpload.value}
            triggerButtonProps={{ theme: 'primary', variant: 'base' }}
            placeholder="这是一段没有文件时的占位文本"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            style={{ marginLeft: '40px', display: 'block' }}
            onFail={this.handleFail}
          ></Upload>

          {/* formatResponse 可控制上传成功或者失败 */}
          <Upload
            ref={this.uploadRef3}
            files={this.files3.value}
            onChange={(val) => (this.files3.value = val)}
            multiple={this.multiple.value}
            disabled={this.disabled.value}
            autoUpload={this.autoUpload.value}
            uploadAllFilesInOneRequest={this.uploadInOneRequest.value}
            isBatchUpload={this.isBatchUpload.value}
            formatResponse={formatResponse}
            placeholder="文件上传失败示例"
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            style={{ marginLeft: '60px', display: 'block' }}
            // fileListDisplay={fileListDisplay}
            onFail={this.handleFail}
          />
        </Space>
      </Space>
    );
  }
}
