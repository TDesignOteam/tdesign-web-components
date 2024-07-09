import 'tdesign-web-components/icon';

import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps, TElement, TNode } from '../common';
// import style from './style'
import { InputValue, TdInputProps } from './type';
import useLengthLimit from './useLengthLimit';

const classPrefix = getClassPrefix();

const InputClassNamePrefix = (name: string) => `${classPrefix}-input${name}`;

export interface InputProps extends TdInputProps, StyledProps {
  showInput?: boolean; // 控制透传readonly同时是否展示input 默认保留 因为正常Input需要撑开宽度
  keepWrapperWidth?: boolean; // 控制透传autoWidth之后是否容器宽度也自适应 多选等组件需要用到自适应但也需要保留宽度
  onMyKeydown?: (value: InputValue, context: { e: KeyboardEvent }) => void;
  onMyKeyup?: (value: InputValue, context: { e: KeyboardEvent }) => void;
}

export interface InputRef {
  currentElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  focus: () => void;
  blur: () => void;
  select: () => void;
}

// type InputContextTrigger = 'input' | 'clear' | 'initial';

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode | TElement) => {
  const result = parseTNode(icon);
  const iconClassName = icon ? `${classPrefix}-input__${type}-icon` : '';

  return result ? (
    <span class={classNames(InputClassNamePrefix(`__${type} ${iconClassName}`))}>{result}</span>
  ) : (
    <span></span>
  );
};

const isFunction = (arg: unknown) => typeof arg === 'function';

@tag('t-input')
export default class Input extends Component<InputProps> {
  static tagStyle = `.t-tag-input t-tag::part(my-part) {
    vertical-align: middle;
    -webkit-animation: t-fade-in .2s ease-in-out;
    animation: t-fade-in .2s ease-in-out;
    margin: 3px var(--td-comp-margin-xs) 3px 0;
    }
    .t-tag-input t-tag[size="small"]::part(my-part) {
      margin: 1px var(--td-comp-margin-xs) 1px 0;
    }
  `;

  //   static labelStyle = `
  //     .t-tag-input--break-line:not(.t-is-empty) .t-tag-input__prefix {
  //       vertical-align: middle;
  //     }

  //     .t-tag-input .t-tag-input__prefix {
  //       margin-left: var(--td-comp-margin-xs);
  //       line-height: 1;
  //     }

  //     .t-tag-input .t-tag-input__prefix {
  //       width: max-content;
  //       display: inline-block;
  //       margin-right: 8px;
  //     }
  //     `

  // static css = style + Input.tagStyle

  static defaultProps = {
    align: 'left',
    allowInputOverMax: false,
    autoWidth: false,
    autocomplete: undefined,
    autofocus: false,
    clearable: false,
    placeholder: '请输入',
    readonly: false,
    showClearIconOnEmpty: false,
    showLimitNumber: false,
    size: 'medium',
    status: undefined,
    type: 'text',
    defaultValue: '',
    borderless: false,
  };

  static propTypes = {
    allowInputOverMax: Boolean,
    autoWidth: Boolean,
    autofocus: Boolean,
    clearable: Boolean,
    disabled: Boolean,

    align: String,
    borderless: Boolean,
    autocomplete: String,
    value: String,
  };

  inputRef = createRef<HTMLElement>();

  inputPreRef = createRef<HTMLElement>();

  wrapperRef = createRef();

  composingRef = createRef();

  value;

  composingValue = '';

  status: TdInputProps['status'] = 'default';

  renderType = '';

  isFocused = false;

  isHover = false;

  eventPropsNames;

  eventProps;

  isKeyUpEvent = false;

  install() {
    // this.props.autoWidth = true
    this.value = this.props.defaultValue || this.props.value;
    this.status = this.props.status;
    // console.log(this.props)
  }

  installed() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.renderType = this.props.type;
    const inputNode = this.inputRef.current;
    const updateInputWidth = () => {
      if (!this.props.autoWidth || !this.inputRef.current) return;
      const { offsetWidth } = this.inputPreRef.current;
      const { width } = this.inputPreRef.current.getBoundingClientRect();
      // 异步渲染场景下 getBoundingClientRect 宽度为 0，需要使用 offsetWidth
      const calcWidth = width < offsetWidth ? offsetWidth + 1 : width;
      this.inputRef.current.style.width = `${calcWidth}px`;
    };

    if (that.props.autoWidth) {
      requestAnimationFrame(() => {
        updateInputWidth();
      });
    }

    inputNode.addEventListener('input', (e) => {
      if (that.composingRef.current) {
        return;
      }
      const target = e.currentTarget as any;
      that.value = target.value;
      const { getValueByLimitNumber, onValidateChange } = useLengthLimit({
        value: that.value === undefined ? undefined : String(that.value),
        status: that.status,
        maxlength: that.props.maxlength,
        maxcharacter: that.props.maxcharacter,
        allowInputOverMax: that.props.allowInputOverMax,
        onValidate: that.props.onValidate,
      });
      const limitedValue = getValueByLimitNumber(target.value);
      that.value = limitedValue;
      that.composingValue = limitedValue;
      that.props.onChange?.(limitedValue);
      if (!that.props.allowInputOverMax) {
        that.update();
      }
      if (that.props.autoWidth) {
        requestAnimationFrame(() => {
          updateInputWidth();
        });
      }
      onValidateChange();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(props: OmiProps<InputProps>, store: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const {
      // type,
      autoWidth,
      placeholder,
      disabled,
      status,
      size,
      class: className,
      // inputClass,
      // style,
      prefixIcon,
      suffixIcon,
      clearable,
      tips,
      align,
      borderless,
      maxlength,
      maxcharacter,
      showClearIconOnEmpty,
      autofocus,
      autocomplete,
      readonly,
      label,
      suffix,
      showInput = true,
      keepWrapperWidth,
      showLimitNumber,
      allowInputOverMax,
      // name,
      format,
      // onClick,
      onClear,
      onEnter,
      // onKeydown,
      // onKeyup,
      onKeypress,
      onFocus,
      onBlur,
      // onPaste,
      onMouseenter,
      onMouseleave,
      // onWheel,
      onCompositionstart,
      onCompositionend,
      onValidate,
      onChange,
      ...restProps
    } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limitNumber, getValueByLimitNumber, tStatus, onValidateChange } = useLengthLimit({
      value: this.value === undefined ? undefined : String(this.value),
      status,
      maxlength,
      maxcharacter,
      allowInputOverMax,
      onValidate,
    });

    const isShowClearIcon = ((clearable && this.value && !disabled) || showClearIconOnEmpty) && this.isHover;
    const prefixIconContent = renderIcon('t', 'prefix', parseTNode(prefixIcon));
    let suffixIconNew = suffixIcon;

    if (isShowClearIcon) {
      suffixIconNew = (
        <t-icon
          name={'close-circle-filled'}
          class={classNames(InputClassNamePrefix(`__suffix-clear`))}
          onClick={handleClear}
        />
      ) as any;
    }

    const suffixIconContent = renderIcon('t', 'suffix', parseTNode(suffixIconNew));
    const labelContent = isFunction(label) ? label() : label;
    const suffixContent = isFunction(suffix) ? suffix() : suffix;

    const limitNumberNode =
      limitNumber() && showLimitNumber ? (
        <div
          class={classNames(InputClassNamePrefix(`__limit-number`), {
            [`${classPrefix}-is-disabled`]: disabled,
          })}
        >
          {limitNumber()}
        </div>
      ) : null;

    // const curStatus = status || 'default'

    const innerValue = this.composingRef.current ? this.composingValue : this.value ?? '';
    const formatDisplayValue = format && !this.isFocused ? format(innerValue) : innerValue;
    const renderInput = (
      <input
        {...this.eventProps}
        ref={this.inputRef}
        placeholder={placeholder}
        type={this.renderType}
        class={'t-input__inner'}
        value={formatDisplayValue}
        readOnly={readonly}
        disabled={disabled}
        autoComplete={autocomplete ?? (autocomplete || undefined)}
        autoFocus={autofocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // onPaste={handlePaste}
        // name={name}
        // style="width: 0px;"
      />
    );
    const renderInputNode = (
      <div
        class={classNames(`${classPrefix}-input`, {
          [`${classPrefix}-is-readonly`]: readonly,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: this.isFocused,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-align-${align}`]: align,
          [`${classPrefix}-is-${tStatus}`]: tStatus && tStatus !== 'default',
          [InputClassNamePrefix(`--prefix`)]: prefixIcon || labelContent,
          [InputClassNamePrefix(`--suffix`)]: suffixIconContent || suffixContent,
          [InputClassNamePrefix(`--borderless`)]: borderless,
          [InputClassNamePrefix(`--focused`)]: this.isFocused,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // onWheel={(e) => onWheel?.({ e })}
        // onClick={(e) => {
        //   inputRef.current?.focus();
        //   onClick?.({ e });
        // }}
      >
        {prefixIconContent}
        {/* {null} */}
        {labelContent ? <div class={classNames(InputClassNamePrefix(`__prefix`))}>{labelContent}</div> : null}
        {showInput && renderInput}

        {autoWidth && (
          <span ref={this.inputPreRef} class={classNames(InputClassNamePrefix(`__input-pre`))}>
            {innerValue || placeholder}
          </span>
        )}

        {suffixContent || limitNumberNode ? (
          <div class={classNames(InputClassNamePrefix(`__suffix`))}>
            {suffixContent}
            {limitNumberNode}
          </div>
        ) : null}
        {suffixIconContent}
      </div>
    );

    function handleChange(e) {
      let { value: newStr } = e.currentTarget;
      if (that.composingRef.current) {
        that.composingValue = newStr;
        console.log('composing');
      } else {
        if (props.type !== 'number') {
          newStr = getValueByLimitNumber(newStr);
        }
        // 完成中文输入时同步一次 composingValue
        that.composingValue = newStr;
        // 防止输入中文后移开光标触发mouseleave时value没更新
        that.value = newStr;
        const { onValidateChange } = useLengthLimit({
          value: newStr === undefined ? undefined : String(newStr),
          status: that.status,
          maxlength,
          maxcharacter,
          allowInputOverMax,
          onValidate,
        });
        onValidateChange();
        onChange?.(newStr);
      }
    }

    function handleClear(e: MouseEvent) {
      // let inputNode = (e.currentTarget as HTMLInputElement).parentNode.previousSibling as HTMLElement
      // console.log('inputNode', inputNode)
      that.composingValue = '';
      that.value = '';
      that.update();
      onChange?.('', { e });
      onClear?.({ e });
      console.log('that', that);
      // inputNode.focus()
      // that.update()
    }

    function handleKeyDown(e: KeyboardEvent) {
      const { key, currentTarget }: { key: string; currentTarget: any } = e;
      that.value = '';
      key === 'Enter' && onEnter?.(currentTarget.value, { e });
      props.onMyKeydown?.(currentTarget.value, { e });
    }

    function handleKeyUp(e: KeyboardEvent) {
      const { currentTarget }: { currentTarget: any } = e;
      props.onMyKeyup?.(currentTarget.value, { e });
    }

    function handleFocus(e: FocusEvent) {
      if (readonly) return;
      const { currentTarget }: { currentTarget: any } = e;
      onFocus?.(currentTarget.value, { e });
      that.isFocused = true;
      that.update();
    }

    function handleKeyPress(e: KeyboardEvent) {
      const { currentTarget }: { currentTarget: any } = e;
      onKeypress?.(currentTarget.value, { e });
    }

    function handleCompositionStart(e: CompositionEvent) {
      that.composingRef.current = true;
      const { currentTarget }: { currentTarget: any } = e;
      onCompositionstart?.(currentTarget.value, { e });
    }

    function handleCompositionEnd(e: CompositionEvent) {
      const { currentTarget }: { currentTarget: any } = e;
      if (that.composingRef.current) {
        that.composingRef.current = false;
        // onValidateChange()
        handleChange(e);
      }
      onCompositionend?.(currentTarget.value, { e });
    }

    function handleBlur(e: FocusEvent) {
      if (readonly) return;
      const { currentTarget }: { currentTarget: any } = e;
      onBlur?.(currentTarget.value, { e });
      that.isFocused = false;
      that.update();
    }

    function handleMouseEnter(e: MouseEvent) {
      that.isHover = true;
      that.update();
      onMouseenter?.({ e });
    }

    function handleMouseLeave(e: MouseEvent) {
      that.isHover = false;
      that.update();
      onMouseleave?.({ e });
    }

    return (
      <div
        class={classNames(
          InputClassNamePrefix('__wrap'),
          {
            [InputClassNamePrefix('--auto-width')]: autoWidth && !keepWrapperWidth,
          },
          className,
        )}
        // style={renderStyle}
        ref={this.wrapperRef}
        part="wrap"
        {...restProps}
      >
        {renderInputNode}
        <div class={classNames('t-input__tips', InputClassNamePrefix(`__tips--${tStatus || 'default'}`))}>{tips}</div>
      </div>
    );
  }
}
