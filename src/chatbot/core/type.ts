export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type ChatStatus = 'idle' | MessageStatus;
export type ContentType = 'text' | 'markdown' | 'search' | 'attachment' | 'thinking' | 'image' | 'audio' | 'video';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';

// 基础类型
export interface BaseContent<T extends string, TData> {
  type: T;
  data: TData;
  status?: MessageStatus;
  id?: string;
}

// 内容类型
export type TextContent = BaseContent<'text', string>;

export type MarkdownContent = BaseContent<'markdown', string>;

export type ImageContent = BaseContent<
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
  url?: string;
  detail?: string;
  source?: string;
  timestamp?: string;
};
export type SearchContent = BaseContent<'search', ReferenceItem[]>;

// 附件消息
export type AttachmentItem = {
  fileType: AttachmentType;
  name: string;
  url: string;
  size: number;
  isReference?: boolean; // 是否是引用
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
};
export type AttachmentContent = BaseContent<'attachment', AttachmentItem[]>;

// 思考过程
export type ThinkingContent = BaseContent<
  'thinking',
  {
    text?: string;
    // markdown?: string;
    title?: string;
  }
>;

// 消息主体
// 基础消息结构
interface BaseMessage {
  id: string;
  status?: MessageStatus;
  timestamp?: string;
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
} & AIContentTypeOverrides;

// 自动生成联合类型
// export type AIMessageContent = AIContentTypeMap[keyof AIContentTypeMap];
export type AIMessageContent = {
  [K in keyof AIContentTypeMap]: AIContentTypeMap[K];
}[keyof AIContentTypeMap];
export type UserMessageContent = TextContent | AttachmentContent;

export interface UserMessage extends BaseMessage {
  role: 'user';
  content: UserMessageContent[];
}

export interface AIMessage extends BaseMessage {
  role: 'assistant';
  content: AIMessageContent[];
}

export interface SystemMessage extends BaseMessage {
  role: 'system';
  content: TextContent[];
}

export type Message = UserMessage | AIMessage | SystemMessage;

// 回答消息体配置
export type SSEChunkData = {
  event?: string;
  data: any;
};

export interface RequestParams extends ModelParams {
  messageID: string;
  prompt: string;
  attachments?: AttachmentContent['data'];
}

export interface LLMConfig {
  endpoint?: string;
  stream?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  onRequest?: (params: RequestParams) => RequestInit;
  onMessage?: (chunk: SSEChunkData) => AIMessageContent;
  onComplete?: (isAborted: Boolean, params: RequestParams, result?: any) => void;
  onAbort?: () => void;
  onError?: (error: Error, params: RequestParams) => void;
}

// 消息相关状态
export interface MessageState {
  messageIds: string[];
  messages: Message[];
}

// 模型服务相关状态
export interface ModelParams {
  model?: string;
  useThink?: boolean;
  useSearch?: boolean;
}

export interface ModelServiceState extends ModelParams {
  config: LLMConfig;
}

// 聚合根状态
export interface ChatState {
  message: MessageState;
  model: ModelServiceState;
}

export type AIContentHandler<T extends BaseContent<any, any>> = (chunk: T, existing?: T) => T;

export interface ContentTypeDefinition<T extends string = string, D = any> {
  type: T;
  handler?: AIContentHandler<BaseContent<T, D>>;
  renderer?: ContentRenderer<BaseContent<T, D>>;
}

export type ContentRenderer<T extends BaseContent<any, any>> = (content: T) => unknown;

// 类型守卫函数
export function isUserMessage(message: Message) {
  return message.role === 'user' && 'content' in message;
}

export function isAIMessage(message: Message) {
  return message.role === 'assistant';
}

export function isThinkingContent(content: AIMessageContent): content is ThinkingContent {
  return content.type === 'thinking';
}

export function isTextContent(content: AIMessageContent): content is TextContent {
  return content.type === 'text';
}

export function isMarkdownContent(content: AIMessageContent): content is MarkdownContent {
  return content.type === 'markdown';
}

export function isImageContent(content: AIMessageContent): content is ImageContent {
  return content.type === 'image';
}

export function isSearchContent(content: AIMessageContent): content is SearchContent {
  return content.type === 'search';
}
