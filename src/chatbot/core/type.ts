export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type ChatStatus = 'idle' | MessageStatus;
export type ContentType = 'text' | 'markdown' | 'search' | 'attachment' | 'thinking' | 'image' | 'audio' | 'video';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';
export type PhaseType = 'thinking' | 'search' | 'main';
// 基础类型
interface BaseContent<T extends ContentType> {
  type: T;
  status?: MessageStatus;
}

// 内容类型
export type TextContent = BaseContent<'text'> & {
  detail: string;
};

export type MarkdownContent = BaseContent<'markdown'> & {
  detail: string;
};

export type ImageContent = BaseContent<'image'> & {
  detail: {
    name?: string;
    url?: string;
    width?: number;
    height?: number;
  };
};

// 搜索
// 公共引用结构
export type ReferenceItem = {
  title: string;
  url?: string;
  detail?: string;
  source?: string;
  timestamp?: string;
};
export type SearchContent = BaseContent<'search'> & {
  detail: ReferenceItem[];
};

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
export type AttachmentContent = BaseContent<'attachment'> & {
  detail: AttachmentItem[];
};

// 思考过程
export type ThinkingContent = BaseContent<'thinking'> & {
  detail: {
    text?: string;
    // markdown?: string;
    title?: string;
  };
};

// 消息主体
// 基础消息结构
interface BaseMessage {
  id: string;
  status?: MessageStatus;
  timestamp?: string;
}

export type AIMessageContent = TextContent | MarkdownContent | ThinkingContent | ImageContent | SearchContent;
export type UserMessageContent = TextContent | AttachmentContent;

export interface UserMessage extends BaseMessage {
  role: 'user';
  content: UserMessageContent[];
}

export interface AIMessage extends BaseMessage {
  role: 'assistant';
  phase?: PhaseType;
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
  attachments?: AttachmentContent['detail'][];
}

export interface LLMConfig {
  endpoint?: string;
  stream?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  onRequest?: (params: RequestParams) => RequestInit;
  onMessage?: (chunk: SSEChunkData) => Message;
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

// 类型守卫函数
export function isUserMessage(message: Message) {
  return message.role === 'user' && 'content' in message;
}

export function isAIMessage(message: Message) {
  return message.role === 'assistant';
}
