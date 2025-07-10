export type ChatMessageRole = 'user' | 'assistant' | 'system';
export type ChatMessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type ChatStatus = 'idle' | ChatMessageStatus;
export type ChatContentType =
  | 'text'
  | 'markdown'
  | 'search'
  | 'attachment'
  | 'thinking'
  | 'image'
  | 'audio'
  | 'video'
  | 'suggestion';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';

// 基础类型
export interface ChatBaseContent<T extends string, TData> {
  type: T;
  data: TData;
  status?: ChatMessageStatus | ((currentStatus: ChatMessageStatus | undefined) => ChatMessageStatus);
  id?: string;
}

// 内容类型
export type TextContent = ChatBaseContent<'text', string>;

export type MarkdownContent = ChatBaseContent<'markdown', string>;

export type ImageContent = ChatBaseContent<
  'image',
  {
    name?: string;
    url?: string;
    width?: number;
    height?: number;
  }
>;

// 搜索
// 公共引用结构
export type ReferenceItem = {
  title: string;
  icon?: string;
  type?: string;
  url?: string;
  content?: string;
  site?: string;
  date?: string;
};
export type SearchContent = ChatBaseContent<
  'search',
  {
    title?: string;
    references?: ReferenceItem[];
  }
>;

export type SuggestionItem = {
  title: string;
  prompt?: string;
};
export type SuggestionContent = ChatBaseContent<'suggestion', SuggestionItem[]>;

// 附件消息
export type AttachmentItem = {
  fileType: AttachmentType;
  size?: number;
  name?: string;
  url?: string;
  isReference?: boolean; // 是否是引用
  width?: number;
  height?: number;
  extension?: string; // 自定义文件后缀，默认按照name文件名后缀识别
  metadata?: Record<string, any>;
};
export type AttachmentContent = ChatBaseContent<'attachment', AttachmentItem[]>;

// 思考过程
export type ThinkingContent = ChatBaseContent<
  'thinking',
  {
    text?: string;
    title?: string;
  }
>;

// 消息主体
// 基础消息结构

export interface ChatBaseMessage {
  id: string;
  status?: ChatMessageStatus;
  datetime?: string;
  ext?: any;
}

// 类型扩展机制
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AIContentTypeOverrides {}
}

type AIContentTypeMap = {
  text: TextContent;
  markdown: MarkdownContent;
  thinking: ThinkingContent;
  image: ImageContent;
  search: SearchContent;
  suggestion: SuggestionContent;
} & AIContentTypeOverrides;

// 自动生成联合类型
// export type AIMessageContent = AIContentTypeMap[keyof AIContentTypeMap];
// export type AIMessageContent = {
//   [K in keyof AIContentTypeMap]: AIContentTypeMap[K];
// }[keyof AIContentTypeMap];

export type AIContentType = keyof AIContentTypeMap;
export type AIMessageContent = AIContentTypeMap[AIContentType];
export type UserMessageContent = TextContent | AttachmentContent;

export interface UserMessage extends ChatBaseMessage {
  role: 'user';
  content: UserMessageContent[];
}

export type ChatComment = 'good' | 'bad' | '';

export interface AIMessage extends ChatBaseMessage {
  role: 'assistant';
  content?: AIMessageContent[];
  /** 点赞点踩 */
  comment?: ChatComment;
}

export interface SystemMessage extends ChatBaseMessage {
  role: 'system';
  content: TextContent[];
}

export type ChatMessagesData = UserMessage | AIMessage | SystemMessage;

// 回答消息体配置
export type SSEChunkData = {
  event?: string;
  data: any;
};

export interface ChatRequestParams extends RequestInit {
  prompt: string;
  messageID?: string;
  attachments?: AttachmentContent['data'];
}

// 基础配置类型
export type AIContentChunkUpdate = AIMessageContent & {
  // 将新内容块和入策略，merge表示和入到同类型内容中，append表示作为新的内容块，默认是merge
  strategy?: 'merge' | 'append';
};

// SSE连接层事件回调（技术层面）
export interface SSEConnectionCallbacks {
  /** 心跳检测 - 每10秒触发，用于监控连接健康状态 */
  onHeartbeat?: (event: { connectionId: string; timestamp: number }) => void;
  /** 连接状态变化 - 监控连接技术状态：connecting/connected/reconnecting/error等 */
  onConnectionStateChange?: (event: { connectionId: string; from: string; to: string; timestamp: number }) => void;
  /** 连接建立成功 - SSE连接技术层面建立完成 */
  onConnectionEstablished?: (connectionId: string) => void;
  /** 连接断开 - SSE连接技术层面断开（可能会自动重连） */
  onConnectionLost?: (connectionId: string) => void;
}

// 网络请求配置（纯技术配置）
export interface ChatNetworkConfig {
  /** 请求端点 */
  endpoint?: string;
  /** 是否启用流式传输 */
  stream?: boolean;
  /** 重试间隔（毫秒） */
  retryInterval?: number;
  /** 最大重试次数 */
  maxRetries?: number;
  /** SSE连接技术层面的监控回调 */
  connection?: SSEConnectionCallbacks;
}

// 主配置接口 - 三选一的配置模式
export interface ChatServiceConfig extends ChatNetworkConfig {
  /** 请求发送前配置 */
  onRequest?: (params: ChatRequestParams) => RequestInit | Promise<RequestInit>;
  /** 接收到消息数据块 - 用于解析和处理聊天内容 */
  onMessage?: (chunk: SSEChunkData, message?: ChatMessagesData) => AIContentChunkUpdate | AIMessageContent[] | null;
  /** 对话完成 - 聊天业务流程结束（正常完成/用户中断/出错） */
  onComplete?: (isAborted: boolean, params: RequestInit, result?: any) => void;
  /** 用户主动中断对话 */
  onAbort?: () => Promise<void>;
  /** 错误处理 */
  onError?: (err: Error | Response) => void;
}

// 联合类型支持静态配置和动态生成
export type ChatServiceConfigSetter = ChatServiceConfig | ((params?: any) => ChatServiceConfig);

// 消息相关状态
export interface ChatMessageStore {
  messageIds: string[];
  messages: ChatMessagesData[];
}

// 模型服务相关状态
export interface ModelParams {
  model?: string;
  useThink?: boolean;
  useSearch?: boolean;
}

export interface ModelServiceState extends ModelParams {
  config: ChatServiceConfig;
}

// 聚合根状态
export interface ChatState {
  message: ChatMessageStore;
  model: ModelServiceState;
}

export type ChatMessageSetterMode = 'replace' | 'prepend' | 'append';

export type AIContentHandler<T extends ChatBaseContent<any, any>> = (chunk: T, existing?: T) => T;

export interface ContentTypeDefinition<T extends string = string, D = any> {
  type: T;
  handler?: AIContentHandler<ChatBaseContent<T, D>>;
  renderer?: ContentRenderer<ChatBaseContent<T, D>>;
}

export type ContentRenderer<T extends ChatBaseContent<any, any>> = (content: T) => unknown;
