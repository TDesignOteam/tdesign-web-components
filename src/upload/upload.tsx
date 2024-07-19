import { classNames, Component, computed, OmiProps, tag } from 'omi';

import 'tdesign-icons-web-components';
import { Button } from '../button';
import NormalFile from './NormalFile';
import useUpload from './hooks/useUpload';
import { TdUploadProps, UploadFile } from './type';
import { CommonDisplayFileProps } from './interface';
import ImageCard from './ImageCard';
import CustomFile from './CustomFile';

export type UploadProps = TdUploadProps;

export const uploadDefaultProps: TdUploadProps = {
  autoUpload: true,
  theme: 'file',
};

@tag('t-upload')
export default class Upload extends Component<UploadProps> {
  uploadFiles: undefined | ((files: UploadFile[]) => void) = undefined;

  static css = [];

  static defaultProps = uploadDefaultProps;

  static propTypes = {
    abridgeName: Array,
    accept: String,
    action: String,
    autoUpload: Boolean,
    beforeUpload: Function,
    disabled: Boolean,
    files: Array,
    placeholder: String,
    formatResponse: Function,
    sizeLimit: Number,
    theme: String,
    tips: String,
    onChange: Function,
    onFail: Function,
    onPreview: Function,
    onSelectChange: Function,
    onSuccess: Function,
    onValidate: Function,
  };

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const { theme } = props;
    const {
      classPrefix,
      triggerUploadText,
      toUploadFiles,
      displayFiles,
      uploadValue,
      sizeOverLimitMessage,
      uploading,
      tipsClasses,
      errorClasses,
      placeholderClass,
      inputRef,
      uploadFiles,
      onNormalFileChange,
      triggerUpload,
      cancelUpload,
    } = useUpload(props);

    this.uploadFiles = uploadFiles;

    const commonDisplayFileProps: CommonDisplayFileProps = {
      accept: props.accept,
      files: uploadValue,
      toUploadFiles,
      displayFiles,
      theme,
      abridgeName: props.abridgeName,
      placeholder: props.placeholder,
      disabled: props.disabled,
      tips: props.tips,
      sizeOverLimitMessage,
      uploading,
      classPrefix,
      tipsClasses,
      errorClasses,
      placeholderClass,
      // locale,
      autoUpload: props.autoUpload,
      // showUploadProgress: props.showUploadProgress,
      // fileListDisplay: props.fileListDisplay,
      // imageViewerProps: props.imageViewerProps,
      // onRemove,
    };

    const uploadClasses = computed(() => [
      // props.className,
      `${classPrefix}-upload`,
      {
        [`${classPrefix}-upload--theme-${props.theme}`]: props.theme === 'file-input',
      },
    ]);

    const renderTrigger = () => {
      const getDefaultTrigger = () => {
        if (theme === 'file-input') {
          return <Button variant="outline">{triggerUploadText}</Button>;
        }
        return (
          <Button variant="outline" icon={<t-icon name="upload" />}>
            {triggerUploadText}
          </Button>
        );
      };
      return (
        // props.children || getDefaultTrigger()
        getDefaultTrigger()
      );
    };

    const triggerElement = renderTrigger();

    const getNormalFileNode = () => (
      <NormalFile {...commonDisplayFileProps} multiple={false}>
        <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
          {triggerElement}
        </div>
      </NormalFile>
    );

    const getImageCardUploadNode = () => (
      <ImageCard
        {...commonDisplayFileProps}
        // showUploadProgress={props.showUploadProgress}
        triggerUpload={triggerUpload}
        uploadFiles={uploadFiles}
        cancelUpload={cancelUpload}
        onPreview={props.onPreview}
        // showImageFileName={props.showImageFileName}
      />
    );

    const getCustomFile = () => (
      <CustomFile {...commonDisplayFileProps} triggerUpload={triggerUpload}>
        {triggerElement}
      </CustomFile>
    );

    return (
      <div class={classNames(uploadClasses.value)}>
        <input
          ref={inputRef}
          type="file"
          disabled={false}
          onChange={onNormalFileChange}
          multiple={false}
          accept={props.accept}
          hidden
        />
        {['file', 'file-input'].includes(props.theme) && getNormalFileNode()}
        {/* {['file', 'image'].includes(props.theme) && props.draggable && getSingleFileDraggerUploadNode()} */}
        {props.theme === 'image' && getImageCardUploadNode()}
        {/* {['image-flow', 'file-flow'].includes(props.theme) && getFlowListNode()} */}
        {props.theme === 'custom' && getCustomFile()}

        {Boolean(props.tips) && (
          <small class={classNames([tipsClasses, `${classPrefix.value}-upload__tips`])}>{props.tips}</small>
        )}
        {sizeOverLimitMessage.value && <small class={classNames(errorClasses)}>{sizeOverLimitMessage.value}</small>}
      </div>
    );
  }
}
