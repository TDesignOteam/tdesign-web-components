import '../popup';

import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { type PopupVisibleChangeContext } from '../popup';
import useUpload from './hooks/useUpload';
import { TdUploadProps } from './type';

export type UploadProps = TdUploadProps;

export const uploadDefaultProps: TdUploadProps = {
  autoUpload: true,
  theme: 'file',
};

@tag('t-upload')
export default class Upload extends Component<UploadProps> {
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

  popupRef = createRef();

  timerRef = createRef();

  timeUp = false;

  popupVisible = undefined;

  handleVisibleChange(visible: boolean, { e, trigger }: PopupVisibleChangeContext) {
    this.props?.onVisibleChange?.(visible, { e, trigger });
  }

  countDown(props: TooltipProps) {
    if (props.duration !== 0 && !this.timeUp) {
      this.timeUp = true;
      this.popupVisible = true;
      this.update();
      clearTimeout(this.timerRef.current as number);
      this.timerRef.current = window.setTimeout(() => {
        this.popupVisible = undefined;
        this.timeUp = false;
        this.update();
      }, props.duration);
    }
  }

  receiveProps(props: TooltipProps, old: TooltipProps) {
    if (props.duration !== old.duration) {
      this.countDown(props);
    }

    return true;
  }

  installed(): void {
    this.countDown(this.props);
  }

  uninstall(): void {
    if (this.timerRef.current) {
      clearTimeout(this.timerRef.current as number);
    }
  }

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const {
      locale,
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
      onInnerRemove,
      uploadFiles,
      onNormalFileChange,
      onDragFileChange,
      onPasteFileChange,
      triggerUpload,
      cancelUpload,
      uploadFilePercent,
    } = useUpload(props);
    const { destroyOnClose, showArrow, theme, placement, overlayClassName, ignoreAttributes, ...restProps } = props;
    const classPrefix = getClassPrefix();
    const toolTipClass = classname(
      `${classPrefix}-tooltip`,
      {
        [`${classPrefix}-tooltip--${theme}`]: theme,
      },
      overlayClassName,
    );

    delete restProps.onVisibleChange;
    delete restProps.duration;
    delete restProps.children;

    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }

    getNormalFileNode = () => (
      <NormalFile {...commonDisplayFileProps} multiple={false}>
        <div className={`${classPrefix}-upload__trigger`} onClick={triggerUpload}>
          {triggerElement}
        </div>
      </NormalFile>
    );

    return (
      <div class={uploadClasses.value} onPaste={props.uploadPastedFiles ? onPasteFileChange : undefined}>
        <input
          ref={inputRef}
          type="file"
          disabled={disabled.value}
          onChange={onNormalFileChange}
          multiple={props.multiple}
          accept={props.accept}
          hidden
          {...(props.inputAttributes ? { ...props.inputAttributes } : {})}
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
