import { Component } from 'omi';

/**
 * 当组件的props.ignoreFire为true时，跳过fire事件派发
 *
 * 用法：
 * class Input extends Component<InputProps> {
 *   private emit = createEmit(this);
 *
 *   handleChange = () => {
 *     this.emit('change', value);
 *   }
 * }
 */
export function createEmit(component: Component) {
  return (eventName: string, data: any, options?: { bubbles?: boolean; composed?: boolean }) => {
    if ((component.props as any).ignoreFire) {
      return;
    }

    // 调用方为omi环境时也跳过，避免重复触发
    if (isCallerOmiComponent(component)) {
      return;
    }

    component.fire(eventName, data, { bubbles: true, composed: true, ...options });
  };
}

/**
 * 通过shadow root判断调用方是否为omi环境
 */
function isCallerOmiComponent(component: Component) {
  const host = (component as any).rootElement || component;
  const parent = host?.parentNode;

  if (parent?.constructor?.name === 'ShadowRoot') {
    return true;
  }

  const parentElement = host?.parentElement;
  // eslint-disable-next-line no-underscore-dangle
  if (parentElement && (parentElement as any).__omi_component__) {
    return true;
  }

  return false;
}
