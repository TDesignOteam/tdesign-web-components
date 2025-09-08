# Chat Message Content Components

## 重构说明

为了减少重复代码并提高维护性，我们将 `ThinkingContent` 和 `ReasoningContent` 的公共逻辑提取到了 `BaseThinkingContent` 中。

### 组件架构

```
BaseThinkingContent (基础类)
├── ThinkingContent (简单思考内容)
└── ReasoningContent (复杂推理内容)
```

## ReasoningContent 组件

ReasoningContent 是一个用于渲染 AGUI 协议中 thinking 部分穿插 toolcall 的组件，基于 `BaseThinkingContent` 实现。

### 重构后的特性

- 🎯 **代码复用**：与 ThinkingContent 共享基础逻辑
- 📝 **文本自动渲染**：文本内容自动分段显示
- 🔌 **插槽机制**：非文本内容通过插槽 `reasoning-{type}-{index}` 自定义渲染
- 🎨 **样式复用**：复用 thinking 组件的样式类
- ⚡ **轻量化**：去除内置的复杂渲染逻辑，更加灵活

### 类型定义

```typescript
type TdChatReasoningProps = {
  content?: AIMessageContent[];
  status?: ChatMessageStatus;
} & TdChatContentProps['thinking'];
```

### 使用示例

#### 基础用法

```tsx
const reasoningData: AIMessageContent[] = [
  {
    type: 'text',
    data: '我需要分析这个问题...',
  },
  {
    type: 'toolcall',
    data: {
      toolCallId: 'search_001',
      toolCallName: 'web_search',
      args: '{"query": "相关信息"}',
      result: '搜索结果...',
    },
    status: 'complete',
  },
  {
    type: 'text',
    data: '基于搜索结果，我的分析是...',
  },
];

<t-chat-reasoning-content
  content={reasoningData}
  status="complete"
  maxHeight={400}
  defaultCollapsed={false}
  layout="border"
/>
```

#### 在 ChatItem 中使用（带自定义插槽）

```tsx
<t-chat-item message={message}>
  {/* 自定义工具调用渲染 */}
  <div slot="reasoning-toolcall-1">
    <div class="custom-toolcall">
      <h4>🔧 工具调用</h4>
      <p>函数: {toolCall.toolCallName}</p>
      <p>参数: {toolCall.args}</p>
      <p>结果: {toolCall.result}</p>
    </div>
  </div>
  
  {/* 自定义搜索结果渲染 */}
  <div slot="reasoning-search-3">
    <div class="custom-search">
      <h4>🔍 搜索结果</h4>
      <div class="search-references">
        {/* 自定义搜索结果展示 */}
      </div>
    </div>
  </div>
</t-chat-item>
```

### 插槽命名规则

- 文本内容：自动渲染，无需插槽
- 其他内容：`reasoning-{type}-{index}`
  - `reasoning-toolcall-0`：第一个工具调用
  - `reasoning-search-1`：第二个搜索结果
  - `reasoning-image-2`：第三个图片内容

### 与 ThinkingContent 的对比

| 特性 | ThinkingContent | ReasoningContent |
|------|----------------|------------------|
| 基础类 | BaseThinkingContent | BaseThinkingContent |
| 数据结构 | `{text, title}` | `AIMessageContent[]` |
| 内容渲染 | 纯文本 | 文本 + 插槽 |
| 使用场景 | 简单思考 | 复杂推理 |
| 自定义能力 | 低 | 高 |

### 样式复用

组件复用 thinking 的样式类：

```less
.t-chat__item__think {
  // 基础容器样式（共享）
  
  &__reasoning {
    // reasoning 特有标识（实际复用 think 样式）
    
    &__text {
      // 文本段落样式
    }
    
    &__custom {
      // 自定义内容容器样式
    }
  }
}
```

### 最佳实践

1. **插槽使用**：为非文本内容提供对应的插槽实现
2. **性能优化**：大量内容时设置 `maxHeight`
3. **样式一致性**：自定义插槽内容保持与整体风格一致
4. **类型安全**：使用 TypeScript 确保内容类型正确

### 迁移指南

如果你之前使用了包含复杂渲染逻辑的版本，现在需要：

1. 将工具调用、搜索等内容的渲染逻辑移到插槽中
2. 使用 `reasoning-{type}-{index}` 命名规则
3. 保持文本内容不变（自动处理）

## BaseThinkingContent 基础类

提供 thinking 和 reasoning 组件的公共功能：

### 公共特性

- 折叠/展开状态管理
- 状态指示器渲染
- 基础样式和布局
- 事件处理机制

### 扩展点

- `renderContent()`: 子类实现具体内容渲染
- `getHeaderTitle()`: 子类定义头部标题
- `getClassName()`: 子类定义特有样式类

### 使用方式

```typescript
// 继承基础类
export class CustomThinkingComponent extends BaseThinkingContent<CustomProps> {
  protected renderContent(props: CustomProps) {
    // 实现自定义内容渲染
    return <div>Custom content</div>;
  }
  
  protected getHeaderTitle(props: CustomProps) {
    return props.customTitle || '自定义标题';
  }
  
  protected getClassName() {
    return 'custom-thinking';
  }
}