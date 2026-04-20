import '../../attachments';

import { type AttachmentItem } from '@tdesign/web-components-chat/chat-engine';
import { TdAttachmentItem } from '@tdesign/web-components-chat/filecard';
import { getClassPrefix } from '@tdesign/web-components-shared/_util/classname';
import { Component, tag } from 'omi';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatAttachmentContentProps = {
  content?: AttachmentItem[];
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
};

// 纯函数渲染器
export const renderAttachments = ({ content, onFileClick }: TdChatAttachmentContentProps) => (
  <div className={`${className}__attachments`}>
    <t-attachments
      className={`${className}__attachments__host`}
      items={content}
      removable={false}
      onFileClick={onFileClick}
      style={{ '--td-attachment-image-width': '160px', '--td-attachment-image-height': '160px' }}
    />
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

  onFileClick = (event) => {
    this.fire('fileClick', event.detail, { composed: true });
  };

  render(props) {
    if (!props?.content) return;
    return renderAttachments({ ...props, onFileClick: this.onFileClick });
  }
}
