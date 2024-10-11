import 'tdesign-icons-web-components/esm/components/align-top';

import { Component, createRef, OmiProps, signal, SignalValue, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { scrollTo } from '../_util/dom';
import { AttachNode, StyledProps } from '../common';
import { TdBackTopProps } from './type';

export interface BackTopProps extends TdBackTopProps, StyledProps {}

const getContainer = (container: string | Function) => {
  if (typeof container === 'string') {
    if (typeof document !== 'undefined') {
      return document.querySelector(container);
    }
  }
  if (typeof container === 'function') {
    return container();
  }
  return null;
};

interface ClickEventProps {
  target?: AttachNode;
  container?: AttachNode;
  duration?: number;
  onClick?: OmiProps<BackTopProps>['onClick'];
  e: MouseEvent;
}

@tag('t-back-top')
export default class BackTop extends Component<BackTopProps> {
  static css = [];

  buttonRef = createRef<any>();

  containerRef = createRef<any>();

  visible: SignalValue<boolean> = signal(false);

  needUninstall: Set<Function> = new Set<Function>();

  cls: SignalValue<string> = signal('');

  static propTypes = {
    container: Object,
    content: [String, Number, Object, Function],
    default: Object,
    duration: Number,
    offset: Object,
    shape: Object,
    size: String,
    target: Object,
    theme: String,
    visibleHeight: Object,
    onClick: Function,
    ignoreAttributes: Object,
  };

  static defaultProps = {
    container: 'body',
    duration: 200,
    offset: ['24px', '80px'],
    shape: 'square',
    size: 'medium',
    target: 'body',
    theme: 'light',
    visibleHeight: '200px',
  };

  getBackTo(target: AttachNode, container: AttachNode): number {
    if (target === container) return 0;
    if (target === 'body') return 0;
    if (!target) return 0;
    const targetElement = getContainer(target);
    if (!targetElement) return 0;
    return (targetElement as HTMLElement).getBoundingClientRect().y;
  }

  handleClick(clickEventProps: ClickEventProps) {
    const { target, container, duration, onClick, e } = { ...clickEventProps };
    e.stopPropagation();
    const y = this.getBackTo(target, container);
    scrollTo(y, { container: this.containerRef.current, duration });
    onClick?.({ e });
  }

  ready() {
    const { container, visibleHeight } = this.props;
    const scrollTop = signal(0);
    const scrollContainer = getContainer(container);
    this.containerRef.current = scrollContainer;
    const updateScrollTop = () => {
      if (scrollContainer === document) {
        scrollTop.value = scrollContainer.documentElement.scrollTop;
      } else {
        scrollTop.value = (scrollContainer as HTMLElement).scrollTop;
      }
    };

    const updateVisible = () => {
      if (typeof visibleHeight === 'string') {
        this.visible.value = scrollTop.value >= Number(visibleHeight.replace('px', ''));
        return;
      }
      this.visible.value = scrollTop.value >= visibleHeight;
    };

    const updateEachScroll = () => {
      updateScrollTop();
      updateVisible();
    };
    scrollContainer.addEventListener('scroll', updateEachScroll);

    const scrollListenerUninstall = () => {
      scrollContainer.removeEventListener('scroll', updateEachScroll);
    };

    this.needUninstall.add(scrollListenerUninstall);
  }

  uninstall(): void {
    this.needUninstall.forEach((uninstall) => {
      uninstall();
    });
  }

  render(props: OmiProps<BackTopProps>) {
    const {
      theme,
      target,
      shape,
      size,
      container,
      duration,
      content,
      offset,
      children,
      default: cusContent,
      onClick,
      innerClass,
      innerStyle,
      ignoreAttributes,
    } = props;
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    const backTopStyle = {
      insetInlineEnd: offset[0],
      insetBlockEnd: offset[1],
      ...innerStyle,
    };
    const classPrefix = getClassPrefix();
    const defaultContent = (
      <>
        <t-icon-align-top className={`${classPrefix}-back-top__icon`} />
        <span className={`${classPrefix}-back-top__text`}>TOP</span>
      </>
    );
    this.cls.value = classname(
      `${classPrefix}-back-top`,
      `${classPrefix}-back-top--theme-${theme}`,
      `${classPrefix}-back-top--${shape}`,
      {
        [`${classPrefix}-back-top--show`]: this.visible.value,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-m`]: size === 'medium',
      },
      innerClass,
    );
    const renderChildren = children || content || cusContent || defaultContent;
    const clickEventProps = { target, container, duration, onClick } as ClickEventProps;
    return (
      <button
        ref={this.buttonRef}
        type="button"
        className={this.cls.value}
        style={backTopStyle}
        onClick={(e) => this.handleClick({ e, ...clickEventProps })}
      >
        {renderChildren}
      </button>
    );
  }
}
