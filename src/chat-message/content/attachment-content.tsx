import '../../attachments';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { type AttachmentItem } from '../../chat-engine';
import { TdAttachmentItem } from '../../filecard';
import styles from '../style/chat-item.less?inline';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatAttachmentContentProps = {
  key?: string;
  content?: AttachmentItem[];
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
};

// 纯函数渲染器
export const renderAttachments = ({ key, content }: TdChatAttachmentContentProps, self: any) => (
  <div key={key} className={`${className}__attachments`}>
    <t-attachments
      className={`${className}__attachments__host`}
      items={content}
      removable={false}
      onFileClick={(e) => {
        self.fire('fileClick', e.detail, { composed: true });
      }}
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

  render(props) {
    if (!props?.content) return;
    return renderAttachments(props, this);
  }
}
