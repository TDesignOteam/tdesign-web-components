import { Component, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';

export interface FakeArrowProps {
  /**
   * 是否为激活态
   */
  isActive?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

@tag('t-fake-arrow')
export default class FakeArrow extends Component<FakeArrowProps> {
  componentName = `${classPrefix}-fake-arrow`;

  static css = `
.t-fake-arrow.t-is-disabled  {
  cursor: not-allowed;
  color: var(--td-text-color-disabled, var(--td-font-gray-4));
}
`;

  render(props) {
    const classes = classname(this.componentName, {
      [`${this.componentName}--active`]: props.isActive,
      [`${classPrefix}-is-disabled`]: props.disabled,
    });

    return (
      <svg
        class={classes}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={props.isActive ? 'transform: rotate(0deg);' : 'transform: rotate(-90deg);'}
      >
        <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="black" stroke-opacity="0.9" stroke-width="1.3" />
      </svg>
    );
  }
}
