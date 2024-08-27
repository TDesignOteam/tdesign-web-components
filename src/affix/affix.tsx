import { isFunction } from 'lodash';
import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { getScrollContainer } from '../_util/dom';
import { ScrollContainerElement, StyledProps } from '../common';
import { AffixRef, TdAffixProps } from './type';

export interface AffixProps extends TdAffixProps, StyledProps, AffixRef {}

@tag('t-affix')
export default class Affix extends Component<AffixProps> {
  static defaultProps = { container: () => window, offsetBottom: 0, offsetTop: 0 };

  static propsType = {
    children: [Function, Object, String, Number],
    container: [Function, Object, String, Number],
    content: [Function, Object, String, Number],
    offsetBottom: Number,
    offsetTop: Number,
    zIndex: Number,
    onFixedChange: Function,
  };

  innerOffsetTop = 0;

  inneroffsetBottom = 0;

  innerZIndex = 0;

  affixWrapRef = createRef<HTMLDivElement>();

  affixRef = createRef<HTMLDivElement>();

  scrollContainer: ScrollContainerElement = null;

  placeholderEL: HTMLDivElement = null;

  ticking = false;

  handleScroll = () => {
    if (this.ticking) return;
    window.requestAnimationFrame(() => {
      let fixedTop: number | false;
      const wrapToTop = this.affixWrapRef.current.getBoundingClientRect().top || 0;
      const wrapWidth = this.affixWrapRef.current.getBoundingClientRect().width || 0;
      const wrapHeight = this.affixWrapRef.current.getBoundingClientRect().height || 0;
      let containerToTop = 0;
      if (this.scrollContainer instanceof HTMLElement) {
        containerToTop = this.scrollContainer.getBoundingClientRect().top;
      }
      const calcTop = wrapToTop - containerToTop;
      const containerHeight =
        this.scrollContainer[this.scrollContainer instanceof Window ? 'innerHeight' : 'clientHeight'] - wrapHeight;
      const calcBottom = containerToTop + containerHeight - (this.inneroffsetBottom ?? 0);
      if (this.innerOffsetTop !== undefined && calcTop <= this.innerOffsetTop) {
        fixedTop = containerToTop + this.innerOffsetTop;
      } else if (this.inneroffsetBottom !== undefined && wrapToTop >= calcBottom) {
        fixedTop = calcBottom;
      } else {
        fixedTop = false;
      }
      if (!this.affixRef) return;
      const affixed = fixedTop !== false;
      let placeholderStatus = this.affixWrapRef.current.contains(this.placeholderEL);
      const prePlaceholderStatus = placeholderStatus;
      if (affixed) {
        this.affixRef.current.className = `${getClassPrefix()}-affix`;
        this.affixRef.current.style.top = `${fixedTop}px`;
        this.affixRef.current.style.width = `${wrapWidth}px`;
        this.affixRef.current.style.height = `${wrapHeight}px`;
        if (this.innerZIndex) {
          this.affixRef.current.style.zIndex = `${this.innerZIndex}`;
        }
        if (!placeholderStatus) {
          this.placeholderEL.style.width = `${wrapWidth}px`;
          this.placeholderEL.style.height = `${wrapHeight}px`;
          this.affixWrapRef.current.appendChild(this.placeholderEL);
          placeholderStatus = true;
        }
      } else {
        this.affixRef.current.removeAttribute('class');
        this.affixRef.current.removeAttribute('style');
        if (placeholderStatus) {
          this.placeholderEL.remove();
          placeholderStatus = false;
        }
      }
      if (prePlaceholderStatus !== placeholderStatus && isFunction(this.props.onFixedChange)) {
        this.props.onFixedChange(affixed, { top: +fixedTop });
      }
      this.ticking = false;
    });
    this.ticking = true;
  };

  receiveProps(newProps: AffixProps) {
    const { offsetBottom, offsetTop, zIndex } = newProps;
    this.innerOffsetTop = offsetTop;
    this.inneroffsetBottom = offsetBottom;
    this.innerZIndex = zIndex;
    this.handleScroll();
    return true;
  }

  installed() {
    const { offsetBottom, offsetTop, zIndex, container } = this.props;
    this.innerOffsetTop = offsetTop;
    this.inneroffsetBottom = offsetBottom;
    this.innerZIndex = zIndex;
    this.placeholderEL = document.createElement('div');
    this.scrollContainer = getScrollContainer(container);
    if (this.scrollContainer) {
      this.handleScroll();
      this.scrollContainer.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleScroll);
    }
  }

  uninstalled() {
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
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
