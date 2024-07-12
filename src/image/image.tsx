// import 'tdesign-icons-omi/image-error';
// import 'tdesign-icons-omi/image-1';
import '../space';

import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import observe from '../_common/js/utils/observe';
import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { TdImageProps } from './type';

export interface ImageProps extends TdImageProps, StyledProps {}

@tag('t-image')
export default class Image extends Component<ImageProps> {
  static css = [];

  static defaultProps = {
    fit: 'fill',
    gallery: false,
    lazy: false,
    overlayTrigger: 'always',
    position: 'center',
    shape: 'square',
  };

  static propTypes = {
    alt: String,
    error: Object,
    fit: String,
    gallery: Boolean,
    lazy: Boolean,
    loading: Object,
    overlayContent: Object,
    overlayTrigger: String,
    placeholder: Object,
    position: String,
    shape: String,
    src: String,
    srcset: Object,
    onError: Function,
    onLoad: Function,
  };

  componentName = `${getClassPrefix()}-image`;

  imageRef = createRef();

  imageSrc: string; // useMemo, local.replaceImageSrc(function replace image url)

  shouldLoad: boolean;

  isLoaded = false;

  hasError = false;

  hasMouseEvent: boolean;

  shouldShowOverlay: boolean;

  observerRefValue = null as HTMLElement;

  io: any;

  handleLoadImage = () => {
    this.shouldLoad = true;
    this.update();
  };

  handleLoad = (e: Event) => {
    this.isLoaded = true;
    this.props.onLoad?.({ e });
    this.update();
  };

  handleError = (e: Event) => {
    this.hasError = true;
    this.props.onError?.({ e });
    this.update();
  };

  handleToggleOverlay = (overlay: boolean) => {
    this.shouldShowOverlay = overlay;
    this.update();
  };

  // observe
  handleObserve = () => {
    const { lazy } = this.props;
    const { imageRef, handleLoadImage } = this;
    if (!lazy || !imageRef?.current) {
      return;
    }
    if (this.observerRefValue === this.imageRef.current) {
      return;
    }
    this.observerRefValue = imageRef.current as HTMLElement;
    this.io = observe(this.observerRefValue, null, handleLoadImage, 0);
  };

  beforeUpdate() {
    this.handleObserve();
  }

  install() {
    const { src, lazy, overlayTrigger } = this.props;
    this.imageSrc = src;
    this.shouldLoad = !lazy;
    this.hasMouseEvent = overlayTrigger === 'hover';
    this.shouldShowOverlay = !this.hasMouseEvent;
  }

  installed() {
    this.handleObserve();
  }

  uninstall() {
    const { imageRef, io } = this;
    imageRef.current && io && io.unobserve(imageRef.current);
  }

  render(props: OmiProps<ImageProps>) {
    const {
      componentName,
      isLoaded,
      imageRef,
      hasMouseEvent,
      shouldShowOverlay,
      hasError,
      shouldLoad,
      imageSrc,
      handleToggleOverlay,
      handleError,
      handleLoad,
    } = this;
    const {
      class: className,
      style,
      alt,
      fit,
      position,
      shape,
      placeholder,
      loading,
      error,
      gallery,
      overlayContent,
      srcset,
      ...rest
    } = props;

    delete rest.onLoad;
    delete rest.onError;
    delete rest.lazy;
    delete rest.overlayTrigger;
    delete rest.src;

    const renderOverlay = () => {
      if (!overlayContent) {
        return null;
      }
      return (
        <div
          class={classNames(
            `${componentName}__overlay-content`,
            !shouldShowOverlay && `${componentName}__overlay-content--hidden`,
          )}
        >
          {overlayContent}
        </div>
      );
    };

    const renderPlaceholder = () => {
      if (!placeholder) {
        return null;
      }
      return <div class={`${componentName}__placeholder`}>{placeholder}</div>;
    };

    const renderGalleryShadow = () => {
      if (!gallery) {
        return null;
      }
      return <div class={`${componentName}__gallery-shadow`} />;
    };

    const renderImage = (url: string) => (
      <img
        src={url}
        onError={handleError}
        onLoad={handleLoad}
        class={classNames(componentName, `${componentName}--fit-${fit}`, `${componentName}--position-${position}`)}
        alt={alt}
      />
    );

    const renderImageSrcset = () => (
      <picture>
        {Object.entries(props.srcset).map(([type, url]) => (
          <source key={url} type={type} srcSet={url} />
        ))}
        {props.src && renderImage(props.src)}
      </picture>
    );

    return (
      <div
        ref={imageRef}
        class={classNames(
          `${componentName}__wrapper`,
          `${componentName}__wrapper--shape-${shape}`,
          gallery && `${componentName}__wrapper--gallery`,
          hasMouseEvent && `${componentName}__wrapper--need-hover`,
          className,
        )}
        style={style}
        {...(hasMouseEvent
          ? {
              onMouseEnter: () => handleToggleOverlay(true),
              onMouseLeave: () => handleToggleOverlay(false),
            }
          : null)}
        {...rest}
      >
        {renderPlaceholder()}
        {renderGalleryShadow()}
        {!(hasError || !shouldLoad) && (
          <>
            {srcset && Object.keys(srcset).length ? renderImageSrcset() : renderImage(imageSrc)}
            {!(hasError || !shouldLoad) && !isLoaded && (
              <div class={`${componentName}__loading`}>
                {loading || (
                  <t-space direction="vertical" size={8} align="center">
                    <t-icon className="mb-[2px]" size={24} name={'image-1'} />
                    图片加载中
                  </t-space>
                )}
              </div>
            )}
          </>
        )}
        {hasError && (
          <div class={`${componentName}__error`}>
            {error || (
              <t-space direction="vertical" size={8} align="center">
                <t-icon className="mb-[2px]" size={24} name={'image-error'} />
                图片无法显示
              </t-space>
            )}
          </div>
        )}
        {renderOverlay()}
      </div>
    );
  }
}
