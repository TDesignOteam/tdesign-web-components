# TDesign Chatbot 使用指南

## 回调函数设计说明

为了避免混淆，我们将回调函数明确分为两个层次：

### **业务层回调** - 处理聊天对话逻辑
处理聊天内容、对话流程等业务相关的事件

### **连接层回调** - 监控SSE技术状态  
监控网络连接、心跳检测等底层技术相关的事件

---

## 回调函数完整列表

### 业务层回调（直接配置在config中）

| 回调名称 | 触发时机 | 参数 | 用途 |
|---------|---------|------|------|
| `onRequest` | 发送请求前 | `ChatRequestParams` | 自定义请求配置 |
| `onMessage` | 接收到消息数据块 | `SSEChunkData, ChatMessage?` | 解析处理聊天内容 |
| `onComplete` | **对话完成** | `isAborted: boolean, params, result?` | 聊天流程结束（正常/中断/出错） |
| `onAbort` | 用户主动中断 | 无 | 用户停止对话 |
| `onError` | **业务错误** | `Error \| Response` | 聊天业务逻辑错误 |

### 连接层回调（配置在config.connection中）

| 回调名称 | 触发时机 | 参数 | 用途 |
|---------|---------|------|------|
| `onHeartbeat` | 心跳检测 | `{ connectionId, timestamp }` | 监控连接健康状态 |
| `onConnectionStateChange` | **连接状态变化** | `{ connectionId, from, to, timestamp }` | 技术状态监控 |
| `onConnectionEstablished` | SSE连接建立 | `connectionId: string` | 底层连接成功 |
| `onConnectionLost` | SSE连接断开 | `connectionId: string` | 底层连接丢失 |

## 📝 重要区别说明

### onComplete vs onConnectionStateChange
- **onComplete**: 业务层面的**对话完成**（聊天流程结束，用户可以发起新对话）
- **onConnectionStateChange**: 技术层面的**连接状态变化**（网络连接状态，不影响聊天业务）

### onError vs onConnectionStateChange(error状态)  
- **onError**: **业务错误**（消息解析失败、接口返回错误等，需要用户感知）
- **onConnectionStateChange**: **连接错误**（网络问题，系统会自动重试，用户可不感知）

---

## 基础使用示例

```typescript
import ChatEngine from './chatbot/core';

const chatEngine = new ChatEngine();

chatEngine.init({
  endpoint: '/api/chat',
  stream: true,
  
  // === 🎯 业务层回调：处理聊天对话逻辑 ===
  
  onMessage: (chunk, message) => {
    // 解析聊天消息内容
    console.log('💬 收到消息:', chunk);
    return parseMessageChunk(chunk);
  },
  
  onComplete: (isAborted, params) => {
    // 对话完成 - 聊天流程结束
    console.log('🏁 对话完成:', isAborted ? '用户中断' : '正常结束');
    enableInputField();        // 启用输入框，用户可以继续聊天
    hideTypingIndicator();     // 隐藏"正在输入"提示
    saveConversationHistory(); // 保存对话记录
  },
  
  onError: (error) => {
    // 业务错误 - 需要用户感知的错误
    console.error('💬 聊天错误:', error);
    showErrorMessage(`聊天出错: ${error.message}`);
    enableRetryButton();       // 显示重试按钮
  },
  
  onAbort: async () => {
    // 用户主动停止对话
    console.log('🛑 用户停止对话');
    clearPendingOperations();
  },
  
  // === 🔧 连接层回调：监控SSE技术状态 ===
  
  connection: {
    onHeartbeat: (event) => {
      // 心跳检测 - 技术层面的连接健康监控
      console.log(`💓 连接心跳: ${event.connectionId}`);
      updateConnectionHealthIndicator('healthy');
      // 注意：这不影响聊天业务，仅用于技术监控
    },
    
    onConnectionStateChange: (event) => {
      // 连接状态变化 - 技术层面的网络状态
      console.log(`🔧 连接状态: ${event.from} -> ${event.to}`);
      
      // 根据技术状态显示不同的网络指示器
      switch (event.to) {
        case 'connecting':
          showNetworkStatus('连接中...', 'warning');
          break;
        case 'connected':
          showNetworkStatus('网络正常', 'success');
          break;
        case 'reconnecting':
          showNetworkStatus('重连中...', 'warning');
          break;
        case 'error':
          showNetworkStatus('网络异常', 'error');
          break;
      }
      // 注意：连接问题不直接影响UI主要功能
    },
    
    onConnectionEstablished: (connectionId) => {
      // SSE连接建立 - 技术层面的连接成功
      console.log(`🔗 SSE连接建立: ${connectionId}`);
      hideNetworkErrorBanner();   // 隐藏网络错误横幅
      // 注意：这是技术连接，不等于聊天功能可用
    },
    
    onConnectionLost: (connectionId) => {
      // SSE连接断开 - 技术层面的连接丢失
      console.log(`📡 SSE连接断开: ${connectionId}`);
      showNetworkWarning('网络连接不稳定，正在尝试重连...');
      // 注意：系统会自动重连，用户通常不需要手动操作
    }
  }
});
```

## 高级用例：分层处理

### 业务层：聊天会话管理

```typescript
class ChatSessionManager {
  private currentSessionId: string | null = null;
  
  setupChatEngine() {
    const chatEngine = new ChatEngine();
    
    chatEngine.init({
      endpoint: '/api/chat',
      stream: true,
      
      // === 专注于聊天业务逻辑 ===
      
      onMessage: (chunk, message) => {
        // 处理聊天内容
        this.updateChatBubble(message?.id, chunk);
        return this.parseMessageContent(chunk);
      },
      
      onComplete: (isAborted, params) => {
        // 对话完成 - 业务流程结束
        this.finalizeSession(isAborted);
        this.enableNewMessage();
        
        if (isAborted) {
          this.showSessionInterruptedMessage();
        } else {
          this.showSessionCompletedMessage();
          this.saveSessionHistory();
        }
      },
      
      onError: (error) => {
        // 业务错误 - 用户需要感知和处理
        this.handleBusinessError(error);
        this.showUserFriendlyError(error);
        this.enableRetryButton();
      }
    });
    
    return chatEngine;
  }
  
  private handleBusinessError(error: Error) {
    // 根据业务错误类型做不同处理
    if (error.message.includes('rate limit')) {
      this.showRateLimitMessage();
    } else if (error.message.includes('invalid')) {
      this.showInvalidInputMessage();
    } else {
      this.showGenericErrorMessage();
    }
  }
}
```

### 连接层：网络监控系统

```typescript  
class NetworkMonitor {
  private connectionStats = {
    healthScore: 100,
    latency: [],
    disconnects: 0
  };
  
  setupNetworkMonitoring(chatEngine: ChatEngine) {
    // 专门配置连接监控，不影响聊天业务
    const config = {
      // ... 其他业务配置
      
      connection: {
        onHeartbeat: (event) => {
          // 纯技术监控，用户通常不感知
          this.recordHeartbeat(event);
          this.updateNetworkHealthScore();
          this.sendTelemetryData();
        },
        
        onConnectionStateChange: (event) => {
          // 技术状态变化，系统级监控
          this.logTechnicalState(event);
          
          if (event.to === 'error') {
            this.connectionStats.disconnects++;
            this.adjustHealthScore(-10);
          } else if (event.to === 'connected') {
            this.adjustHealthScore(+5);
          }
          
          // 只在状态异常时才提示用户
          if (this.isNetworkUnstable()) {
            this.showMinimalNetworkWarning();
          }
        },
        
        onConnectionEstablished: (connectionId) => {
          // 技术连接成功
          this.resetNetworkWarnings();
          console.log(`🔧 技术连接已建立: ${connectionId}`);
        },
        
        onConnectionLost: (connectionId) => {
          // 技术连接丢失，系统会自动处理
          console.log(`🔧 技术连接丢失: ${connectionId}，系统将自动重连`);
          
          // 只在频繁断开时才警告用户
          if (this.connectionStats.disconnects > 5) {
            this.showPersistentNetworkIssue();
          }
        }
      }
    };
    
    chatEngine.init(config);
  }
  
  private isNetworkUnstable(): boolean {
    return this.connectionStats.healthScore < 60;
  }
  
  private showMinimalNetworkWarning() {
    // 最小化的网络提示，不干扰聊天体验
    showToast('网络不稳定', { duration: 2000, type: 'warning' });
  }
}

## 最佳实践指南

### ✅ 正确的错误处理分层

```typescript
chatEngine.init({
  // === 业务层错误：影响用户体验，需要明确反馈 ===
  onError: (error) => {
    console.error('🚨 业务错误:', error);
    
    // 分类处理业务错误
    if (error.message.includes('rate limit')) {
      showUserMessage('发送太快了，请稍后再试', 'warning');
      disableSendButton(30000); // 禁用30秒
    } else if (error.message.includes('content filter')) {
      showUserMessage('消息包含敏感内容，请修改后重试', 'error');
      highlightProblematicContent();
    } else {
      showUserMessage('聊天出现错误，请重试', 'error');
      enableRetryButton();
    }
  },
  
  // === 连接层错误：技术问题，最小化用户感知 ===
  connection: {
    onConnectionStateChange: (event) => {
      // 安全的技术监控，避免回调错误影响连接
      try {
        if (event.to === 'error') {
          console.warn('🔧 连接技术错误，系统自动处理');
          // 只在必要时显示最小化提示
          if (this.isRepeatedFailure()) {
            showMinimalToast('网络不稳定', 2000);
          }
        }
      } catch (error) {
        console.error('连接监控回调错误:', error);
        // 绝不重新抛出，避免影响SSE连接
      }
    }
  }
});
```

### ✅ 正确的完成事件处理

```typescript
chatEngine.init({
  // === 业务完成：聊天对话结束 ===
  onComplete: (isAborted, params) => {
    console.log('💬 对话完成');
    
    // 聊天业务层面的收尾工作
    enableInputField();           // 用户可以继续聊天
    hideTypingIndicator();        // 隐藏输入提示
    saveConversationToHistory();  // 保存对话记录
    updateMessageCounter();       // 更新消息计数
    
    if (isAborted) {
      showFeedback('已停止生成');
    } else {
      showFeedback('回答完成');
      enableFollowUpSuggestions(); // 显示后续建议
    }
  },
  
  // === 连接层事件：技术状态监控 ===
  connection: {
    onConnectionEstablished: (connectionId) => {
      console.log('🔧 SSE技术连接建立');
      // 技术层面的连接建立，不等于业务可用
      hideNetworkErrorBanner();
      updateTechnicalStatusIndicator('connected');
    }
  }
});
```



## ⚠️ 常见误区

### ❌ 错误示例：混淆业务和技术层

```typescript
// 错误：在连接回调中处理业务逻辑
connection: {
  onConnectionEstablished: (connectionId) => {
    enableSendButton();        // ❌ 业务逻辑放错位置
    showSuccessMessage('可以开始聊天了'); // ❌ 技术连接≠业务可用
  }
}

// 错误：在业务回调中处理技术细节  
onComplete: (isAborted) => {
  updateConnectionHealthScore(); // ❌ 技术监控不应该在业务回调中
  closeWebSocketConnection();   // ❌ 技术操作放错位置
}
```

### ✅ 正确示例：各司其职

```typescript
// 正确：业务逻辑在业务回调中
onComplete: (isAborted) => {
  enableInputField();           // ✅ 业务UI控制
  saveConversationHistory();    // ✅ 业务数据处理
  showCompletionMessage();      // ✅ 业务用户反馈
},

// 正确：技术监控在连接回调中
connection: {
  onConnectionEstablished: (connectionId) => {
    updateNetworkStatusIndicator('good'); // ✅ 技术状态指示
    logTechnicalMetrics(connectionId);    // ✅ 技术数据收集
  }
}
```

---

## 📋 快速参考

### 我应该用哪个回调？

| 我想要... | 使用回调 | 层次 |
|----------|----------|------|
| 处理聊天消息内容 | `onMessage` | 业务层 |
| 知道对话何时结束 | `onComplete` | 业务层 |
| 处理聊天业务错误 | `onError` | 业务层 |
| 监控网络连接健康 | `connection.onHeartbeat` | 连接层 |
| 监控连接状态变化 | `connection.onConnectionStateChange` | 连接层 |
| 知道技术连接是否正常 | `connection.onConnectionEstablished` | 连接层 |

### 层次判断原则

**业务层**：用户可感知、影响聊天功能、需要UI反馈  
**连接层**：技术细节、系统自动处理、后台监控

---

## 🔄 迁移指南

### 从旧版本升级

新增的连接层回调是**完全可选的**，不会影响现有功能：

```typescript
// 旧版本配置 - 继续正常工作
chatEngine.init({
  onMessage: (chunk) => parseMessage(chunk),
  onComplete: (isAborted) => handleComplete(isAborted),
  onError: (error) => handleError(error)
});

// 新版本配置 - 可选添加连接监控
chatEngine.init({
  // 原有业务回调保持不变
  onMessage: (chunk) => parseMessage(chunk),
  onComplete: (isAborted) => handleComplete(isAborted), 
  onError: (error) => handleError(error),
  
  // 可选：添加连接层监控
  connection: {
    onHeartbeat: (event) => logHeartbeat(event),
    onConnectionStateChange: (event) => monitorNetwork(event)
  }
});
```

---

## 📖 注意事项

1. **错误隔离**: 连接层回调的错误不能影响业务层运行
2. **性能考虑**: 心跳每10秒触发，避免重计算操作
3. **职责分离**: 业务逻辑和技术监控严格分离
4. **用户体验**: 连接层问题最小化用户感知
