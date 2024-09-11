import 'tdesign-icons-web-components/esm/components/upload';

import { classNames, Component, computed, css, OmiProps, signal, SignalValue, tag } from 'omi';

import { classPrefix } from '../_util/classname';
import { Button, ButtonProps } from '../button';
import useUpload from './hooks/useUpload';
import CustomFile from './CustomFile';
import ImageCard from './ImageCard';
import { CommonDisplayFileProps } from './interface';
import NormalFile from './NormalFile';
import { TdUploadProps, UploadFile } from './type';
import { toRef } from './utils';

export type UploadProps = TdUploadProps;

export const uploadDefaultProps: TdUploadProps = {
  autoUpload: true,
  theme: 'file',
  showUploadProgress: true,
  showImageFileName: true,
};

@tag('t-upload')
export default class Upload extends Component<UploadProps> {
  static css = css`
    .t-upload__single-input-clear {
      display: none;
    }

    .t-upload__single-progress .t-loading {
      line-height: calc(var(--td-font-size-body-medium) + 2px);
    }
  `;

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

  uploadState: ReturnType<typeof useUpload>;

  commonDisplayFileProps: SignalValue<CommonDisplayFileProps>;

  theme = signal<string>('file');

  onPreview: SignalValue<(options: { file: UploadFile; index: number; e: MouseEvent }) => void>;

  triggerButtonProps: SignalValue<ButtonProps>;

  propsRef: SignalValue<UploadProps>;

  uploadFiles: (toFiles?: UploadFile[]) => void;

  init(props: SignalValue<UploadProps | OmiProps<UploadProps, any>>) {
    const { theme, onPreview, triggerButtonProps } = toRef(props);

    this.uploadState = useUpload(props);
    this.uploadFiles = this.uploadState.uploadFiles;
    this.theme = theme;
    this.onPreview = onPreview;
    this.triggerButtonProps = triggerButtonProps;

    this.commonDisplayFileProps = computed(() => ({
      accept: props.value.accept,
      files: this.uploadState.uploadValue.value,
      toUploadFiles: this.uploadState.toUploadFiles.value,
      displayFiles: this.uploadState.displayFiles.value,
      theme: props.value.theme,
      abridgeName: props.value.abridgeName,
      placeholder: props.value.placeholder,
      disabled: props.value.disabled,
      tips: props.value.tips,
      sizeOverLimitMessage: this.uploadState.sizeOverLimitMessage.value,
      uploading: this.uploadState.uploading.value,
      showUploadProgress: props.value.showUploadProgress,
      classPrefix,
      tipsClasses: this.uploadState.tipsClasses,
      errorClasses: this.uploadState.errorClasses,
      placeholderClass: this.uploadState.placeholderClass,
      // locale,
      autoUpload: props.value.autoUpload,
      // showUploadProgress: props.showUploadProgress,
      // fileListDisplay: props.fileListDisplay,
      // imageViewerProps: props.imageViewerProps,
      onRemove: this.uploadState.onRemove,
    }));
  }

  install(): void {
    this.propsRef = signal<UploadProps>(this.props);
    this.init(this.propsRef);
  }

  receiveProps(props: UploadProps | OmiProps<UploadProps, any>) {
    this.propsRef.value = props;
  }

  renderTrigger = (): JSX.Element => {
    const { disabled, triggerUploadText, triggerUpload } = this.uploadState;

    const getDefaultTrigger = () => {
      if (this.theme.value === 'file-input') {
        return (
          <Button
            variant="outline"
            onClick={triggerUpload}
            {...this.triggerButtonProps.value}
            disabled={disabled.value}
          >
            {triggerUploadText.value}
          </Button>
        );
      }
      return (
        <Button
          variant="outline"
          icon={<t-icon-upload />}
          onClick={triggerUpload}
          {...this.triggerButtonProps.value}
          disabled={disabled.value}
        >
          {triggerUploadText.value}
        </Button>
      );
    };
    return (
      // props.children || getDefaultTrigger()
      getDefaultTrigger()
    );
  };

  getNormalFileNode = () => (
    <NormalFile {...this.commonDisplayFileProps.value}>
      <div className={`${classPrefix}-upload__trigger`}>{this.renderTrigger()}</div>
    </NormalFile>
  );

  getImageCardUploadNode = (props: UploadProps) => {
    const { uploadFiles, triggerUpload, cancelUpload } = this.uploadState;
    return (
      <ImageCard
        {...this.commonDisplayFileProps.value}
        showUploadProgress={props.showUploadProgress}
        triggerUpload={triggerUpload}
        uploadFiles={uploadFiles}
        cancelUpload={cancelUpload}
        onPreview={this.onPreview.value}
        showImageFileName={props.showImageFileName}
      />
    );
  };

  getCustomFile = () => {
    const { triggerUpload } = this.uploadState;
    return (
      <CustomFile {...this.commonDisplayFileProps.value} triggerUpload={triggerUpload}>
        {this.renderTrigger()}
      </CustomFile>
    );
  };

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const { sizeOverLimitMessage, inputRef, tipsClasses, errorClasses, onNormalFileChange } = this.uploadState;
    const uploadClasses = [
      // props.className,
      `${classPrefix}-upload`,
      {
        [`${classPrefix}-upload--theme-${props.theme}`]: props.theme === 'file-input',
      },
    ];

    return (
      <div class={classNames(uploadClasses)}>
        <input
          ref={inputRef}
          type="file"
          disabled={false}
          onChange={onNormalFileChange}
          multiple={false}
          accept={props.accept}
          hidden
        />
        {['file', 'file-input'].includes(props.theme) && this.getNormalFileNode()}
        {/* {['file', 'image'].includes(props.theme) && props.draggable && getSingleFileDraggerUploadNode()} */}
        {props.theme === 'image' && this.getImageCardUploadNode(props)}
        {/* {['image-flow', 'file-flow'].includes(props.theme) && getFlowListNode()} */}
        {props.theme === 'custom' && this.getCustomFile()}

        {Boolean(props.tips) && (
          <small class={classNames([tipsClasses, `${classPrefix.value}-upload__tips`])}>{props.tips}</small>
        )}
        {sizeOverLimitMessage.value && <small class={classNames(errorClasses)}>{sizeOverLimitMessage.value}</small>}
      </div>
    );
  }
}
