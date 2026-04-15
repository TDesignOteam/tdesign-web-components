import '../common/check';

import { OmiProps, tag } from 'omi';

import Radio, { RadioProps } from './radio';
import { TdRadioProps } from './type';

@tag('t-radio-button')
export default class RadioButton extends Radio {
  static isLightDOM = true;

  static propTypes = {
    allowUncheck: Boolean,
    checked: Boolean,
    defaultChecked: Boolean,
    children: [String, Number, Object, Function],
    disabled: Boolean,
    label: [String, Number, Object, Function],
    name: String,
    value: [String, Number],
    onChange: Function,
    onClick: Function,
  };

  static defaultProps: TdRadioProps = {
    allowUncheck: false,
    defaultChecked: false,
    disabled: undefined,
    value: undefined,
  };

  render(props: OmiProps<RadioProps>) {
    const { children, ...rest } = props;

    return <t-check type="radio-button" content={children} {...rest} />;
  }
}
