import 'tdesign-web-components/icon';

import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import parseTNode from '../_util/parseTNode';
import { StyledProps, TElement, TNode } from '../common';
import { InputValue, TdInputProps } from './type';
import useLengthLimit from './useLengthLimit';

const classPrefix = getClassPrefix();

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

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode | TElement) => {
  const result = parseTNode(icon);
  const iconClassName = icon ? `${classPrefix}-input__${type}-icon` : '';

  return result ? (
    <span class={classNames(`${classPrefix}-input__${type} ${iconClassName}`)}>{result}</span>
  ) : (
    <span></span>
  );
};

const isFunction = (arg: unknown) => typeof arg === 'function';

@tag('t-input')
export default class Input extends Component<InputProps> {
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

  private handleChange = (e) => {
    const { maxlength, maxcharacter, allowInputOverMax, status, onValidate, onChange } = this.props;

    const { getValueByLimitNumber } = useLengthLimit({
      value: this.value === undefined ? undefined : String(this.value),
      status,
      maxlength,
      maxcharacter,
      allowInputOverMax,
      onValidate,
    });

    let { value: newStr } = e.currentTarget;
    if (this.composingRef.current) {
      this.composingValue = newStr;
    } else {
      if (this.props.type !== 'number') {
        newStr = getValueByLimitNumber(newStr);
      }
      // 完成中文输入时同步一次 composingValue
      this.composingValue = newStr;
      // 防止输入中文后移开光标触发mouseleave时value没更新
      this.value = newStr;
      const { onValidateChange } = useLengthLimit({
        value: newStr === undefined ? undefined : String(newStr),
        status: this.status,
        maxlength,
        maxcharacter,
        allowInputOverMax,
        onValidate,
      });
      onValidateChange();
      onChange?.(newStr);
    }
  };

  private handleFocus = (e: FocusEvent) => {
    console.log('focus');
    const { readonly, onFocus } = this.props;
    if (readonly) return;
    const { currentTarget }: { currentTarget: any } = e;
    onFocus?.(currentTarget.value, { e });
    this.isFocused = true;
    this.update();
  };

  private handleBlur = (e: FocusEvent) => {
    console.log('blur', this.props);
    const { readonly, onBlur } = this.props;
    if (readonly) return;
    const { currentTarget }: { currentTarget: any } = e;
    onBlur?.(currentTarget.value, { e });
    this.isFocused = false;
    this.update();
  };

  private handleMouseEnter = (e: MouseEvent) => {
    const { onMouseenter } = this.props;
    this.isHover = true;
    this.update();
    onMouseenter?.({ e });
  };

  private handleMouseLeave = (e: MouseEvent) => {
    const { onMouseleave } = this.props;
    this.isHover = false;
    this.update();
    onMouseleave?.({ e });
  };

  private handleClear = (e: MouseEvent) => {
    const { onChange, onClear } = this.props;
    this.composingValue = '';
    this.value = '';
    this.update();
    onChange?.('', { e });
    onClear?.({ e });
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    const { onEnter } = this.props;
    const { key, currentTarget }: { key: string; currentTarget: any } = e;
    this.value = '';
    key === 'Enter' && onEnter?.(currentTarget.value, { e });
    this.props.onMyKeydown?.(currentTarget.value, { e });
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const { currentTarget }: { currentTarget: any } = e;
    this.props.onMyKeyup?.(currentTarget.value, { e });
  };

  private handleKeyPress = (e: KeyboardEvent) => {
    const { onKeypress } = this.props;
    const { currentTarget }: { currentTarget: any } = e;
    onKeypress?.(currentTarget.value, { e });
  };

  private handleCompositionStart = (e: CompositionEvent) => {
    const { onCompositionstart } = this.props;
    this.composingRef.current = true;
    const { currentTarget }: { currentTarget: any } = e;
    onCompositionstart?.(currentTarget.value, { e });
  };

  private handleCompositionEnd = (e: CompositionEvent) => {
    const { onCompositionend } = this.props;
    const { currentTarget }: { currentTarget: any } = e;
    if (this.composingRef.current) {
      this.composingRef.current = false;
      this.handleChange(e);
    }
    onCompositionend?.(currentTarget.value, { e });
  };

  install() {
    this.value = this.props.defaultValue || this.props.value;
    this.status = this.props.status;
  }

  installed() {
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

    if (this.props.autoWidth) {
      requestAnimationFrame(() => {
        updateInputWidth();
      });
    }

    inputNode.addEventListener('input', (e) => {
      if (this.composingRef.current) {
        return;
      }
      const target = e.currentTarget as any;
      this.value = target.value;
      const { getValueByLimitNumber, onValidateChange } = useLengthLimit({
        value: this.value === undefined ? undefined : String(this.value),
        status: this.status,
        maxlength: this.props.maxlength,
        maxcharacter: this.props.maxcharacter,
        allowInputOverMax: this.props.allowInputOverMax,
        onValidate: this.props.onValidate,
      });
      const limitedValue = getValueByLimitNumber(target.value);
      this.value = limitedValue;
      this.composingValue = limitedValue;
      this.props.onChange?.(limitedValue);
      if (!this.props.allowInputOverMax) {
        this.update();
      }
      if (this.props.autoWidth) {
        requestAnimationFrame(() => {
          updateInputWidth();
        });
      }
      onValidateChange();
    });
  }

  render(props: OmiProps<InputProps>) {
    const {
      autoWidth,
      placeholder,
      disabled,
      status,
      size,
      class: className,
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
      format,
      onValidate,
      ...restProps
    } = props;

    const { limitNumber, tStatus } = useLengthLimit({
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
          class={classNames(`${classPrefix}-input__suffix-clear`)}
          onClick={this.handleClear}
        />
      ) as any;
    }

    const suffixIconContent = renderIcon('t', 'suffix', parseTNode(suffixIconNew));
    const labelContent = isFunction(label) ? label() : label;
    const suffixContent = isFunction(suffix) ? suffix() : suffix;

    const limitNumberNode =
      limitNumber() && showLimitNumber ? (
        <div
          class={classNames(`${classPrefix}-input__limit-number`, {
            [`${classPrefix}-is-disabled`]: disabled,
          })}
        >
          {limitNumber()}
        </div>
      ) : null;

    const innerValue = this.composingRef.current ? this.composingValue : this.value ?? '';
    const formatDisplayValue = format && !this.isFocused ? format(innerValue) : innerValue;
    const renderInput = (
      <input
        {...this.eventProps}
        ref={this.inputRef}
        placeholder={placeholder}
        type={this.renderType}
        class={`${classPrefix}-input__inner`}
        value={formatDisplayValue}
        readOnly={readonly}
        disabled={disabled}
        autoComplete={autocomplete ?? (autocomplete || undefined)}
        autoFocus={autofocus}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onKeyPress={this.handleKeyPress}
        onCompositionStart={this.handleCompositionStart}
        onCompositionEnd={this.handleCompositionEnd}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
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
          [`${classPrefix}-input--prefix`]: prefixIcon || labelContent,
          [`${classPrefix}-input--suffix`]: suffixIconContent || suffixContent,
          [`${classPrefix}-input--borderless`]: borderless,
          [`${classPrefix}-input--focused`]: this.isFocused,
        })}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {prefixIconContent}
        {labelContent ? <div class={classNames(`${classPrefix}-input__prefix`)}>{labelContent}</div> : null}
        {showInput && renderInput}

        {autoWidth && (
          <span ref={this.inputPreRef} class={classNames(`${classPrefix}-input__input-pre`)}>
            {innerValue || placeholder}
          </span>
        )}

        {suffixContent || limitNumberNode ? (
          <div class={classNames(`${classPrefix}-input__suffix`)}>
            {suffixContent}
            {limitNumberNode}
          </div>
        ) : null}
        {suffixIconContent}
      </div>
    );

    return (
      <div
        class={classNames(
          `${classPrefix}-input__wrap`,
          {
            [`${classPrefix}-input--auto-width`]: autoWidth && !keepWrapperWidth,
          },
          className,
        )}
        ref={this.wrapperRef}
        part="wrap"
        {...restProps}
      >
        {renderInputNode}
        <div class={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${tStatus || 'default'}`)}>
          {tips}
        </div>
      </div>
    );
  }
}
