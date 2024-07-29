import 'tdesign-icons-web-components';
import classNames from 'classnames';
import Loading from '../loading';
// import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from './interface';
import { TdUploadProps, UploadFile } from './type';
import { abridgeName } from '../_common/js/upload/utils';
import Image from '../image';
import zhCN from '../locale/zh_CN';

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

const ImageCard = (props: ImageCardUploadProps): JSX.Element => {
  const locale = zhCN.upload;
  const { displayFiles, classPrefix, onRemove, disabled } = props;

  const showTrigger = !displayFiles?.[0];

  const renderMainContent = (file: UploadFile, index: number) => (
    <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
      <Image className={`${classPrefix}-upload__card-image`} src={file.url || file.raw} error="" loading="" />
      {!disabled && (
        <div className={`${classPrefix}-upload__card-mask`}>
          <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
            <t-icon name="delete" onClick={(e) => onRemove?.({ e, file, index })} />
          </span>
        </div>
      )}
    </div>
  );

  const renderProgressFile = (file: UploadFile, loadCard: string) => (
    <div className={classNames([loadCard, `${classPrefix}-upload__${props.theme}-${file.status}`])}>
      <Loading loading={true} size="medium" />
      <p>
        {locale?.progress?.uploadingText}
        {props.showUploadProgress ? ` ${file.percent}%` : ''}
      </p>
    </div>
  );

  const renderFailFile = (file: UploadFile, index: number, loadCard: string) => (
    <div className={loadCard}>
      <t-icon name="error-circle-filled" />
      <p>{file.response?.error || locale?.progress?.failText}</p>
      <div className={`${classPrefix}-upload__card-mask`}>
        <span className={`${classPrefix}-upload__card-mask-item`} onClick={(e) => e.stopPropagation()}>
          <t-icon name="delete" onClick={(e) => props.onRemove?.({ e, file, index })} />
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
              <t-icon name="add" />
              <p className={classNames([`${classPrefix}-size-s`, `${classPrefix}-upload__add-text`])}>
                {locale?.triggerUploadText?.image}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

ImageCard.displayName = 'ImageCard';

export default ImageCard;
