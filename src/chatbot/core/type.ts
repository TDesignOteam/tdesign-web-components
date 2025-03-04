export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'streaming' | 'sent' | 'error';
export type ContentType = 'text' | 'markdown' | 'image' | 'audio' | 'video';
export type AttachmentType = 'file' | 'image' | 'video' | 'audio';
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
export interface Attachment {
  type: AttachmentType;
  name: string;
  url: string;
  isReference: boolean;
  metadata?: Record<string, any>;
}

// 消息主体
export interface Message extends ChunkParsedResult {
  id: string;
  role: MessageRole;
  status: MessageStatus;
  timestamp?: string;
  main?: MessageContent;
}

// 服务配置
export interface ChunkParsedResult {
  main?: MessageContent;
  search?: SearchResult;
  thinking?: ThinkingContent;
}

export interface RequestParams extends ModelParams {
  prompt: string;
}

export interface LLMConfig {
  endpoint: string;
  stream?: boolean;
  parseRequest?: (params: RequestParams) => RequestInit;
  parseResponse?: (chunk: any) => ChunkParsedResult;
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
  messagesList: MessageState;
  modelService: ModelServiceState;
}
