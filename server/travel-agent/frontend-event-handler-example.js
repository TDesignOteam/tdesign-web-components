/**
 * 前端AG-UI事件处理示例
 * 展示如何完整处理所有事件类型
 */

class AGUIEventHandler {
  constructor() {
    this.state = {};
    this.currentStep = null;
    this.pendingInputs = new Map();
    this.toolCalls = new Map();
    this.messages = [];
    this.isRunning = false;

    // UI组件引用（实际应用中会绑定到真实DOM）
    this.ui = {
      messageContainer: null,
      progressBar: null,
      inputDialog: null,
      notificationContainer: null,
      statusIndicator: null,
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
    this.isRunning = true;
    this.state.runId = event.runId;
    this.state.threadId = event.threadId;

    this.updateStatusIndicator('running', '正在处理...');
    this.showNotification('info', '开始处理您的请求');
  }

  handleRunFinished(event) {
    this.isRunning = false;

    this.updateStatusIndicator('completed', '处理完成');
    this.updateProgressBar(100);

    if (event.result) {
      this.showNotification('success', `处理完成！${this.formatResult(event.result)}`);
    }
  }

  handleRunError(event) {
    this.isRunning = false;

    this.updateStatusIndicator('error', '处理失败');
    this.showNotification('error', `处理失败: ${event.message}`);

    // 显示错误详情
    this.addErrorMessage(event.message, event.code);
  }

  // 步骤事件处理
  handleStepStarted(event) {
    this.currentStep = event.stepName;
    this.updateStatusIndicator('running', `正在${event.stepName}...`);

    // 更新进度条（假设有6个步骤）
    const stepProgress = this.calculateStepProgress(event.stepName);
    this.updateProgressBar(stepProgress);

    // 添加步骤指示器
    this.addStepIndicator(event.stepName, 'started');
  }

  handleStepFinished(event) {
    this.addStepIndicator(event.stepName, 'finished');

    // 更新状态
    if (!this.state.completedSteps) {
      this.state.completedSteps = [];
    }
    this.state.completedSteps.push(event.stepName);
  }

  // 文本消息事件处理
  handleTextMessageStart(event) {
    // 创建新的消息容器
    const { messageId } = event;
    this.messages[messageId] = {
      id: messageId,
      role: event.role,
      content: '',
      timestamp: Date.now(),
    };

    this.createMessageContainer(messageId, event.role);
  }

  handleTextMessageChunk(event) {
    const { messageId } = event;
    const message = this.messages[messageId];

    if (message) {
      message.content += event.delta;
      this.updateMessageContent(messageId, message.content);
    }
  }

  handleTextMessageEnd(event) {
    const { messageId } = event;
    const message = this.messages[messageId];

    if (message) {
      message.completed = true;
      this.finalizeMessage(messageId);
    }
  }

  // 工具调用事件处理
  handleToolCallStart(event) {
    const { toolCallId } = event;
    this.toolCalls.set(toolCallId, {
      id: toolCallId,
      name: event.toolCallName,
      status: 'running',
      startTime: Date.now(),
    });

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

    // 显示工具调用结果
    this.addToolCallResult(event.toolCallId, event.content, event.role);
  }

  // 状态事件处理
  handleStateSnapshot(event) {
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
    this.messages = event.messages.reduce((acc, msg) => {
      acc[msg.id] = msg;
      return acc;
    }, {});

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

    this.showInputDialog(requestId, prompt, options, type);
  }

  handleStreamPause(value) {
    this.updateStatusIndicator('paused', '等待用户输入...');
    this.showNotification('info', '请提供所需信息以继续');
  }

  handleStreamResume(value) {
    this.updateStatusIndicator('running', '继续处理...');
    this.showNotification('info', '已收到您的输入，继续处理中...');
  }

  handleSystemNotification(value) {
    this.showNotification(value.level, value.message, value.duration);
  }

  handleDebugInfo(value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 调试信息 [${value.component}.${value.method}]:`, value.data);
    }
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

  addToolCallResult(toolCallId, content, role) {
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
    // 更新状态显示（实际应用中会更新相应的UI组件）
    console.log('📊 状态更新:', this.state);
  }

  refreshMessageDisplay() {
    // 刷新消息显示
    console.log('💬 消息刷新:', this.messages);
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
