import { bind, classNames, Component, createRef, tag } from 'omi';

import calcTextareaHeight from '../_common/js/utils/calcTextareaHeight';
import { getCharacterLength, limitUnicodeMaxLength } from '../_common/js/utils/helper';
import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { TdTextareaProps } from './type';

export interface TextareaProps extends TdTextareaProps, StyledProps {}
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
    const { value, disabled, ...otherProps } = this.props;
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
    this.onInput();
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

  @bind
  onInput() {
    const node = this.textArea.current;
    const { autosize, maxcharacter } = this.props;
    if (autosize === true) {
      const heightObj = calcTextareaHeight(node);
      this.setHeight(heightObj);
    } else if (typeof autosize === 'object') {
      const heightObj = calcTextareaHeight(node, autosize?.minRows, autosize?.maxRows);
      this.setHeight(heightObj);
    }
    if (maxcharacter) {
      const text = node.value;
      const length = this.countCharacters(text);
      if (length > maxcharacter) {
        if (text[text.length - 1].match('/[\u4e00-\u9fa5]/g')) {
          node.value = text.slice(0, maxcharacter - 1);
        } else {
          node.value = text.slice(0, maxcharacter);
        }
      }
    }
  }

  onChange(e) {
    const { target } = e;
    let val = (target as HTMLInputElement).value;
    if (!this.props?.allowInputOverMax && !this.textArea.current) {
      val = limitUnicodeMaxLength(val, this.props?.maxlength);
      if (this.props?.maxcharacter && this.props?.maxcharacter >= 0) {
        const stringInfo = getCharacterLength(val, this.props?.maxcharacter);
        val = typeof stringInfo === 'object' && stringInfo.characters;
      }
    }
    // setValue(val, { e });
    this.value = val;

    this.props?.onChange(val, { e });
    this.update();
  }

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
            value={this.value}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            autofocus={autofocus}
            maxlength={maxlength}
            maxcharacter={maxcharacter}
            onChange={(e) => this.onChange(e)}
            onInput={this.onInput}
            ref={this.textArea}
          ></textarea>
          {tips && <div class={classNames(`${this.classPrefix}-tips`, this.getTipsStyle(status))}>{tips}</div>}
        </div>
      </>
    );
  }
}
