import { isFunction } from 'lodash';
import { Component, createRef, signal, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { getScrollContainer } from '../_util/dom';
import { ScrollContainer, ScrollContainerElement, StyledProps, TNode } from '../common';

export interface TdAffixProps {
  children?: TNode;
  container?: ScrollContainer;
  content?: TNode;
  offsetBottom?: number;
  offsetTop?: number;
  zIndex?: number;
  onFixedChange?: (affixed: boolean, context: { top: number }) => void;
}
export interface AffixRef {
  handleScroll: () => void;
}
export interface AffixProps extends TdAffixProps, StyledProps, AffixRef {}

@tag('t-affix')
export default class Affix extends Component<AffixProps> {
  constructor() {
    super();
    this.props = {
      container: () => window,
      offsetBottom: 0,
      offsetTop: 0,
      ...this.props,
    };
  }

  innerOffsetTop = signal(0);

  inneroffsetBottom = signal(0);

  innerZIndex = signal(0);

  affixWrapRef = createRef<HTMLDivElement>();

  affixRef = createRef<HTMLDivElement>();

  scrollContainer = createRef<ScrollContainerElement>();

  placeholderEL = createRef<HTMLElement>();

  ticking = createRef<boolean>();

  handleScroll = () => {
    if (this.ticking.current) return;
    window.requestAnimationFrame(() => {
      let fixedTop: number | false;
      const wrapToTop = this.affixWrapRef.current.getBoundingClientRect().top || 0;
      const wrapWidth = this.affixWrapRef.current.getBoundingClientRect().width || 0;
      const wrapHeight = this.affixWrapRef.current.getBoundingClientRect().height || 0;
      let containerToTop = 0;
      if (this.scrollContainer.current instanceof HTMLElement) {
        containerToTop = this.scrollContainer.current.getBoundingClientRect().top;
      }
      const calcTop = wrapToTop - containerToTop;
      const containerHeight =
        this.scrollContainer.current[this.scrollContainer.current instanceof Window ? 'innerHeight' : 'clientHeight'] -
        wrapHeight;
      const calcBottom = containerToTop + containerHeight - (this.inneroffsetBottom.value ?? 0);
      if (this.innerOffsetTop.value !== undefined && calcTop <= this.innerOffsetTop.value) {
        fixedTop = containerToTop + this.innerOffsetTop.value;
      } else if (this.inneroffsetBottom.value !== undefined && wrapToTop >= calcBottom) {
        fixedTop = calcBottom;
      } else {
        fixedTop = false;
      }
      if (!this.affixRef) return;
      const affixed = fixedTop !== false;
      let placeholderStatus = this.affixWrapRef.current.contains(this.placeholderEL.current);
      const prePlaceholderStatus = placeholderStatus;
      if (affixed) {
        this.affixRef.current.className = `${getClassPrefix()}-affix`;
        this.affixRef.current.style.top = `${fixedTop}px`;
        this.affixRef.current.style.width = `${wrapWidth}px`;
        this.affixRef.current.style.height = `${wrapHeight}px`;
        if (this.innerZIndex.value) {
          this.affixRef.current.style.zIndex = `${this.innerZIndex.value}`;
        }
        if (!placeholderStatus) {
          this.placeholderEL.current.style.width = `${wrapWidth}px`;
          this.placeholderEL.current.style.height = `${wrapHeight}px`;
          this.affixWrapRef.current.appendChild(this.placeholderEL.current);
          placeholderStatus = true;
        }
      } else {
        this.affixRef.current.removeAttribute('class');
        this.affixRef.current.removeAttribute('style');
        if (placeholderStatus) {
          this.placeholderEL.current.remove();
          placeholderStatus = false;
        }
      }
      if (prePlaceholderStatus !== placeholderStatus && isFunction(this.props.onFixedChange)) {
        this.props.onFixedChange(affixed, { top: +fixedTop });
      }
      this.ticking.current = false;
    });
    this.ticking.current = true;
  };

  receiveProps(newProps: AffixProps) {
    const { offsetBottom, offsetTop, zIndex } = newProps;
    this.innerOffsetTop.value = offsetTop;
    this.inneroffsetBottom.value = offsetBottom;
    this.innerZIndex.value = zIndex;
    this.handleScroll();
    return true;
  }

  installed() {
    const { offsetBottom, offsetTop, zIndex, container } = this.props;
    this.innerOffsetTop.value = offsetTop;
    this.inneroffsetBottom.value = offsetBottom;
    this.innerZIndex.value = zIndex;
    this.placeholderEL.current = document.createElement('div');
    this.scrollContainer.current = getScrollContainer(container);
    if (this.scrollContainer.current) {
      this.handleScroll();
      this.scrollContainer.current.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleScroll);
    }
  }

  uninstalled() {
    this.scrollContainer.current.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  render() {
    const { children, content, style } = this.props;
    return (
      <div ref={this.affixWrapRef} className={this.className} style={style}>
        <div ref={this.affixRef}>{children || content}</div>
      </div>
    );
  }
}
