// types.ts
export type MessageRole = 'user' | 'assistant' | 'system'; // 消息类型
export type MessageStatus = 'pending' | 'thinking' | 'streaming' | 'sent' | 'error'; // 消息状态
export type MessagePhase = 'thinking' | 'generating' | 'complete'; // 消息阶段
export type ContentType = 'text' | 'markdown' | 'image' | 'file'; // 内容类型

export interface ContentData {
  type: ContentType;
  text?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface ThinkingStep {
  type: 'analysis' | 'search' | 'calculation';
  content: string;
  timestamp: number;
}

export interface MessageReference {
  sourceId: string;
  excerpt: string;
  confidence: number;
}

export interface Attachment {
  type: 'file' | 'image' | 'data';
  name: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface MessageContent {
  thinking?: {
    steps: ThinkingStep[];
    finalConclusion?: string;
  };
  main: ContentData;
  attachments?: Attachment[];
  clarification?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  status: MessageStatus;
  phase?: MessagePhase;
  timestamp: number;
  content: MessageContent;
  references?: MessageReference[];
  error?: string;
  context?: {
    parentMessageId?: string;
    reasoningChain?: string[];
  };
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
