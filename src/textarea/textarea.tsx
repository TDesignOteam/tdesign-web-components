import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import calcTextareaHeight from '../_common/js/utils/calcTextareaHeight';
import { getCharacterLength, limitUnicodeMaxLength } from '../_common/js/utils/helper';
import { getClassPrefix } from '../utils';
import { TdTextareaProps } from './type';

export type TextareaProps = TdTextareaProps;
@tag('t-textarea')
export default class Textarea extends Component<TdTextareaProps> {
  static css = [];

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

  value = '';

  isFocused = false;

  eventPropsNames;

  eventProps;

  classPrefix = getClassPrefix();

  installed() {
    const {
      value,
      disabled,
      maxlength,
      maxcharacter,
      readonly,
      autofocus,
      style,
      autosize,
      status,
      tips,
      allowInputOverMax,
      ...otherProps
    } = this.props;
    this.value = value;
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

    this.update();

    const node = this.textArea.current;
    this.value = node.value;

    if (autosize === true) {
      node.addEventListener('input', () => {
        const heightObj = calcTextareaHeight(node);
        const clacMinHeight = heightObj.minHeight;
        const clacHeight = heightObj.height;
        node.style.minHeight = clacMinHeight;
        node.style.height = clacHeight;
      });
    } else if (typeof autosize === 'object') {
      node.addEventListener('input', () => {
        const heightObj = calcTextareaHeight(node, autosize?.minRows, autosize?.maxRows);
        const clacMinHeight = heightObj.minHeight;
        const clacHeight = heightObj.height;
        node.style.minHeight = clacMinHeight;
        node.style.height = clacHeight;
      });
    }

    const maxLength = maxcharacter;
    if (maxLength) {
      node.addEventListener('input', () => {
        const text = node.value;
        const length = this.countCharacters(text);
        if (length > maxLength) {
          if (text[text.length - 1].match('/[\u4e00-\u9fa5]/g')) {
            node.value = text.slice(0, maxLength - 1);
          } else {
            node.value = text.slice(0, maxLength);
          }
        }
      });
    }
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

  inputValueChangeHandle = (e: Event) => {
    console.log('inputValueChangeHandle', e);
    const { target } = e;
    let val = (target as HTMLInputElement).value;
    if (!this.props.allowInputOverMax && !this.textArea.current) {
      val = limitUnicodeMaxLength(val, this.props.maxlength);
      if (this.props.maxcharacter && this.props.maxcharacter >= 0) {
        const stringInfo = getCharacterLength(val, this.props.maxcharacter);
        val = typeof stringInfo === 'object' && stringInfo.characters;
      }
    }
    // setValue(val, { e });
    this.value = val;
    this.update();
  };

  render(props: OmiProps<TextareaProps, any>) {
    const { autofocus, placeholder, readonly, status, disabled, tips, maxlength, maxcharacter } = props;

    return (
      <>
        <div class={classNames(`${this.classPrefix}-textarea`)}>
          <textarea
            {...this.eventProps}
            class={this.cls()}
            value={this.value}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            autofocus={autofocus}
            maxlength={maxlength}
            maxcharacter={maxcharacter}
            onChange={(e) => {
              this.inputValueChangeHandle(e);
            }}
            ref={this.textArea}
          ></textarea>
          {tips && <div class={classNames(`${this.classPrefix}-tips`, this.getTipsStyle(status))}>{tips}</div>}
        </div>
      </>
    );
  }
}
