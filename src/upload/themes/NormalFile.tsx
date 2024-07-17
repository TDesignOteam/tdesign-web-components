import '../popup';

import { Component, OmiProps, tag } from 'omi';
import classNames from '../../_util/classname';
import 'tdesign-icons-web-components';

import { abridgeName } from '../../_common/js/upload/utils';
import '../../loading';
import { CommonDisplayFileProps } from '../interface';

export type NormalFileProps = CommonDisplayFileProps;
@tag('t-upload-normalfile')
export default class NormalFile extends Component<NormalFileProps> {
  static defaultProps = {};

  static propTypes = {
    accept: String,
  };

  render(props: NormalFileProps | OmiProps<NormalFileProps, any>): JSX.Element {
    const { theme, disabled, classPrefix } = props;

    const uploadPrefix = `${classPrefix}-upload`;

    const renderProgress = (percent: number) => (
      <div className={`${uploadPrefix}__single-progress`}>
        <t-loading />
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
        {displayFiles[0]?.status === 'fail' && theme === 'file' ? (
          <small className={classNames(props.errorClasses)}>{displayFiles[0].response?.error}</small>
        ) : null}
      </div>
    );
  }
}
