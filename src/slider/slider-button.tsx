import '../tooltip';

import { bind, Component, createRef, signal, tag } from 'omi';

import { formatLabel } from '../_common/js/slider/utils';
import classname, { classPrefix } from '../_util/classname';
import { TdSliderProps } from './type';

interface SliderButtonProps {
  label: TdSliderProps['label'];
  value: number;
  tooltipProps: TdSliderProps['tooltipProps'];
  disabled: TdSliderProps['disabled'];
  vertical: boolean;
  min: TdSliderProps['min'];
  rangeDiff: number;
  onButtonMouseup?: Function;
  resetSize?: Function;
  sliderSize?: number;
  step: number;
  precision: number;
  onInput?: (value: number) => {};
}

@tag('t-slider-button')
export default class SliderButton extends Component<SliderButtonProps> {
  static defaultProps = {
    label: true,
    value: 0,
    min: 0,
    rangeDiff: 100,
    sliderSize: 1,
  };

  static propTypes = {
    label: String || Boolean || Object,
    value: Number || Array,
    max: Number,
    min: Number,
    rangeDiff: Number,
    sliderSize: Number,
    tooltipProps: Object,
    step: Number,
    disabled: Boolean,
    vertical: Boolean,
    resetSize: Function,
    onInput: Function,
    onButtonMouseup: Function,
  };

  className = `${classPrefix}-slider__button`;

  visible = signal(false);

  hovering = false;

  dragging = signal(false);

  isClick = false;

  startY = 0;

  startX = 0;

  currentX = 0;

  currentY = 0;

  clientY = 0;

  clientX = 0;

  startPos = 0;

  newPos = 0;

  prevValue = 0;

  tooltipRef = createRef();

  buttonRef = createRef();

  get currentPos() {
    const { value, min, rangeDiff } = this.props;
    const result = `${(((value as number) - min) / rangeDiff) * 100}%`;
    return result;
  }

  get wrapperStyle() {
    return this.props.vertical ? { bottom: this.currentPos } : { left: this.currentPos };
  }

  @bind
  getTooltipContent() {
    const { label, value } = this.props;
    if (label === true) {
      return String(value);
    }
    if (typeof label === 'string') {
      return formatLabel(label, value as number);
    }
    return label;
  }

  @bind
  handleMouseEnter() {
    this.hovering = true;
    this.showTooltipComponent();
    (this.buttonRef.current as HTMLElement)?.focus();
  }

  @bind
  handleMouseLeave() {
    this.hovering = false;
    if (!this.dragging.value) {
      this.hideTooltipComponent();
    }
  }

  @bind
  onButtonDown(event) {
    if (this.props.disabled) {
      return;
    }
    event.preventDefault();
    this.onDragStart(event);
    window.addEventListener('mousemove', this.onDragging);
    window.addEventListener('mouseup', this.onDragEnd);
    window.addEventListener('touchmove', this.onDragging);
    window.addEventListener('touchend', this.onDragEnd);
    window.addEventListener('contextmenu', this.onDragEnd);
  }

  @bind
  onDragStart(event) {
    this.dragging.value = true;
    this.isClick = true;
    const { type } = event;
    let { clientY, clientX } = event as MouseEvent;
    if (type === 'touchstart') {
      const touch = (event as TouchEvent).touches;
      [clientY, clientX] = [touch[0].clientY, touch[0].clientX];
    }
    if (this.props.vertical) {
      this.startY = clientY;
    } else {
      this.startX = clientX;
    }
    this.startPos = parseFloat(this.currentPos);
    this.newPos = this.startPos;
  }

  @bind
  onDragEnd() {
    if (this.dragging) {
      setTimeout(() => {
        this.dragging.value = false;
        this.hideTooltipComponent();
      }, 0);
      window.removeEventListener('mousemove', this.onDragging);
      window.removeEventListener('touchmove', this.onDragging);
      window.removeEventListener('mouseup', this.onDragEnd);
      window.removeEventListener('touchend', this.onDragEnd);
      window.removeEventListener('contextmenu', this.onDragEnd);
      this.props?.onButtonMouseup?.();
    }
  }

  @bind
  hideTooltipComponent() {
    this.visible.value = false;
  }

  @bind
  showTooltipComponent() {
    this.visible.value = true;
  }

  @bind
  onDragging(event) {
    if (!this.dragging.value) {
      return;
    }

    this.isClick = false;
    this.showTooltipComponent();
    this.props?.resetSize?.();
    let diff = 0;

    const parentSliderSize = this.props.sliderSize;
    if (this.props.vertical) {
      this.currentY = (event as MouseEvent).clientY;
      diff = this.startY - this.currentY;
    } else {
      this.currentX = (event as MouseEvent).clientX;
      diff = this.currentX - this.startX;
    }

    if (event.type === 'touchmove') {
      const touch = (event as TouchEvent).touches;
      const [clientY, clientX] = [touch[0].clientY, touch[0].clientX];
      this.clientY = clientY;
      this.clientX = clientX;
    }

    diff = (diff / parentSliderSize) * 100;
    this.newPos = this.startPos + diff;
    this.setPosition(this.newPos);
  }

  @bind
  setPosition(pos: number) {
    let newPos = pos;
    if (newPos === null || isNaN(newPos)) {
      return;
    }

    if (newPos > 100) {
      newPos = 100;
    } else if (newPos < 0) {
      newPos = 0;
    }
    const perStepLen = (100 * this.props.step) / this.props.rangeDiff;
    const steps = Math.round(newPos / perStepLen);
    let value = steps * perStepLen * this.props.rangeDiff * 0.01;
    value += this.props.min;
    value = Number(parseFloat(`${value}`).toFixed(this.props.precision));
    this.props?.onInput?.(value);

    if (!this.dragging.value && this.props.value !== this.prevValue) {
      this.prevValue = this.props.value;
    }
  }

  @bind
  onNativeKeyDown(e: KeyboardEvent) {
    const { code } = e;
    e.preventDefault();
    if (code === 'ArrowDown' || code === 'ArrowLeft') {
      this.onKeyDown('sub');
    }
    if (code === 'ArrowUp' || code === 'ArrowRight') {
      this.onKeyDown('add');
    }
  }

  @bind
  onLeftKeyDown() {
    this.onKeyDown('sub');
  }

  @bind
  onRightKeyDown() {
    this.onKeyDown('add');
  }

  @bind
  onKeyDown(state: string) {
    if (this.props.disabled) {
      return;
    }
    let stepLength = (this.props.step / this.props.rangeDiff) * 100;
    if (state === 'sub') {
      stepLength = -stepLength;
    }
    this.newPos = parseFloat(this.currentPos) + stepLength;
    this.setPosition(this.newPos);
  }

  @bind
  getTooltipProps() {
    if (this.props.tooltipProps instanceof Object) {
      return this.props.tooltipProps;
    }
    return {};
  }

  install() {
    this.prevValue = this.props.value;
  }

  render(props) {
    return (
      <div
        ref={this.buttonRef}
        className={classname(`${this.className}-wrapper`, {
          [`${classPrefix}-is-disabled`]: props.disabled,
          [`${this.className}-wrapper--vertical`]: props.vertical,
        })}
        style={this.wrapperStyle}
        tabindex="0"
        onmouseenter={this.handleMouseEnter}
        onmouseleave={this.handleMouseLeave}
        onmousedown={this.onButtonDown}
        ontouchstart={this.onButtonDown}
        onfocus={this.handleMouseEnter}
        onblur={this.handleMouseLeave}
        onKeydown={this.onNativeKeyDown}
      >
        <t-tooltip
          ref={this.tooltipRef}
          showArrow
          hideEmptyPopup
          {...this.getTooltipProps()}
          overlayInnerStyle={{ whiteSpace: 'nowrap' }}
          arrowStyle={{ marginLeft: '-8px' }}
          strategy="absolute"
          content={this.getTooltipContent()}
          visible={props.label && this.visible.value}
        >
          <div className={classname(`${this.className}`, { [`${this.className}--dragging`]: this.dragging.value })} />
        </t-tooltip>
      </div>
    );
  }
}
