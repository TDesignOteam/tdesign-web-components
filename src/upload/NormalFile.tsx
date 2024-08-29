import 'tdesign-icons-web-components/esm/components/time-filled';
import 'tdesign-icons-web-components/esm/components/check-circle-filled';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/close-circle-filled';
import 'tdesign-icons-web-components/esm/components/close';

import { abridgeName } from '../_common/js/upload/utils';
import classNames from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import Loading from '../loading';
import { CommonDisplayFileProps } from './interface';
import { UploadFile } from './type';

export type NormalFileProps = CommonDisplayFileProps;
export default function NormalFile(props: NormalFileProps): JSX.Element {
  const { theme, disabled, classPrefix } = props;

  const uploadPrefix = `${classPrefix}-upload`;

  const renderProgress = (percent: number) => (
    <div className={`${uploadPrefix}__single-progress`}>
      {convertToLightDomNode(<Loading loading={true} size="medium" />)}
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
