import 'tdesign-icons-web-components';
import { computed, createRef, signal } from 'omi';
import Button from 'tdesign-web-components/button';
import Space from 'tdesign-web-components/space';
import Upload from '../upload';
import type { UploadProps } from '../upload';
import { UploadFile } from '../type';

export default function UploadExample() {
  const uploadRef1 = createRef<InstanceType<typeof Upload>>();
  const uploadRef2 = createRef<InstanceType<typeof Upload>>();
  const uploadRef3 = createRef<InstanceType<typeof Upload>>();
  const files1 = signal<UploadFile[]>([]);
  const files2 = signal<UploadFile[]>([
    {
      name: '这是一个默认文件',
      status: 'success',
      url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
      size: 1000,
    },
  ]);
  const multiple = signal(false);
  const files3 = computed<UploadFile[]>(() =>
    multiple.value
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
  const uploadInOneRequest = signal(false);
  const autoUpload = signal(true);
  const isBatchUpload = signal(false);
  const disabled = signal(false);

  const handleFail: UploadProps['onFail'] = ({ file }) => {
    console.error(`文件 ${file.name} 上传失败`);
  };

  const handleSelectChange: UploadProps['onSelectChange'] = (files) => {
    console.log('onSelectChange', files);
  };

  const handleSuccess: UploadProps['onSuccess'] = (params) => {
    console.log(params);
    console.log('上传成功');
  };

  // 多文件上传，一个文件一个请求场景，每个文件也会单独触发上传成功的事件
  // const onOneFileSuccess: UploadProps['onOneFileSuccess'] = (params) => {
  //   console.log('onOneFileSuccess', params);
  // };

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  const onValidate: UploadProps['onValidate'] = (params) => {
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
  const outsideRemove = (index: number) => {
    files3.value = files3.value.splice(index, 1);
  };

  // eslint-disable-next-line
  const fileListDisplay = () => (
    <div>
      {files3.value.map((file, index) => (
        <div key={file.name} className="t-upload__single-display-text t-upload__display-text--margin">
          {file.name}（{file.size} B）
          <t-icon name="close" className="t-upload__icon-delete" onClick={() => outsideRemove(index)} />
        </div>
      ))}
    </div>
  );

  // 非自动上传文件，需要在父组件单独执行上传请求
  const uploadFiles = () => {
    uploadRef1.current.uploadFiles([]);
    uploadRef2.current.uploadFiles([]);
    uploadRef3.current.uploadFiles([]);
  };

  // 非自动上传文件，需保存待上传文件列表

  // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
  const formatResponse: UploadProps['formatResponse'] = (res) => ({ ...res, error: '上传失败，请重试', url: res?.url });

  /** 单个文件校验方法，示例代码有效，勿删 */
  // const beforeUpload = (file) => {
  //   console.error(`文件 ${file.name} 不满足条件`);
  //   return false;
  // };

  /** 全部文件一次性校验方法，示例代码有效，勿删 */
  // const beforeAllFilesUpload = () => {
  //   console.error(`文件不满足条件`);
  //   return false;
  // };

  const Checkbox = ({ checked, onChange, children }) => {
    const handleChange = (event) => {
      if (onChange) {
        onChange(event.target.checked);
      }
    };

    return (
      <label className="checkbox">
        <input type="checkbox" checked={checked} onChange={handleChange} />
        <span className="checkbox-label">{children}</span>
      </label>
    );
  };

  return (
    <Space direction="vertical">
      <Space>
        <Checkbox checked={disabled.value} onChange={(disabled.value = !disabled.value)}>
          禁用状态
        </Checkbox>
        <Checkbox checked={autoUpload.value} onChange={(autoUpload.value = !autoUpload.value)}>
          自动上传
        </Checkbox>
        {!autoUpload && (
          <Button variant="base" theme="default" style={{ height: '22px' }} onClick={uploadFiles}>
            点击手动上传
          </Button>
        )}
      </Space>

      <br />

      {/* <!-- 1. formatRequest 用于修改或新增上传请求数据，示例：:formatRequest="(obj) => ({ ...obj, other: 123 })" --> */}
      <Space>
        <Upload
          ref={uploadRef1}
          files={files1.value}
          onChange={(val, ctx) => {
            console.log(val, ctx);
            files1.value = val;
          }}
          action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          placeholder={multiple.value ? '文件数量不超过 5 个' : '要求文件大小在 1M 以内'}
          multiple={multiple.value}
          autoUpload={autoUpload.value}
          uploadAllFilesInOneRequest={uploadInOneRequest.value}
          isBatchUpload={isBatchUpload.value}
          sizeLimit={{ size: 1, unit: 'MB' }}
          max={5}
          disabled={disabled.value}
          allowUploadDuplicateFile={true}
          // formatRequest={(obj) => ({ ...obj, other: 123 })}
          onSelectChange={handleSelectChange}
          onFail={handleFail}
          onSuccess={handleSuccess}
          onValidate={onValidate}
        />

        <Upload
          ref={uploadRef2}
          files={files2.value}
          onChange={(val) => (files2.value = val)}
          multiple={multiple.value}
          disabled={disabled.value}
          autoUpload={autoUpload.value}
          uploadAllFilesInOneRequest={uploadInOneRequest.value}
          isBatchUpload={isBatchUpload.value}
          triggerButtonProps={{ theme: 'primary', variant: 'base' }}
          placeholder="这是一段没有文件时的占位文本"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          style={{ marginLeft: '40px' }}
          onFail={handleFail}
        ></Upload>

        {/* formatResponse 可控制上传成功或者失败 */}
        <Upload
          ref={uploadRef3}
          files={files3.value}
          onChange={(val) => (files3.value = val)}
          multiple={multiple.value}
          disabled={disabled.value}
          autoUpload={autoUpload.value}
          uploadAllFilesInOneRequest={uploadInOneRequest.value}
          isBatchUpload={isBatchUpload.value}
          formatResponse={formatResponse}
          placeholder="文件上传失败示例"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          style={{ marginLeft: '60px' }}
          // fileListDisplay={fileListDisplay}
          onFail={handleFail}
        />
      </Space>
    </Space>
  );
}
