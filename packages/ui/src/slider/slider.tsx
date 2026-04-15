import './slider-button';
import './slider-mark';
import '../input-number';

import { bind, Component, createRef, OmiProps, signal, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';
import { StyledProps, TNode } from '../common';
import { SliderValue, TdSliderProps } from './type';

export interface SliderProps extends TdSliderProps, StyledProps {}
export interface MarkItem {
  point: number;
  position: number;
  mark: string | number | TNode<{ value: number }>;
}
interface SliderButtonType {
  setPosition: (param: number) => {};
}

@tag('t-slider')
export default class Slider extends Component<SliderProps> {
  static defaultProps = {
    value: 0,
    disabled: false,
    label: true,
    layout: 'horizontal',
    max: 100,
    min: 0,
    range: false,
    step: 1,
  };

  static propTypes = {
    disabled: Boolean,
    inputNumberProps: Object,
    label: [String, Boolean, Object],
    layout: String,
    marks: [Array, Object],
    max: Number,
    min: Number,
    range: Boolean,
    step: Number,
    tooltipProps: Object,
    value: [Number, Array],
    onChange: Function,
    onChangeEnd: Function,
  };

  className = `${classPrefix}-slider`;

  sliderRef = createRef();

  leftButtonRef = createRef();

  rightButtonRef = createRef();

  leftInputRef = createRef();

  rightInputRef = createRef();

  sliderSize = signal(1);

  firstValue = signal(0);

  secondValue = signal(0);

  prevValue = signal(0);

  dragging = false;

  get isVertical() {
    return this.props.layout === 'vertical';
  }

  get maxValue() {
    return Math.max(this.firstValue.value, this.secondValue.value);
  }

  get minValue() {
    return Math.min(this.firstValue.value, this.secondValue.value);
  }

  get rangeDiff() {
    return this.props.max - this.props.min;
  }

  get barSize() {
    const diff = this.props.range ? this.maxValue - this.minValue : this.prevValue.value - this.props.min;
    return `${(100 * diff) / this.rangeDiff}%`;
  }

  get markList() {
    if (!this.props.marks) {
      return [];
    }
    const legalMarks: Array<MarkItem> = [];
    Object.keys(this.props.marks)
      .map(parseFloat)
      .sort((a, b) => a - b)
      .filter((point) => point <= this.props.max && point >= this.props.min)
      .forEach((point) => {
        const item: MarkItem = {
          point,
          position: ((point - this.props.min) * 100) / this.rangeDiff,
          mark: this.props.marks[point],
        };
        legalMarks.push(item);
      });
    return legalMarks;
  }

  get barStart() {
    return this.props.range ? `${(100 * (this.minValue - this.props.min)) / this.rangeDiff}%` : '0%';
  }

  get barStyle() {
    return this.isVertical
      ? {
          height: this.barSize,
          bottom: this.barStart,
        }
      : {
          width: this.barSize,
          left: this.barStart,
        };
  }

  get calcInputNumberProps() {
    const defaultInputNumberProps = {
      placeholder: '',
      theme: 'column',
    };
    if (typeof this.props.inputNumberProps === 'object') {
      return {
        ...defaultInputNumberProps,
        ...this.props.inputNumberProps,
      };
    }
    return defaultInputNumberProps;
  }

  @bind
  init() {
    const { range, value, min, max } = this.props;

    if (range) {
      if (Array.isArray(value)) {
        this.firstValue.value = Math.max(min || 0, value[0] as number);
        this.secondValue.value = Math.min(max || 100, value[1] as number);
      } else {
        this.firstValue.value = min || 0;
        this.secondValue.value = max || 100;
      }
    } else if (typeof value !== 'number') {
      this.prevValue.value = min;
    } else {
      this.prevValue.value = Math.min(max, Math.max(min, value));
    }

    this.resetSize();
    window.addEventListener('resize', this.resetSize);
  }

  @bind
  onSliderClick(event) {
    if (this.props.disabled || this.dragging) {
      return;
    }
    this.resetSize();
    let value = 0;
    if (this.isVertical) {
      const sliderOffsetBottom = (this.sliderRef.current as Element).getBoundingClientRect().bottom;
      value = ((sliderOffsetBottom - event.clientY) / this.sliderSize.value) * 100;
      this.setPosition(value);
    } else {
      const sliderOffsetLeft = (this.sliderRef.current as Element).getBoundingClientRect().left;
      value = ((event.clientX - sliderOffsetLeft) / this.sliderSize.value) * 100;
      this.setPosition(value);
    }
  }

  @bind
  resetSize() {
    if (this.sliderRef?.current) {
      this.sliderSize.value = this.sliderRef.current[`client${this.isVertical ? 'Height' : 'Width'}`];
    }
  }

  @bind
  watchValue(newVal: SliderValue) {
    if (this.dragging) return;
    if (Array.isArray(newVal) && this.props.range) {
      [this.firstValue.value, this.secondValue.value] = newVal;
    } else {
      this.prevValue.value = newVal as number;
    }
  }

  @bind
  getStopStyle(position: number) {
    return this.isVertical ? { top: `calc(${100 - position}% - 1px)` } : { left: `${position}%` };
  }

  @bind
  changeValue(point: number) {
    if (this.props.disabled || this.dragging) {
      return;
    }
    this.resetSize();
    const value = Number((point / this.rangeDiff) * 100);
    this.setPosition(value);
    this.emitChange(point);
  }

  @bind
  setPosition(percent: number): void {
    let targetValue = (percent * this.rangeDiff) / 100;
    targetValue = this.props.min + targetValue;
    if (!this.props.range) {
      (this.leftButtonRef.current as SliderButtonType).setPosition(percent);
      return;
    }
    let button;
    if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
      button = this.firstValue.value < this.secondValue.value ? 'leftButtonRef' : 'rightButtonRef';
    } else {
      button = this.firstValue.value > this.secondValue.value ? 'leftButtonRef' : 'rightButtonRef';
    }
    (this[button].current as SliderButtonType).setPosition(percent);
  }

  get precision() {
    const precisions = [this.props.min, this.props.max, this.props.step].map((item) => {
      const decimalArr = `${item}`.split('.');
      return decimalArr[1] ? decimalArr[1].length : 0;
    });
    return Math.max.apply(null, precisions);
  }

  @bind
  emitChange(value: SliderValue) {
    let changeValue = value;
    if (changeValue === undefined) {
      if (this.props.range) {
        changeValue = [this.firstValue.value, this.secondValue.value];
      } else {
        changeValue = this.prevValue.value;
      }
    }
    const fixValue: SliderValue = this.setValues(changeValue);
    this.props?.onChange?.(fixValue);
  }

  @bind
  emitChangeEnd() {
    const changeEndValue = this.props.range ? [this.firstValue.value, this.secondValue.value] : this.prevValue.value;
    this.props?.onChangeEnd?.(changeEndValue);
  }

  @bind
  setValues(value: SliderValue): SliderValue {
    const [min, max] = [this.props.min, this.props.max];
    if (min > max) {
      console.warn('[Slider] max should be greater than min.');
      return;
    }
    // 双向滑块
    if (this.props.range && Array.isArray(value)) {
      let [firstValue, secondValue] = [Math.min(...value), Math.max(...value)];
      if (firstValue > max) firstValue = this.firstValue.value;
      if (firstValue < min) firstValue = min;
      if (secondValue < min) secondValue = this.secondValue.value;
      if (secondValue > max) secondValue = max;
      [this.firstValue.value, this.secondValue.value] = [firstValue, secondValue];
      return [firstValue, secondValue];
    }
    let prevValue = value as number;
    if (prevValue < min) prevValue = min;
    if (prevValue > max) prevValue = max;
    this.prevValue.value = prevValue;
    return prevValue;
  }

  @bind
  onFirstButtonInput(v: number) {
    if (this.props.range) {
      if (this.firstValue.value === v) {
        return;
      }
      this.firstValue.value = v;
    } else {
      if (this.prevValue.value === v) {
        return;
      }
      this.prevValue.value = v;
    }
    this.emitChange(this.props.range ? [v, this.secondValue.value] : v);
  }

  @bind
  onSecondButtonInput(v: number) {
    if (this.secondValue.value === v) return;

    this.secondValue.value = v;
    this.emitChange([this.firstValue.value, v]);
  }

  @bind
  renderInputButton() {
    const sliderNumberClass = classname([
      `${this.className}__input`,
      {
        'is-vertical': this.isVertical,
      },
    ]);
    const { max, min, range } = this.props;
    return (
      <div
        className={classname([
          `${this.className}__input-container`,
          {
            'is-vertical': this.isVertical,
          },
        ])}
      >
        {
          <t-input-number
            class={sliderNumberClass}
            value={range ? this.firstValue.value : this.prevValue.value}
            ref={this.leftInputRef}
            step={this.props.step}
            onChange={(v: number) => {
              this.props.range ? (this.firstValue.value = v) : (this.prevValue.value = v);
            }}
            disabled={this.props.disabled}
            min={min}
            max={max}
            props={this.calcInputNumberProps}
          />
        }
        {range && <div className={`${this.className}__center-line`} />}
        {range && (
          <t-input-number
            className={sliderNumberClass}
            value={this.secondValue.value}
            ref={this.rightInputRef}
            step={this.props.step}
            disabled={this.props.disabled}
            min={min}
            max={max}
            props={this.calcInputNumberProps}
            onChange={(v: number) => {
              this.secondValue.value = v;
            }}
          />
        )}
      </div>
    );
  }

  install() {
    this.init();
  }

  receiveProps(props: TdSliderProps | OmiProps<TdSliderProps, any>) {
    this.watchValue(props.value);
  }

  @bind
  renderMarks() {
    if (this.markList.length) {
      return (
        <div>
          <div class={`${this.className}__stops`}>
            {this.markList.map((item, index) => {
              if (item.position === 0 || item.position === 100) return null;
              return (
                <div
                  className={classname([`${this.className}__stop`, `${this.className}__mark-stop`])}
                  style={this.getStopStyle(item.position)}
                  key={index}
                ></div>
              );
            })}
          </div>
          <div className={`${this.className}__mark`}>
            {this.markList.map((item, key) => (
              <t-slider-mark
                mark={item.mark}
                point={item.point}
                key={key}
                style={this.getStopStyle(item.position)}
                onChangeValue={this.changeValue}
              ></t-slider-mark>
            ))}
          </div>
        </div>
      );
    }
  }

  render(props: SliderProps): TNode {
    const { isVertical } = this;
    const sliderClass = classname(this.className, {
      'is-vertical': isVertical,
      [`${this.className}--with-input`]: props.inputNumberProps,
      [`${this.className}--vertical`]: isVertical,
      [`${classPrefix}-is-disabled`]: props.disabled,
    });
    const railClass = classname(`${this.className}__rail`, {
      'show-input': props.inputNumberProps,
      [`${classPrefix}-is-disabled`]: props.disabled,
    });
    const runwayStyle = isVertical ? { height: '100%' } : {};
    const buttonGroup = props.inputNumberProps && this.renderInputButton();

    return (
      <div
        className={classname(
          `${this.className}__container`,
          {
            'is-vertical': isVertical,
          },
          props.innerClass,
        )}
        style={props.innerStyle}
      >
        <div className={sliderClass}>
          <div className={railClass} style={runwayStyle} onClick={this.onSliderClick} ref={this.sliderRef}>
            <div class={`${this.className}__track`} style={this.barStyle}></div>
            <t-slider-button
              ref={this.leftButtonRef}
              disabled={props.disabled}
              step={props.step}
              min={props.min}
              max={props.max}
              tooltipProps={props.tooltipProps}
              vertical={this.isVertical}
              rangeDiff={this.rangeDiff}
              precision={this.precision}
              value={props.range ? this.firstValue.value : this.prevValue.value}
              sliderSize={this.sliderSize.value}
              resetSize={this.resetSize}
              onInput={this.onFirstButtonInput}
              onButtonMouseup={this.emitChangeEnd}
            />
            {this.props.range && (
              <t-slider-button
                ref={this.rightButtonRef}
                disabled={props.disabled}
                step={props.step}
                min={props.min}
                max={props.max}
                tooltipProps={props.tooltipProps}
                vertical={this.isVertical}
                rangeDiff={this.rangeDiff}
                precision={this.precision}
                value={this.secondValue.value}
                sliderSize={this.sliderSize.value}
                resetSize={this.resetSize}
                onInput={this.onSecondButtonInput}
                onButtonMouseup={this.emitChangeEnd}
              />
            )}

            {this.renderMarks()}
          </div>
        </div>
        {buttonGroup}
      </div>
    );
  }
}
