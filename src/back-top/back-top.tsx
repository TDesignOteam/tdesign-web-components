import 'tdesign-web-components/icon';

import { Component, computed, createRef, effect, OmiProps, signal, SignalValue, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { scrollTo } from '../_util/dom.ts';
import { StyledProps } from '../common';
import { styleSheet } from './style';
import { TdBackTopProps } from './type.ts';

type Element = HTMLElement | Window | Document;

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

@tag('t-back-top')
export default class BackTop extends Component<BackTopProps> {
  static css = styleSheet;

  buttonRef: Partial<Record<'current', Element>> = createRef();

  containerRef: Partial<Record<'current', Element>> = createRef();

  visible: SignalValue<boolean> = signal(false);

  needUninstall: Set<Function> = new Set<Function>();

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

  ready() {
    const { container, visibleHeight } = this.props;
    const scrollTop = signal(0);
    const scrollContainer = getContainer(container);
    this.containerRef.current = scrollContainer;
    const updateScrollTop = () => {
      if (scrollContainer === document) {
        scrollTop.value = scrollContainer.documentElement.scrollTop;
      } else {
        scrollTop.value = scrollContainer.scrollTop;
      }
    };
    const updateVisible = () => {
      if (typeof visibleHeight === 'string') {
        this.visible.value = scrollTop.value >= Number(visibleHeight.replace('px', ''));
        return;
      }
      this.visible.value = scrollTop.value >= visibleHeight;
    };
    scrollContainer.addEventListener('scroll', updateScrollTop);
    const scrollListenerUninstall = () => {
      scrollContainer.removeEventListener('scroll', updateScrollTop);
    };
    const visibleUninstall: Function = effect(updateVisible);

    this.needUninstall.add(scrollListenerUninstall);
    this.needUninstall.add(visibleUninstall);
  }

  uninstall(): void {
    this.needUninstall.forEach((uninstall) => {
      uninstall();
    });
  }

  render(props: OmiProps<BackTopProps>) {
    const {
      theme,
      size,
      shape,
      target,
      container,
      duration,
      content,
      offset,
      children,
      default: cusContent,
      className,
      style,
      onClick,
      ignoreAttributes,
    } = props;
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    const backTopStyle: SignalValue<Object> = computed(() => ({
      insetInlineEnd: offset[0],
      insetBlockEnd: offset[1],
      ...style,
    }));
    const classPrefix = getClassPrefix();
    const cls = computed(() =>
      classname(
        `${classPrefix}-back-top`,
        `${classPrefix}-back-top--theme-${theme}`,
        `${classPrefix}-back-top--${shape}`,
        {
          [`${classPrefix}-back-top--show`]: this.visible.value,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-m`]: size === 'medium',
        },
        className,
      ),
    );
    const defaultContent = (
      <>
        <t-icon name="align-top" className={`${classPrefix}-back-top__icon`} />
        <span className={`${classPrefix}-back-top__text`}>TOP</span>
      </>
    );
    const renderChildren = children || content || cusContent || defaultContent;
    const getBackTo = (): number => {
      if (target === container) return 0;
      if (target === 'body') return 0;
      if (!target) return 0;
      const targetElement = getContainer(target);
      if (!targetElement) return 0;
      return (targetElement as HTMLElement).getBoundingClientRect().y;
    };
    const handleClick = (e: MouseEvent) => {
      const y = getBackTo();
      scrollTo(y, { container: this.containerRef.current, duration });
      onClick?.({ e });
    };
    return (
      <button ref={this.buttonRef} type="button" className={cls.value} style={backTopStyle.value} onClick={handleClick}>
        {renderChildren}
      </button>
    );
  }
}
