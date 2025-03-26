import MarkdownIt from 'markdown-it';

import type { StyledProps, TNode } from '../common';
import type { Attachment } from '../filecard';
import type { MessageRole, ModelServiceState } from './core/type';
import type { Message } from './core/type';

export type TdChatItemActionName = 'copy' | 'good' | 'bad' | 'replay' | 'share';

export interface TdChatItemAction {
  name: TdChatItemActionName;
  render: TNode;
  // 满足条件才展示
  condition?: (message: Message) => boolean;
}

export interface TdChatRenderConfig {
  /** slot命名规则 */
  slotName?: string;
}

export type TdChatCustomRenderConfig = Record<string, (props: any) => TdChatRenderConfig | undefined | null>;

export interface TdChatItemProps {
  /**
   * 操作
   */
  actions?: TdChatItemAction[] | ((preset: TdChatItemAction[]) => TdChatItemAction[]) | boolean;
  /**
   * 作者
   */
  name?: string | TNode;
  /**
   * 头像
   */
  avatar?: string | TNode;
  /**
   * 时间
   */
  datetime?: string | TNode;
  /**
   * 消息类型
   */
  role?: MessageRole;
  /**
   * 消息样式，是否有边框，背景色等
   */
  variant?: Variant;
  /** 气泡方向 */
  placement?: 'left' | 'right';
  /** 消息体 */
  message: Message;
  /** 透传chat-content参数 */
  chatContentProps?: Omit<TdChatContentProps, 'content' | 'role'>;
  /** 自定义消息体渲染配置 */
  customRenderConfig?: TdChatCustomRenderConfig;
}

interface ChatProps {
  children?: TNode;
  /**
   * 布局
   */
  layout?: Layout;
  /**
   * 倒序渲染
   */
  reverse?: boolean;
  /** role对应的item配置 */
  rolesConfig?: TdChatRolesConfig;
  /**
   * 数据
   */
  items?: Array<TdChatItemProps>;
  inputCSS?: string;
  /**
   * 接口请求中
   */
  textLoading?: boolean;
  /** 清空历史按钮，值为 true 显示默认操作按钮，值为 false 不显示任何内容，值类型为 Function 表示自定义 */
  clearHistory?: boolean | TNode;
  /** 点赞差评复制重新生成按钮集合，值为true显示默认操作按钮 */
  actions?: boolean | TNode;
  // 流式数据加载中
  isStreamLoad?: boolean;
  modelConfig: ModelServiceState;
  attachmentProps?: {
    onFileSelected?: (files: File[]) => Promise<Attachment[]>;
    onFileRemove?: (file: Attachment) => void;
  };
  onClear?: (context: { e: MouseEvent }) => void;
}

export interface TdChatProps extends ChatProps, StyledProps {}

export type TdChatRolesConfig = Record<ModelRoleEnum, Partial<TdChatItemProps>>;

export interface TdChatListProps {
  /** 自动滚动底部 */
  autoScroll?: boolean;
  /** 滚动底部按钮 */
  scrollToBottom?: boolean;
  onScroll?: (e: Event) => void;
}

/** markdown插件预设 */
export type TdChatContentMDPresetPlugin = 'code' | 'link' | 'katex';

export interface TdChatContentMDPresetConfig {
  preset: TdChatContentMDPresetPlugin;
  /** 是否开启 */
  enabled?: boolean;
  /** 插件参数 */
  options?: any;
}

export type TdChatContentMDPluginConfig =
  /** 预设插件配置 */
  | TdChatContentMDPresetConfig
  /** markdownIt原生插件配置 */
  | MarkdownIt.PluginSimple
  | MarkdownIt.PluginWithParams
  | MarkdownIt.PluginWithOptions;

export interface TdChatContentMDProps {
  options?: MarkdownIt.Options;
  pluginConfig?: Array<TdChatContentMDPluginConfig>;
}

export interface TdChatContentProps {
  content?: string;
  role?: string;
  markdownProps?: TdChatContentMDProps;
}

export interface TdChatCodeProps {
  lang: string;
  code: string;
}

export interface MetaData {
  /**
   * 角色头像
   * @description 可选参数，如果不传则使用默认头像
   */
  avatar?: string;
  /**
   * 名称
   * @description 可选参数，如果不传则使用默认名称
   */
  name?: string;
  /**
   * 附加数据
   * @description 可选参数，如果不传则使用默认名称
   */
  [key: string]: any;
}
export interface TdChatItemMeta {
  avatar?: string;
  name?: string;
  role?: string;
  datetime?: string;
}
export type ModelRoleEnum = 'assistant' | 'user' | 'system';

export type Variant = 'base' | 'text' | 'outline';
export type Layout = 'single' | 'both';
export interface FetchSSEOptions {
  success?: (res: SSEEvent) => void; // 流式数据解析成功回调
  fail?: () => void; // 流式请求失败回调
  complete?: (isOk: Boolean, msg?: String, requestid?: String) => void; // 流式请求完成回调
}
export interface SSEEvent {
  type: string | null;
  data: string | null;
}
export interface BackBottomParams {
  behavior?: 'auto' | 'smooth';
}
