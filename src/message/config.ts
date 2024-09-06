import { messageDefaultProps } from './defaultProps';
import { MessageOptions } from './type';

/**
 * @name: globalConfig
 * @description: message 组件全局的默认配置
 * */
export const globalConfig = {
  top: 32,
};

// 全局默认配置，zIndex 为 5000，默认关闭时间 3000ms
let messageDefaultConfig: MessageOptions = {
  ...messageDefaultProps,
  duration: 3000,
  placement: 'top',
  zIndex: 5000,
};

/**
 * @name: getMessageConfig
 * @description: 组合 currentOptions 和 defaultConfig 拼装成最终生效的 options
 * 保证所有的配置出口都通过该函数，当后续封装 globalConfig 时从此处添加即可全局生效
 * @return: MessageOptions
 * @param options
 * */
export const getMessageConfig = (options: MessageOptions): MessageOptions => {
  const currentOptions = { ...options };

  for (const i in currentOptions) {
    if (typeof currentOptions[i] === 'undefined') {
      delete currentOptions[i];
    }
  }

  // duration 判断
  if (typeof currentOptions.duration !== 'number' || currentOptions.duration < 0) {
    delete currentOptions.duration;
  }

  return {
    ...messageDefaultConfig,
    ...currentOptions,
  };
};

/**
 * @name: setGlobalConfig
 * @description: 设置全局配置
 * */
export const setGlobalConfig = (options: MessageOptions) => {
  messageDefaultConfig = {
    ...getMessageConfig(options),
  };
};
