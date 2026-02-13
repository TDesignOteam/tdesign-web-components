import 'tdesign-icons-web-components';
import '../input';
import '../tag';

import { Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
import { tagInputDefaultProps } from './defaultProps';
import { TagInputChangeContext, TagInputValue, TdTagInputProps } from './type';

const className = `${getClassPrefix()}-tag-input`;

export type TagInputProps = TdTagInputProps;

@tag('t-tag-input')
export default class TagInput extends Component<TagInputProps> {
  static css = [];

  static defaultProps = tagInputDefaultProps;

  static propTypes = {
    value: Array,
    defaultValue: Array,
    inputValue: [String, Number],
    defaultInputValue: [String, Number],
    label: String,
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    max: Number,
    minCollapsedNum: Number,
    excessTagsDisplayType: String,
    size: String,
    status: String,
    tips: String,
    autoWidth: Boolean,
    valueDisplay: [String, Function],
    collapsedItems: [String, Function],
    options: Array,
    onChange: Function,
    onInputChange: Function,
    onEnter: Function,
    onExceed: Function,
    onRemove: Function,
    onClear: Function,
    onFocus: Function,
    onBlur: Function,
  };

  // 内部状态
  private innerTags: TagInputValue = [];

  private innerInputValue: string = '';

  private isHover = false;

  private inputRef = createRef<HTMLElement>();

  private scrollElement: HTMLElement | null = null;

  private scrollDistance = 0;

  private mouseEnterTimer: ReturnType<typeof setTimeout> | null = null;

  private get isTagsControlled() {
    return Reflect.has(this.props, 'value') && this.props.value !== null && this.props.value !== undefined;
  }

  private get isInputControlled() {
    return (
      Reflect.has(this.props, 'inputValue') && this.props.inputValue !== null && this.props.inputValue !== undefined
    );
  }

  private get tags(): TagInputValue {
    return this.isTagsControlled ? this.props.value ?? [] : this.innerTags;
  }

  private get inputVal(): string {
    return this.isInputControlled ? String(this.props.inputValue ?? '') : this.innerInputValue;
  }

  install() {
    this.innerInputValue = String(this.props.defaultInputValue ?? '');
  }

  ready() {
    // defaultValue不在install()而在ready()中读取，是因为install()时omi-reactify的update()还没执行，复杂类型的props未被设置
    this.innerTags = this.props.defaultValue ?? [];
    this.initScroll();
  }

  uninstall() {
    if (this.mouseEnterTimer) {
      clearTimeout(this.mouseEnterTimer);
      this.mouseEnterTimer = null;
    }
  }

  private initScroll() {
    if (this.inputRef.current) {
      this.scrollElement = this.inputRef.current.children?.[0] as HTMLElement;
    }
  }

  // 计算最大可滚动距离
  private updateScrollDistance() {
    if (!this.scrollElement) return;
    this.scrollDistance = this.scrollElement.scrollWidth - this.scrollElement.clientWidth;
  }

  private doScrollTo(distance: number) {
    if (this.scrollElement?.scroll) {
      this.scrollElement.scroll({ left: distance, behavior: 'smooth' });
    }
  }

  private scrollToRight() {
    this.updateScrollDistance();
    this.doScrollTo(this.scrollDistance);
  }

  private scrollToLeft() {
    this.doScrollTo(0);
  }

  // 处理鼠标滚轮事件
  private onWheel = (eventOrContext: WheelEvent | { e: WheelEvent }) => {
    const { readonly, disabled, excessTagsDisplayType } = this.props;
    if (readonly || disabled) return;
    if (!this.scrollElement) return;
    if (excessTagsDisplayType !== 'scroll') return;

    const e = eventOrContext instanceof WheelEvent ? eventOrContext : eventOrContext.e;
    this.updateScrollDistance();
    if (e.deltaX > 0 || e.deltaY > 0) {
      const distance = Math.min(this.scrollElement.scrollLeft + 120, this.scrollDistance);
      this.doScrollTo(distance);
    } else {
      const distance = Math.max(this.scrollElement.scrollLeft - 120, 0);
      this.doScrollTo(distance);
    }
  };

  private scrollToRightOnEnter() {
    if (this.props.excessTagsDisplayType !== 'scroll') return;
    this.mouseEnterTimer = setTimeout(() => {
      this.scrollToRight();
    }, 100);
  }

  private scrollToLeftOnLeave() {
    if (this.props.excessTagsDisplayType !== 'scroll') return;
    this.scrollToLeft();
    if (this.mouseEnterTimer) {
      clearTimeout(this.mouseEnterTimer);
      this.mouseEnterTimer = null;
    }
  }

  // 事件派发
  private fireChange(value: TagInputValue, context: TagInputChangeContext) {
    if (!this.isTagsControlled) {
      this.innerTags = value;
    }
    this.fire('change', { value, context }, { bubbles: true, composed: true });
    this.update();
  }

  private fireInputChange(value: string, context: { e?: Event; trigger?: 'input' | 'clear' | 'enter' | 'blur' }) {
    if (!this.isInputControlled) {
      this.innerInputValue = value;
    }
    this.fire('inputChange', { value, context }, { bubbles: true, composed: true });
    this.update();
  }

  // 交互
  private handleEnter = (value: string, context: { e: KeyboardEvent }) => {
    const v = value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').trim();
    if (!v) return;
    const { max } = this.props;
    if (max != null && this.tags.length >= max) {
      this.fire('exceed', { value: this.tags, inputValue: v, e: context.e }, { bubbles: true, composed: true });
      return;
    }

    const tags = [...this.tags, v];
    this.fireChange(tags, { trigger: 'enter', item: v, e: context.e });
    this.fireInputChange('', { e: context.e, trigger: 'enter' });
    this.fire('enter', { value: tags, inputValue: v, e: context.e }, { bubbles: true, composed: true });
    this.scrollToRight();
  };

  private handleBackspace = (_value: string, context: { e: KeyboardEvent }) => {
    if (context.e.key !== 'Backspace') return;
    // 输入框有值时不删tag
    if (this.inputVal) return;
    if (!this.tags.length) return;

    const index = this.tags.length - 1;
    const item = this.tags[index];
    const tags = this.tags.slice(0, -1);
    this.fireChange(tags, { trigger: 'backspace', index, item, e: context.e });
    this.fire(
      'remove',
      { value: tags, index, item, trigger: 'backspace', e: context.e },
      { bubbles: true, composed: true },
    );
  };

  private handleTagClose = (index: number, e?: MouseEvent) => {
    const item = this.tags[index];
    const tags = [...this.tags];
    tags.splice(index, 1);
    this.fireChange(tags, { trigger: 'tag-remove', index, item, e });
    this.fire('remove', { value: tags, index, item, trigger: 'tag-remove' }, { bubbles: true, composed: true });
  };

  private handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    this.fireChange([], { trigger: 'clear', e });
    this.fireInputChange('', { e, trigger: 'clear' });
    this.fire('clear', { e }, { bubbles: true, composed: true });
  };

  private handleInputChange = (value: string, context?: { e?: Event }) => {
    this.fireInputChange(value, { e: context?.e, trigger: 'input' });
  };

  private handleMouseEnter = () => {
    this.isHover = true;
    this.update();
    this.scrollToRightOnEnter();
  };

  private handleMouseLeave = () => {
    this.isHover = false;
    this.update();
    this.scrollToLeftOnLeave();
  };

  // render
  private renderLabel() {
    const { valueDisplay, label } = this.props;

    if (valueDisplay) {
      const onClose = (index: number) => this.handleTagClose(index);
      if (typeof valueDisplay === 'function') {
        return valueDisplay(this.tags, onClose);
      }
      return valueDisplay;
    }

    const { minCollapsedNum, tagProps, disabled, readonly, size, collapsedItems, options } = this.props;
    let displayTags = this.tags;
    let collapsedCount = 0;
    if (minCollapsedNum != null && minCollapsedNum > 0 && this.tags.length > minCollapsedNum) {
      displayTags = this.tags.slice(0, minCollapsedNum);
      collapsedCount = this.tags.length - minCollapsedNum;
    }

    const list: any[] = [];

    if (label) {
      list.push(
        <div key="label" class={`${className}__prefix`}>
          {label}
        </div>,
      );
    }

    const isLastTag = (idx: number) => idx === displayTags.length - 1 && collapsedCount === 0;
    // 禁用动画，防止update时tag闪烁
    const noAnimationStyle = { animationName: 'none' };

    displayTags.forEach((item, index) => {
      list.push(
        <t-tag
          key={index}
          size={size}
          closable={!disabled && !readonly}
          disabled={disabled}
          innerStyle={isLastTag(index) ? noAnimationStyle : { ...noAnimationStyle, marginRight: '4px' }}
          onClose={(e: any) => {
            const event = e?.e ?? e;
            this.handleTagClose(index, event);
          }}
          {...(tagProps || {})}
        >
          {item}
        </t-tag>,
      );
    });

    // 当tags数超过minCollapsedNum时，优先尝试调用collapsedItems（用户自定义的折叠样式），否则调用默认的“+N”样式
    if (collapsedCount > 0) {
      // 透传options，让collapsedItems能拿到完整的options内容
      const collapsedOptions = Array.isArray(options) ? options : this.tags;
      const collapsedParams = {
        value: this.tags,
        collapsedSelectedItems: collapsedOptions.slice(minCollapsedNum),
        count: collapsedCount,
        onClose: (context: { index: number; e?: MouseEvent }) => this.handleTagClose(context.index, context.e),
      };

      const collapsedNode = typeof collapsedItems === 'function' ? collapsedItems(collapsedParams) : collapsedItems;

      list.push(
        collapsedNode ?? (
          <t-tag key="collapsed" size={size} disabled={disabled} innerStyle={noAnimationStyle}>
            +{collapsedCount}
          </t-tag>
        ),
      );
    }

    return list;
  }

  render(props: TdTagInputProps | OmiProps<TdTagInputProps, any>) {
    const { clearable, disabled, readonly, placeholder, size, status, tips, suffixIcon, excessTagsDisplayType } = props;
    const showClear = clearable && this.isHover && !disabled && !readonly && (this.tags.length > 0 || this.inputVal);
    const placeholderText = this.tags.length ? '' : placeholder;
    const suffixNode = showClear ? (
      <t-icon-close-circle-filled
        class={`${className}__suffix-clear`}
        onClick={this.handleClear}
        onMouseDown={(e: MouseEvent) => e.preventDefault()}
      />
    ) : (
      suffixIcon
    );
    const isEmpty = this.tags.length === 0;
    // 处理自动换行时的input宽度自适应
    const needAutoExpand = excessTagsDisplayType === 'break-line' && !isEmpty;
    const innerClass = classname(className, {
      [`${getClassPrefix()}-is-empty`]: isEmpty,
      [`${className}--break-line`]: excessTagsDisplayType === 'break-line',
      [`${className}--scroll`]: excessTagsDisplayType === 'scroll',
      [`${className}--with-tag`]: !isEmpty,
    });

    return (
      <t-input
        ignoreFire
        fitHeight
        ref={this.inputRef}
        innerClass={innerClass}
        value={this.inputVal}
        label={this.renderLabel()}
        placeholder={placeholderText}
        disabled={disabled}
        readonly={readonly}
        size={size}
        status={status}
        tips={tips}
        suffixIcon={suffixNode}
        autoWidth={props.autoWidth}
        autoExpandWidth={needAutoExpand}
        onChange={this.handleInputChange}
        onEnter={this.handleEnter}
        onMyKeydown={this.handleBackspace}
        onWheel={this.onWheel}
        onMouseenter={this.handleMouseEnter}
        onMouseleave={this.handleMouseLeave}
        onFocus={(value: string, context: { e: FocusEvent }) => {
          this.fire('focus', { value: this.tags, inputValue: value, e: context.e }, { bubbles: true, composed: true });
        }}
        onBlur={(value: string, context: { e: FocusEvent }) => {
          if (this.inputVal) {
            this.fireInputChange('', { e: context.e, trigger: 'blur' });
          }
          this.fire('blur', { value: this.tags, inputValue: value, e: context.e }, { bubbles: true, composed: true });
        }}
      />
    );
  }
}
