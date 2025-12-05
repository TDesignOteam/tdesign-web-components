import 'tdesign-icons-web-components/esm/components/swap-right';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { convertToLightDomNode } from '../../_util/lightDom';
import { type SuggestionItem } from '../../chat-engine';
import styles from '../style/chat-item.less?inline';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatSuggestionContentProps = {
  key?: string;
  content?: SuggestionItem[];
  handlePromptClick?: ({ event, content }: { event: MouseEvent; content: SuggestionItem }) => void;
};

// 纯函数渲染器
export const renderSuggestion = ({ key, content, handlePromptClick }: TdChatSuggestionContentProps) => (
  <div key={key} className={`${className}__suggestion`}>
    {content.map(
      (s, i) =>
        s?.title && (
          <div
            key={i}
            className={`${className}__suggestion-item`}
            onClick={(event) => handlePromptClick?.({ event, content: s })}
          >
            {s.title}
            {convertToLightDomNode(<t-icon-swap-right class={`${className}__suggestion-arrow`} size="16px" />)}
          </div>
        ),
    )}
  </div>
);

// Web Component版本
@tag('t-chat-suggestion-content')
export default class SuggestionContentComponent extends Component<TdChatSuggestionContentProps> {
  static css = styles;

  static propTypes = {
    content: Object,
    handlePromptClick: Object,
  };

  render(props) {
    if (!props?.content) return;
    return renderSuggestion(props);
  }
}
