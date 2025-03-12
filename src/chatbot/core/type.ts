export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type ChatStatus = 'idle' | MessageStatus;
export type ContentType = 'text' | 'markdown' | 'image' | 'audio' | 'video';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';
export type MediaFormat = {
  image: 'jpg' | 'png' | 'webp';
  audio: 'mp3' | 'wav' | 'ogg';
  video: 'mp4' | 'mov' | 'avi';
};

// 基础类型
interface BaseContent<T extends ContentType> {
  type: T;
  status: MessageStatus;
}

interface BaseMediaItem<F = string> {
  url: string;
  format?: F;
  duration?: number;
  metadata?: Record<string, any>;
}

// 内容类型
export type TextContent = BaseContent<'text' | 'markdown'> & {
  content: string;
};

export type ImageContent = BaseContent<'image'> & {
  content: (BaseMediaItem<MediaFormat['image']> & {
    source?: string;
    alt?: string;
    resolution?: [number, number];
  })[];
};

export type AudioContent = BaseContent<'audio'> & {
  content: (BaseMediaItem<MediaFormat['audio']> & {
    source?: string;
    sampleRate?: number;
  })[];
};

export type VideoContent = BaseContent<'video'> & {
  content: (BaseMediaItem<MediaFormat['video']> & {
    source?: string;
    poster?: string;
    resolution?: [number, number];
  })[];
};

export type MessageContent = TextContent | ImageContent | AudioContent | VideoContent;

// 公共引用结构
export interface ReferenceItem {
  title: string;
  url?: string;
  detail?: string;
  source?: string;
  timestamp?: string;
}

interface PhaseContent<T = string> {
  status: MessageStatus;
  title?: string;
  content?: T;
}

// 搜索和思考
export type SearchResult = PhaseContent<ReferenceItem[]>;
export type ThinkingContent = PhaseContent<string> & {
  type?: 'text' | 'markdown';
};

// 附件系统
export interface AttachmentContent {
  type: string;
  name: string;
  url: string;
  size: number;
  isReference?: boolean;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

// 消息主体
// 基础消息结构
interface BaseMessage {
  id: string;
  status: MessageStatus;
  timestamp?: string;
}

export interface UserMessage extends BaseMessage {
  role: 'user';
  content: string;
  attachments?: AttachmentContent[];
}

export interface SystemMessage extends BaseMessage {
  role: 'system';
  content: string;
}

export type Message = UserMessage | AIMessage | SystemMessage;

// 回答消息体配置
export interface AIMessage extends BaseMessage, AIResponse {
  role: 'assistant';
}

export interface AIResponse {
  main?: MessageContent;
  search?: SearchResult;
  thinking?: ThinkingContent;
}

export type SSEChunkData = {
  event?: string;
  data: any;
};

export interface RequestParams extends ModelParams {
  messageID: string;
  prompt: string;
  attachments?: AttachmentContent[];
}

export interface LLMConfig {
  endpoint?: string;
  stream?: boolean;
  retryInterval?: number;
  maxRetries?: number;
  onRequest?: (params: RequestParams) => RequestInit;
  onMessage?: (chunk: SSEChunkData) => AIResponse;
  onComplete?: (isAborted: Boolean, params: RequestParams, result?: any) => void;
  onAbort?: () => void;
  onError?: (error: Error, params: RequestParams) => void;
}

// 消息相关状态
export interface MessageState {
  messageIds: string[];
  messages: Record<string, Message>;
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
export function isUserMessage(message: Message): message is UserMessage {
  return message.role === 'user' && 'content' in message;
}

export function isAIMessage(message: Message): message is AIMessage {
  return message.role === 'assistant';
}
