import 'tdesign-icons-web-components/esm/components/delete';
import 'tdesign-icons-web-components/esm/components/error-circle-filled';
import 'tdesign-icons-web-components/esm/components/add';

import zhCn from '../_common/js/global-config/locale/zh_CN';
import { abridgeName } from '../_common/js/upload/utils';
import classNames from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import Image from '../image';
import Loading from '../loading';
// import ImageViewer from '../../image-viewer';
import { CommonDisplayFileProps } from './interface';
import { TdUploadProps, UploadFile } from './type';

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

export function renderImageCard(props: ImageCardUploadProps) {
  const locale = zhCn.upload;
  const { displayFiles, classPrefix, onRemove, disabled } = props;

  const showTrigger = !displayFiles?.[0];

  const renderMainContent = (file: UploadFile, index: number) => (
    <div className={`${classPrefix}-upload__card-content ${classPrefix}-upload__card-box`}>
      <Image src={file.url} error="" loading="" />
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
      <Loading loading={true} size="medium" />
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

export default renderImageCard;
