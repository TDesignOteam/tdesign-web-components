// types.ts
export type MessageRole = 'user' | 'assistant' | 'system'; // 消息类型
export type MessageStatus = 'pending' | 'streaming' | 'sent' | 'error'; // 消息状态
export type ContentType = 'text' | 'markdown' | 'image' | 'audio' | 'video' | 'file'; // 内容类型
export type AttachmentType = 'file' | 'image' | 'video' | 'audio'; // 附件类型

export interface ContentData {
  type: ContentType;
  text?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface ThinkingStep {
  type: 'search' | 'analysis' | 'calculation';
  content: string;
}

export interface MessageReference {
  sourceId: string;
  excerpt: string;
  confidence: number;
}

export interface Attachment {
  type: AttachmentType;
  name: string;
  url: string;
  isReference: boolean;
  metadata: Record<string, any>;
}

// 文本类内容
interface TextContent {
  type: 'text' | 'markdown';
  status: MessageStatus;
  content: string;
}

// 图片内容
interface ImageContent {
  type: 'image';
  status: MessageStatus;
  content: {
    url: string;
    alt?: string;
    format?: 'jpg' | 'png' | 'webp'; //  图片格式
  }[];
}

// 音频内容
interface AudioContent {
  type: 'audio';
  status: MessageStatus;
  content: {
    url: string;
    duration: number;
    format?: 'mp3' | 'wav' | 'ogg';
    sampleRate?: number; // 音频采样率
  }[];
}

// 视频内容
interface VideoContent {
  type: 'video';
  status: MessageStatus;
  content: {
    url: string;
    poster?: string;
    duration?: number;
    resolution?: [number, number];
    format?: 'mp4' | 'mov' | 'avi';
  }[];
}

export type MessageContent = TextContent | ImageContent | AudioContent | VideoContent;
// | {
//     type: 'mixed';
//     content: (TextContent | MediaContent)[];
//   }; // 支持混合内容

// 搜索模块
interface ReferenceContent {
  title: string;
  url?: string;
  detail?: string;
  source?: string;
  timestamp?: string;
}

type PhaseContent = {
  title?: string;
  status: MessageStatus;
};

export interface SearchResult extends PhaseContent {
  content: ReferenceContent[];
}

// 思考过程
export interface ThinkingContent extends PhaseContent {
  type: 'text' | 'markdown';
  content: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  status: MessageStatus;
  main?: MessageContent;
  search?: SearchResult;
  thinking?: ThinkingContent;
  attachments?: Attachment[];
  timestamp?: string;
}

export interface LLMConfig {
  name: string;
  endpoint: string;
  headers?: Record<string, string>;
  stream?: boolean;
  supportedContentTypes?: ContentType[];
}

// 消息相关状态
export interface MessageState {
  messageIds: string[];
  messages: Record<string, Message>;
}

// 模型服务相关状态
export interface ModelServiceState {
  currentModel: string;
  isLoading: boolean;
  error: string | Error | null;
  availableModels: string[];
}

// 聚合根状态
export interface ChatState {
  messages: MessageState;
  modelService: ModelServiceState;
}
