import { classNames, Component, computed, createRef, OmiProps, signal, SignalValue, tag } from 'omi';

import 'tdesign-icons-web-components';
import { Button } from '../button';
import NormalFile from './NormalFile';
import useUpload from './hooks/useUpload';
import { TdUploadProps, UploadFile } from './type';
import { CommonDisplayFileProps } from './interface';
import ImageCard from './ImageCard';
import CustomFile from './CustomFile';
import { classPrefix } from '../_util/classname';
import { toRef } from './utils';

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

  triggerUploadText = signal('');

  inputRef = createRef<HTMLInputElement>();

  commonDisplayFileProps: SignalValue<CommonDisplayFileProps>;

  onNormalFileChange: (e: InputEvent) => void;

  triggerUpload: (e?: MouseEvent) => void;

  cancelUpload: (context?: { file?: UploadFile; e?: MouseEvent }) => void;

  theme: SignalValue<string>;

  onPreview: SignalValue<(options: { file: UploadFile; index: number; e: MouseEvent }) => void>;

  tipsClasses: string;

  sizeOverLimitMessage: SignalValue<string>;

  errorClasses: string[];

  triggerButtonProps: SignalValue<import('/Users/wings/repos/tdesign-web-components/src/button/button').ButtonProps>;

  disabled: SignalValue<boolean>;

  propsRef: SignalValue<UploadProps>;

  init(props: SignalValue<UploadProps | OmiProps<UploadProps, any>>) {
    const { theme, onPreview, triggerButtonProps } = toRef(props);
    this.theme = theme;
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
      disabled,
      uploadFiles,
      onRemove,
      onNormalFileChange,
      triggerUpload,
      cancelUpload,
    } = useUpload(props);

    this.triggerUploadText = triggerUploadText;
    this.uploadFiles = uploadFiles;
    this.inputRef = inputRef;
    this.onNormalFileChange = onNormalFileChange;
    this.triggerUpload = triggerUpload;
    this.cancelUpload = cancelUpload;
    this.onPreview = onPreview;
    this.tipsClasses = tipsClasses;
    this.errorClasses = errorClasses;
    this.sizeOverLimitMessage = sizeOverLimitMessage;
    this.triggerButtonProps = triggerButtonProps;
    this.disabled = disabled;

    const commonDisplayFileProps: SignalValue<CommonDisplayFileProps> = computed(() => ({
      accept: props.value.accept,
      files: uploadValue.value,
      toUploadFiles: toUploadFiles.value,
      displayFiles: displayFiles.value,
      theme: props.value.theme,
      abridgeName: props.value.abridgeName,
      placeholder: props.value.placeholder,
      disabled: props.value.disabled,
      tips: props.value.tips,
      sizeOverLimitMessage: sizeOverLimitMessage.value,
      uploading: uploading.value,
      classPrefix,
      tipsClasses,
      errorClasses,
      placeholderClass,
      // locale,
      autoUpload: props.value.autoUpload,
      // showUploadProgress: props.showUploadProgress,
      // fileListDisplay: props.fileListDisplay,
      // imageViewerProps: props.imageViewerProps,
      onRemove,
    }));
    this.commonDisplayFileProps = commonDisplayFileProps;
  }

  install(): void {
    this.propsRef = signal<UploadProps>(this.props);
    this.init(this.propsRef);
  }

  receiveProps(props: UploadProps | OmiProps<UploadProps, any>) {
    this.propsRef.value = props;
  }

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const uploadClasses = computed(() => [
      // props.className,
      `${classPrefix}-upload`,
      {
        [`${classPrefix}-upload--theme-${props.theme}`]: props.theme === 'file-input',
      },
    ]);
    const renderTrigger = (): JSX.Element => {
      const getDefaultTrigger = () => {
        if (this.theme.value === 'file-input') {
          return (
            <Button
              variant="outline"
              onClick={this.triggerUpload}
              {...this.triggerButtonProps.value}
              disabled={this.disabled.value}
            >
              {this.triggerUploadText.value}
            </Button>
          );
        }
        return (
          <Button
            variant="outline"
            icon={<t-icon name="upload" />}
            onClick={this.triggerUpload}
            {...this.triggerButtonProps.value}
            disabled={this.disabled.value}
          >
            {this.triggerUploadText.value}
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
      <NormalFile {...this.commonDisplayFileProps.value} multiple={false}>
        <div className={`${classPrefix}-upload__trigger`}>{triggerElement}</div>
      </NormalFile>
    );

    const getImageCardUploadNode = () => (
      <ImageCard
        {...this.commonDisplayFileProps.value}
        // showUploadProgress={props.showUploadProgress}
        triggerUpload={this.triggerUpload}
        uploadFiles={this.uploadFiles}
        cancelUpload={this.cancelUpload}
        onPreview={this.onPreview.value}
        // showImageFileName={props.showImageFileName}
      />
    );

    const getCustomFile = () => (
      <CustomFile {...this.commonDisplayFileProps.value} triggerUpload={this.triggerUpload}>
        {triggerElement}
      </CustomFile>
    );
    return (
      <div class={classNames(uploadClasses.value)}>
        <input
          ref={this.inputRef}
          type="file"
          disabled={false}
          onChange={this.onNormalFileChange}
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
          <small class={classNames([this.tipsClasses, `${classPrefix.value}-upload__tips`])}>{props.tips}</small>
        )}
        {this.sizeOverLimitMessage.value && (
          <small class={classNames(this.errorClasses)}>{this.sizeOverLimitMessage.value}</small>
        )}
      </div>
    );
  }
}
