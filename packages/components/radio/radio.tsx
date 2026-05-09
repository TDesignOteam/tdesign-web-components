import '@tdesign/web-components-shared/common/check';

import { CheckProps } from '@tdesign/web-components-shared/common/index';
import { Component, OmiProps, tag } from 'omi';

import { TdRadioProps } from './type';

export type RadioProps = Omit<CheckProps, 'type'>;

@tag('t-radio')
export default class Radio extends Component<RadioProps> {
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

    return <t-check type="radio" content={children} {...rest} />;
  }
}
