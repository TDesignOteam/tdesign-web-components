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

  static propTypes = {
    isActive: Boolean,
    disabled: Boolean,
  };

  static css = `
.${classPrefix}-fake-arrow.${classPrefix}-is-disabled  {
  cursor: not-allowed;
  color: var(--td-text-color-disabled, var(--td-font-gray-4));
}
`;

  render(props) {
    const classes = classname(this.componentName, {
      [`${classPrefix}-is-disabled`]: props.disabled,
    });

    return (
      <svg
        class={classes}
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transition: 'all 0.2s cubic-bezier(0.38, 0, 0.24, 1)',
          transform: props.isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}
      >
        <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="currentColor" stroke-width="1.3" />
      </svg>
    );
  }
}
