import '../skeleton';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import classname from '../_util/classname';
import { StyledProps } from '../common';
import { TdLoadingProps } from './type';

import styles from './style/loading.less';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

const className = `${getClassPrefix()}-chat-loading`;
@tag('t-chat-loading')
export default class Loading extends Component<LoadingProps> {
  static css = [styles];

  static propTypes = {
    animation: String,
    text: String,
  };

  containerRef = createRef<HTMLElement>();

  installed() {}

  get renderIcon() {
    const { animation = 'skeleton' } = this.props;
    if (['gradient', 'circle'].includes(animation)) {
      return <div class={`${className}__${animation}`} />;
    }
    if (animation === 'moving') {
      return (
        <div class={`${className}__moving`}>
          <div class={`${className}__moving--top`} />
          <div class={`${className}__moving--left`} />
          <div class={`${className}__moving--right`} />
        </div>
      );
    }
    return (
      <t-skeleton class={`${className}__skeleton`} loading={true} theme="paragraph" animation="gradient"></t-skeleton>
    );
  }

  render(props: LoadingProps) {
    const { text, animation = 'skeleton' } = props;

    return (
      <div class={classname(`${className}`, animation === 'skeleton' && `${className}__skeleton`)}>
        {this.renderIcon}
        {animation !== 'skeleton' && (
          <div class={classname(`${className}__text`, `${className}__text__${animation}`)}>{text}</div>
        )}
      </div>
    );
  }
}
