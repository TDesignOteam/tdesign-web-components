import { Component, render, tag } from 'omi';
import { convertToLightDomNode } from 'tdesign-web-components/_util/lightDom.ts';

import classname from '../_util/classname';
import { AttachNodeReturnValue, Styles, TNode } from '../common';
import { getMessageConfig, globalConfig, setGlobalConfig } from './config.ts';
import { PlacementOffset, tdMessageListClass, tdMessagePlacementClassGenerator } from './const.tsx';
import MessageComponent from './messageComponent.tsx';
import {
  MessageCloseAllMethod,
  MessageContainerProps,
  MessageInstance,
  MessageMethod,
  MessageOptions,
  MessagePluginType,
  MessageThemeList,
} from './type';

let MessageList: MessageInstance[] = [];
let keyIndex = 1;

@tag('t-message-container')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MessageContainer extends Component<MessageContainerProps> {
  static defaultProps = {
    placement: 'top',
    zIndex: 5000,
  };

  static propTypes = {
    placement: String,
    zIndex: Number,
    id: String,
    children: [String, Number, Object, Function],
    renderCallback: Function,
  };

  render(props) {
    const { placement, children, zIndex, id, className } = props;

    const style: Styles = {
      zIndex,
    };

    Object.keys(PlacementOffset[placement]).forEach((key) => {
      style[key] = PlacementOffset[placement][key];
    });

    if (placement.includes('top')) {
      style.top = `${globalConfig.top}px`;
    }
    return (
      <div className={className} style={style} id={id}>
        {children}
      </div>
    );
  }
}

function createContainer({ attach, zIndex, placement = 'top' }: MessageOptions): Promise<Element> {
  return new Promise((resolve) => {
    let mountedDom: AttachNodeReturnValue = document.body;

    if (typeof attach === 'string') {
      const result = document.querySelectorAll(attach);
      if (result.length > 0) {
        mountedDom = result.item(0);
      }
    } else if (typeof attach === 'function') {
      mountedDom = attach();
    }
    // 选择器找到一个挂载 message 的容器，不存在则创建
    const containerId = `tdesign-message-container--${placement}`;
    const container = Array.from(mountedDom.querySelectorAll(`#${containerId}`));
    if (container.length === 0) {
      const div = document.createElement('div');
      render(
        <t-message-container
          className={classname(tdMessageListClass, tdMessagePlacementClassGenerator(placement))}
          id={containerId}
          placement={placement}
          zIndex={zIndex}
        />,
        div,
      );
      mountedDom.appendChild(div);
      const container = Array.from(mountedDom.querySelectorAll(`#${containerId}`));
      resolve(container[0]);
    } else {
      resolve(container[0]);
    }
  });
}

async function renderElement(theme, config: MessageOptions): Promise<MessageInstance> {
  const placement = config.placement || 'top';
  const container = (await createContainer(config)) as HTMLElement;
  const { content, offset, onClose = () => {} } = config;
  const div = document.createElement('div');

  keyIndex += 1;
  const containerId = `tdesign-message-container--${placement}`;
  const aimContainer = container.shadowRoot.querySelector(`#${containerId}`);
  const message = {
    close: () => {
      div.remove();
      message.closed = true;
    },
    key: keyIndex,
    closed: false,
  };

  let style: Styles = { ...config.style };
  if (Array.isArray(offset) && offset.length === 2) {
    const [left, top] = offset;
    style = {
      left,
      top,
      ...style,
      position: 'relative',
    };
  }
  return new Promise((resolve) => {
    // 渲染组件
    render(
      convertToLightDomNode(
        <t-message
          key={keyIndex}
          {...config}
          theme={theme}
          style={style}
          onClose={(ctx) => {
            onClose(ctx);
            message.close();
          }}
        >
          {content}
        </t-message>,
      ),
      div,
    );
    // 将当前渲染的 message 挂载到指定的容器中
    aimContainer.appendChild(div);
    // message 推入 message 列表
    MessageList.push(message);
    // 将 message 实例通过 resolve 返回给 promise 调用方
    resolve(message);
  });
}

function isConfig(content: MessageOptions | TNode): content is MessageOptions {
  return Object.prototype.toString.call(content) === '[object Object]' && !!(content as MessageOptions).content;
}

const messageMethod: MessageMethod = (theme: MessageThemeList, content, duration?: number) => {
  let config = {} as MessageOptions;
  if (isConfig(content)) {
    config = {
      duration,
      ...content,
    };
  } else {
    config = {
      content,
      duration,
    };
  }
  return renderElement(theme, getMessageConfig(config));
};

export const MessagePlugin: MessagePluginType = (theme, message, duration) => messageMethod(theme, message, duration);
MessagePlugin.info = (content, duration) => messageMethod('info', content, duration);
MessagePlugin.error = (content, duration) => messageMethod('error', content, duration);
MessagePlugin.warning = (content, duration) => messageMethod('warning', content, duration);
MessagePlugin.success = (content, duration) => messageMethod('success', content, duration);
MessagePlugin.question = (content, duration) => messageMethod('question', content, duration);
MessagePlugin.loading = (content, duration) => messageMethod('loading', content, duration);
MessagePlugin.config = (options: MessageOptions) => setGlobalConfig(options);

MessagePlugin.close = (messageInstance) => {
  messageInstance.then((instance) => instance.close());
};

MessagePlugin.closeAll = (): MessageCloseAllMethod => {
  MessageList.forEach((message) => {
    typeof message.close === 'function' && message.close();
  });
  MessageList = [];
  return;
};

export default MessageComponent;
