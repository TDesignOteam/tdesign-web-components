import 'tdesign-icons-web-components';
import '../button';
import '../input';

import { isEqual, pick } from 'lodash';
import { bind, Component, createRef, OmiProps, signal, tag } from 'omi';

import {
  canAddNumber,
  canInputNumber,
  canReduceNumber,
  canSetValue,
  formatThousandths,
  formatUnCompleteNumber,
  getMaxOrMinValidateResult,
  getStepValue,
  InputNumberErrorType,
  largeNumberToFixed,
} from '../_common/js/input-number/number';
import classname, { getClassPrefix, getCommonClassName } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { StyledProps } from '../common';
import { ChangeContext, InputNumberValue, TdInputNumberProps } from './type';

const classPrefix = getClassPrefix();

export interface InputNumberProps extends TdInputNumberProps, StyledProps {}

@tag('t-input-number')
export default class InputNumber extends Component<InputNumberProps> {
  static css = `
    .t-input-number t-button-light-dom.t-input-number__decrease,
    .t-input-number t-button-light-dom.t-input-number__increase {
      border: none;
      transition: none;
    }

    .t-input-number button.t-input-number__decrease,
    .t-input-number button.t-input-number__increase {
      position: static;
    }
  `;

  static defaultProps = {
    allowInputOverLimit: true,
    autoWidth: false,
    decimalPlaces: undefined,
    largeNumber: false,
    max: Infinity,
    min: -Infinity,
    placeholder: '请输入',
    readonly: false,
    size: 'medium',
    status: 'default',
    step: 1,
    theme: 'row',
  };

  static propTypes = {};

  private inputRef = createRef();

  private usedValue = signal<InputNumberValue>('');

  private error = signal<InputNumberErrorType>(undefined);

  private userInput = signal('');

  private get isControlled() {
    return Reflect.has(this.props, 'value');
  }

  private get disabledReduce() {
    const { disabled, min, largeNumber } = this.props;
    return disabled || !canReduceNumber(this.usedValue.value, min, largeNumber);
  }

  private get disabledAdd() {
    const { disabled, max, largeNumber } = this.props;
    return disabled || !canAddNumber(this.usedValue.value, max, largeNumber);
  }

  private getUserInput(value: InputNumberValue) {
    if (!value && value !== 0) {
      return '';
    }

    const { decimalPlaces, largeNumber, format } = this.props;
    let inputStr = value || value === 0 ? String(value) : '';

    const num = formatUnCompleteNumber(inputStr, {
      decimalPlaces,
      largeNumber,
      isToFixed: true,
    });
    inputStr = num || num === 0 ? String(num) : '';
    if (format) {
      inputStr = String(format(value, { fixedNumber: inputStr }));
    }
    return inputStr;
  }

  @bind
  private handleChange(value: InputNumberValue, context: ChangeContext) {
    const preUsedValue = this.usedValue.value;

    if (!this.isControlled) {
      this.usedValue.value = value;
    }
    this.props.onChange?.(value, context);

    const curUsedValue = this.usedValue.value;

    if (curUsedValue !== preUsedValue) {
      this.handleUsedValueChange();
      this.handleValidate();
    }
  }

  @bind
  private handleStepValue(op: 'add' | 'reduce') {
    const { step, max, min, largeNumber } = this.props;
    const newValue = getStepValue({
      op,
      step,
      max,
      min,
      lastValue: this.usedValue.value,
      largeNumber,
    });
    const overLimit = getMaxOrMinValidateResult({
      value: newValue,
      largeNumber,
      max,
      min,
    });
    return {
      overLimit,
      newValue,
    };
  }

  @bind
  private handleReduce(e: any) {
    if (this.disabledReduce || this.props.readonly) {
      return;
    }
    const r = this.handleStepValue('reduce');
    if (r.overLimit && !this.props.allowInputOverLimit) {
      return;
    }
    this.handleChange(r.newValue, { type: 'reduce', e });
  }

  @bind
  private handleAdd(e: any) {
    if (this.disabledAdd || this.props.readonly) {
      return;
    }
    const r = this.handleStepValue('add');
    if (r.overLimit && !this.props.allowInputOverLimit) {
      return;
    }
    this.handleChange(r.newValue, { type: 'add', e });
  }

  @bind
  private handleInputChange(inputValue: string) {
    const { largeNumber } = this.props;
    // 处理千分位
    const val = formatThousandths(inputValue);

    if (!canInputNumber(val, largeNumber)) {
      return;
    }

    this.userInput.value = val;

    if (largeNumber) {
      this.handleChange(val, { type: 'input', e: new InputEvent('input') });
      return;
    }

    if (canSetValue(String(val), Number(this.usedValue.value))) {
      const newVal = val === '' ? undefined : Number(val);
      this.handleChange(newVal, { type: 'input', e: new InputEvent('input') });
    }
  }

  @bind
  private handleKeydown(_: string, ctx: { e: KeyboardEvent }) {
    const { key } = ctx.e;

    if (key === 'ArrowUp') {
      this.handleAdd(ctx.e);
    }

    if (key === 'ArrowDown') {
      this.handleReduce(ctx.e);
    }

    this.props.onKeydown?.(this.userInput.value, ctx);
  }

  @bind
  private handleKeyUp(_: string, ctx: { e: KeyboardEvent }) {
    this.props.onKeyup?.(this.userInput.value, ctx);
  }

  @bind
  private handleKeyPress(_: string, ctx: { e: KeyboardEvent }) {
    this.props.onKeypress?.(this.userInput.value, ctx);
  }

  @bind
  private handleEnter(value: string, ctx: { e: KeyboardEvent }) {
    this.userInput.value = this.getUserInput(value);

    const { decimalPlaces, largeNumber } = this.props;
    const newValue = formatUnCompleteNumber(value, {
      decimalPlaces,
      largeNumber,
    });

    if (newValue !== value && String(newValue) !== value) {
      this.handleChange(newValue, { type: 'enter', e: ctx.e });
    }

    this.props.onEnter?.(newValue, ctx);
  }

  @bind
  private handleClear(ctx: { e: MouseEvent }) {
    this.handleChange(undefined, { type: 'clear', e: ctx.e });
    this.userInput.value = '';
  }

  @bind
  private handleFocus(_: string, ctx: { e: FocusEvent }) {
    this.userInput.value = String(this.usedValue.value || '');
    this.props.onFocus?.(this.usedValue.value, ctx);
  }

  @bind
  private handleBlur(value: string, ctx: { e: FocusEvent }) {
    const { min, max, largeNumber, allowInputOverLimit, decimalPlaces } = this.props;

    if (!allowInputOverLimit && value !== undefined) {
      const r = getMaxOrMinValidateResult({
        value: this.usedValue.value,
        largeNumber,
        max,
        min,
      });
      if (r === 'below-minimum') {
        this.handleChange(min, { type: 'blur', e: ctx.e });
        return;
      }
      if (r === 'exceed-maximum') {
        this.handleChange(max, { type: 'blur', e: ctx.e });
        return;
      }
    }
    const newValue = formatUnCompleteNumber(value, {
      decimalPlaces,
      largeNumber,
    });

    this.userInput.value = this.getUserInput(newValue);
    if (newValue !== this.usedValue.value) {
      this.handleChange(newValue, { type: 'blur', e: ctx.e });
    }

    this.props.onBlur?.(newValue, ctx);
  }

  @bind
  private handleValidate() {
    if ([undefined, '', null].includes(this.usedValue.value as any)) {
      return;
    }
    const { max, min, largeNumber } = this.props;
    const error = getMaxOrMinValidateResult({
      value: this.usedValue.value,
      max,
      min,
      largeNumber,
    });
    this.error.value = error;
    this.props.onValidate?.({ error });
  }

  @bind
  private handleUsedValueChange() {
    const inputValue = [undefined, null].includes(this.usedValue.value) ? '' : String(this.usedValue.value);

    const { largeNumber, decimalPlaces } = this.props;

    // userInput.value 为非合法数字，则表示用户正在输入，此时无需处理
    if (!largeNumber && !Number.isNaN(this.userInput.value)) {
      if (parseFloat(this.userInput.value) !== this.usedValue.value) {
        this.userInput.value = this.getUserInput(inputValue);
      }
      const fixedNumber = Number(largeNumberToFixed(inputValue, decimalPlaces, largeNumber));
      if (
        decimalPlaces !== undefined &&
        ![undefined, null].includes(this.usedValue.value) &&
        Number(fixedNumber) !== Number(this.usedValue.value)
      ) {
        this.handleChange(fixedNumber, { type: 'props', e: undefined });
      }
    }
    if (largeNumber) {
      const tmpUserInput = this.getUserInput(inputValue);
      this.userInput.value = tmpUserInput;
      if (
        decimalPlaces !== undefined &&
        largeNumberToFixed(inputValue, decimalPlaces, largeNumber) !== this.usedValue.value
      ) {
        this.handleChange(tmpUserInput, { type: 'props', e: undefined });
      }
    }
  }

  install(): void {
    this.usedValue.value = this.props.value || this.props.defaultValue;
    this.handleUsedValueChange();
    this.handleValidate();
  }

  receiveProps(
    props: InputNumberProps | OmiProps<InputNumberProps, any>,
    oldProps: InputNumberProps | OmiProps<InputNumberProps, any>,
  ) {
    if (
      (this.isControlled && props.value !== oldProps.value) ||
      (Reflect.has(oldProps, 'value') && !this.isControlled)
    ) {
      this.usedValue.value = props.value;
      this.handleUsedValueChange();
      this.handleValidate();
    }

    const value = pick(props, ['value', 'max', 'min', 'largeNumber', 'onValidate']);
    const preValue = pick(oldProps, ['value', 'max', 'min', 'largeNumber', 'onValidate']);
    if (!isEqual(value, preValue)) {
      this.handleUsedValueChange();
      this.handleValidate();
    }
  }

  render(props: OmiProps<InputNumberProps>) {
    const status = this.error.value ? 'error' : props.status;

    const { SIZE, STATUS } = getCommonClassName();

    const reduceClasses = classname(`${classPrefix}-input-number__decrease`, {
      [STATUS.disabled]: this.disabledReduce,
    });

    const addClasses = classname(`${classPrefix}-input-number__increase`, { [STATUS.disabled]: this.disabledAdd });

    const addIcon =
      props.theme === 'column'
        ? convertToLightDomNode(<t-icon size={props.size} name="chevron-up" />)
        : convertToLightDomNode(<t-icon size={props.size} name="add" />);

    const reduceIcon =
      props.theme === 'column'
        ? convertToLightDomNode(<t-icon size={props.size} name="chevron-down" />)
        : convertToLightDomNode(<t-icon size={props.size} name="remove" />);

    return (
      <div
        style={props.style}
        className={classname(`${classPrefix}-input-number`, SIZE[props.size], props.className, {
          [STATUS.disabled]: props.disabled,
          [`${classPrefix}-is-controls-right`]: props.theme === 'column',
          [`${classPrefix}-input-number--${props.theme}`]: props.theme,
          [`${classPrefix}-input-number--auto-width`]: props.autoWidth,
        })}
      >
        {props.theme !== 'normal' &&
          convertToLightDomNode(
            <t-button
              className={reduceClasses}
              disabled={props.disabled}
              onClick={this.handleReduce}
              variant="outline"
              shape="square"
              icon={reduceIcon}
            />,
          )}
        <t-input
          style={{ display: 'block' }}
          className={`${classPrefix}-input__wrap`}
          autocomplete="off"
          disabled={props.disabled}
          readonly={props.readonly}
          placeholder={props.placeholder}
          autoWidth={props.autoWidth}
          align={props.align || (props.theme === 'row' ? 'center' : undefined)}
          status={status}
          label={props.label}
          suffix={props.suffix}
          value={this.userInput.value}
          size={props.size}
          onChange={this.handleInputChange}
          onKeydown={this.handleKeydown}
          onKeyup={this.handleKeyUp}
          onKeypress={this.handleKeyPress}
          onEnter={this.handleEnter}
          onClear={this.handleClear}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.inputRef}
          {...(props.inputProps || {})}
        />
        {props.theme !== 'normal' &&
          convertToLightDomNode(
            <t-button
              className={addClasses}
              disabled={props.disabled}
              onClick={this.handleAdd}
              variant="outline"
              shape="square"
              icon={addIcon}
            />,
          )}

        {props.tips && (
          <div className={classname(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${status}`)}>
            {props.tips}
          </div>
        )}
      </div>
    );
  }
}
