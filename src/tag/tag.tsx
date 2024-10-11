import 'tdesign-icons-web-components/esm/components/close';

import { classNames, Component, createRef, tag } from 'omi';

import { classPrefix } from '../_util/classname';
import { flexIcon } from '../_util/icon';
import { convertToLightDomNode } from '../_util/lightDom';
import { TagProps } from './type';

const TagClassNamePrefix = (className: string) => `${classPrefix}-tag${className}`;

@tag('t-tag')
export default class Tag extends Component<TagProps> {
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
    icon: String,
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
      cls={classNames(TagClassNamePrefix(`__icon-close`))}
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

    if (typeof icon === 'object' && 'attributes' in icon) {
      icon.attributes.style = {};
      icon.attributes.style.marginRight = 4;
    }

    return (
      <span
        class={this.cls()}
        part="my-part"
        ref={this.span}
        onClick={this.handleClick}
        className={innerClass}
        style={
          maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth, ...innerStyle } : innerStyle
        }
      >
        <>
          {icon}
          <span class={maxWidth ? TagClassNamePrefix(`--text`) : undefined} {...this.getTitle(children)}>
            {children ?? content}
          </span>
          {closable && !disabled && convertToLightDomNode(flexIcon(this.deleteIcon))}
        </>
      </span>
    );
  }
}
