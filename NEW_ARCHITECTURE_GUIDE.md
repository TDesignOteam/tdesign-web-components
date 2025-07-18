# 🚀 TDesign Web Components 新架构指南

## 架构重新设计

根据用户反馈，我们重新设计了聊天引擎架构，移除了复杂的`engine-bridge`桥接模式，采用更简洁、更符合实际使用场景的设计。

## 🆚 新旧架构对比

### ❌ 旧架构（已废弃）
```
EngineBridge（桥接层）
├── ChatEngine（传统引擎）
└── AGUIEngine（AG-UI引擎）
+ 运行时引擎切换
+ 复杂的UnifiedEngineConfig配置
```

**问题：**
- 🔴 过度设计：引擎桥接层增加了复杂性
- 🔴 不必要的功能：运行时引擎切换在实际使用中不需要
- 🔴 配置混合：两种不同的配置混在一起
- 🔴 维护困难：额外的抽象层难以理解和扩展

### ✅ 新架构（推荐）
```
BaseEngine（基类）
├── AGUIEngine（继承BaseEngine）
└── ChatEngine（保持独立，未来可继承）
+ 组件级引擎选择
+ 清晰分离的配置
```

**优势：**
- 🟢 设计简洁：直接选择引擎，无需桥接
- 🟢 符合实际：正常使用只选择一种引擎
- 🟢 配置清晰：`chatServiceConfig` 和 `aguiServiceConfig` 分离
- 🟢 代码复用：BaseEngine提供通用功能
- 🟢 类型安全：TypeScript支持更好
- 🟢 易于扩展：新引擎只需继承BaseEngine

## 📁 文件结构

```
src/chatbot/
├── core/
│   ├── base-engine.ts          # 🆕 基类引擎，定义IUnifiedEngine接口
│   ├── agui-engine.ts          # 🔄 AG-UI引擎，继承BaseEngine
│   ├── index.ts                # 传统ChatEngine（保持不变）
│   ├── agui-adapter.ts         # AG-UI适配器
│   ├── agui-types.ts           # AG-UI类型定义
│   └── agui-http-agent.ts      # AG-UI HTTP客户端
├── type.ts                     # 🔄 更新类型定义
├── chat.tsx                    # 主聊天组件（待更新）
└── _example/
    ├── unified-engine-example.tsx  # 🆕 新架构使用示例
    └── agui-simple-example.tsx     # AG-UI对比示例
```

## 🎯 核心接口

### BaseEngine 基类
```typescript
export interface IUnifiedEngine {
  // 生命周期
  init(config?: any, messages?: ChatMessagesData[]): void;
  destroy(): void;
  
  // 消息操作
  sendUserMessage(params: ChatRequestParams): Promise<void>;
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;
  abortChat(): Promise<void>;
  
  // 状态管理
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;
  clearMessages(): void;
  
  // 响应式接口
  getMessages$(): Observable<ChatMessagesData[]>;
  getStatus$(): Observable<ChatStatus>;
  
  // 属性访问
  get messages(): ChatMessagesData[];
  get status(): ChatStatus;
  get messageStore(): ChatMessageStore;
  
  // 策略注册
  registerMergeStrategy<T extends AIMessageContent>(
    type: T['type'], 
    handler: (chunk: T, existing?: T) => T
  ): void;
}

export abstract class BaseEngine implements IUnifiedEngine {
  // 提供通用实现
  // 子类只需实现抽象方法
}
```

### AGUIEngine 实现
```typescript
export class AGUIEngine extends BaseEngine {
  constructor(private config: TdAguiServiceConfig) {
    super();
  }
  
  // 实现抽象方法
  async sendUserMessage(params: ChatRequestParams): Promise<void> {
    // AG-UI特定实现
  }
  // ... 其他方法
}
```

## 🛠️ 使用方式

### 1. 组件Props定义
```typescript
export interface TdChatProps extends StyledProps {
  /** 引擎模式 */
  engineMode?: TdEngineMode; // 'default' | 'agui'
  
  /** 传统模式服务配置 */
  chatServiceConfig?: ChatServiceConfigSetter;
  
  /** AG-UI模式服务配置 */
  aguiServiceConfig?: TdAguiServiceConfig;
  
  // ... 其他props
}

export type TdEngineMode = 'default' | 'agui';

export interface TdAguiServiceConfig {
  url: string;
  agentId?: string;
  headers?: Record<string, string>;
  initialState?: any;
  tools?: any[];
  context?: any[];
}
```

### 2. 组件内部使用
```typescript
class ChatComponent extends Component<TdChatProps> {
  private chatEngine: IUnifiedEngine | ChatEngine;
  
  install() {
    const { engineMode = 'default', aguiServiceConfig, chatServiceConfig } = this.props;
    
    if (engineMode === 'agui' && aguiServiceConfig) {
      // 使用AG-UI引擎
      this.chatEngine = new AGUIEngine(aguiServiceConfig);
    } else {
      // 使用传统引擎
      this.chatEngine = new ChatEngine();
    }
  }
  
  private initChat() {
    if (this.chatEngine instanceof AGUIEngine) {
      this.chatEngine.init(this.props.aguiServiceConfig, this.props.defaultMessages);
    } else {
      this.chatEngine.init(this.props.chatServiceConfig, this.props.defaultMessages);
    }
  }
}
```

### 3. 用户使用示例

#### 传统模式
```typescript
<t-chatbot
  engineMode="default"
  chatServiceConfig={{
    endpoint: '/api/chat',
    stream: true,
    onMessage: (chunk) => { /* 处理消息 */ }
  }}
  defaultMessages={[]}
/>
```

#### AG-UI模式  
```typescript
<t-chatbot
  engineMode="agui"
  aguiServiceConfig={{
    url: '/api/agui-agent',
    agentId: 'my-agent',
    headers: { 'Authorization': 'Bearer token' }
  }}
  defaultMessages={[]}
/>
```

## 🔧 迁移指南

### 从旧架构迁移

#### 1. 更新配置方式
```typescript
// ❌ 旧方式
<t-chatbot
  chatServiceConfig={{
    mode: 'agui',
    agui: { url: '/api/agui', agentId: 'agent' },
    traditional: { endpoint: '/api/chat' }
  }}
/>

// ✅ 新方式
<t-chatbot
  engineMode="agui"
  aguiServiceConfig={{ url: '/api/agui', agentId: 'agent' }}
/>
```

#### 2. 更新导入
```typescript
// ❌ 移除旧导入
import { EngineBridge } from './core/engine-bridge';

// ✅ 使用新导入
import { AGUIEngine } from './core/agui-engine';
import { BaseEngine, IUnifiedEngine } from './core/base-engine';
```

#### 3. 代码更新
```typescript
// ❌ 旧方式
const bridge = new EngineBridge();
bridge.init(unifiedConfig);
bridge.switchEngine('agui'); // 不再需要

// ✅ 新方式
const engine = engineMode === 'agui' 
  ? new AGUIEngine(aguiConfig)
  : new ChatEngine();
engine.init(config);
```

## 🎉 新功能特性

### 1. Observable响应式（AG-UI）
```typescript
const aguiEngine = new AGUIEngine(config);

// 订阅消息变化
aguiEngine.getMessages$().subscribe(messages => {
  console.log('消息更新:', messages);
});

// 订阅状态变化
aguiEngine.getStatus$().subscribe(status => {
  console.log('状态变化:', status);
});
```

### 2. 统一的合并策略
```typescript
// 注册自定义合并策略
engine.registerMergeStrategy('text', (chunk, existing) => ({
  ...chunk,
  data: (existing?.data || '') + chunk.data
}));
```

### 3. 类型安全
- 完整的TypeScript支持
- 清晰的接口定义
- 编译时类型检查

## 📊 性能优化

### 1. 按需加载
```typescript
// 只在需要时创建引擎
const createEngine = () => {
  return engineMode === 'agui' 
    ? new AGUIEngine(aguiConfig)
    : new ChatEngine();
};
```

### 2. 内存管理
```typescript
// 组件销毁时清理资源
uninstall() {
  this.chatEngine?.destroy();
}
```

## 🧪 测试和示例

### 运行示例
```bash
# 启动开发服务器
npm run dev

# 访问新架构示例
http://localhost:3000/components/chatbot#unified-engine-example
```

### 示例文件
- `unified-engine-example.tsx` - 完整的新架构演示
- `agui-simple-example.tsx` - AG-UI对比示例

## 📝 总结

新架构的核心思想是**简化设计，符合实际使用场景**：

1. **移除不必要的复杂性** - 不再需要运行时引擎切换
2. **清晰的职责分离** - 配置分离，引擎专一
3. **更好的代码复用** - BaseEngine提供通用功能
4. **符合开发直觉** - 选择引擎就像选择其他组件一样简单

这个架构更易于理解、维护和扩展，同时保持了完整的功能和性能。 