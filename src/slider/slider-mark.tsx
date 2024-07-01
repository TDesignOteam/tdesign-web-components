import { bind, Component, tag } from 'omi';

import { TdSliderProps } from './type';

interface SliderMarkProps {
  mark: TdSliderProps['marks'];
  point: number;
  onChangeValue?: (point: number) => {};
}

@tag('t-slider-mark')
export default class SliderMark extends Component<SliderMarkProps> {
  static isLightDOM = true;

  @bind
  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.props.onChangeValue(this.props.point);
  }

  render(props) {
    return (
      <div className="t-slider__mark-text" onClick={this.onClick} style={props.style}>
        {props.mark}
      </div>
    );
  }
}
