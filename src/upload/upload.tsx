import 'tdesign-icons-web-components/esm/components/upload';
import '../input';

import { classNames, Component, css, OmiProps, signal, SignalValue, tag } from 'omi';

import { classPrefix } from '../_util/classname';
import { ButtonProps } from '../button';
import useUpload from './hooks/useUpload';
import renderCustomFile from './CustomFile';
import renderImageCard from './ImageCard';
import { CommonDisplayFileProps } from './interface';
import renderNormalFile from './NormalFile';
import { TdUploadProps, UploadFile, UploadProps } from './type';
import { toRef } from './utils';

export const uploadDefaultProps: TdUploadProps = {
  autoUpload: true,
  theme: 'file',
  showUploadProgress: true,
  showImageFileName: true,
};

@tag('t-upload')
export default class Upload extends Component<UploadProps> {
  static css = css`
    .${classPrefix}-upload__single-input-clear {
      display: none;
    }

    .${classPrefix}-upload__single-progress .t-loading {
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
  }

  install(): void {
    this.propsRef = signal<UploadProps>(this.props);
    this.init(this.propsRef);
  }

  receiveProps(props: UploadProps | OmiProps<UploadProps, any>) {
    this.propsRef.value = props;
  }

  renderTrigger = (): JSX.Element => {
    const { triggerUploadText, triggerUpload } = this.uploadState;

    const getDefaultTrigger = () => {
      if (this.theme.value === 'file-input') {
        return (
          <t-button
            variant="outline"
            onClick={triggerUpload}
            {...this.triggerButtonProps.value}
            disabled={this.props.disabled}
          >
            {triggerUploadText.value}
          </t-button>
        );
      }
      return (
        <t-button
          variant="outline"
          icon={<t-icon-upload />}
          onClick={triggerUpload}
          {...this.triggerButtonProps.value}
          disabled={this.props.disabled}
        >
          {triggerUploadText.value}
        </t-button>
      );
    };
    return (
      // props.children || getDefaultTrigger()
      getDefaultTrigger()
    );
  };

  getNormalFileNode = (props: UploadProps) =>
    renderNormalFile({
      accept: props.accept,
      files: this.uploadState.uploadValue.value,
      toUploadFiles: this.uploadState.toUploadFiles.value,
      displayFiles: this.uploadState.displayFiles.value,
      theme: props.theme,
      abridgeName: props.abridgeName,
      placeholder: props.placeholder,
      disabled: props.disabled,
      tips: props.tips,
      sizeOverLimitMessage: this.uploadState.sizeOverLimitMessage.value,
      uploading: this.uploadState.uploading.value,
      showUploadProgress: props.showUploadProgress,
      classPrefix,
      tipsClasses: this.uploadState.tipsClasses,
      errorClasses: this.uploadState.errorClasses,
      placeholderClass: this.uploadState.placeholderClass,
      autoUpload: props.autoUpload,
      onRemove: this.uploadState.onRemove,
      children: <div className={`${classPrefix}-upload__trigger`}>{this.renderTrigger()}</div>,
    });

  getImageCardUploadNode = (props: UploadProps) => {
    const { uploadFiles, triggerUpload, cancelUpload } = this.uploadState;
    return renderImageCard({
      accept: props.accept,
      files: this.uploadState.uploadValue.value,
      toUploadFiles: this.uploadState.toUploadFiles.value,
      displayFiles: this.uploadState.displayFiles.value,
      theme: props.theme,
      abridgeName: props.abridgeName,
      placeholder: props.placeholder,
      disabled: props.disabled,
      tips: props.tips,
      sizeOverLimitMessage: this.uploadState.sizeOverLimitMessage.value,
      uploading: this.uploadState.uploading.value,
      showUploadProgress: props.showUploadProgress,
      classPrefix,
      tipsClasses: this.uploadState.tipsClasses,
      errorClasses: this.uploadState.errorClasses,
      placeholderClass: this.uploadState.placeholderClass,
      autoUpload: props.autoUpload,
      onRemove: this.uploadState.onRemove,
      triggerUpload,
      uploadFiles,
      cancelUpload,
      onPreview: this.onPreview.value,
      showImageFileName: props.showImageFileName,
    });
  };

  getCustomFile = (props: UploadProps) => {
    const { triggerUpload } = this.uploadState;
    return renderCustomFile({
      accept: props.accept,
      files: this.uploadState.uploadValue.value,
      toUploadFiles: this.uploadState.toUploadFiles.value,
      displayFiles: this.uploadState.displayFiles.value,
      theme: props.theme,
      abridgeName: props.abridgeName,
      placeholder: props.placeholder,
      disabled: props.disabled,
      tips: props.tips,
      sizeOverLimitMessage: this.uploadState.sizeOverLimitMessage.value,
      uploading: this.uploadState.uploading.value,
      showUploadProgress: props.showUploadProgress,
      classPrefix,
      tipsClasses: this.uploadState.tipsClasses,
      errorClasses: this.uploadState.errorClasses,
      placeholderClass: this.uploadState.placeholderClass,
      autoUpload: props.autoUpload,
      onRemove: this.uploadState.onRemove,
      triggerUpload,
      childrenNode: this.renderTrigger(),
    });
  };

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const { sizeOverLimitMessage, inputRef, tipsClasses, errorClasses, onNormalFileChange } = this.uploadState;
    return (
      <div
        class={classNames([
          `${classPrefix}-upload`,
          {
            [`${classPrefix}-upload--theme-${props.theme}`]: props.theme === 'file-input',
          },
          props.innerClass,
        ])}
        style={props.innerStyle}
      >
        <input
          ref={inputRef}
          type="file"
          disabled={props.disabled}
          onChange={onNormalFileChange}
          multiple={false}
          accept={props.accept}
          hidden
        />
        {['file', 'file-input'].includes(props.theme) && this.getNormalFileNode(props)}
        {/* {['file', 'image'].includes(props.theme) && props.draggable && getSingleFileDraggerUploadNode()} */}
        {props.theme === 'image' && this.getImageCardUploadNode(props)}
        {/* {['image-flow', 'file-flow'].includes(props.theme) && getFlowListNode()} */}
        {props.theme === 'custom' && this.getCustomFile(props)}

        {Boolean(props.tips) && (
          <small class={classNames([tipsClasses, `${classPrefix.value}-upload__tips`])}>{props.tips}</small>
        )}
        {sizeOverLimitMessage.value && <small class={classNames(errorClasses)}>{sizeOverLimitMessage.value}</small>}
      </div>
    );
  }
}
