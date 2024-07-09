import { Component, createRef, tag } from 'omi';

import circleAdapter from '../_common/js/loading/circle-adapter';
import classnames, { getClassPrefix } from '../_util/classname';

/**
 * Loading组件 渐变部分实现
 */
@tag('t-loading-gradient')
export default class GradientLoading extends Component {
  conicRef = createRef();

  static isLightDOM = true;

  installed(): void {
    // settimeout的目的是为了拿到color的值，getComputedStyle 会拿不到最新的color
    setTimeout(() => {
      circleAdapter(this.conicRef.current as HTMLElement);
    });
  }

  render() {
    const classPrefix = getClassPrefix();
    const gradientClass = `${classPrefix}-loading__gradient`;
    return (
      <svg
        className={classnames(gradientClass, `${classPrefix}-icon-loading`)}
        viewBox="0 0 12 12"
        version="1.1"
        width="1em"
        height="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="0" y="0" width="12" height="12">
          <div className={`${gradientClass}-conic`} ref={this.conicRef} />
        </foreignObject>
      </svg>
    );
  }
}
