import '../skeleton';

import { Component, createRef, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import classname from '../_util/classname';
import { setExportparts } from '../_util/dom';
import styles from './style/loading.less?inline';
import { TdChatLoadingProps } from './type';

const className = `${getClassPrefix()}-chat-loading`;
@tag('t-chat-loading')
export default class Loading extends Component<TdChatLoadingProps> {
  static css = [styles];

  static propTypes = {
    animation: String,
    text: String,
  };

  static defaultProps: Partial<TdChatLoadingProps> = {
    text: '',
    animation: 'moving',
  };

  containerRef = createRef<HTMLElement>();

  ready() {
    setExportparts(this);
  }

  get renderIcon() {
    const { animation } = this.props;
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
    if (animation === 'dots') {
      return (
        <div class={`${className}__dot`}>
          <span class={`${className}__dot-item`} style={{ animationDelay: '0s' }}></span>
          <span class={`${className}__dot-item`} style={{ animationDelay: '0.2s' }}></span>
          <span class={`${className}__dot-item`} style={{ animationDelay: '0.4s' }}></span>
        </div>
      );
    }
    return (
      <t-skeleton class={`${className}__skeleton`} loading={true} theme="paragraph" animation="gradient"></t-skeleton>
    );
  }

  render(props: TdChatLoadingProps) {
    const { text, animation } = props;

    return (
      <div class={classname(`${className}`, animation === 'skeleton' && `${className}__skeleton`)}>
        {this.renderIcon}
        {animation !== 'skeleton' && text !== '' && (
          <div class={classname(`${className}__text`, `${className}__text__${animation}`)}>{text}</div>
        )}
      </div>
    );
  }
}
