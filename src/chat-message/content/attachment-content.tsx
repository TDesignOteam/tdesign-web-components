import '../../image';
import '../../attachments';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { type AttachmentItem } from '../../chatbot/type';
import { TdAttachmentItem } from '../../filecard';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatAttachmentContentProps = {
  content?: AttachmentItem[];
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
};

// 纯函数渲染器
export const renderAttachments = ({ content }: TdChatAttachmentContentProps, self: any) => {
  // 判断是否全部是图片类型
  const isAllImages = content.every((att) => /image/.test(att.fileType));
  return (
    <div className={`${className}__attachments`}>
      {isAllImages ? (
        <div className={`${className}__image-grid`}>
          {content.map((img, index) => (
            <div
              className={`${className}__image-wrapper`}
              key={index}
              onClick={() => {
                self.fire('file-click', img, { composed: true });
              }}
            >
              {convertToLightDomNode(
                <t-image
                  src={img.url}
                  alt={img.name}
                  className={`${className}__preview-image`}
                  shape="round"
                  loading="lazy"
                />,
              )}
            </div>
          ))}
        </div>
      ) : (
        convertToLightDomNode(
          <t-attachments
            items={content}
            removable={false}
            onFileClick={(e) => {
              self.fire('file-click', e.detail, { composed: true });
            }}
          />,
        )
      )}
    </div>
  );
};

// Web Component版本
@tag('t-chat-attachment-content')
export default class AttachmentContentComponent extends Component<TdChatAttachmentContentProps> {
  static css = styles;

  static propTypes = {
    content: Object,
    onFileClick: Function,
  };

  render(props) {
    if (!props?.content) return;
    return renderAttachments(props, this);
  }
}
