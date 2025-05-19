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
export const renderAttachments = ({ content }: TdChatAttachmentContentProps, self: any) => (
    <div className={`${className}__attachments`}>
      {
        convertToLightDomNode(
          <t-attachments
            className={`${className}__attachments_image`}
            items={content}
            removable={false}
            onFileClick={(e) => {
              self.fire('file-click', e.detail, { composed: true });
            }}
          />,
        )
      }
    </div>
  );

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
