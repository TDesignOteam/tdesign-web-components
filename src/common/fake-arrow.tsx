import { Component, OmiProps, tag } from 'omi';

import classname, { classPrefix } from '../_util/classname';

/**
 * 展开图标方向
 */
export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

export interface FakeArrowProps {
  /**
   * 是否为激活态
   */
  isActive?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 自定义样式
   */
  style?: Partial<CSSStyleDeclaration>;

  /**
   * 箭头初始方向
   * @default down
   */
  direction?: ArrowDirection;

  /**
   * 激活时的箭头方向，仅在设置了 direction 属性时生效
   * @default up
   */
  activeDirection?: ArrowDirection;
}

const DIRECTION_ANGLE_MAP: Record<ArrowDirection, number> = {
  down: 0,
  left: 90,
  up: 180,
  right: 270,
};

const getAngle = (from: ArrowDirection, to: ArrowDirection): number => {
  const fromAngle = DIRECTION_ANGLE_MAP[from];
  const toAngle = DIRECTION_ANGLE_MAP[to];
  return toAngle <= fromAngle ? toAngle + 360 : toAngle;
};

@tag('t-fake-arrow')
export default class FakeArrow extends Component<FakeArrowProps> {
  componentName = `${classPrefix}-fake-arrow`;

  static propTypes = {
    isActive: Boolean,
    disabled: Boolean,
    style: Object,
    direction: String,
    activeDirection: String,
  };

  static css = `
.${classPrefix}-fake-arrow.${classPrefix}-is-disabled  {
  cursor: not-allowed;
  color: var(--td-text-color-disabled, var(--td-font-gray-4));
}
`;

  render(props: OmiProps<FakeArrowProps>) {
    const { isActive, disabled, direction, activeDirection = 'up' } = props;

    const isCustomDirection = direction !== undefined;

    const getRotateAngle = () => {
      if (!isCustomDirection) return 0;
      const directionAngle = DIRECTION_ANGLE_MAP[direction];
      if (isActive && !disabled) {
        return getAngle(direction, activeDirection);
      }
      return directionAngle;
    };
    const currentAngle = getRotateAngle();

    const classes = classname(this.componentName, {
      [`${classPrefix}-fake-arrow--active`]: !isCustomDirection && isActive && !disabled,
      [`${classPrefix}-is-disabled`]: disabled,
    });

    const style = {
      transition: 'transform 0.2s cubic-bezier(0.38, 0, 0.24, 1)',
      ...props.style,
    };

    if (isCustomDirection) {
      style.transform = `rotate(${currentAngle}deg)`;
    }

    return (
      <svg
        class={classes}
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="currentColor" stroke-width="1.3" />
      </svg>
    );
  }
}
