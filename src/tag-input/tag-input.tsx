import 'tdesign-icons-web-components/esm/components/close-circle-filled';
import '../input';
import '../tag';

import { Component, createRef, OmiProps, tag } from 'omi';

import classNames, { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { InputValue } from '../input';
import { TagInputValue, TdTagInputProps } from './type';

const classPrefix = getClassPrefix();

const TagInputClassNamePrefix = (className: string) => `${classPrefix}-tag-input${className}`;

export interface TagInputProps extends TdTagInputProps, StyledProps {}

interface DragSortProps<T> {
  sortOnDraggable: boolean;
  onDragSort?: (context: DragSortContext<T>) => void;
  onDragOverCheck?: {
    x?: boolean;
    targetClassNameRegExp?: RegExp;
  };
}

type DragFnType = (e?: DragEvent, index?: number, record?: any) => void;
interface DragSortInnerData {
  dragging?: boolean;
  draggable?: boolean;
  onDragStart?: DragFnType;
  onDragOver?: DragFnType;
  onDrop?: DragFnType;
  onDragEnd?: DragFnType;
}

interface DragSortInnerProps extends DragSortInnerData {
  getDragProps?: (index?: number, record?: any) => DragSortInnerData;
}

interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}

const isFunction = (arg: unknown) => typeof arg === 'function';

@tag('t-tag-input')
export default class TagInput extends Component<TagInputProps> {
  static css = `
    t-input::part(input-tag) {
      padding: 0;
      vertical-align: middle;
      -webkit-animation: t-fade-in .2s ease-in-out;
      animation: t-fade-in .2s ease-in-out;
      margin: 3px var(--td-comp-margin-xs) 3px 0;
    }

    t-input::part(input-tag-l) {
      height: var(--td-comp-size-m);
      font: var(--td-font-body-medium);
    }

    t-input::part(input-tag-s) {
      height: var(--td-comp-size-xxs);
      font: var(--td-font-body-small);
      margin: 1px var(--td-comp-margin-xs) 1px 0;
    }
  `;

  static defaultProps = {
    autoWidth: false,
    clearable: false,
    dragSort: false,
    excessTagsDisplayType: 'break-line',
    defaultInputValue: '',
    minCollapsedNum: 0,
    placeholder: undefined,
    readonly: false,
    size: 'medium',
    defaultValue: [],
  };

  static propTypes = {
    autoWidth: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    dragSort: Boolean,
    readonly: Boolean,

    excessTagsDisplayType: String,
    placeholder: String,
    size: String,
    status: String,
    max: Number,
    minCollapsedNum: Number,

    onBlur: Function,
    onChange: Function,
    onClear: Function,
    onClick: Function,
    onDragSort: Function,
    onEnter: Function,
    onFocus: Function,
    onInputChange: Function,
    onMouseenter: Function,
    onMouseleave: Function,
    onPaste: Function,
    onRemove: Function,
  };

  tagInputRef = createRef();

  tInputValue = '';

  oldInputValue = '';

  isHover = false;

  tagValue = [];

  mouseEnterTimer = null;

  scrollDistance = 0;

  scrollElement;

  draggingIndex = -1;

  dragStartData = null;

  isDropped = null;

  startInfo = { nodeX: 0, nodeWidth: 0, mouseX: 0 };

  isCompositionRef = createRef();

  install() {
    this.tagValue = this.props?.defaultValue || [];
  }

  installed() {
    this.initScroll(this.tagInputRef);
  }

  updateScrollElement = (element) => {
    [this.scrollElement] = element.current.children;
  };

  updateScrollDistance = () => {
    if (!this.scrollElement) return;
    this.scrollDistance = this.scrollElement.scrollWidth - this.scrollElement.clientWidth;
  };

  scrollTo = (options) => {
    if (isFunction(this.scrollElement?.scroll)) {
      this.scrollElement.scroll({ left: options.x, behavior: 'smooth' });
    }
  };

  scrollToRight = () => {
    this.updateScrollDistance();
    this.scrollTo({ x: this.scrollDistance, y: 0 });
  };

  scrollToLeft = () => {
    this.scrollTo({ x: 0, y: 0 });
  };

  // TODO：MAC 电脑横向滚动，Windows 纵向滚动。当前只处理了横向滚动
  onWheel = ({ e }: { e: WheelEvent }) => {
    if (this.props.readonly || this.props.disabled) return;
    if (!this.scrollElement) return;
    if (e?.deltaX && e.deltaX > 0) {
      const distance = Math.min(this.scrollElement.scrollLeft + 120, this.scrollDistance);
      this.scrollTo({ x: distance, y: 0 });
    } else {
      const distance = Math.max(this.scrollElement.scrollLeft - 120, 0);
      this.scrollTo({ x: distance, y: 0 });
    }
  };

  // 鼠标 hover，自动滑动到最右侧，以便输入新标签
  scrollToRightOnEnter = () => {
    if (this.props.excessTagsDisplayType !== 'scroll') return;
    // 一闪而过的 mousenter 不需要执行
    this.mouseEnterTimer = setTimeout(() => {
      this.scrollToRight();
      clearTimeout(this.mouseEnterTimer);
    }, 100);
  };

  scrollToLeftOnLeave = () => {
    if (this.props.excessTagsDisplayType !== 'scroll') return;
    this.scrollTo({ x: 0 });
    clearTimeout(this.mouseEnterTimer);
  };

  clearScroll = () => {
    clearTimeout(this.mouseEnterTimer);
  };

  initScroll = (element) => {
    if (!element) return;
    this.updateScrollElement(element);
  };

  private useDragSorter = <T,>(props: DragSortProps<T>): DragSortInnerProps => {
    const { sortOnDraggable, onDragSort, onDragOverCheck } = props;

    const onDragOver = (e, index, record) => {
      e.preventDefault();
      if (this.draggingIndex === index || this.draggingIndex === -1) return;
      if (onDragOverCheck?.targetClassNameRegExp && !onDragOverCheck?.targetClassNameRegExp.test(e.target?.className)) {
        return;
      }
      if (onDragOverCheck?.x) {
        if (!this.startInfo.nodeWidth) return;

        const { x, width } = e.target.getBoundingClientRect();
        const targetNodeMiddleX = x + width / 2;
        const clientX = e.clientX || 0;
        const draggingNodeLeft = clientX - (this.startInfo.mouseX - this.startInfo.nodeX);
        const draggingNodeRight = draggingNodeLeft + this.startInfo.nodeWidth;

        let overlap = false;
        if (draggingNodeLeft > x && draggingNodeLeft < x + width) {
          overlap = draggingNodeLeft < targetNodeMiddleX;
        } else {
          overlap = draggingNodeRight > targetNodeMiddleX;
        }
        if (!overlap) return;
      }
      onDragSort?.({
        currentIndex: this.draggingIndex,
        current: this.dragStartData,
        target: record,
        targetIndex: index,
      });
      this.draggingIndex = index;
    };

    if (!sortOnDraggable) {
      return {};
    }

    const onDragStart = (e, index, record: T) => {
      this.draggingIndex = index;
      this.dragStartData = record;
      if (onDragOverCheck) {
        const { x, width } = e.target.getBoundingClientRect();
        this.startInfo = {
          nodeX: x,
          nodeWidth: width,
          mouseX: e.clientX || 0,
        };
      }
    };

    const onDrop = () => {
      this.isDropped = true;
    };

    const onDragEnd = () => {
      if (!this.isDropped) {
        // 取消排序，待扩展 api，输出 dragStartData
      }
      this.isDropped = false;
      this.draggingIndex = -1;
      this.dragStartData = null;
    };

    const getDragProps = (index, record: T) => {
      if (sortOnDraggable) {
        return {
          draggable: true,
          onDragStart: (e) => {
            onDragStart(e, index, record);
          },
          onDragOver: (e) => {
            onDragOver(e, index, record);
          },
          onDrop: () => {
            onDrop();
          },
          onDragEnd: () => {
            onDragEnd();
          },
        };
      }
      return {};
    };

    return { onDragStart, onDragOver, onDrop, onDragEnd, getDragProps, dragging: this.draggingIndex !== -1 };
  };

  private onClose = (p: { e?: MouseEvent; index: number; item: string | number }) => {
    const { props, tagValue } = this;
    const arr = [...tagValue];
    arr.splice(p.index, 1);
    this.tagValue = arr;
    props?.onChange &&
      props?.onChange?.(arr, {
        ...p,
        trigger: 'tag-remove',
      });
    props?.onRemove && props?.onRemove?.({ e: p?.e, index: p.index, item: p.item, trigger: 'tag-remove', value: arr });
    this.update();
  };

  // 按下回退键，删除标签
  private onInputBackspaceKeyDown = (value: InputValue, context: { e: KeyboardEvent }) => {
    const { tagValue, props, tInputValue, isCompositionRef } = this;
    if (!context) return;
    const { e } = context;
    if (!tagValue || !tagValue.length) return;
    // 回车键删除，输入框值为空时，才允许 Backspace 删除标签
    // 当输入中文拼音时，如果输入的拼音内容未转换为中文时，tInputValue 的内容为空，此时按Backspace键会触发删除标签的情况，而不是只删除输入框内的中文拼音
    if (!tInputValue && !isCompositionRef.current && ['Backspace', 'NumpadDelete'].includes(e.key)) {
      const index = tagValue.length - 1;
      const item = tagValue[index];
      const trigger = 'backspace';
      const newValue = tagValue.slice(0, -1);
      this.tagValue = newValue;
      props?.onChange && props?.onChange(newValue, { e, index, item, trigger });
      props?.onRemove && props?.onRemove?.({ e, index, item, trigger, value: newValue });
      this.update();
    }
  };

  private clearAll = (e) => {
    const { props } = this;
    this.tagValue = [];
    this.tInputValue = '';
    props?.onChange && props.onChange([], { e, trigger: 'clear' });
    this.update();
  };

  private onClearClick = (e: MouseEvent) => {
    this.clearAll(e);
    this.props.onClear?.({ e });
  };

  private onInnerClick = (context: { e: MouseEvent }) => {
    console.log('innerClick');
    const { props, tagInputRef } = this;
    if (!props.disabled && !props.readonly) {
      (tagInputRef.current as any).inputElement?.focus?.();
    }
    props.onClick?.(context);
  };

  private onInnerEnter = (value: InputValue, context: { e: KeyboardEvent }) => {
    const { tagValue, props } = this;
    const valueStr = value ? String(value).trim() : '';
    let newValue: TagInputValue = tagValue;
    const isLimitExceeded = props.max && tagValue?.length >= props.max;
    if (valueStr && !isLimitExceeded) {
      newValue = tagValue instanceof Array ? tagValue.concat(String(valueStr)) : [valueStr];
    }
    this.tInputValue = '';
    props.onChange?.(newValue, {
      ...context,
      trigger: 'enter',
    });
    this.tagValue = newValue;
    props?.onEnter?.(newValue, { ...context, inputValue: value });
    this.update();
  };

  private onInputEnter = (value: InputValue, context: { e: KeyboardEvent }) => {
    !this.isCompositionRef.current && this.onInnerEnter(value, context);
    this.scrollToRight();
  };

  private addHover = (context) => {
    const { props } = this;
    if (props.readonly || props.disabled) return;
    this.isHover = true;
    this.update();
    props.onMouseenter?.(context);
  };

  private cancelHover = (context) => {
    const { props } = this;
    if (props.readonly || props.disabled) return;
    this.isHover = false;
    this.update();
    props.onMouseleave?.(context);
  };

  private onInputCompositionstart = (value: string, context: { e: CompositionEvent }) => {
    this.isCompositionRef.current = true;
    this.props.inputProps?.onCompositionstart?.(value, context);
  };

  private onInputCompositionend = (value: string, context: { e: CompositionEvent }) => {
    this.isCompositionRef.current = false;
    this.props.inputProps?.onCompositionend?.(value, context);
  };

  // 将对 tag-input 组件的 value 值进行受控处理提取到 render 之前
  beforeRender(): void {
    this.tagValue = this.props?.value ? this.props.value : this.tagValue;
  }

  render(props: OmiProps<TagInputProps>) {
    const {
      excessTagsDisplayType,
      autoWidth,
      readonly,
      disabled,
      clearable,
      placeholder,
      valueDisplay,
      label,
      inputProps,
      size,
      tips,
      status,
      suffixIcon,
      suffix,
      style,
      onPaste,
      onFocus,
      onBlur,
    } = props;

    const { tagValue } = this;

    const { getDragProps } = this.useDragSorter({
      ...props,
      sortOnDraggable: props.dragSort,
      onDragOverCheck: {
        x: true,
        targetClassNameRegExp: /^t-tag/,
      },
    });

    // 自定义 Tag 节点
    const displayNode = isFunction(valueDisplay)
      ? valueDisplay({
          value: tagValue,
          onClose: (index, item) => this.onClose({ index, item }),
        })
      : valueDisplay;

    const onInputBackspaceKeyUp = (value: InputValue) => {
      if (!tagValue || !tagValue.length) return;
      this.oldInputValue = value;
    };

    const renderLabel = ({ displayNode, label }) => {
      const newList = props.minCollapsedNum ? tagValue.slice(0, props.minCollapsedNum) : tagValue;
      const list = displayNode
        ? displayNode
        : newList?.map((item, index) => {
            const tagContent = isFunction(props.tag) ? props.tag({ value: item }) : props.tag;
            return (
              <t-tag
                part={`input-tag ${size === 'large' && 'input-tag-l'} ${size === 'small' && 'input-tag-s'}`}
                key={index}
                size={size}
                disabled={disabled}
                onClose={(context) => this.onClose({ e: context.e, item, index })}
                closable={!readonly && !disabled}
                {...getDragProps?.(index, item)}
                {...props.tagProps}
                style={{ margin: `` }}
                class={classNames(`${classPrefix}-tag`)}
              >
                {tagContent ?? item}
              </t-tag>
            );
          });
      if (label) {
        list?.unshift(
          <div class={`${classPrefix}-tag-input ${classPrefix}-tag-input__prefix`} key="label">
            {label}
          </div>,
        );
      }
      if (newList.length !== tagValue.length) {
        const len = tagValue.length - newList.length;
        const params = {
          value: tagValue,
          count: tagValue.length - props.minCollapsedNum,
          collapsedTags: tagValue.slice(props.minCollapsedNum, tagValue.length),
          collapsedSelectedItems: tagValue.slice(props.minCollapsedNum, tagValue.length),
          onClose: this.onClose,
        };
        const more = isFunction(props.collapsedItems) ? props.collapsedItems(params) : props.collapsedItems;
        if (more) {
          list.push(more);
        } else {
          list.push(<t-tag size={size}>+{len}</t-tag>);
        }
      }
      return list;
    };

    const tagInputPlaceholder = !tagValue?.length ? placeholder : '';

    const showClearIcon = Boolean(!readonly && !disabled && clearable && this.isHover && tagValue?.length);

    const suffixIconNode = showClearIcon ? (
      <t-icon-close-circle-filled
        class={classNames([
          `${classPrefix}-icon`,
          `${classPrefix}-icon-close-circle-filled `,
          TagInputClassNamePrefix(`__suffix-clear`),
        ])}
        onClick={this.onClearClick}
      />
    ) : (
      suffixIcon
    );

    const isEmpty = !(Array.isArray(tagValue) && tagValue.length);

    const classes = [
      `${classPrefix}-tag-input`,
      {
        [TagInputClassNamePrefix(`--break-line`)]: excessTagsDisplayType === 'break-line',
        [TagInputClassNamePrefix(`__with-suffix-icon`)]: !!suffixIconNode,
        [`${classPrefix}-is-empty`]: isEmpty,
        [TagInputClassNamePrefix(`--with-tag`)]: !isEmpty,
        [`${classPrefix}-input--auto-width`]: !!autoWidth,
        [`${classPrefix}-input__warp`]: !autoWidth,
      },
      props.className,
    ];

    return (
      <t-input
        ref={this.tagInputRef}
        value={this.tInputValue}
        onChange={(val) => {
          this.tInputValue = val;
          this.update();
        }}
        autoWidth={true} // 控制input_inner的宽度 设置为true让内部input不会提前换行
        onWheel={this.onWheel}
        size={size}
        readonly={readonly}
        disabled={disabled}
        label={renderLabel({ displayNode, label })}
        class={classNames(classes)}
        style={style}
        tips={tips}
        status={status}
        placeholder={tagInputPlaceholder}
        suffix={suffix}
        suffixIcon={suffixIconNode}
        showInput={!inputProps?.readonly || !tagValue || !tagValue?.length}
        keepWrapperWidth={!autoWidth}
        onPaste={onPaste}
        onEnter={this.onInputEnter}
        onMyKeydown={this.onInputBackspaceKeyDown}
        onMyKeyup={onInputBackspaceKeyUp}
        onMouseenter={(context) => {
          this.addHover(context);
          this.scrollToRightOnEnter();
        }}
        onMouseleave={(context) => {
          this.cancelHover(context);
          this.scrollToLeftOnLeave();
        }}
        onFocus={(inputValue, context) => {
          onFocus?.(tagValue, { e: context.e, inputValue });
        }}
        onBlur={(tInputValue, context) => {
          if (tInputValue) {
            this.tInputValue = '';
            this.update();
          }
          onBlur?.(tagValue, { e: context.e, inputValue: '' });
        }}
        onCompositionstart={this.onInputCompositionstart}
        onCompositionend={this.onInputCompositionend}
        {...inputProps}
      />
    );
  }
}
