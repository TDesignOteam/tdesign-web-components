import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import { getClassPrefix, getCommonClassName } from '../_util/classname';
import { StyledProps } from '../common';
import { ImageProps } from '../image';
import { TdAvatarProps } from './type';

export interface AvatarProps extends TdAvatarProps, StyledProps {}

@tag('t-avatar')
export default class Avatar extends Component<AvatarProps> {
  static css = [];

  static defaultProps = { hideOnLoadFailed: false, shape: 'circle' };

  static propTypes = {
    alt: String,
    hideOnLoadFailed: Boolean,
    icon: Object,
    image: String,
    shape: String,
    size: String,
    onError: Function,
    children: Object,
    content: Object,
    style: Object,
    imageProps: Object,
  };

  scale = 1;

  gap = 4;

  isImgExist = true;

  inject = ['groupSize'];

  groupSize: any;

  avatarRef = createRef();

  avatarChildrenRef = createRef();

  componentName = `${getClassPrefix()}-avatar`;

  handleScale = () => {
    const { avatarChildrenRef, avatarRef, gap } = this;
    if (!avatarChildrenRef.current || !avatarRef.current) {
      return;
    }
    const avatar = avatarRef.current as HTMLElement;
    const children = avatarChildrenRef.current as HTMLElement;
    const avatarWidth = avatar.offsetWidth;
    const childrenWidth = children.offsetWidth;

    if (childrenWidth !== 0 && avatarWidth !== 0) {
      if (gap * 2 < avatarWidth) {
        this.scale = avatarWidth - gap * 2 < childrenWidth ? (avatarWidth - gap * 2) / childrenWidth : 1;
      }
    }
  };

  handleImgLoadError: ImageProps['onError'] = (ctx) => {
    const { hideOnLoadFailed, onError } = this.props;
    onError?.(ctx);
    if (!hideOnLoadFailed) {
      this.isImgExist = false;
      this.update();
    }
  };

  // resizeObserver
  beforeRender(): void {
    this.groupSize = this.injection ? this.injection.groupSize : null;
  }

  installed() {
    this.handleScale();
    this.update();
  }

  render(props: OmiProps<AvatarProps, any>) {
    const { SIZE } = getCommonClassName();
    const { componentName, isImgExist, groupSize, avatarRef, avatarChildrenRef, handleImgLoadError } = this;
    const {
      alt,
      icon,
      image,
      shape,
      size: avatarSize,
      children,
      content,
      innerClass,
      innerStyle,
      imageProps,
      ...avatarProps
    } = props;

    delete avatarProps.className;
    delete avatarProps.style;

    const size = avatarSize === undefined ? groupSize : avatarSize;

    const numSizeStyle =
      size && !SIZE[size]
        ? {
            width: size,
            height: size,
            fontSize: `${Number.parseInt(size, 10) / 2}px`,
          }
        : {};

    const imageStyle =
      size && !SIZE[size]
        ? {
            width: size,
            height: size,
          }
        : {};

    const avatarClass = classNames(
      componentName,
      {
        [SIZE[size]]: !!SIZE[size],
        [`${componentName}--${shape}`]: !!shape,
        [`${componentName}__icon`]: !!icon,
      },
      innerClass,
    );
    let renderChildren: string | number | boolean | object;

    if (image && isImgExist) {
      renderChildren = (
        <t-image src={image} alt={alt} style={imageStyle} onError={handleImgLoadError} {...imageProps} />
      );
    } else if (icon) {
      renderChildren = icon;
    } else {
      const childrenStyle = {
        transform: `scale(${this.scale})`,
      };
      const renderChildrenContent = children && children[0] ? children : content;
      renderChildren = (
        <span ref={avatarChildrenRef} style={childrenStyle}>
          {renderChildrenContent}
        </span>
      );
    }
    return (
      <div class={avatarClass} style={{ ...numSizeStyle, ...innerStyle }} {...avatarProps} ref={avatarRef}>
        {renderChildren}
      </div>
    );
  }
}
