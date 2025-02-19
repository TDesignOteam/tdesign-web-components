import '../input';
import '../button';

import { Component, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';

export type SenderProps = StyledProps & {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: CustomEvent) => void;
  onSubmit?: (e: CustomEvent) => void;
};

const className = `${getClassPrefix()}-chat-sender`;

@tag('t-chat-sender')
export default class Sender extends Component<SenderProps> {
  static css = `
    .${className}-wrapper {
    }
    .${className}-main {
      display: flex;
      align-items: center;
    }
  `;

  static propTypes = {
    value: String,
    defaultValue: String,
    placeholder: String,
    change: Function,
    submit: Function,
  };

  static defaultProps = {};

  private pValue = '';

  className = className;

  get inputValue() {
    if (this.props.value !== undefined) return this.props.value;
    return this.pValue;
  }

  handleChange = (v: string) => {
    this.pValue = v;
    this.update();

    this.fire('change', v, {
      composed: true,
    });
  };

  handleSubmit = () => {
    this.fire('submit', this.inputValue, {
      composed: true,
    });

    this.pValue = '';
    this.update();
  };

  install(): void {
    console.log('查看sender接收到的参数', this.props);
    this.pValue = this.props.value || this.props.defaultValue;
  }

  render(props: SenderProps) {
    const { placeholder } = props;

    return (
      <div className={`${this.className}-wrapper`}>
        <div className={`${this.className}-header`}>
          <slot name="header-content"></slot>
        </div>
        <div className={`${this.className}-main`}>
          {/* 问题：转lightDOM后input点击会不断复制 */}
          <t-input
            className={`${this.className}-input`}
            value={this.inputValue}
            placeholder={placeholder}
            onChange={this.handleChange}
          />
          {/* 问题：转lightDOM后slot渲染不出来 */}
          <t-button className={`${this.className}-submit`} onClick={this.handleSubmit}>
            提交
          </t-button>
        </div>
        <div className={`${this.className}-footer`}>
          <slot name="options"></slot>
        </div>
      </div>
    );
  }
}
