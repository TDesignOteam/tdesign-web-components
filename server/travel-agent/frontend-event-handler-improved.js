/**
 * 改进的前端AG-UI事件处理器
 * 明确state和messages的关系，实现历史消息显示功能
 */

class AGUIEventHandler {
  constructor() {
    // 应用状态 - 存储业务数据和会话信息
    this.state = {
      // 会话信息
      runId: null,
      threadId: null,
      isRunning: false,
      currentStep: null,

      // 业务数据
      userPreferences: {},
      currentItinerary: {},
      completedSteps: [],
      pendingUserInput: false,
      requirements: null,
      attractions: null,
      weather: null,
      budget: null,

      // 历史会话信息
      sessionHistory: [],
      lastMessageId: null,
    };

    // 消息存储 - 存储对话消息
    this.messages = new Map(); // 改为Map结构，key为messageId

    // 工具调用存储
    this.toolCalls = new Map();

    // 待处理输入
    this.pendingInputs = new Map();

    // UI组件引用
    this.ui = {
      messageContainer: null,
      progressBar: null,
      inputDialog: null,
      notificationContainer: null,
      statusIndicator: null,
      historyContainer: null, // 新增历史消息容器
    };
  }

  // 主要事件处理方法
  handleEvent(event) {
    console.log(`📨 处理事件: ${event.type}`, event);

    switch (event.type) {
      // 生命周期事件
      case 'RUN_STARTED':
        this.handleRunStarted(event);
        break;
      case 'RUN_FINISHED':
        this.handleRunFinished(event);
        break;
      case 'RUN_ERROR':
        this.handleRunError(event);
        break;

      // 步骤事件
      case 'STEP_STARTED':
        this.handleStepStarted(event);
        break;
      case 'STEP_FINISHED':
        this.handleStepFinished(event);
        break;

      // 文本消息事件
      case 'TEXT_MESSAGE_START':
        this.handleTextMessageStart(event);
        break;
      case 'TEXT_MESSAGE_CHUNK':
        this.handleTextMessageChunk(event);
        break;
      case 'TEXT_MESSAGE_END':
        this.handleTextMessageEnd(event);
        break;

      // 工具调用事件
      case 'TOOL_CALL_START':
        this.handleToolCallStart(event);
        break;
      case 'TOOL_CALL_ARGS':
        this.handleToolCallArgs(event);
        break;
      case 'TOOL_CALL_END':
        this.handleToolCallEnd(event);
        break;
      case 'TOOL_CALL_RESULT':
        this.handleToolCallResult(event);
        break;

      // 状态事件
      case 'STATE_SNAPSHOT':
        this.handleStateSnapshot(event);
        break;
      case 'STATE_DELTA':
        this.handleStateDelta(event);
        break;

      // 消息快照事件
      case 'MESSAGES_SNAPSHOT':
        this.handleMessagesSnapshot(event);
        break;

      // 自定义事件
      case 'CUSTOM':
        this.handleCustomEvent(event);
        break;

      default:
        console.warn(`⚠️ 未知事件类型: ${event.type}`);
    }
  }

  // 生命周期事件处理
  handleRunStarted(event) {
    this.state.isRunning = true;
    this.state.runId = event.runId;
    this.state.threadId = event.threadId;

    this.updateStatusIndicator('running', '正在处理...');
    this.showNotification('info', '开始处理您的请求');

    // 记录会话开始
    this.recordSessionEvent('session_started', {
      runId: event.runId,
      threadId: event.threadId,
      timestamp: Date.now(),
    });
  }

  handleRunFinished(event) {
    this.state.isRunning = false;

    this.updateStatusIndicator('completed', '处理完成');
    this.updateProgressBar(100);

    if (event.result) {
      this.showNotification('success', `处理完成！${this.formatResult(event.result)}`);
    }

    // 记录会话结束
    this.recordSessionEvent('session_finished', {
      result: event.result,
      timestamp: Date.now(),
    });
  }

  handleRunError(event) {
    this.state.isRunning = false;

    this.updateStatusIndicator('error', '处理失败');
    this.showNotification('error', `处理失败: ${event.message}`);

    this.addErrorMessage(event.message, event.code);

    // 记录错误
    this.recordSessionEvent('session_error', {
      error: event.message,
      code: event.code,
      timestamp: Date.now(),
    });
  }

  // 步骤事件处理
  handleStepStarted(event) {
    this.state.currentStep = event.stepName;
    this.updateStatusIndicator('running', `正在${event.stepName}...`);

    const stepProgress = this.calculateStepProgress(event.stepName);
    this.updateProgressBar(stepProgress);

    this.addStepIndicator(event.stepName, 'started');
  }

  handleStepFinished(event) {
    this.addStepIndicator(event.stepName, 'finished');

    if (!this.state.completedSteps) {
      this.state.completedSteps = [];
    }
    this.state.completedSteps.push(event.stepName);
  }

  // 文本消息事件处理
  handleTextMessageStart(event) {
    const { messageId } = event;

    // 创建新消息对象
    const message = {
      id: messageId,
      role: event.role,
      content: '',
      timestamp: Date.now(),
      completed: false,
      toolCalls: [], // 关联的工具调用
    };

    this.messages.set(messageId, message);
    this.state.lastMessageId = messageId;

    this.createMessageContainer(messageId, event.role);
  }

  handleTextMessageChunk(event) {
    const { messageId } = event;
    const message = this.messages.get(messageId);

    if (message) {
      message.content += event.delta;
      this.updateMessageContent(messageId, message.content);
    }
  }

  handleTextMessageEnd(event) {
    const { messageId } = event;
    const message = this.messages.get(messageId);

    if (message) {
      message.completed = true;
      this.finalizeMessage(messageId);

      // 记录消息完成
      this.recordSessionEvent('message_completed', {
        messageId,
        role: message.role,
        contentLength: message.content.length,
        timestamp: Date.now(),
      });
    }
  }

  // 工具调用事件处理
  handleToolCallStart(event) {
    const { toolCallId } = event;
    const toolCall = {
      id: toolCallId,
      name: event.toolCallName,
      status: 'running',
      startTime: Date.now(),
      parentMessageId: event.parentMessageId,
    };

    this.toolCalls.set(toolCallId, toolCall);

    // 关联到父消息
    if (event.parentMessageId) {
      const parentMessage = this.messages.get(event.parentMessageId);
      if (parentMessage) {
        parentMessage.toolCalls.push(toolCallId);
      }
    }

    this.addToolCallIndicator(toolCallId, event.toolCallName, 'started');
  }

  handleToolCallArgs(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.args = event.delta;
    }
  }

  handleToolCallEnd(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.status = 'completed';
      toolCall.endTime = Date.now();
      toolCall.duration = toolCall.endTime - toolCall.startTime;
    }

    this.updateToolCallIndicator(event.toolCallId, 'completed');
  }

  handleToolCallResult(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.result = event.content;
      toolCall.resultRole = event.role;
    }

    this.addToolCallResult(event.toolCallId, event.content, event.role);
  }

  // 状态事件处理
  handleStateSnapshot(event) {
    // 合并状态快照
    this.state = { ...this.state, ...event.snapshot };
    this.updateStateDisplay();
  }

  handleStateDelta(event) {
    // 应用JSON Patch操作
    event.delta.forEach((patch) => {
      this.applyPatch(patch);
    });

    this.updateStateDisplay();
  }

  handleMessagesSnapshot(event) {
    // 清空现有消息
    this.messages.clear();

    // 重新构建消息Map
    event.messages.forEach((msg) => {
      this.messages.set(msg.id, {
        ...msg,
        toolCalls: [], // 初始化工具调用数组
      });
    });

    this.refreshMessageDisplay();
  }

  // 自定义事件处理
  handleCustomEvent(event) {
    switch (event.name) {
      case 'input_request':
        this.handleInputRequest(event.value);
        break;
      case 'stream_pause':
        this.handleStreamPause(event.value);
        break;
      case 'stream_resume':
        this.handleStreamResume(event.value);
        break;
      case 'system_notification':
        this.handleSystemNotification(event.value);
        break;
      case 'debug_info':
        this.handleDebugInfo(event.value);
        break;
      default:
        console.log(`📋 自定义事件: ${event.name}`, event.value);
    }
  }

  // 自定义事件的具体处理
  handleInputRequest(value) {
    const { requestId, prompt, options, type, required, timeout } = value;

    this.pendingInputs.set(requestId, {
      prompt,
      options,
      type,
      required,
      timeout,
      timestamp: Date.now(),
    });

    this.state.pendingUserInput = true;
    this.showInputDialog(requestId, prompt, options, type);
  }

  handleStreamPause(value) {
    this.updateStatusIndicator('paused', '等待用户输入...');
    this.showNotification('info', '请提供所需信息以继续');
  }

  handleStreamResume(value) {
    this.updateStatusIndicator('running', '继续处理...');
    this.showNotification('info', '已收到您的输入，继续处理中...');
    this.state.pendingUserInput = false;
  }

  handleSystemNotification(value) {
    this.showNotification(value.level, value.message, value.duration);
  }

  handleDebugInfo(value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 调试信息 [${value.component}.${value.method}]:`, value.data);
    }
  }

  // 历史消息相关方法
  recordSessionEvent(eventType, data) {
    this.state.sessionHistory.push({
      type: eventType,
      data,
      timestamp: Date.now(),
    });
  }

  // 获取历史消息
  getMessageHistory() {
    return Array.from(this.messages.values())
      .filter((msg) => msg.completed)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // 获取会话历史
  getSessionHistory() {
    return this.state.sessionHistory;
  }

  // 显示历史消息
  displayMessageHistory() {
    if (!this.ui.historyContainer) return;

    const history = this.getMessageHistory();

    this.ui.historyContainer.innerHTML = '';

    history.forEach((message) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `history-message ${message.role}`;
      messageDiv.innerHTML = `
        <div class="message-header">
          <span class="message-role">${this.formatRole(message.role)}</span>
          <span class="message-time">${this.formatTime(message.timestamp)}</span>
        </div>
        <div class="message-content">${this.formatMessageContent(message.content)}</div>
        ${this.renderToolCalls(message.toolCalls)}
      `;

      this.ui.historyContainer.appendChild(messageDiv);
    });
  }

  // 渲染工具调用
  renderToolCalls(toolCallIds) {
    if (!toolCallIds || toolCallIds.length === 0) return '';

    return toolCallIds
      .map((toolCallId) => {
        const toolCall = this.toolCalls.get(toolCallId);
        if (!toolCall) return '';

        return `
        <div class="tool-call-history">
          <div class="tool-name">🔧 ${toolCall.name}</div>
          ${toolCall.result ? `<div class="tool-result">${this.formatToolResult(toolCall.result)}</div>` : ''}
        </div>
      `;
      })
      .join('');
  }

  // 格式化角色显示
  formatRole(role) {
    const roleMap = {
      user: '👤 用户',
      assistant: '🤖 助手',
      tool: '🔧 工具',
      system: '⚙️ 系统',
    };
    return roleMap[role] || role;
  }

  // 格式化时间显示
  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
  }

  // UI更新方法
  updateStatusIndicator(status, message) {
    if (this.ui.statusIndicator) {
      this.ui.statusIndicator.className = `status-indicator ${status}`;
      this.ui.statusIndicator.textContent = message;
    }
  }

  updateProgressBar(percentage) {
    if (this.ui.progressBar) {
      this.ui.progressBar.style.width = `${percentage}%`;
      this.ui.progressBar.setAttribute('aria-valuenow', percentage);
    }
  }

  showNotification(level, message, duration = 5000) {
    if (this.ui.notificationContainer) {
      const notification = document.createElement('div');
      notification.className = `notification ${level}`;
      notification.textContent = message;

      this.ui.notificationContainer.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, duration);
    }
  }

  createMessageContainer(messageId, role) {
    if (this.ui.messageContainer) {
      const messageDiv = document.createElement('div');
      messageDiv.id = `message-${messageId}`;
      messageDiv.className = `message ${role}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.id = `content-${messageId}`;

      messageDiv.appendChild(contentDiv);
      this.ui.messageContainer.appendChild(messageDiv);
    }
  }

  updateMessageContent(messageId, content) {
    const contentDiv = document.getElementById(`content-${messageId}`);
    if (contentDiv) {
      contentDiv.innerHTML = this.formatMessageContent(content);
    }
  }

  addStepIndicator(stepName, status) {
    if (this.ui.progressBar) {
      const stepDiv = document.createElement('div');
      stepDiv.className = `step-indicator ${status}`;
      stepDiv.textContent = stepName;
      this.ui.progressBar.appendChild(stepDiv);
    }
  }

  addToolCallIndicator(toolCallId, toolName, status) {
    if (this.ui.messageContainer) {
      const toolDiv = document.createElement('div');
      toolDiv.id = `tool-${toolCallId}`;
      toolDiv.className = `tool-call ${status}`;
      toolDiv.innerHTML = `
        <div class="tool-name">🔧 ${toolName}</div>
        <div class="tool-status">${status === 'started' ? '执行中...' : '已完成'}</div>
      `;
      this.ui.messageContainer.appendChild(toolDiv);
    }
  }

  updateToolCallIndicator(toolCallId, status) {
    const toolDiv = document.getElementById(`tool-${toolCallId}`);
    if (toolDiv) {
      toolDiv.className = `tool-call ${status}`;
      const statusDiv = toolDiv.querySelector('.tool-status');
      if (statusDiv) {
        statusDiv.textContent = status === 'completed' ? '已完成' : '执行中...';
      }
    }
  }

  addToolCallResult(toolCallId, content) {
    const toolDiv = document.getElementById(`tool-${toolCallId}`);
    if (toolDiv) {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'tool-result';
      resultDiv.innerHTML = `
        <div class="result-label">结果:</div>
        <div class="result-content">${this.formatToolResult(content)}</div>
      `;
      toolDiv.appendChild(resultDiv);
    }
  }

  showInputDialog(requestId, prompt, options, type) {
    if (this.ui.inputDialog) {
      this.ui.inputDialog.innerHTML = `
        <div class="dialog-content">
          <h3>${prompt}</h3>
          ${this.generateInputOptions(options, type)}
          <div class="dialog-actions">
            <button onclick="handleUserInput('${requestId}', 'cancel')">取消</button>
            <button onclick="handleUserInput('${requestId}', 'confirm')">确认</button>
          </div>
        </div>
      `;
      this.ui.inputDialog.style.display = 'block';
    }
  }

  // 辅助方法
  calculateStepProgress(stepName) {
    const stepOrder = ['需求分析', '景点查询', '天气查询', '路线规划', '预算计算', '行程总结'];
    const stepIndex = stepOrder.indexOf(stepName);
    return stepIndex >= 0 ? ((stepIndex + 1) / stepOrder.length) * 100 : 0;
  }

  applyPatch(patch) {
    const path = patch.path.substring(1); // 移除开头的 '/'
    const pathParts = path.split('/');
    let current = this.state;

    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }

    const lastPart = pathParts[pathParts.length - 1];

    switch (patch.op) {
      case 'add':
        current[lastPart] = patch.value;
        break;
      case 'replace':
        current[lastPart] = patch.value;
        break;
      case 'remove':
        delete current[lastPart];
        break;
    }
  }

  formatMessageContent(content) {
    // 简单的Markdown格式化
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  formatToolResult(content) {
    try {
      const data = JSON.parse(content);
      return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch {
      return content;
    }
  }

  formatResult(result) {
    if (result.totalSteps) {
      return `共完成 ${result.totalSteps} 个步骤`;
    }
    return '处理完成';
  }

  generateInputOptions(options, type) {
    if (type === 'select') {
      return `
        <select id="user-input-select">
          ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
        </select>
      `;
    }
    return `<input type="text" id="user-input-text" placeholder="请输入...">`;
  }

  updateStateDisplay() {
    console.log('📊 状态更新:', this.state);
  }

  refreshMessageDisplay() {
    console.log('💬 消息刷新:', this.messages);
    this.displayMessageHistory(); // 刷新历史消息显示
  }

  addErrorMessage(message, code) {
    if (this.ui.messageContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'message error';
      errorDiv.innerHTML = `
        <div class="error-content">
          <div class="error-icon">❌</div>
          <div class="error-message">${message}</div>
          ${code ? `<div class="error-code">错误代码: ${code}</div>` : ''}
        </div>
      `;
      this.ui.messageContainer.appendChild(errorDiv);
    }
  }

  finalizeMessage(messageId) {
    const messageDiv = document.getElementById(`message-${messageId}`);
    if (messageDiv) {
      messageDiv.classList.add('completed');
    }
  }

  // 获取当前状态快照
  getStateSnapshot() {
    return {
      ...this.state,
      messages: this.getMessageHistory(),
      toolCalls: Array.from(this.toolCalls.values()),
    };
  }

  // 导出会话数据
  exportSessionData() {
    return {
      state: this.state,
      messages: this.getMessageHistory(),
      toolCalls: Array.from(this.toolCalls.values()),
      sessionHistory: this.state.sessionHistory,
      exportTime: Date.now(),
    };
  }
}

// 用户输入处理函数（全局函数，供HTML调用）
window.handleUserInput = function (requestId, action) {
  const handler = window.aguiHandler; // 假设handler是全局的

  if (action === 'cancel') {
    handler.showNotification('warning', '操作已取消');
    handler.ui.inputDialog.style.display = 'none';
    return;
  }

  // 获取用户输入
  const selectElement = document.getElementById('user-input-select');
  const textElement = document.getElementById('user-input-text');

  let userInput;
  if (selectElement) {
    userInput = selectElement.value;
  } else if (textElement) {
    userInput = textElement.value;
  }

  if (!userInput) {
    handler.showNotification('error', '请输入有效信息');
    return;
  }

  // 隐藏对话框
  handler.ui.inputDialog.style.display = 'none';

  // 发送用户输入到服务器
  handler.sendUserInput(requestId, userInput);
};

// 导出
export { AGUIEventHandler };
