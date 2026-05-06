import 'tdesign-icons-web-components/esm/components/close';

import { classNames, Component, createRef, tag } from 'omi';

import { classPrefix } from '../_util/classname';
import { flexIcon } from '../_util/icon';
import { convertToLightDomNode } from '../_util/lightDom';
import parseTNode from '../_util/parseTNode';
import { TagProps } from './type';

const TagClassNamePrefix = (className: string) => `${classPrefix}-tag${className}`;

@tag('t-tag')
export default class Tag extends Component<TagProps> {
  static isLightDOM = true;

  static css = [];

  static defaultProps = {
    closable: false,
    disabled: false,
    icon: undefined,
    shape: 'square',
    size: 'medium',
    theme: 'default',
    variant: 'dark',
    onClick: () => {},
    onClose: () => {},
  };

  static propTypes = {
    closable: Boolean,
    disabled: Boolean,

    children: String,
    content: String,
    icon: Object,
    maxWidth: String,
    shape: String,
    size: String,
    theme: String,
    variant: String,

    onClick: Function,
    onClose: Function,
  };

  span = createRef();

  cls() {
    return classNames(
      `${classPrefix}-tag`,
      TagClassNamePrefix(`--${this.props.theme}`),
      TagClassNamePrefix(`--${this.props.variant}`),
      {
        [TagClassNamePrefix(`--${this.props.shape}`)]: this.props.shape !== 'square',
        [TagClassNamePrefix(`--ellipsis`)]: !!this.props.maxWidth,
        [TagClassNamePrefix(`--disabled`)]: this.props.disabled,
        [`${classPrefix}-size-s`]: this.props.size === 'small',
        [`${classPrefix}-size-l`]: this.props.size === 'large',
      },
    );
  }

  deleteIcon = (
    <t-icon-close
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        if (this.props.disabled) return;
        e.stopImmediatePropagation();
        this.props.onClose(e);
      }}
      innerClass={classNames(TagClassNamePrefix(`__icon-close`))}
    />
  );

  handleClick = (e) => {
    if (this.props.disabled) return;
    this.props.onClick(e);
  };

  getTitle(children: any) {
    if (children && typeof children === 'object') return { title: children[0] };
  }

  render(props: TagProps) {
    const { disabled, maxWidth, icon, children, content, closable, innerStyle, innerClass } = props;

    const iconNode = icon ? convertToLightDomNode(flexIcon(parseTNode(icon))) : null;

    return (
      <span
        class={classNames(this.cls(), innerClass)}
        part="my-part"
        ref={this.span}
        onClick={this.handleClick}
        style={
          maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth, ...innerStyle } : innerStyle
        }
      >
        <>
          {iconNode}
          <span class={maxWidth ? TagClassNamePrefix(`--text`) : undefined} {...this.getTitle(children)}>
            {children ?? content}
          </span>
          {closable && !disabled && convertToLightDomNode(flexIcon(this.deleteIcon))}
        </>
      </span>
    );
  }
}
