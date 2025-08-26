import 'tdesign-icons-web-components/esm/components/jump';
import '../../collapse';

import { Component, OmiProps, signal, tag } from 'omi';

import { getClassPrefix } from '../../_util/classname';
import { ChatMessageStatus, ReferenceItem } from '../../chat-engine';
import { TdChatContentProps } from '../../chatbot';
import { CollapseValue } from '../../collapse';

import styles from '../style/chat-item.less';

const className = `${getClassPrefix()}-chat__item`;

type SearchContent = {
  title?: string;
  references?: ReferenceItem[];
};
export type TdChatSearchContentProps = {
  key?: string;
  content?: SearchContent;
  status?: ChatMessageStatus | ((currentStatus: ChatMessageStatus | undefined) => ChatMessageStatus);
  onChange?: (value: CollapseValue) => void;
  handleSearchResultClick?: ({ event, content }: { event: MouseEvent; content: SearchContent }) => void;
  handleSearchItemClick?: ({ event, content }: { event: MouseEvent; content: ReferenceItem }) => void;
} & TdChatContentProps['search'];

// 纯函数渲染器
export const renderSearch = ({
  key,
  content,
  status,
  useCollapse = true,
  collapsed = true,
  handleSearchResultClick,
  handleSearchItemClick,
  onChange,
}: TdChatSearchContentProps) => {
  if (!content) return;
  const defaultCollapsed = collapsed ? [] : [1];
  const { references = [], title } = content;
  const titleText = status === 'stop' ? '搜索已终止' : title;

  if (!references?.length && status === 'complete') return null;

  const imgs = (
    <div className={`${className}__search-icons`}>
      {references.map(
        (item) =>
          item?.icon && <img key={item.url} className={`${className}__search-icon`} alt={item.title} src={item.icon} />,
      )}
    </div>
  );

  return (
    <div key={key} className={`${className}__search__wrapper`}>
      {useCollapse ? (
        <t-collapse
          className={`${className}__search`}
          expandIconPlacement="right"
          value={onChange ? defaultCollapsed : undefined}
          defaultValue={onChange ? undefined : defaultCollapsed}
          onChange={onChange}
        >
          <t-collapse-panel className={`${className}__search__content`}>
            <div className={`${className}__search-links`}>
              {references.map((item, i) => (
                <span
                  key={item.url}
                  className={`${className}__search-link-wrapper`}
                  onClick={(e) => {
                    handleSearchItemClick?.({ event: e, content: item });
                  }}
                >
                  <a target="_blank" href={item.url} className={`${className}__search-link`}>
                    {i + 1}. {item.title}
                  </a>
                  <t-icon-jump />
                </span>
              ))}
            </div>
            <div slot="header" className={`${className}__search__header__content`}>
              {titleText}
            </div>
          </t-collapse-panel>
        </t-collapse>
      ) : (
        <div
          className={`${className}__search__header`}
          onClick={(e) =>
            handleSearchResultClick?.({
              event: e,
              content,
            })
          }
        >
          {imgs}
          {titleText}
        </div>
      )}
    </div>
  );
};

// Web Component版本
@tag('t-chat-search-content')
export default class SearchContentComponent extends Component<TdChatSearchContentProps> {
  static css = styles;

  static propTypes = {
    content: Object,
    status: String,
    useCollapse: Boolean,
    collapsed: Boolean,
    handleSearchItemClick: Object,
    handleSearchResultClick: Object,
  };

  pCollapsed = signal(false);

  receiveProps(props: TdChatSearchContentProps | OmiProps<TdChatSearchContentProps, any>) {
    this.pCollapsed.value = props.collapsed || false;
  }

  onCollapsedChange = (e: CustomEvent<CollapseValue>) => {
    this.pCollapsed.value = !e.detail.length;
  };

  render(props) {
    return renderSearch({ ...props, collapsed: this.pCollapsed.value, onChange: this.onCollapsedChange });
  }
}
