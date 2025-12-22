import { classNames, Component, createRef, signal, tag } from 'omi';

import generateBase64Url from '../_common/js/watermark/generateBase64Url';
import randomMovingStyle from '../_common/js/watermark/randomMovingStyle';
import { getClassPrefix } from '../_util/classname';
import { createStyleSheet } from '../_util/lightDom';
import type { StyledProps } from '../common';
import { TdWatermarkProps } from './type';
import { createMutationObservable, getStyleStr } from './utils';

export interface WatermarkProps extends TdWatermarkProps, StyledProps {}

@tag('t-watermark')
export default class Watermark extends Component<WatermarkProps> {
  static propsType = {
    alpha: Number,
    content: [String, Number, Object, Function],
    height: Number,
    isRepeat: Boolean,
    lineSpace: Number,
    movable: Number,
    moveInterval: Number,
    offset: Array,
    removable: Boolean,
    rotate: Number,
    watermarkContent: Object,
    width: Number,
    x: Number,
    y: Number,
    zIndex: Number,
  };

  static defaultProps = {
    alpha: 1,
    isRepeat: true,
    lineSpace: 16,
    movable: false,
    moveInterval: 3000,
    removable: false,
    rotate: -22,
    width: 120,
    height: 60,
    offset: [],
  };

  watermarkRef = createRef<HTMLDivElement>();

  watermarkImgRef = createRef<HTMLDivElement>();

  styleStr = '';

  stopObservation = signal(false);

  selfDisconnect;

  async ready() {
    const { x, y, rotate: tempRotate, movable, offset } = this.props;

    let gapX = x;
    let gapY = y;
    let rotate = tempRotate;
    if (movable) {
      gapX = 0;
      gapY = 0;
      rotate = 0;
    }

    const offsetLeft = offset[0] || gapX / 2;
    const offsetTop = offset[1] || gapY / 2;

    this.generateBase64Url(this.props, { gapX, gapY, rotate, offsetLeft, offsetTop });

    // 水印节点 - 变化时重新渲染
    this.selfDisconnect = createMutationObservable(this.watermarkRef.current, (mutations) => {
      if (this.stopObservation.value) return;
      if (movable) return;
      mutations.forEach((mutation) => {
        // 水印节点被删除
        if (mutation.type === 'childList') {
          const removeNodes = mutation.removedNodes;
          removeNodes.forEach((node) => {
            const element = node as HTMLElement;
            if (element === this.watermarkImgRef.current) {
              this.renderWatermark();
            }
          });
        }
        // 水印节点其他变化
        if (mutation.target === this.watermarkImgRef.current) {
          this.renderWatermark();
        }
      });
    });

    // 组件父节点 - 增加 keyframes
    const keyframesStyle = randomMovingStyle();

    this.shadowRoot.adoptedStyleSheets.push(createStyleSheet(keyframesStyle));
  }

  async receiveProps(newProps) {
    const { x, y, rotate: tempRotate, movable, offset } = newProps;

    let gapX = x;
    let gapY = y;
    let rotate = tempRotate;
    if (movable) {
      gapX = 0;
      gapY = 0;
      rotate = 0;
    }

    const offsetLeft = offset[0] || gapX / 2;
    const offsetTop = offset[1] || gapY / 2;

    this.generateBase64Url(newProps, { gapX, gapY, rotate, offsetLeft, offsetTop });
  }

  generateBase64Url(props, { rotate, gapX, gapY, offsetLeft, offsetTop }) {
    const { width, height, lineSpace, alpha, watermarkContent } = props;
    generateBase64Url(
      {
        width,
        height,
        rotate,
        lineSpace,
        alpha,
        gapX,
        gapY,
        watermarkContent,
        offsetLeft,
        offsetTop,
      },
      (url) => {
        this.generateStyleStr(url, props, { gapX });
        this.renderWatermark();
      },
    );
  }

  async generateStyleStr(url, props, { gapX }) {
    const { zIndex, isRepeat, moveInterval, movable, width, style } = props;

    let backgroundRepeat = '';
    if (movable) {
      backgroundRepeat = 'no-repeat';
    } else {
      backgroundRepeat = isRepeat ? 'repeat' : 'no-repeat';
    }
    this.styleStr = getStyleStr({
      zIndex: zIndex?.toString() ?? '10',
      position: 'absolute',
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      width: movable ? `${width}px` : '100%',
      height: movable ? `${width}px` : '100%',
      backgroundSize: `${gapX + width}px`,
      pointerEvents: 'none',
      backgroundRepeat,
      backgroundImage: `url('${url}')`,
      animation: movable ? `watermark infinite ${(moveInterval * 4) / 60}s` : 'none',
      ...style,
    });
  }

  renderWatermark() {
    // 停止监听
    this.stopObservation.value = true;
    // 删除之前
    this.watermarkImgRef.current?.remove?.();
    this.watermarkImgRef.current = undefined;
    // 创建新的
    this.watermarkImgRef.current = document.createElement('div');
    this.watermarkImgRef.current.setAttribute('style', this.styleStr);
    this.watermarkRef.current?.append(this.watermarkImgRef.current);
    // 继续监听
    setTimeout(() => {
      this.stopObservation.value = false;
    });
  }

  uninstall(): void {
    this.selfDisconnect();
  }

  render(props: WatermarkProps) {
    const { content, children, innerClass, innerStyle } = props;

    const classPrefix = getClassPrefix();

    const clsName = `${classPrefix}-watermark`;

    return (
      <div ref={this.watermarkRef} className={classNames([clsName, innerClass])} style={innerStyle}>
        {children || content}
      </div>
    );
  }
}
