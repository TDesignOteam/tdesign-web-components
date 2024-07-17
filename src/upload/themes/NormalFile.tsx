import '../popup';

import classNames from 'classnames';
import { Component, OmiProps, tag } from 'omi';
import 'tdesign-icons-web-components';

import { abridgeName } from '../../_common/js/upload/utils';
import '../../loading';
import zhCn from '../../locale/zh_CN';
import { CommonDisplayFileProps } from '../interface';
import { UploadFile } from '../type';

export type NormalFileProps = CommonDisplayFileProps;
@tag('t-upload')
export default class Upload extends Component<NormalFileProps> {
  render(props: NormalFileProps | OmiProps<NormalFileProps, any>): JSX.Element {
    const locale = zhCn;
    const { theme, disabled, classPrefix } = props;

    const uploadPrefix = `${classPrefix}-upload`;

    const renderProgress = (percent: number) => (
      <div className={`${uploadPrefix}__single-progress`}>
        <t-loading />
        <span className={`${uploadPrefix}__single-percent`}>{percent || 0}%</span>
      </div>
    );

    // 文本型预览
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
                <t-icon name="error-circle-filled" />
              </div>
            )}
            {file.status === 'waiting' && (
              <div className={`${uploadPrefix}__flow-status ${uploadPrefix}__file-waiting`}>
                <t-icon name="time-filled" />
              </div>
            )}
            {file.status === 'progress' && renderProgress(file.percent)}
            {!disabled && file.status !== 'progress' && (
              <t-icon
                name="close"
                className={`${uploadPrefix}__icon-delete`}
                onClick={(e) => props.onRemove({ e, file, index })}
              />
            )}
          </div>
        );
      });
    };

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
            {file?.status === 'waiting' && (
              <t-icon name="time-filled" className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-waiting`} />
            )}
            {file?.name && file.status === 'success' && (
              <t-icon name="check-circle-filled" className={`${uploadPrefix}__status-icon`} />
            )}
            {file?.name && file.status === 'fail' && (
              <t-icon
                name="error-circle-filled"
                className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-fail`}
              />
            )}
            {Boolean(!disabled && file?.name) && (
              <t-icon
                name="close-circle-filled"
                className={`${uploadPrefix}__single-input-clear`}
                onClick={(e) => props.onRemove({ e, file, index: 0 })}
              />
            )}
          </div>
        </div>
      );
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

        {/* 单文件上传失败要显示失败的原因 */}
        {!props.multiple && displayFiles[0]?.status === 'fail' && theme === 'file' ? (
          <small className={classNames(props.errorClasses)}>
            {displayFiles[0].response?.error || locale.progress.failText}
          </small>
        ) : null}
      </div>
    );
  }
}
