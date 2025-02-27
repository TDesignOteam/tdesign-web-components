import { classNames, Component, createRef, signal, tag } from 'omi';

import calcTextareaHeight from '../_common/js/utils/calcTextareaHeight';
import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import useLengthLimit from '../input/useLengthLimit';
import { TdTextareaProps } from './type';

export interface TextareaProps extends TdTextareaProps, StyledProps {}
@tag('t-textarea')
export default class Textarea extends Component<TdTextareaProps> {
  static css = [];

  static propTypes = {
    allowInputOverMax: Boolean,
    autofocus: Boolean,
    autosize: Boolean,
    disabled: Boolean,
    label: Object,
    maxcharacter: Number,
    maxlength: Number,
    placeholder: String,
    readonly: Boolean,
    status: String,
    tips: Object,
    value: String,
    defaultValue: String,
  };

  constructor() {
    super();
    this.props = {
      allowInputOverMax: false,
      autofocus: false,
      autosize: false,
      disabled: false,
      readonly: false,
      value: '',
      ...this.props,
    };
  }

  private pValue = signal('');

  isFocused = false;

  eventPropsNames;

  eventProps;

  classPrefix = getClassPrefix();

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue.value;
  }

  installed() {
    const { value, defaultValue, disabled, ...otherProps } = this.props;
    this.pValue.value = value || defaultValue;
    this.eventPropsNames = Object.keys(otherProps).filter((key) => /^on[A-Z]/.test(key));
    this.eventProps = this.eventPropsNames.reduce((eventProps, key) => {
      Object.assign(eventProps, {
        [key]: (e) => {
          if (disabled) return;
          if (key === 'onFocus') {
            this.isFocused = true;
            this.update();
          }
          if (key === 'onBlur') {
            this.isFocused = false;
            this.update();
          }
          this.props[key](e.currentTarget.value, { e });
          e.stopPropagation();
        },
      });
      return eventProps;
    }, {});

    this.adjustTextareaHeight();
    this.update();
  }

  countCharacters(text: string) {
    // 按照一个中文汉字等于一个字符长度计算
    const chineseCharacterRegex = /[\u4e00-\u9fa5]/g;
    const chineseCharacters = text.match(chineseCharacterRegex) || [];
    return text.length + chineseCharacters.length;
  }

  // textarea ref
  textArea = createRef<any>();

  getTextareaStatus(status: string) {
    return `${this.classPrefix}-is-${status || ''}`;
  }

  getTipsStyle(status: string) {
    return `${this.classPrefix}-textarea__tips--${status}`;
  }

  getTextareaIsDisabled(disabled: boolean) {
    return `${this.classPrefix}-is-${disabled ? 'disabled' : ''}`;
  }

  textareaClassPrefix = `${this.classPrefix}-textarea`;

  cls() {
    return classNames(`${this.textareaClassPrefix}__inner`, {
      [`${this.classPrefix}-is-${this.props.status}`]: this.props.status,
      [`${this.classPrefix}-is-disabled`]: this.props.disabled,
      [`${this.classPrefix}-is-focused`]: this.isFocused,
      [`${this.classPrefix}-resize-none`]: typeof this.props.autosize === 'object',
    });
  }

  setHeight(heightObj) {
    const node = this.textArea.current;
    const clacMinHeight = heightObj.minHeight;
    const clacHeight = heightObj.height;
    node.style.minHeight = clacMinHeight;
    node.style.height = clacHeight;
  }

  adjustTextareaHeight = () => {
    const node = this.textArea.current;
    const { autosize } = this.props;
    if (autosize === true) {
      const heightObj = calcTextareaHeight(node);
      this.setHeight(heightObj);
    } else if (typeof autosize === 'object') {
      const heightObj = calcTextareaHeight(node, autosize?.minRows, autosize?.maxRows);
      this.setHeight(heightObj);
    }
  };

  onChange = (e: Event) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    const val = target.value;

    const { getValueByLimitNumber } = useLengthLimit({
      value: val ? String(val) : undefined,
      status: 'default',
      maxlength: this.props.maxlength,
      maxcharacter: this.props.maxcharacter,
      allowInputOverMax: this.props.allowInputOverMax,
      onValidate: () => {},
    });

    const limitedValue = getValueByLimitNumber(target.value);
    this.pValue.value = limitedValue;

    this.fire('change', limitedValue);
    this.adjustTextareaHeight();
  };

  render(props: TextareaProps) {
    const {
      autofocus,
      placeholder,
      readonly,
      status,
      disabled,
      tips,
      maxlength,
      maxcharacter,
      innerClass,
      innerStyle,
    } = props;

    return (
      <>
        <div class={classNames(`${this.classPrefix}-textarea`, innerClass)} style={innerStyle}>
          <textarea
            {...this.eventProps}
            class={this.cls()}
            value={this.inputValue}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            autofocus={autofocus}
            maxlength={maxlength}
            maxcharacter={maxcharacter}
            // 这个事件会在失焦前触发，必须加上否则会导致失焦时，textarea的value值为空
            onChange={this.onChange}
            onInput={this.onChange}
            ref={this.textArea}
          />
          {tips && <div class={classNames(`${this.classPrefix}-tips`, this.getTipsStyle(status))}>{tips}</div>}
        </div>
      </>
    );
  }
}
