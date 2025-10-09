import 'tdesign-icons-web-components/esm/components/upload';
import 'tdesign-icons-web-components/esm/components/delete';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/add';
import 'tdesign-icons-web-components/esm/components/time-filled';
import 'tdesign-icons-web-components/esm/components/check-circle-filled';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/close-circle-filled';
import 'tdesign-icons-web-components/esm/components/close';
import '../input';
import '../image';
import '../loading';

import { classNames, Component, css, OmiProps, signal, SignalValue, tag } from 'omi';

import zhCn from '../_common/js/global-config/locale/zh_CN';
import { abridgeName } from '../_common/js/upload/utils';
import { classPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { ButtonProps } from '../button';
import useUpload from './hooks/useUpload';
import renderCustomFile from './CustomFile';
import { CommonDisplayFileProps } from './interface';
import { TdUploadProps, UploadFile, UploadProps } from './type';
import { toRef } from './utils';

export const uploadDefaultProps: TdUploadProps = {
  autoUpload: true,
  theme: 'file',
  showUploadProgress: true,
  showImageFileName: true,
};

export interface ImageCardUploadProps extends CommonDisplayFileProps {
  // multiple: TdUploadProps['multiple'];
  // max: TdUploadProps['max'];
  disabled?: TdUploadProps['disabled'];
  // showUploadProgress: TdUploadProps['showUploadProgress'];
  triggerUpload?: () => void;
  uploadFiles?: (toFiles?: UploadFile[]) => void;
  cancelUpload?: (context: { e: MouseEvent; file: UploadFile }) => void;
  onPreview?: TdUploadProps['onPreview'];
  showImageFileName?: boolean;
}

export type NormalFileProps = CommonDisplayFileProps;
export function renderNormalFile(props: NormalFileProps) {
  const { theme, disabled, classPrefix } = props;

  const uploadPrefix = `${classPrefix}-upload`;

  const renderProgress = (percent: number) => (
    <div className={`${uploadPrefix}__single-progress`}>
      {convertToLightDomNode(<t-loading loading={true} size="medium"></t-loading>)}
      <span className={`${uploadPrefix}__single-percent`}>{percent || 0}%</span>
    </div>
  );

  // 输入框型预览
  const renderFilePreviewAsInput = () => {
    const file = props.displayFiles[0];
    const inputTextClass = [
      `${classPrefix}-input__inner`,
      { [`${uploadPrefix}__placeholder`]: !props.displayFiles[0] },
    ];
    const disabledClass = disabled ? `${classPrefix}-is-disabled` : '';
    const fileName =
      props.abridgeName?.length && file?.name ? abridgeName(file.name, ...props.abridgeName) : file?.name;
    return (
      <div className={`${uploadPrefix}__single-input-preview ${classPrefix}-input ${disabledClass}`}>
        <div className={classNames(inputTextClass)}>
          <span
            className={classNames(`${uploadPrefix}__single-input-text`, {
              [props.placeholderClass]: props.placeholder && !file?.name,
            })}
          >
            {file?.name ? fileName : props.placeholder}
          </span>
          {file?.status === 'progress' && renderProgress(file.percent)}
          {file?.status === 'waiting' &&
            convertToLightDomNode(
              <t-icon-time-filled className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-waiting`} />,
            )}
          {file?.name &&
            file.status === 'success' &&
            convertToLightDomNode(<t-icon-check-circle-filled className={`${uploadPrefix}__status-icon`} />)}
          {file?.name &&
            file.status === 'fail' &&
            convertToLightDomNode(
              <t-icon-error-circle-filled className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-fail`} />,
            )}
          {Boolean(!disabled && file?.name) &&
            convertToLightDomNode(
              <t-icon-close-circle-filled
                className={`${uploadPrefix}__single-input-clear`}
                onClick={(e) => props.onRemove({ e, file, index: 0 })}
              />,
            )}
        </div>
      </div>
    );
  };

  const renderFilePreviewAsText = (files: UploadFile[]) => {
    if (theme !== 'file') return null;
    if (files[0]?.status === 'fail' && props.autoUpload) {
      return null;
    }
    return files.map((file, index) => {
      const fileName = props.abridgeName && file.name ? abridgeName(file.name, ...props.abridgeName) : file.name;
      return (
        <div
          className={`${uploadPrefix}__single-display-text ${uploadPrefix}__display-text--margin`}
          key={file.name + index + file.percent + file.status}
        >
          <span className={`${uploadPrefix}__single-name`}>{fileName}</span>
          {file.status === 'fail' && (
            <div className={`${uploadPrefix}__flow-status ${uploadPrefix}__file-fail`}>
              {convertToLightDomNode(<t-icon-error-circle-filled />)}
            </div>
          )}
          {file.status === 'waiting' && (
            <div className={`${uploadPrefix}__flow-status ${uploadPrefix}__file-waiting`}>
              {convertToLightDomNode(<t-icon-time-filled />)}
            </div>
          )}
          {file.status === 'progress' && renderProgress(file.percent)}
          {!disabled &&
            file.status !== 'progress' &&
            convertToLightDomNode(
              <t-icon-close
                className={`${uploadPrefix}__icon-delete`}
                onClick={(e) => props.onRemove({ e, file, index })}
              />,
            )}
        </div>
      );
    });
  };

  const { displayFiles } = props;

  const classes = [`${uploadPrefix}__single`, `${uploadPrefix}__single-${theme}`];
  return (
    <div className={classNames(classes)}>
      {theme === 'file-input' && renderFilePreviewAsInput()}
      {props.children}

      {theme === 'file' && props.placeholder && !displayFiles[0] && (
        <small className={classNames([props.tipsClasses, props.placeholderClass])}>{props.placeholder}</small>
      )}

      {renderFilePreviewAsText(displayFiles)}

      {/* 单文件上传失败要显示失败的原因 */}
      {displayFiles[0]?.status === 'fail' && theme === 'file' ? (
        <small className={classNames(props.errorClasses)}>{displayFiles[0].response?.error}</small>
      ) : null}
    </div>
  );
}

export function renderImageCard(props: ImageCardUploadProps) {
  const locale = zhCn.upload;
  const { displayFiles, classPrefix, onRemove, disabled } = props;

  const showTrigger = !displayFiles?.[0];

  const renderMainContent = (file: UploadFile, index: number) => (
    <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
      <t-image src={file.url} error="" loading=""></t-image>
      {!disabled && (
        <div className={`${classPrefix}-upload__card-mask`}>
          <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
            {convertToLightDomNode(<t-icon-delete onClick={(e) => onRemove?.({ e, file, index })} />)}
          </span>
        </div>
      )}
    </div>
  );
  const renderProgressFile = (file: UploadFile, loadCard: string) => (
    <div className={classNames([loadCard, `${classPrefix}-upload__${props.theme}-${file.status}`])}>
      <t-loading loading={true} size="medium"></t-loading>
      <p>
        {locale?.progress?.uploadingText}
        {props.showUploadProgress ? ` ${file.percent}%` : ''}
      </p>
    </div>
  );

  const renderFailFile = (file: UploadFile, index: number, loadCard: string) => (
    <div className={loadCard}>
      {convertToLightDomNode(<t-icon-error-circle-filled />)}
      <p>{file.response?.error || locale?.progress?.failText}</p>
      <div className={`${classPrefix}-upload__card-mask`}>
        <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
          {convertToLightDomNode(<t-icon-delete onClick={(e) => props.onRemove?.({ e, file, index })} />)}
        </span>
      </div>
    </div>
  );

  const cardItemClasses = `${classPrefix}-upload__card-item ${classPrefix}-is-background`;

  return (
    <div>
      <ul className={`${classPrefix}-upload__card`}>
        {displayFiles.map((file: UploadFile, index: number) => {
          const loadCard = `${classPrefix}-upload__card-container ${classPrefix}-upload__card-box`;
          const fileName = props.abridgeName ? abridgeName(file.name, ...props.abridgeName) : file.name;
          const fileNameClassName = `${classPrefix}-upload__card-name`;
          return (
            <li className={cardItemClasses} key={index}>
              {file.status === 'progress' && renderProgressFile(file, loadCard)}
              {file.status === 'fail' && renderFailFile(file, index, loadCard)}
              {!['progress', 'fail'].includes(file.status) && renderMainContent(file, index)}
              {
                fileName && props.showImageFileName && (
                  // (file.url ? (
                  //   <Link href={file.url} className={fileNameClassName} target="_blank" hover="color" size="small">
                  //     {fileName}
                  //   </Link>
                  // ) : (
                  <span className={fileNameClassName}>{fileName}</span>
                )
                // ))
              }
            </li>
          );
        })}
        {showTrigger && (
          <li className={cardItemClasses} onClick={props.triggerUpload}>
            <div
              className={classNames([
                `${classPrefix}-upload__image-add`,
                `${classPrefix}-upload__card-container`,
                `${classPrefix}-upload__card-box`,
                {
                  [`${classPrefix}-is-disabled`]: props.disabled,
                },
              ])}
            >
              {convertToLightDomNode(<t-icon-add />)}
              <p className={classNames([`${classPrefix}-size-s`, `${classPrefix}-upload__add-text`])}>
                {locale?.triggerUploadText?.image}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

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

  render(props: UploadProps | OmiProps<UploadProps, any>): JSX.Element {
    const { sizeOverLimitMessage, inputRef, tipsClasses, errorClasses, onNormalFileChange } = this.uploadState;

    // 通用的渲染属性
    const commonRenderProps = {
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
    };

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
        <slot name="upload-content">
          {['file', 'file-input'].includes(props.theme) &&
            renderNormalFile({
              ...commonRenderProps,
              children: <div className={`${classPrefix}-upload__trigger`}>{this.renderTrigger()}</div>,
            })}
          {/* {['file', 'image'].includes(props.theme) && props.draggable && getSingleFileDraggerUploadNode()} */}
          {props.theme === 'image' &&
            renderImageCard({
              ...commonRenderProps,
              triggerUpload: this.uploadState.triggerUpload,
              uploadFiles: this.uploadState.uploadFiles,
              cancelUpload: this.uploadState.cancelUpload,
              onPreview: this.onPreview.value,
              showImageFileName: props.showImageFileName,
            })}
          {/* {['image-flow', 'file-flow'].includes(props.theme) && getFlowListNode()} */}
          {props.theme === 'custom' &&
            renderCustomFile({
              ...commonRenderProps,
              triggerUpload: this.uploadState.triggerUpload,
              childrenNode: this.renderTrigger(),
            })}
        </slot>

        {Boolean(props.tips) && (
          <small class={classNames([tipsClasses, `${classPrefix.value}-upload__tips`])}>{props.tips}</small>
        )}
        {sizeOverLimitMessage.value && <small class={classNames(errorClasses)}>{sizeOverLimitMessage.value}</small>}
      </div>
    );
  }
}
