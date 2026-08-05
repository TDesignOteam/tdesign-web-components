import 'tdesign-icons-web-components/esm/components/swap-right';

import { type SuggestionItem } from '@tdesign/ai-chat-engine';
import { getClassPrefix } from '@tdesign/web-components-shared/_util/classname';
import { convertToLightDomNode } from '@tdesign/web-components-shared/_util/lightDom';
import { Component, tag } from 'omi';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

export type TdChatSuggestionContentProps = {
  content?: SuggestionItem[];
  handlePromptClick?: ({ event, content }: { event: MouseEvent; content: SuggestionItem }) => void;
};

type RenderSuggestionProps = TdChatSuggestionContentProps & { key?: string };

// 纯函数渲染器
export const renderSuggestion = ({ key, content, handlePromptClick }: RenderSuggestionProps) => (
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
    content: Array,
    handlePromptClick: Function,
  };

  render(props) {
    if (!props?.content) return;
    return renderSuggestion(props);
  }
}
